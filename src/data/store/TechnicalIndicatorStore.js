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

import extension from '../extension'

import { isFunction, isValid, isObject } from '../../utils/typeChecks'
import { formatPrecision, formatBigNumber } from '../../utils/format'

import { logWarn } from '../../utils/logger'

import TechnicalIndicator from '../../component/tech/TechnicalIndicator'

/**
 * 获取技术指标信息
 * @param tech
 * @return {{ calcParams, precision, name, shouldCheckParamCount, shouldOhlc, shouldFormatBigNumber, styles }}
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

export default class TechnicalIndicatorStore {
  constructor () {
    // 指标模板
    this._templates = this._createTemplates()
  }

  /**
   * 创建技术指标模板
   * @return {{}}
   */
  _createTemplates () {
    const mapping = {}
    const extensions = extension.technicalIndicatorExtensions
    for (const name in extensions) {
      const templateInstance = this._createTemplateInstance(extensions[name])
      if (templateInstance) {
        mapping[name] = templateInstance
      }
    }
    return mapping
  }

  /**
   * 创建一个新的技术指标
   * @param name
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
   * @returns {templateInstance|null}
   */
  _createTemplateInstance ({
    name, calcParams, plots, precision,
    shouldCheckParamCount, shouldOhlc, shouldFormatBigNumber,
    minValue, maxValue, styles,
    calcTechnicalIndicator, regeneratePlots, render
  }) {
    if (!name || !isFunction(calcTechnicalIndicator)) {
      logWarn('', '', 'The required attribute "name" and method "calcTechnicalIndicator" are missing, and new technical indicator cannot be generated!!!')
      return null
    }
    class Template extends TechnicalIndicator {
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
    Template.prototype.calcTechnicalIndicator = calcTechnicalIndicator
    if (isFunction(regeneratePlots)) {
      Template.prototype.regeneratePlots = regeneratePlots
    }
    if (isFunction(render)) {
      Template.prototype.render = render
    }
    return new Template()
  }

  /**
   * 添加指标模板
   * @param templates
   */
  addTemplate (templates) {
    templates.forEach(tmp => {
      const instance = this._createTemplateInstance(tmp || {})
      if (instance) {
        // 将生成的新的指标类放入集合
        this._templates[instance.name] = instance
      }
    })
  }

  /**
   * 复制一个技术指标
   * @param tech
   * @return {any}
   */
  cloneTemplate (name) {
    const template = this._templates[name]
    let instance
    if (template) {
      instance = Object.create(Object.getPrototypeOf(template))
      for (const key in template) {
        if (Object.prototype.hasOwnProperty.call(template, key)) {
          instance[key] = template[key]
        }
      }
    }
    return instance
  }

  /**
   * 获取模板
   * @param name
   * @returns
   */
  getTemplate (name) {
    return this._templates[name]
  }

  /**
   * 获取技术指标信息
   * @param name
   * @return {{}|{calcParams: *, precision: *, name: *}}
   */
  getInfo (name) {
    if (isValid(name)) {
      const tech = this.getTemplate(name)
      if (tech) {
        return createTechnicalIndicatorInfo(tech)
      }
    } else {
      const techs = {}
      for (const name in this._templates) {
        const instance = this._templates[name]
        techs[name] = createTechnicalIndicatorInfo(instance)
      }
      return techs
    }
    return {}
  }
}
