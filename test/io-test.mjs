#external (describe, it, before-each)

#metaimport
  masakari
  hash-require

#require
  chai expect
  mori map
  rx
    Observable
    ReplaySubject
  '../lib/io'
    ConsoleInteractor

var rx-array = Observable.from-array

fun key (name, sequence) ->
  {name: name,
   ctrl: false,
   meta: false,
   shift: false,
   sequence: sequence || name}

fun keypress (key, ch) ->
  {key: key, ch: ch}

fun char-key ch ->
  keypress (key ch, ch)

const return-key = keypress key ('return', '\r')

describe
  'ConsoleInteractor'
  #->
    it
      'sends complete expression upon <ENTER>'
      done ->
        var keys = new ReplaySubject ()
        fun press k -> keys.on-next k
        var expressions = new ReplaySubject ()
        var subject = new ConsoleInteractor (keys, expressions)
        press char-key '4'
        press char-key '2'
        press return-key
        expressions.on-completed ()
        expressions |.>
          to-array ()
          action! #-> (expect #it).to.eql (["42"])
          subscribe (#->, done, done)
