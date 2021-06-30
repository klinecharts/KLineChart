/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TechnicalIndicator from './TechnicalIndicator'

import extension from '../../data/extension'

import { isFunction, isObject, isValid } from '../../utils/typeChecks'
import { formatBigNumber, formatPrecision } from '../../utils/format'
import { logWarn } from '../../utils/logger'

/**
 * 创建技术指标模板映射
 * @return {{}}
 */
export function createTechnicalIndicatorTemplateMapping () {
  const mapping = {}
  const extensions = extension.technicalIndicatorExtensions
  for (const name in extensions) {
    const templateInstance = createTechnicalIndicatorTemplateInstance(extensions[name])
    if (templateInstance) {
      mapping[name] = templateInstance
    }
  }
  return mapping
}

/**
 * 创建一个新的技术指标
 * @param name
 * @param series
 * @param calcParams
 * @param plots
 * @param precision
 * @param shouldCheckParamCount
 * @param shouldOhlc
 * @param shouldFormatBigNumber
 * @param minValue
 * @param maxValue
 * @param styles
 * @param calcTechnicalIndicator
 * @param regeneratePlots
 * @param render
 * @returns {TechnicalIndicatorTemplate|null}
 */
export function createTechnicalIndicatorTemplateInstance ({
  name, calcParams, plots, precision,
  shouldCheckParamCount, shouldOhlc, shouldFormatBigNumber,
  minValue, maxValue, styles,
  calcTechnicalIndicator, regeneratePlots, render
}) {
  if (!name || !isFunction(calcTechnicalIndicator)) {
    logWarn('', '', 'The required attribute "name" and method "calcTechnicalIndicator" are missing, and new technical indicator cannot be generated!!!')
    return null
  }
  class TechnicalIndicatorTemplate extends TechnicalIndicator {
    constructor () {
      super(
        {
          name,
          calcParams,
          plots,
          precision,
          shouldCheckParamCount,
          shouldOhlc,
          shouldFormatBigNumber,
          minValue,
          maxValue,
          styles
        }
      )
    }
  }
  TechnicalIndicatorTemplate.prototype.calcTechnicalIndicator = calcTechnicalIndicator
  if (isFunction(regeneratePlots)) {
    TechnicalIndicatorTemplate.prototype.regeneratePlots = regeneratePlots
  }
  if (isFunction(render)) {
    TechnicalIndicatorTemplate.prototype.render = render
  }
  return new TechnicalIndicatorTemplate()
}

/**
 * 复制一个技术指标
 * @param tech
 * @return {any}
 */
export function cloneTechnicalIndicator (tech) {
  const cloneInstance = Object.create(Object.getPrototypeOf(tech))
  for (const key in tech) {
    if (Object.prototype.hasOwnProperty.call(tech, key)) {
      cloneInstance[key] = tech[key]
    }
  }
  return cloneInstance
}

/**
 * 获取技术指标信息
 * @param tech
 * @return {{series, calcParams, precision, name, styles}}
 */
export function createTechnicalIndicatorInfo (tech) {
  return {
    name: tech.name,
    calcParams: tech.calcParams,
    shouldCheckParamCount: tech.shouldCheckParamCount,
    shouldOhlc: tech.shouldOhlc,
    shouldFormatBigNumber: tech.shouldFormatBigNumber,
    precision: tech.precision,
    styles: tech.styles,
    result: tech.result || []
  }
}

/**
 * 获取技术指标提示数据
 * @param technicalIndicatorData
 * @param technicalIndicator
 * @return {{calcParamText: string, values: [], name: string}}
 */
export function getTechnicalIndicatorTooltipData (technicalIndicatorData = {}, technicalIndicator) {
  const calcParams = technicalIndicator.calcParams
  const plots = technicalIndicator.plots
  const precision = technicalIndicator.precision
  const shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber

  const values = []
  let name = ''
  let calcParamText = ''
  if (plots.length > 0) {
    name = technicalIndicator.name
  }
  if (calcParams.length > 0) {
    const params = calcParams.map(param => {
      if (isObject(param)) {
        return param.value
      }
      return param
    })
    calcParamText = `(${params.join(',')})`
  }
  plots.forEach(plot => {
    const data = {}
    if (isValid(plot.title)) {
      let value = technicalIndicatorData[plot.key]
      if (isValid(value)) {
        value = formatPrecision(value, precision)
        if (shouldFormatBigNumber) {
          value = formatBigNumber(value)
        }
      }
      data.title = plot.title
      data.value = value
    }
    values.push(data)
  })
  return { values, name, calcParamText }
}
