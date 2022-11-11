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

import ChartStore from './ChartStore'

import IndicatorImp, { IndicatorCreate, IndicatorConstructor, Indicator, IndicatorSeries } from '../componentl/Indicator'
import { getIndicatorClass } from '../extension/indicator/index'

export default class IndicatorStore {
  private readonly _chartStore: ChartStore
  private readonly _instances: Map<string, Map<string, IndicatorImp>> = new Map()

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  private _overrideInstance (instance: IndicatorImp, indicator: Partial<Indicator>): boolean[] {
    const {
      shortName, series, calcParams, precision, figures, minValue, maxValue,
      shouldOhlc, shouldFormatBigNumber, styles, extendData,
      regenerateFigures, createToolTipDataSource, draw, calc
    } = indicator
    let updateFlag = false
    if (shortName !== undefined && instance.setShortName(shortName)) {
      updateFlag = true
    }
    if (series !== undefined && instance.setSeries(series)) {
      updateFlag = true
    }
    let calcFlag = false
    if (calcParams !== undefined && instance.setCalcParams(calcParams)) {
      updateFlag = true
      calcFlag = true
    }
    if (figures !== undefined && instance.setFigures(figures)) {
      updateFlag = true
    }
    if (minValue !== undefined && instance.setMinValue(minValue)) {
      updateFlag = true
    }
    if (maxValue !== undefined && instance.setMinValue(maxValue)) {
      updateFlag = true
    }
    if (precision !== undefined && instance.setPrecision(precision)) {
      updateFlag = true
    }
    if (shouldOhlc !== undefined && instance.setShouldOhlc(shouldOhlc)) {
      updateFlag = true
    }
    if (shouldFormatBigNumber !== undefined && instance.setShouldFormatBigNumber(shouldFormatBigNumber)) {
      updateFlag = true
    }
    if (styles !== undefined && instance.setStyles(styles)) {
      updateFlag = true
    }
    if (extendData !== undefined && instance.setExtendData(extendData)) {
      updateFlag = true
    }
    if (regenerateFigures !== undefined && instance.setRegenerateFigures(regenerateFigures)) {
      updateFlag = true
    }
    if (createToolTipDataSource !== undefined && instance.setCreateToolTipDataSource(createToolTipDataSource)) {
      updateFlag = true
    }
    if (draw !== undefined && instance.setDraw(draw)) {
      updateFlag = true
    }
    if (calc !== undefined) {
      instance.calc = calc
    }
    return [updateFlag, calcFlag]
  }

  /**
   * 添加技术指标实例
   * @param paneId
   * @param indicator
   * @param isStack
   * @returns
   */
  async addInstance (indicator: IndicatorCreate, paneId: string, isStack: boolean): Promise<boolean> {
    const { name } = indicator
    let paneInstances = this._instances.get(paneId)
    if (paneInstances?.has(name) !== undefined) {
      return await Promise.resolve(false)
    }
    if (paneInstances === undefined) {
      paneInstances = new Map()
      this._instances.set(paneId, paneInstances)
    }
    const IndicatorClazz = getIndicatorClass(name) as IndicatorConstructor
    const instance = new IndicatorClazz()
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
  getInstances (paneId: string): Map<string, IndicatorImp> {
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
      const paneInstances = this._instances.get(paneId) as Map<string, IndicatorImp>
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
          const instance = paneInstances?.get(name) as IndicatorImp
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        }
      } else {
        this._instances.forEach(paneInstances => {
          if (paneInstances.has(name)) {
            const instance = paneInstances?.get(name) as IndicatorImp
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
  getInstanceByPaneId (paneId?: string, name?: string): TypeOrNull<Indicator> | TypeOrNull<Map<string, Indicator>> | Map<string, Map<string, Indicator>> {
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
  async override (indicator: IndicatorCreate, paneId?: string): Promise<boolean[]> {
    const { name } = indicator
    let instances: Map<string, Map<string, IndicatorImp>> = new Map()
    if (paneId !== undefined) {
      if (this._instances.has(paneId)) {
        instances.set(paneId, this._instances.get(paneId) as Map<string, IndicatorImp>)
      }
    } else {
      instances = this._instances
    }
    const tasks: Array<Promise<boolean>> = []
    instances.forEach(paneInstances => {
      if (paneInstances.has(name)) {
        const instance = paneInstances.get(name) as IndicatorImp
        const overrideResult = this._overrideInstance(instance, indicator)
        if (overrideResult[1]) {
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        }
      }
    })
    return await Promise.all(tasks)
  }
}
