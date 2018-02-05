# Caret Pos

Get the position/offset of the caret/cursor from a textarea, contentedtiable, or an iframe body.

The reason for the iframe is that WYSIWYG editors are often inside of one.

This can also set the position in an editable field.

## Caret.js

This is a port of ichord's [Caret.js](https://github.com/ichord/Caret.js). The motivation for porting this was to drop the jQuery dependency and drop support for older browsers. This library won't work with any browser that doesn't have support for the [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection). Check [caniuse.com](https://caniuse.com/#search=selection) for browser support.

Thanks to ichord for all his hard work.

## Usage
Simply import `position` and/or `offset` from `cart-pos`.

```javascript
import { position, offset } from 'caret-pos';
```

### Get
Use one of the functions to get the value.

```javascript
const input = document.querySelector('.foo');
const pos = position(input); // { left: 15, top: 30, height: 20, pos: 15 }
const off = offset(input); // { left: 15, top: 30, height: 20 }
```

### Set
Pass an integer to set the position in the input.

```javascript
position(input, 11);
```

### iframe context
In order to get the correct values for an iframe, we need to pass it in the settings so that it can get a reference to the iframe.

```javascript
const frame = document.getElementById('iframe');
const body = frame.contentDocument.body;

const pos = position(body, { iframe: frame });
const off = offset(body, { iframe: frame });
```

You may also need to get the offset of the iframe to position things correctly. For this there is utility that you can use to get the offset.

```javascript
import { getOffset } from 'caret-pos';

const frameOffset = getOffset(frame);
  off.left += frameOffset.left;
  off.top += frameOffset.top;
```
