var callOnce = require( '..' )
var assert = require( 'assert' )

describe( 'call-once', function(){
  var wrapped
  var val = 0
  beforeEach( function(){
    val = 0
    wrapped = callOnce(function(){
      val += 1
      return val
    })
  })

  it( 'should return the correct value the first time', function(){
    assert.equal( val, 0 )
    var returned = wrapped()
    assert.equal( val, 1 )
  })

  it( 'should refuse to call the function again', function(){
    assert.equal( val, 0 )
    wrapped()
    assert.equal( val, 1 )
    wrapped()
    assert.equal( val, 1 )
  })

  it( 'should refuse to call the function at all when .block() is called', function(){
    assert.equal( val, 0 )
    wrapped.block()
    wrapped()
    assert.equal( val, 0 )
  })

  it( 'should allow a blocked function call to be unblocked', function(){
    assert.equal( val, 0 )
    wrapped.block()
    wrapped()
    assert.equal( val, 0 )
    wrapped.unblock()
    wrapped()
    assert.equal( val, 1 )
    wrapped()
    assert.equal( val, 1 )
  })

  it( 'should allow a called function call to be unblocked', function(){
    assert.equal( val, 0 )
    wrapped()
    assert.equal( val, 1 )
    wrapped.unblock()
    wrapped()
    assert.equal( val, 2 )
    wrapped()
    assert.equal( val, 2 )
  })
})
