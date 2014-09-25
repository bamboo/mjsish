(require 'source-map-support').install ()

#metaimport
  masakari
  hash-require

#require
  readline
  colors
  './mjs'

fun parse-command-line argv ->
  #doto (require 'commander')
    .version
      (require '../package.json').version
    .option ('--no-tty', "don't treat stdout as a TTY, useful in combination with rlwrap")
    .option ('--ipc', 'enable parent process to send evaluation requests via node ipc')
    .option ('-j, --log-js', 'send generated javascript code to the console')
    .option ('-p, --port <p>', 'start tcp server on the specified port', parse-int)
    .parse argv

fun format-mjs-error e ->
  '' + e.line + ':' + (e.column + 1) + ':' + e.message

fun is-empty-or-ends-with-semicolon line ->
  line == '' || line.substr (-1) == ';'

fun make-eval (evaluator, log-result, log-error, log-js) ->
  fun mjs-eval code -> do!
    try
      var result = evaluator.eval code
      if (result.errors)
        result.errors.for-each #->
          log-error format-mjs-error #it
      else
        log-js result.code
        log-result result.value
    catch var e
      log-error (e.stack || e.to-string ())

fun start-ipc-server evaluator ->
  #external process
  fun reply message ->
    process.send message
  process.on
    'message'
    code -> do!
      try
        var result = evaluator.eval code
        if (result.errors)
          reply {
            intent: ::compilation-errors
            errors: result.errors
          }
        else
          reply {
            intent: ::evaluation-result
            code: result.code
            result: result.value
          }
      catch var e
        reply {
          intent: ::evaluation-error
          error: e.stack || e.to-string ()
        }

fun start-evaluation-server (evaluator, port) ->
  #require net
  var server = net.create-server fun socket ->
    fun println m -> socket.write (m + '\n')
    println 'CONNECTED'
    var mjs-eval = make-eval
      evaluator
      println
      println
      #->
    socket.on
      'data'
      #-> mjs-eval #it.to-string ()
  #doto server
    .listen (port, '127.0.0.1')

fun main () ->
  #external process
  var program = parse-command-line process.argv

  #require require-like
  var require-local = require-like '.'
  var evaluator = new mjs.Evaluator {require: require-local}
  var mjs-eval = make-eval
    evaluator
    #-> console.log #it
    #-> console.log #it.red
    if program.log-js
      #-> console.log #it.grey
    else
      #->

  if program.ipc start-ipc-server evaluator
  if program.port start-evaluation-server (evaluator, program.port)
  var rl = readline.create-interface {
    input: process.stdin
    output: process.stdout
    terminal: program.tty && process.stdout.TTY?}

  fun reset-prompt () ->
    rl.set-prompt 'mjs> '

  var pending-lines = []
  rl.on
    'line'
    line ->
      pending-lines.push line
      if (line |> is-empty-or-ends-with-semicolon)
        var code = pending-lines.join '\n  '
        pending-lines = []
        if (code != '')
          mjs-eval (code, program.log-js)
        reset-prompt ()
      else
        rl.set-prompt '....   '
      rl.prompt ()
  reset-prompt ()
  rl.prompt ()

#external module.exports = main
