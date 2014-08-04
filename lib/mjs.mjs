#metaimport
  hash-require
  masakari

#require
  vm
  meta-script

var mjs = meta-script ()
mjs.options.allow-undeclared-identifiers = true
mjs.options.emit-identifier-statements = true

fun compile code ->
  var compiler = mjs.compiler-from-string code
  var ast = compiler.produce-ast ()
  if compiler.errors.length
    {errors: compiler.errors}
  else do
    var result = compiler.generate ast
    result.ast = ast
    result

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
