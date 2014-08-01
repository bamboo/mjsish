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
  c.generate ast

fun main () ->
  var context = vm.create-context {require: require}
  fun eval code ->
    vm.run-in-context (code, context)

  var pending-lines = []

  #external process
  var rl = readline.create-interface {input: process.stdin, output: process.stdout}
  fun reset-prompt () ->
    rl.set-prompt 'mjs> '
  rl.on
    'line'
    line ->
      pending-lines.push line
      if (line != '' && line.substr (-1) != ';')
        rl.set-prompt '....   '
      else
        var code = pending-lines.join '\n  '
        pending-lines = []

        try
          var result = compile code
          if (result.code)
            console.log result.code.grey
            console.log eval result.code
        catch var e
          console.log
            (e.stack || e.to-string ()).red

        reset-prompt ()
      rl.prompt ()
  reset-prompt ()
  rl.prompt ()

#external module.exports = main
