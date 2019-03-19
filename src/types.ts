export interface Props {
  targets: string | HTMLElement | NodeList
  easing: string
  duration: [number, number]
  intensity: number
  useNative: boolean
  appleDevicesOnly: boolean
}

export type Options = Partial<Props>

export interface Instance {
  el: Element
  props: Props
  enable(): void
  disable(): void
}

interface CSSStyleDeclarationExtended extends CSSStyleDeclaration {
  webkitOverflowScrolling: 'touch' | 'none' | ''
}

export interface ElastifiedElement extends HTMLElement {
  _elasticScroll?: Instance
  style: CSSStyleDeclarationExtended
}
