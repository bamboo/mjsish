#metaimport
  masakari
  hash-require

#require
  keypress
  './io'
  rx Subject

fun keypresses-from stdin ->
  keypress stdin
  var keypresses = new Subject ()
  #doto stdin
    on
      'keypress'
      fun (ch, key) ->
        if (key && key.ctrl && key.name == 'c')
          stdin.pause ()
        else
          keypresses.on-next {ch: ch, key: key}
    set-raw-mode true
    resume ()
  keypresses

fun main () ->
  var keypresses = keypresses-from #external process.stdin
  var expressions = new Subject ()
  var interactor = new io.ConsoleInteractor (keypresses, expressions)
  expressions.subscribe #-> console.log #it

#external module.exports = main
