const isBrowser = typeof window !== 'undefined'
const platform = isBrowser && navigator.platform
const ua = isBrowser && navigator.userAgent
const isMac = isBrowser && /Mac/.test(platform)
const isIOS = isBrowser && /iPhone|iPad|iPod/.test(platform) && !window.MSStream
const hasNativeSupport =
  isIOS || (isMac && /Safari/.test(ua) && !/Chrome/.test(ua))
const isAppleDevice = isIOS || isMac

const Defaults = {
  targets: '[data-elastic]',
  easing: 'cubic-bezier(.23,1,.32,1)',
  duration: [100, 800],
  intensity: 0.8,
  useNative: true,
  appleDevicesOnly: true
}

const createInnerWrap = el => {
  const div = document.createElement('div')
  div.innerHTML = el.innerHTML
  el.innerHTML = ''
  el.appendChild(div)
  return div
}

const getArrayOfElements = value => {
  if (typeof value === 'string') {
    return [].slice.call(document.querySelectorAll(value))
  } else if (value instanceof NodeList) {
    return [].slice.call(value)
  } else if (value instanceof Element) {
    return [value]
  }

  return []
}

const createElasticScroll = (el, props) => {
  if (el._elasticScroll) {
    return
  }

  const innerWrap = createInnerWrap(el)
  let isTransitioning = false
  let previousScrollTop = 0
  let previousScrollLeft = 0
  let scrollDirection = null

  const onWheel = ({ deltaX, deltaY }) => {
    const {
      offsetHeight,
      offsetWidth,
      scrollHeight,
      scrollWidth,
      scrollTop,
      scrollLeft
    } = el

    if (previousScrollTop !== scrollTop) {
      scrollDirection = 'y'
    } else if (previousScrollLeft !== scrollLeft) {
      scrollDirection = 'x'
    }

    const isAtTop = scrollTop <= 0
    const isAtBottom = scrollTop + offsetHeight >= scrollHeight
    const isAtLeft = scrollLeft <= 0
    const isAtRight = scrollLeft + offsetWidth >= scrollWidth

    const hitLeftOrRightAndScrollingX =
      scrollDirection === 'x' && (isAtLeft || isAtRight)
    const hitTopOrBottomAndScrollingY =
      scrollDirection === 'y' && (isAtTop || isAtBottom)

    if (!hitLeftOrRightAndScrollingX && !hitTopOrBottomAndScrollingY) {
      isTransitioning = false

      innerWrap.removeEventListener('transitionend', onBounceAwayTransitionEnd)
      innerWrap.removeEventListener('transitionend', onBounceBackTransitionEnd)

      // Prevent a bounce if already at the edge
      if (innerWrap.style.transform !== 'translate3d(0px, 0px, 0px)') {
        innerWrap.style.transition = 'transform 0s'
        innerWrap.style.transform = 'translate3d(0, 0, 0)'
      }
    }

    if (scrollTop === previousScrollTop && scrollLeft === previousScrollLeft) {
      // It's transitioning, or they are "stretching" the overflow.
      // TODO: implement stretching
      return
    }

    previousScrollTop = scrollTop
    previousScrollLeft = scrollLeft

    if (
      !isTransitioning &&
      (hitLeftOrRightAndScrollingX || hitTopOrBottomAndScrollingY)
    ) {
      isTransitioning = true

      innerWrap.addEventListener('transitionend', onBounceAwayTransitionEnd)
      innerWrap.style.transition = `transform ${props.duration[0]}ms ${
        props.easing
      }`

      // Start transition away
      innerWrap.style.transform = `translate3d(${
        hitLeftOrRightAndScrollingX ? props.intensity * -deltaX : 0
      }px, ${hitTopOrBottomAndScrollingY ? props.intensity * -deltaY : 0}px, 0)`
    }
  }

  const onBounceAwayTransitionEnd = () => {
    innerWrap.removeEventListener('transitionend', onBounceAwayTransitionEnd)
    innerWrap.addEventListener('transitionend', onBounceBackTransitionEnd)
    innerWrap.style.transition = `transform ${props.duration[1]}ms ${
      props.easing
    }`
    // Start transition back down
    innerWrap.style.transform = 'translate3d(0, 0, 0)'
  }

  const onBounceBackTransitionEnd = () => {
    innerWrap.removeEventListener('transitionend', onBounceBackTransitionEnd)
    isTransitioning = false
  }

  const enable = () => {
    if (props.appleDevicesOnly && !isAppleDevice) {
      return
    }

    if (props.useNative && hasNativeSupport) {
      el.style.webkitOverflowScrolling = 'touch'
    } else if (!props.useNative || !hasNativeSupport) {
      el.addEventListener('wheel', onWheel)
    }
  }
  const disable = () => {
    el.style.webkitOverflowScrolling = ''
    el.removeEventListener('wheel', onWheel)
  }

  enable()

  const elasticScroll = {
    el,
    props,
    enable,
    disable
  }

  el._elasticScroll = elasticScroll

  return elasticScroll
}

const elasticScroll = options => {
  const props = { ...Defaults, ...options }
  const targets = getArrayOfElements(props.targets)
  return targets
    .map(target => createElasticScroll(target, props))
    .filter(Boolean)
}

elasticScroll.defaults = Defaults

export default elasticScroll
