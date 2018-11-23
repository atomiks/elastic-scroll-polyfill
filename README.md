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

Calling `elasticScroll()` without arguments will apply the elastic scroll effect to all elements on the document with a `data-elastic` attribute by default. Both `x` and `y` overflow receive the effect. You can pass in a single `Element` or `NodeList` as well.

```js
const singleElement = document.querySelector('#scrollableElement')
const instance = elasticScroll({ targets: singleElement }) // Object

// Methods to disable/enable the effect
instance.disable()
instance.enable()

const multipleElements = document.querySelectorAll('.scrollableElements')
const instances = elasticScroll({ targets: multipleElements }) // Array
```

Elastified elements also have an `_elasticScroll` property.

## Options

```js
{
  targets: '[data-elastic]', // String, Element, NodeList
  easing: 'cubic-bezier(.23,1,.32,1)', // CSS transition timing function (ease-out-quint)
  duration: [100, 800], // [BounceAway, BounceBack] in ms
  intensity: 0.8, // intensity of the effect (how much it translates the content)
  useNative: true, // use the native implementation if possible, `-webkit-overflow-scrolling` on iOS
  appleDevicesOnly: true // only apply to Apple devices
}
```

Example:

```js
elasticScroll({
  intensity: 2,
  useNative: false
})
```

## Limitations

The native implementation offers the ability to "stretch" the overflow when already at the edge of the scrolling boundary. As far as I'm aware there is no way to replicate this unfortunately.

## Browser support

Browsers that support the `wheel` event and unprefixed CSS transitions.

## Usage with React and other libraries

In order to prevent reconciliation problems created by the inner wrapper, you'll need to add the inner elastic wrapper div yourself, ensuring it has a `data-elastic-wrapper` attribute.

Here's a component example:

```jsx
import React, { Children, cloneElement, createRef } from 'react'

class ElasticScroll extends Component {
  scroller = createRef()

  componentDidMount() {
    this.instance = elasticScroll({
      targets: this.scroller,
      ...this.props
    })
  }

  componentWillUnmount() {
    this.instance.disable()
    this.instance = null
  }

  render() {
    return Children.map(this.props.children, child =>
      cloneElement(child, {
        children: <div data-elastic-wrapper>{child.props.children}</div>,
        ref: node => {
          this.scroller = node
          const { ref } = child
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref.hasOwnProperty('current')) {
              ref.current = node
            }
          }
        }
      })
    )
  }
}

// Usage: wrap the parent scroller with the component
const App = () => (
  <ElasticScroll>
    <div style={{ width: '300px', height: '300px', overflowY: 'scroll' }}>
      Scrollable content in here
    </div>
  </ElasticScroll>
)
```
