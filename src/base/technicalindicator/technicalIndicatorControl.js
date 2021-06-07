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

import { isFunction, isValid } from '../../utils/typeChecks'
import { formatBigNumber, formatPrecision } from '../../utils/format'
import { logWarn } from '../../utils/logger'

/**
 * 创建技术指标映射
 * @return {{}}
 */
export function createTechnicalIndicatorMapping () {
  const mapping = {}
  const technicalIndicatorExtensions = extension.technicalIndicatorExtensions
  for (const name in technicalIndicatorExtensions) {
    const technicalIndicatorInstance = createTechnicalIndicatorInstance(technicalIndicatorExtensions[name])
    if (technicalIndicatorInstance) {
      mapping[name] = technicalIndicatorInstance
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
 * @param calcParamsAllowDecimal
 * @param shouldCheckParamCount
 * @param shouldOhlc
 * @param shouldFormatBigNumber
 * @param baseValue
 * @param minValue
 * @param maxValue
 * @param styles
 * @param calcTechnicalIndicator
 * @param regeneratePlots
 * @param render
 * @returns {TechnicalIndicatorClass|null}
 */
export function createTechnicalIndicatorInstance ({
  name, series, calcParams, plots, precision,
  calcParamsAllowDecimal, shouldCheckParamCount,
  shouldOhlc, shouldFormatBigNumber, baseValue, minValue, maxValue, styles,
  calcTechnicalIndicator, regeneratePlots, render
}) {
  if (!name || !isFunction(calcTechnicalIndicator)) {
    logWarn('', '', 'The required attribute "name" and method "calcTechnicalIndicator" are missing, and new technical indicator cannot be generated!!!')
    return null
  }
  class TechnicalIndicatorClass extends TechnicalIndicator {
    constructor () {
      super(
        {
          name,
          series,
          calcParams,
          plots,
          precision,
          calcParamsAllowDecimal,
          shouldCheckParamCount,
          shouldOhlc,
          shouldFormatBigNumber,
          baseValue,
          minValue,
          maxValue,
          styles
        }
      )
    }
  }
  TechnicalIndicatorClass.prototype.calcTechnicalIndicator = calcTechnicalIndicator
  if (regeneratePlots && isFunction(regeneratePlots)) {
    TechnicalIndicatorClass.prototype.regeneratePlots = regeneratePlots
  }
  if (render && isFunction(render)) {
    TechnicalIndicatorClass.prototype.render = render
  }
  return new TechnicalIndicatorClass()
}

/**
 * 获取技术指标信息
 * @param technicalIndicator
 * @return {{series, calcParams, precision, name, styles}}
 */
export function createTechnicalIndicatorInfo (technicalIndicator) {
  return {
    name: technicalIndicator.name,
    series: technicalIndicator.series,
    calcParams: technicalIndicator.calcParams,
    calcParamsAllowDecimal: technicalIndicator.calcParamsAllowDecimal,
    shouldCheckParamCount: technicalIndicator.shouldCheckParamCount,
    shouldOhlc: technicalIndicator.shouldOhlc,
    shouldFormatBigNumber: technicalIndicator.shouldFormatBigNumber,
    precision: technicalIndicator.precision,
    styles: technicalIndicator.styles,
    result: technicalIndicator.result || []
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
    calcParamText = `(${calcParams.join(',')})`
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
