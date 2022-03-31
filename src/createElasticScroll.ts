import { hasNativeSupport, isAppleDevice } from './browser'
import { Props, ElastifiedElement, Instance } from './types'
import { createInnerWrap } from './utils'

const TRANSITION_END = 'transitionend'
const RESET_TRANSFORM = 'translate3d(0,0,0)'

export default function createElasticScroll(
  el: ElastifiedElement,
  props: Props,
): Instance {
  if (el._elasticScroll) {
    el._elasticScroll.disable()
  }

  const innerWrap: HTMLElement =
    el.querySelector('[data-elastic-wrapper]') || createInnerWrap(el)

  let isTransitioning = false
  let previousScrollTop = 0
  let previousScrollLeft = 0
  let scrollDirection: 'x' | 'y' = 'y'

  let previousX = 0;
  let previousY = 0;

  function onScroll(): void {
    // Create WheelEvent from deltas
    const { scrollLeft, scrollTop } = el;
    const deltaX = -(previousX - scrollLeft);
    const deltaY = -(previousY - scrollTop);
    const wheelEvent = { deltaX, deltaY } as WheelEvent;
    // const we = new WheelEvent('WheelEvent', { deltaX, deltaY });
    onWheel(wheelEvent);
  }

  function onWheel({ deltaX, deltaY }: WheelEvent): void {
    const {
      offsetHeight,
      offsetWidth,
      scrollHeight,
      scrollWidth,
      scrollTop,
      scrollLeft,
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

      innerWrap.removeEventListener(TRANSITION_END, onBounceAwayTransitionEnd)
      innerWrap.removeEventListener(TRANSITION_END, onBounceBackTransitionEnd)

      // Prevent a bounce if already at the edge
      if (innerWrap.style.transform !== 'translate3d(0px, 0px, 0px)') {
        innerWrap.style.transition = 'none'
        innerWrap.style.transform = RESET_TRANSFORM
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

      innerWrap.addEventListener(TRANSITION_END, onBounceAwayTransitionEnd)
      innerWrap.style.transition = `transform ${props.duration[0]}ms ${
        props.easing
      }`

      // Start transition away
      innerWrap.style.transform = `translate3d(${
        hitLeftOrRightAndScrollingX ? props.intensity * -deltaX : 0
      }px, ${hitTopOrBottomAndScrollingY ? props.intensity * -deltaY : 0}px, 0)`
    }
  }

  function onBounceAwayTransitionEnd(): void {
    innerWrap.removeEventListener(TRANSITION_END, onBounceAwayTransitionEnd)
    innerWrap.addEventListener(TRANSITION_END, onBounceBackTransitionEnd)
    innerWrap.style.transition = `transform ${props.duration[1]}ms ${
      props.easing
    }`
    // Start transition back down
    innerWrap.style.transform = RESET_TRANSFORM
  }

  function onBounceBackTransitionEnd(): void {
    innerWrap.removeEventListener(TRANSITION_END, onBounceBackTransitionEnd)
    isTransitioning = false
  }

  function enable(): void {
    if (props.appleDevicesOnly && !isAppleDevice) {
      return
    }

    if (props.useNative && hasNativeSupport) {
      el.style.webkitOverflowScrolling = 'touch'
    } else if (!props.useNative || !hasNativeSupport) {
      if (isAppleDevice) {
        el.addEventListener('wheel', onWheel, { passive: true })
      } else {
        el.addEventListener('scroll', onScroll, { passive: true })
      }
    }
  }

  function disable(): void {
    el.style.webkitOverflowScrolling = ''
    if (isAppleDevice) {
      el.removeEventListener('wheel', onWheel, {
        passive: true,
      } as AddEventListenerOptions)
    } else {
      el.removeEventListener('scroll', onScroll, {
        passive: true,
      } as AddEventListenerOptions)
    }
  }

  enable()

  const elasticScroll = {
    el,
    props,
    enable,
    disable,
  }

  el._elasticScroll = elasticScroll

  return elasticScroll
}