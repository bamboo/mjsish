#metaimport
  hash-require
  masakari

#require
  vm
  meta-script

var mjs =
  #doto (meta-script ())
    .options.allow-undeclared-identifiers = true
    .options.emit-identifier-statements = true

fun compile code ->
  var compiler = mjs.compiler-from-string code
  var ast = compiler.produce-ast ()
  if compiler.errors.length
    {errors: compiler.errors}
  else
    #doto (compiler.generate ast)
      .ast = ast

fun Evaluator () ->
  assert! this instanceof Evaluator
  var context = vm.create-context {require: require}
  this.eval = code ->
    var result = compile code
    if (!result.errors)
      result.value = vm.run-in-context (result.code, context, 'repl')
    result
  this

#export Evaluator
