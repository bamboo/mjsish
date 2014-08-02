#external (describe, it)

#metaimport
  masakari
  hash-require

#require
  chai expect
  '../lib/mjs'

describe
  'Evaluator'
  #->
    it
      'remembers global variables'
      #->
        var subject = new mjs.Evaluator ()
        subject.eval 'var a = 42'
        expect (subject.eval ('a').value).to.equal 42
