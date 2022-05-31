# Call Once

Limit dangerous function calls.

## Install

```sh
$ npm install call-once
```

## Usage

```js
// Simple usage
var callOnce = require( 'call-once' )
var wrapped = callOnce( function( n ){
  setupNuclearTestPlant()
  return true
})

wrapped() // => true
wrapped() // => undefined
```

```js
// Blocking and unblocking wrapped functions
var callOnce = require( 'call-once' )
var setup = callOnce( function( n ){
  setupNuclearTestPlant()
  return true
})

powerPlant.on( 'constructed', function(){
  setup()
})

president.on( 'cancel_project', function(){
  setup.block() // will prevent the function from being called at all
})

president.on( 'changed_mind', function(){
  setup.unblock() // will allow the function to be called again
})
```

Note: in reality this is more useful for stuff like promise resolutions on a timeout
