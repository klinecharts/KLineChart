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

import Pane from './Pane'
import TechnicalIndicatorWidget from '../widget/TechnicalIndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'
import YAxis from '../component/axis/YAxis'
import { cloneTechnicalIndicator } from '../component/tech/technicalIndicatorControl'

export default class TechnicalIndicatorPane extends Pane {
  constructor (props) {
    super(props)
    this._techs = new Map()
    if ('height' in props) {
      this.setHeight(props.height)
    }
    this.setTechnicalIndicator({ name: props.technicalIndicatorName })
  }

  _initBefore (props) {
    this._id = props.id
    this._yAxis = this._createYAxis(props)
  }

  _createYAxis (props) {
    return new YAxis(
      props.chartData,
      false,
      { technicalIndicators: this.technicalIndicators.bind(this) })
  }

  _createMainWidget (container, props) {
    return new TechnicalIndicatorWidget({
      container,
      chartData: props.chartData,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicators: this.technicalIndicators.bind(this),
        id: this.id.bind(this)
      }
    })
  }

  _createYAxisWidget (container, props) {
    return new YAxisWidget({
      container,
      chartData: props.chartData,
      yAxis: this._yAxis,
      additionalDataProvider: {
        technicalIndicators: this.technicalIndicators.bind(this),
        id: this.id.bind(this)
      }
    })
  }

  setHeight (height) {
    super.setHeight(height)
    this._yAxis.setHeight(height)
  }

  setWidth (mainWidgetWidth, yAxisWidgetWidth) {
    super.setWidth(mainWidgetWidth, yAxisWidgetWidth)
    this._yAxis.setWidth(yAxisWidgetWidth)
  }

  /**
   * 获取id
   * @returns {string}
   */
  id () {
    return this._id
  }

  yAxis () {
    return this._yAxis
  }

  /**
   * 获取技术指标
   * @return {Map<any, any>}
   */
  technicalIndicators () {
    return this._techs
  }

  /**
   * 是否无指标
   * @return {boolean}
   */
  isEmptyTechnicalIndicator () {
    return this._techs.size === 0
  }

  /**
   * 移除技术指标
   * @param name
   * @return {boolean}
   */
  removeTechnicalIndicator (name) {
    if (name) {
      if (this._techs.has(name)) {
        this._techs.delete(name)
        return true
      }
    } else {
      this._techs.clear()
      return true
    }
    return false
  }

  /**
   * 设置技术指标类型
   * @param tech
   * @param isStack
   */
  setTechnicalIndicator (tech, isStack) {
    if (tech) {
      const { name, calcParams, precision, shouldOhlc, shouldFormatBigNumber, styles } = tech
      if (this._techs.has(name)) {
        return false
      }
      const templateInstance = this._chartData.getTechnicalIndicatorTemplateInstance(name)
      if (templateInstance) {
        const cloneInstance = cloneTechnicalIndicator(templateInstance)
        cloneInstance.setCalcParams(calcParams)
        cloneInstance.setPrecision(precision)
        cloneInstance.setShouldOhlc(shouldOhlc)
        cloneInstance.setShouldFormatBigNumber(shouldFormatBigNumber)
        cloneInstance.setStyles(styles, this._chartData.styleOptions().technicalIndicator)
        if (!isStack) {
          this._techs.clear()
        }
        this._techs.set(name, cloneInstance)
        this.calcTechnicalIndicator(cloneInstance)
        return true
      }
    }
    return false
  }

  /**
   * 计算单个技术指标
   * @param technicalIndicator
   */
  calcTechnicalIndicator (technicalIndicator) {
    technicalIndicator.calc(this._chartData.dataList())
  }

  /**
   * 计算所有技术指标
   */
  calcAllTechnicalIndicator () {
    this._techs.forEach(technicalIndicator => {
      this.calcTechnicalIndicator(technicalIndicator)
    })
    return this._yAxis.computeAxis()
  }
}
