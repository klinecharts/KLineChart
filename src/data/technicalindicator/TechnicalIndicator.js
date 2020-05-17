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

import { clone, isNumber } from '../../utils/typeChecks'

export default class TechnicalIndicator {
  constructor (name, calcParams = [], plots = [], precision = 4, shouldCheckParamCount) {
    this.name = name
    this.precision = precision
    this.calcParams = calcParams
    this.plots = plots
    this.shouldCheckParamCount = shouldCheckParamCount
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
    this._regeneratePlots()
  }

  /**
   * 计算技术指标
   */
  calcTechnicalIndicator (dataList) {}

  /**
   * 重新生成各项数据
   * @private
   */
  _regeneratePlots () {}

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
