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

fun CompilationFailed errors -> do!
  this.errors = errors

fun assert-no-errors compiler -> do!
  if compiler.errors.length
    throw new CompilationFailed compiler.errors

fun meta? node ->
  node.count > 1 && (node.at 0).val == "#metaimport"

fun copy node ->
  node.copy ()

fun capture-meta ast ->
  ast |.>
    filter meta?
    map copy

fun apply-meta (meta, root) ->
  meta.for-each fun (m, index) ->
    root.insert-at (index, m.copy ())

fun compile (code, meta) ->
  try do
    var compiler = mjs.compiler-from-string code
    compiler.parse ()
    assert-no-errors compiler

    var root = compiler.root
    var new-meta = capture-meta root
    if meta apply-meta (meta, root)

    var ast = compiler.produce-ast ()
    assert-no-errors compiler

    #doto (compiler.generate ast)
      .ast = ast
      .meta = new-meta
  catch var e
    if (e instanceof CompilationFailed) e
    else (throw e)

fun Evaluator () ->
  assert! this instanceof Evaluator
  var meta = []
  var context = vm.create-context {require: require}
  this.eval = code ->
    var result = compile (code, meta)
    if (!result.errors)
      meta = if result.meta.length (meta.concat result.meta) else meta
      result.value = vm.run-in-context (result.code, context, 'repl')
    result
  this

#export Evaluator
