# elastic-scroll-polyfill

On macOS and iOS, there is a nice effect when hitting the edge of a document called _elastic_ or _rubber band_ scrolling. This is distinct from momentum or inertial scrolling, and was first demoed at the [original iPhone event back in 2007](https://www.youtube.com/watch?v=vN4U5FqrOdQ&t=16m55s).

- **Elastic scrolling**: When hitting the edge of the document, the boundary of the document will continue to scroll briefly as though it is being "stretched" before settling back down.

- **Momentum scrolling**: When letting go of the input device (touch or trackpad), the document will continue to scroll while slowing down before coming to rest, as though it has inertia.

Chrome and Firefox on macOS don't have elastic scrolling on scrollable divs currently. Chrome only has it on the `<body>` element, while Firefox doesn't have it at all.

This library is essentially a polyfill for the effect for Chrome and Firefox on macOS, while handling iOS automatically as well. This is particularly useful for chat web applications, where the lack of elastic scrolling when the user hits the bottom of the scrolling window feels abrupt and inorganic, unlike native apps.

The effect is automatically disabled for non-Apple devices and uses the native implementation if possible (Safari on macOS and iOS have the effect built-in).

## How it works

It uses an inner wrapper and transitions the `translate3d` property, using the `event.deltaY` / `event.deltaX` values to determine the translation intensity in order to replicate the effect.

## Demo

https://codepen.io/anon/pen/bQVpdv

Note: the effect is disabled on non-Apple devices by default. Pass `{ appleDevicesOnly: false }` as an argument to the function to disable this behavior.

## Installation

```
npm i elastic-scroll-polyfill
```

CDN: https://unpkg.com/elastic-scroll-polyfill

## Usage

```html
<div class="overflow" data-elastic>
  Scrollable content in here
</div>
<script>elasticScroll()</script>
```

Calling `elasticScroll()` will apply the elastic scroll effect to all elements with a `data-elastic` attribute by default. Both `x` and `y` overflow receives the effect. You can pass in a single `Element` or `NodeList` as well.

Elastified elements have an `_elasticScroll` property to disable or enable the effect.

```js
const el = document.querySelector('#scrollableElement')
elasticScroll({ targets: el })
el._elasticScroll.disable()
el._elasticScroll.enable()
```

## Options

```js
{
  targets: '[data-elastic]', // String, Element, NodeList
  easing: 'cubic-bezier(.23,1,.32,1)', // CSS transition timing function (ease-out-quint)
  duration: [100, 1000], // [BounceAway, BounceBack] in ms
  intensity: 0.8, // intensity of the effect (how much it translates the content)
  useNative: true, // use the native implementation if possible, `-webkit-overflow-scrolling` on iOS
  appleDevicesOnly: true // only apply to Apple devices
}
```

Example:

```js
elasticScroll({
  targets: document.querySelectorAll('.scrollable-elements'),
  useNative: false
})
```

## Limitations

The native implementation offers the ability to "stretch" the overflow when already at the edge of the scrolling boundary. As far as I'm aware there is no way to replicate this unfortunately.

## Browser support

Browsers that support the `wheel` event and unprefixed CSS transitions.
