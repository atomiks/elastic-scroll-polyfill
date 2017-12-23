# elasticScroll
Browsers like Chrome and Firefox on macOS don't have elastic scrolling on scrollable divs currently. The goal of this library is to replicate macOS native elastic scrolling when hitting the top and bottom of a scrollable element.

## Usage:
```html
<div class="overflow" data-elastic> ... </div>
<script>elasticScroll()</script>
```

This will "elastify" every element with a `data-elastic` attribute. Apply it to elements that overflow in the y direction.

## Defaults

```js
const defaults = {
  targets: '[data-elastic]', // String, Element, NodeList
  easing: 'cubic-bezier(.14,.38,.25,1)', // CSS transition timing function
  duration: [100, 800], // [BounceAway, BounceBack] in ms
  multiplier: 1, // intensity
  useNative: true, // use the native implementation if possible, `-webkit-overflow-scrolling` on iOS
  appleDevicesOnly: true // only apply to Apple devices
}
```

By default, only Apple devices will use elastic scrolling, and the native implementation if possible.

Example:
```js
elasticScroll({
  targets: document.querySelectorAll('.scrollable-elements'),
  useNative: false
})
```

## Demo

https://codepen.io/anon/pen/LebYvR

## Browser support

Browsers that support `wheel` and unprefixed CSS transitions
