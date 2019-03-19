import { Props, ElastifiedElement } from './types'

export function arrayFrom(value: ArrayLike<any>): any[] {
  return [].slice.call(value)
}

export function createInnerWrap(el: HTMLElement): HTMLDivElement {
  const div = document.createElement('div')
  div.setAttribute('data-elastic-wrapper', '')
  arrayFrom(el.childNodes).forEach(node => {
    div.appendChild(node)
  })
  el.appendChild(div)
  return div
}

export function getArrayOfElements(
  value: Props['targets'],
): ElastifiedElement[] {
  if (typeof value === 'string') {
    return arrayFrom(document.querySelectorAll(value))
  } else if (value instanceof NodeList) {
    return arrayFrom(value)
  } else if (value instanceof Element) {
    return [value as ElastifiedElement]
  }

  return []
}
