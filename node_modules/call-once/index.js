function wrapFunctionCall( fn ){
  var called = false
  var wrapped = function wrappedFunctionCall(){
    if( called ) return

    called = true
    return fn.apply( fn, arguments )
  }

  wrapped.block = function(){
    called = true
  }

  wrapped.unblock = function(){
    called = false
  }


  return wrapped
}

module.exports = wrapFunctionCall
