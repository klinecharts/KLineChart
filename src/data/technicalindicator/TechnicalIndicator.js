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

import { clone, isArray, isBoolean, isNumber, isValid } from '../../utils/typeChecks'

export default class TechnicalIndicator {
  constructor ({
    name, calcParams, plots,
    precision, shouldCheckParamCount,
    isPriceTechnicalIndicator, isVolumeTechnicalIndicator,
    baseValue, minValue, maxValue
  }) {
    // 指标名
    this.name = name || ''
    // 精度
    this.precision = isValid(precision) && isNumber(precision) && precision >= 0 ? precision : 4
    // 计算参数
    this.calcParams = isArray(calcParams) ? calcParams : []
    // 数据信息
    this.plots = isArray(plots) ? plots : []
    // 是否需要检查参数
    this.shouldCheckParamCount = isBoolean(shouldCheckParamCount) ? shouldCheckParamCount : true
    // 是否是价格技术指标
    this.isPriceTechnicalIndicator = isPriceTechnicalIndicator
    // 是否是数量技术指标
    this.isVolumeTechnicalIndicator = isVolumeTechnicalIndicator
    // 基础比对数据
    this.baseValue = isNumber(baseValue) ? baseValue : null
    // 指定的最小值
    this.minValue = minValue
    // 指定的最大值
    this.maxValue = maxValue
    // 指标计算结果
    this.result = []
  }

  setPrecision (precision) {
    if (precision >= 0 && isNumber(precision)) {
      this.precision = parseInt(precision, 10)
    }
  }

  setCalcParams (params = []) {
    if (this.shouldCheckParamCount && params.length !== this.calcParams.length) {
      return
    }
    this.calcParams = clone(params)
    const plots = this.regeneratePlots(params)
    if (plots && isArray(plots)) {
      this.plots = plots
    }
  }

  /**
   * 计算技术指标
   */
  calcTechnicalIndicator (dataList, calcParams) {}

  /**
   * 重新生成各项数据
   * @private
   */
  regeneratePlots (params) {}

  /**
   * 基础计算
   * @param dataList
   * @param calcIndicator
   */
  _calc (dataList, calcIndicator) {
    const dataSize = dataList.length
    for (let i = 0; i < dataSize; i++) {
      calcIndicator(i)
    }
  }
}
