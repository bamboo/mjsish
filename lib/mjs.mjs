#metaimport
  hash-require
  masakari

#require
  vm
  meta-script
  mori

var mjs = meta-script ()

fun compile code ->
  const emit-identifier-statements = true
  var compiler = mjs.compiler-from-string (code, undefined, emit-identifier-statements)
  var ast = compiler.produce-ast ()
  if compiler.errors.length
    {errors: compiler.errors}
  else do
    var result = compiler.generate ast
    result.ast = ast
    result

fun collect-globals (ast, globals) ->
  fun recur ast ->
    if (ast instanceof Array)
      ast.for-each #-> collect-globals (#it, globals)
    else
      collect-globals (ast, globals)
  case ast.type
    ::Program
      recur ast.body
    ::VariableDeclaration
      recur ast.declarations
    ::VariableDeclarator
      recur ast.id
    ::Identifier
      globals.push ast.name
    else ()

fun Evaluator () ->
  assert! this instanceof Evaluator
  var context = vm.create-context {require: require}
  var globals = []
  this.eval = code ->
    var prefix = if globals.length ('#external (' + globals + ')\n') else ''
    var result = compile (prefix + code)
    if (!result.errors)
      result.value = vm.run-in-context (result.code, context, 'repl')
      collect-globals (result.ast, globals)
    result
  this

#export Evaluator
