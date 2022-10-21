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

import TypeOrNull from '../common/TypeOrNull'
import Precision from '../common/Precision'

import extension from './extension'

import ChartStore from './ChartStore'

import IndicatorTemplate, { IndicatorConstructor, Indicator, IndicatorSeries } from '../template/indicator/Indicator'

export default class TechStore {
  private readonly _chartStore: ChartStore
  private readonly _templates: Map<string, IndicatorConstructor> = new Map()
  private readonly _instances: Map<string, Map<string, IndicatorTemplate>> = new Map()

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
    // 指标模板
    this.buildTemplates(extension.getTechExtensions())
  }

  private _overrideInstance (instance: IndicatorTemplate, indicator: Indicator): boolean[] {
    const {
      shortName, calcParams, precision, shouldOhlc, shouldFormatBigNumber, styles, extendData
    } = indicator
    let shortNameSuccess = false
    let calcParamsSuccess = false
    let precisionSuccess = false
    let shouldOhlcSuccess = false
    let shouldFormatBigNumberSuccess = false
    let styleSuccess = false
    let extendDataSuccess = false
    if (shortName !== undefined) {
      shortNameSuccess = instance.setShortName(shortName)
    }
    if (calcParams !== undefined) {
      calcParamsSuccess = instance.setCalcParams(calcParams)
    }
    if (precision !== undefined) {
      precisionSuccess = instance.setPrecision(precision)
    }
    if (shouldOhlc !== undefined) {
      shouldOhlcSuccess = instance.setShouldOhlc(shouldOhlc)
    }
    if (shouldFormatBigNumber !== undefined) {
      shouldFormatBigNumberSuccess = instance.setShouldFormatBigNumber(shouldFormatBigNumber)
    }
    if (styles !== undefined) {
      styleSuccess = instance.setStyles(styles)
    }
    if (extendData !== undefined) {
      extendDataSuccess = instance.setExtendData(extendData)
    }
    const overrideSuccess = shortNameSuccess || calcParamsSuccess || precisionSuccess || shouldOhlcSuccess || shouldFormatBigNumberSuccess || styleSuccess || extendDataSuccess
    return [overrideSuccess, calcParamsSuccess]
  }

  /**
   * 创建技术指标模板
   * @return {{}}
   */
  buildTemplates (templates: Indicator[]): void {
    templates.forEach((template: Indicator) => {
      const Clz = IndicatorTemplate.extend(template)
      this._templates.set(template.name, Clz)
    })
  }

  /**
   * 模板是否存在
   * @param {*} name
   * @returns
   */
  hasTemplate (name: string): boolean {
    return this._templates.get(name) !== undefined
  }

  /**
   * 获取技术指标模板信息
   * @param name
   * @return {{}|{calcParams: *, precision: *, name: *}}
   */
  getTemplate (name?: string): TypeOrNull<Indicator> | Indicator[] {
    const templates = extension.getTechExtensions()
    if (name !== undefined) {
      const template = templates.find(t => t.name === name)
      return template ?? null
    }
    return templates
  }

  /**
   * 添加技术指标实例
   * @param paneId
   * @param indicator
   * @param isStack
   * @returns
   */
  async addInstance (paneId: string, indicator: Indicator, isStack: boolean): Promise<boolean> {
    const { name } = indicator
    let paneInstances = this._instances.get(paneId)
    if (paneInstances?.has(name) !== undefined) {
      return await Promise.resolve(false)
    }
    if (paneInstances === undefined) {
      paneInstances = new Map()
      this._instances.set(paneId, paneInstances)
    }
    const Template = this._templates.get(name) as IndicatorConstructor
    const instance = new Template()
    this._overrideInstance(instance, indicator)
    if (!isStack) {
      paneInstances.clear()
    }
    paneInstances.set(name, instance)
    return await instance.calcIndicator(this._chartStore.getDataList())
  }

  /**
   * 获取实例
   * @param {*} paneId
   * @returns
   */
  getInstances (paneId: string): Map<string, IndicatorTemplate> {
    return this._instances.get(paneId) ?? new Map()
  }

  /**
   * 移除技术指标
   * @param paneId
   * @param name
   * @return {boolean}
   */
  removeInstance (paneId: string, name?: string): boolean {
    let removed = false
    if (this._instances.has(paneId)) {
      const paneInstances = this._instances.get(paneId) as Map<string, IndicatorTemplate>
      if (name !== undefined) {
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
  hasInstances (paneId: string): boolean {
    return this._instances.has(paneId)
  }

  /**
   * 实例计算
   * @param paneId
   * @param name
   */
  async calcInstance (name?: string, paneId?: string): Promise<boolean[]> {
    const tasks: Array<Promise<boolean>> = []
    if (name !== undefined) {
      if (paneId !== undefined) {
        const paneInstances = this._instances.get(paneId)
        if (paneInstances?.has(name) ?? false) {
          const instance = paneInstances?.get(name) as IndicatorTemplate
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        }
      } else {
        this._instances.forEach(paneInstances => {
          if (paneInstances.has(name)) {
            const instance = paneInstances?.get(name) as IndicatorTemplate
            tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
          }
        })
      }
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.forEach(instance => {
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        })
      })
    }
    return await Promise.all(tasks)
  }

  /**
   * 获取实例信息
   * @param paneId
   * @param name
   * @returns
   */
  getInstance (paneId?: string, name?: string): TypeOrNull<Indicator> | TypeOrNull<Map<string, Indicator>> | Map<string, Map<string, Indicator>> {
    if (paneId !== undefined) {
      const paneInstances = this._instances.get(paneId)
      if (name !== undefined) {
        return paneInstances?.get(name) ?? null
      }
      return paneInstances ?? null
    }
    return this._instances
  }

  /**
   * 设置系列精度
   * @param precision
   */
  setSeriesPrecision (precision: Precision): void {
    this._instances.forEach(paneInstances => {
      paneInstances.forEach(instance => {
        if (instance.series === IndicatorSeries.PRICE) {
          instance.setPrecision(precision.price, true)
        }
        if (instance.series === IndicatorSeries.VOLUME) {
          instance.setPrecision(precision.volume, true)
        }
      })
    })
  }

  /**
   * 覆盖
   * @param indicator
   * @param paneId
   * @returns
   */
  async override (indicator: Indicator, paneId?: string): Promise<boolean[]> {
    const { name } = indicator
    let instances: Map<string, Map<string, IndicatorTemplate>> = new Map()
    if (paneId !== undefined) {
      if (this._instances.has(paneId)) {
        instances.set(paneId, this._instances.get(paneId) as Map<string, IndicatorTemplate>)
      }
    } else {
      instances = this._instances
    }
    const tasks: Array<Promise<boolean>> = []
    instances.forEach(paneInstances => {
      if (paneInstances.has(name)) {
        const instance = paneInstances.get(name) as IndicatorTemplate
        const overrideResult = this._overrideInstance(instance, indicator)
        if (overrideResult[1]) {
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        }
      }
    })
    return await Promise.all(tasks)
  }
}
