#metamodule
  #keepmacro str
    unary
    LOW
    expand: arg ->
      arg.new-value arg.to-expression-string ().to-string ()
