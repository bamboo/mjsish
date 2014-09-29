#external
  describe
  it

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
            subject.eval metaimport
            expect (subject.eval ('21 |> 2 *').value).to.equal 42
            
    it
      'can evaluate against specific path so relative metaimports work'
      #->
        var subject = new mjs.Evaluator ()
        var options = {filename: #external module.filename}
        var result = subject.eval ("#metaimport './lib/metamodule'", options)
        (expect result.errors).to.not.exist
        (expect subject.eval ('str 42', options).value).to.equal '42'
