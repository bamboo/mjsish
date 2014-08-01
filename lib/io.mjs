#metaimport
  masakari
  hash-require

fun ConsoleInteractor (keypresses, expression-sink) ->
"""
Transforms key presses into expressions ready for evaluation.
"""
  keypresses |.>
    window
      keypresses.filter #-> #it.key && #it.key.name == 'return'
    flat-map
      #-> #it.to-array ()
    subscribe
      #-> expression-sink.on-next #it.map (#-> #it.ch).join ''

#export
  ConsoleInteractor
