interface CSSStyleDeclarationExtended extends CSSStyleDeclaration {
  webkitOverflowScrolling: 'touch' | 'none' | ''
}

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

export interface ElastifiedElement extends HTMLElement {
  _elasticScroll?: Instance
  style: CSSStyleDeclarationExtended
}

export interface ElasticScroll {
  (options?: Options): Instance | Instance[]
}

declare const elasticScroll: ElasticScroll
export default elasticScroll
