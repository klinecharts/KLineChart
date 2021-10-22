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

import TechnicalIndicator, { TechnicalIndicatorSeries } from '../../component/technicalindicator/TechnicalIndicator'

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
  constructor (chartData) {
    this._chartData = chartData
    // 指标模板
    this._templates = this._createTemplates()
    this._instances = new Map()
  }

  /**
   * 获取指标信息
   * @param tech
   * @return {{ calcParams, series, precision, name, shouldCheckParamCount, shouldOhlc, shouldFormatBigNumber, styles }}
   */
  _createTechInfo (tech) {
    return {
      name: tech.name,
      series: tech.series,
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
   * @returns {templateInstance|null}
   */
  _createTemplateInstance ({
    name, series, calcParams, plots, precision,
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
            series,
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
   * 模板是否存在
   * @param {*} name
   * @returns
   */
  hasTemplate (name) {
    return !!this._templates[name]
  }

  /**
   * 获取技术指标模板信息
   * @param name
   * @return {{}|{calcParams: *, precision: *, name: *}}
   */
  getTemplateInfo (name) {
    if (isValid(name)) {
      const template = this._templates[name]
      if (template) {
        return this._createTechInfo(template)
      }
    } else {
      const templateInfos = {}
      for (const name in this._templates) {
        const template = this._templates[name]
        templateInfos[name] = this._createTechInfo(template)
      }
      return templateInfos
    }
    return {}
  }

  /**
   * 添加技术指标实例
   * @param paneId
   * @param tech
   * @param isStack
   * @returns
   */
  addInstance (paneId, tech, isStack) {
    if (tech) {
      const { name, calcParams, precision, shouldOhlc, shouldFormatBigNumber, styles } = tech
      let paneInstances = this._instances.get(paneId)
      if (paneInstances && paneInstances.has(name)) {
        return false
      }
      if (!paneInstances) {
        paneInstances = new Map()
        this._instances.set(paneId, paneInstances)
      }
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
      if (instance) {
        instance.setCalcParams(calcParams)
        instance.setPrecision(precision)
        instance.setShouldOhlc(shouldOhlc)
        instance.setShouldFormatBigNumber(shouldFormatBigNumber)
        instance.setStyles(styles, this._chartData.styleOptions().technicalIndicator)
        if (!isStack) {
          paneInstances.clear()
        }
        paneInstances.set(name, instance)
        instance.calc(this._chartData.dataList())
        return true
      }
    }
    return false
  }

  /**
   * 获取实例
   * @param {*} paneId
   * @returns
   */
  instances (paneId) {
    return this._instances.get(paneId) || new Map()
  }

  /**
   * 移除技术指标
   * @param paneId
   * @param name
   * @return {boolean}
   */
  removeInstance (paneId, name) {
    let removed = false
    if (this._instances.has(paneId)) {
      const paneInstances = this._instances.get(paneId)
      if (isValid(name)) {
        if (paneInstances.has(name)) {
          paneInstances.delete(name)
          removed = true
        }
      } else {
        paneInstances.clear()
        removed = true
      }
      if (paneInstances.size === 0) {
        this._instances.delete(paneId)
      }
    }
    return removed
  }

  /**
   * 是否有实例
   * @param paneId
   * @returns
   */
  hasInstance (paneId) {
    return this._instances.has(paneId)
  }

  /**
   * 实例计算
   * @param paneId
   * @param name
   */
  calcInstance (name, paneId) {
    let calcSuccess = false
    if (isValid(name)) {
      if (isValid(paneId)) {
        const paneInstances = this._instances.get(paneId)
        if (paneInstances && paneInstances.has(name)) {
          paneInstances.get(name).calc(this._chartData.dataList())
          calcSuccess = true
        }
      } else {
        this._instances.forEach(paneInstances => {
          if (paneInstances.has(name)) {
            paneInstances.get(name).calc(this._chartData.dataList())
            calcSuccess = true
          }
        })
      }
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.forEach(instance => {
          instance.calc(this._chartData.dataList())
          calcSuccess = true
        })
      })
    }
    return calcSuccess
  }

  /**
   * 获取实例信息
   * @param paneId
   * @param name
   * @returns
   */
  getInstanceInfo (paneId, name) {
    const info = (paneInstances) => {
      const instanceInfos = []
      for (const entry of paneInstances) {
        const instance = entry[1]
        if (instance) {
          const instanceInfo = this._createTechInfo(instance)
          if (instance.name === name) {
            return instanceInfo
          }
          instanceInfos.push(instanceInfo)
        }
      }
      return instanceInfos
    }

    if (isValid(paneId)) {
      if (this._instances.has(paneId)) {
        return info(this._instances.get(paneId))
      }
    } else {
      const infos = {}
      this._instances.forEach((paneInstance, paneId) => {
        infos[paneId] = info(paneInstance)
      })
      return infos
    }
    return {}
  }

  /**
   * 设置系列精度
   * @param pricePrecision
   * @param volumePrecision
   */
  setSeriesPrecision (pricePrecision, volumePrecision) {
    const setPrecision = (tech) => {
      if (tech.series === TechnicalIndicatorSeries.PRICE) {
        tech.setPrecision(pricePrecision, true)
      }
      if (tech.series === TechnicalIndicatorSeries.VOLUME) {
        tech.setPrecision(volumePrecision, true)
      }
    }
    for (const key in this._templates) {
      setPrecision(this._templates[key])
    }
    this._instances.forEach(paneInstances => {
      paneInstances.forEach(instance => {
        setPrecision(instance)
      })
    })
  }

  /**
   * 覆盖
   * @param techOverride
   * @param paneId
   * @returns
   */
  override (techOverride, paneId) {
    const { name, calcParams, precision, shouldOhlc, shouldFormatBigNumber, styles } = techOverride
    const defaultTechStyleOptions = this._chartData.styleOptions().technicalIndicator
    let instances = new Map()
    if (isValid(paneId)) {
      if (this._instances.has(paneId)) {
        instances.set(paneId, this._instances.get(paneId))
      }
    } else {
      instances = this._instances
      const template = this._templates[name]
      if (template) {
        template.setCalcParams(calcParams)
        template.setPrecision(precision)
        template.setShouldOhlc(shouldOhlc)
        template.setShouldFormatBigNumber(shouldFormatBigNumber)
        template.setStyles(styles, defaultTechStyleOptions)
      }
    }
    let overiderSuccss = false
    const tasks = []
    instances.forEach(paneInstances => {
      if (paneInstances.has(name)) {
        const tech = paneInstances.get(name)
        const calcParamsSuccess = tech.setCalcParams(calcParams)
        const precisionSuccess = tech.setPrecision(precision)
        const shouldOhlcSuccess = tech.setShouldOhlc(shouldOhlc)
        const shouldFormatBigNumberSuccess = tech.setShouldFormatBigNumber(shouldFormatBigNumber)
        const styleSuccess = tech.setStyles(styles, defaultTechStyleOptions)
        if (calcParamsSuccess || precisionSuccess || shouldOhlcSuccess || shouldFormatBigNumberSuccess || styleSuccess) {
          overiderSuccss = true
        }
        if (calcParamsSuccess) {
          tasks.push(
            Promise.resolve(tech.calc(this._chartData.dataList()))
          )
        }
      }
    })
    if (overiderSuccss) {
      return Promise.all(tasks)
    }
  }
}
