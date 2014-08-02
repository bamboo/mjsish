#metaimport
  masakari
  hash-require

#require
  readline
  colors
  vm

var mjs = (require 'meta-script') ()

fun compile code ->
  var c = mjs.compiler-from-string code
  var ast = c.produce-ast ()
  if (c.errors.length)
    {errors: c.errors}
  else
    c.generate ast

fun parse-command-line argv ->
  #doto (require 'commander')
    version
      (require '../package.json').version
    option ('--no-tty', "don't treat stdout as a TTY, useful in combination with rlwrap")
    option ('--log-js', 'send generated javascript code to the console')
    parse argv

fun format-mjs-error e ->
  '' + e.line + ':' + (e.column + 1) + ':' + e.message

fun main () ->
  var context = vm.create-context {require: require}
  fun eval code ->
    vm.run-in-context (code, context, 'repl')

  fun mjs-eval (code, log-js) -> do!
    try
      var result = compile code
      if (result.errors)
        result.errors.for-each #->
          console.log format-mjs-error (#it).red
      else if (result.code)
        if (log-js) console.log result.code.grey
        console.log eval result.code
    catch var e
      console.log
        (e.stack || e.to-string ()).red

  var pending-lines = []

  #external process
  var program = parse-command-line process.argv
  var rl = readline.create-interface {
    input: process.stdin
    output: process.stdout
    terminal: program.tty && process.stdout.TTY?}
  fun reset-prompt () ->
    rl.set-prompt 'mjs> '
  rl.on
    'line'
    line ->
      pending-lines.push line
      if (line == '' || line.substr (-1) == ';')
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
