# xsel

Simple wrapper for linux xsel.

* If you are not familiar with Linux Clipboard visit http://www.freedesktop.org/wiki/Specifications/ClipboardsWiki/

## Install
`npm install xsel`

## Usage

```js
var xsel = require('xsel')

await xsel.set('data to save')
console.log('data was copied to clipboard') // => data was copied to clipboard

await xsel.get(function(error, data)
console.log('clipboard data => ' + data) // => clipboard data => data to save
```

## Docs

`selection` argument is a `String` and can be:  
`"p"`: PRIMARY  
`"s"`: SECONDARY  
`"c"`: CLIPBOARD (default)
<br><br>
```js
await xsel.set(data, [selection])
```
Save `data` to the selection
<br><br>
```js
await xsel.get([selection])
```
Get `data` from the selection
<br><br>
```js
await xsel.clear([selection])
```
Clear the selection
<br><br>
```js
await xsel.remove([selection])
```
Request that the selection be cleared and that  
the application owning it delete its contents
<br><br>
```js
await xsel.keep(callback)
```
Do not modify the selections, but make the PRIMARY  
and SECONDARY selections persist even after the  
programs they were selected in exit.
<br><br>
```js
await xsel.exchange(callback)
```
Exchange the PRIMARY and SECONDARY selections
