#external
  describe
  it

#metaimport
  masakari
  hash-require

#require
  chai expect
  '../lib/mjs'

fun assert-no-errors result ->
  if result.errors
    (expect result.errors).to.equal ([])
  else
    ()

describe
  'Evaluator'
  #->
    it
      'remembers global variables'
      #->
        var subject = new mjs.Evaluator ()
        subject.eval 'var a = 42'
        expect (subject.eval ('a').value).to.equal 42

    it
      'remembers #defmacro'
      #->
        const macro =
         ("#defmacro str\n" +
          "  unary\n" +
          "  LOW\n" +
          "  expand: e -> ast.new-value String(e.val)")
        var subject = new mjs.Evaluator ()
        subject.eval macro
        expect (subject.eval ('str 42').value).to.equal '42'

    ['#metaimport masakari',
     '#metaimport\n  hash-require\n  masakari'].for-each
      (metaimport, index) ->
        it
          'remembers #metaimport (' + (index + 1) + ')'
          #->
            var subject = new mjs.Evaluator ()
            assert-no-errors (subject.eval metaimport)
            var result = subject.eval '21 |> 2 *'
            assert-no-errors result
            expect (result.value).to.equal 42

    it
      'can evaluate against specific path so relative metaimports work'
      #->
        var subject = new mjs.Evaluator ()
        var options = {filename: #external module.filename}
        var result = subject.eval ("#metaimport './lib/metamodule'", options)
        assert-no-errors result
        (expect subject.eval ('str 42', options).value).to.equal '42'
