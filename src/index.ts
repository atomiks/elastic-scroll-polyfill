import defaultProps from './props'
import createElasticScroll from './createElasticScroll'
import { getArrayOfElements } from './utils'
import { Options, Instance } from './types'

function elasticScroll(options?: Options): Instance | Instance[] {
  const props = { ...defaultProps, ...options }
  const instances = getArrayOfElements(props.targets)
    .map(target => createElasticScroll(target, props))
    .filter(Boolean)
  return props.targets instanceof Element ? instances[0] : instances
}

elasticScroll.defaults = defaultProps

export default elasticScroll
