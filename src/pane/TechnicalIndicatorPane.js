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
import YAxis from '../component/YAxis'

export default class TechnicalIndicatorPane extends Pane {
  constructor (props) {
    super(props)
    this._technicalIndicators = []
    if ('height' in props) {
      this.setHeight(props.height)
    }
    this.setTechnicalIndicator(this._chartData.technicalIndicator(props.name))
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

  /**
   * 是否包含指标
   * @param name
   * @return {boolean}
   * @private
   */
  _includeTechnicalIndicator (name) {
    for (const technicalIndicator of this._technicalIndicators) {
      if (technicalIndicator.name === name) {
        return true
      }
    }
    return false
  }

  setHeight (height) {
    super.setHeight(height)
    this._yAxis.setHeight(height)
  }

  setWidth (mainWidgetWidth, yAxisWidgetWidth) {
    super.setWidth(mainWidgetWidth, yAxisWidgetWidth)
    this._yAxis.setWidth(yAxisWidgetWidth)
  }

  computeAxis (forceCompute) {
    this._yAxis.calcMinMaxValue()
    return this._yAxis.computeAxis(forceCompute)
  }

  getSelfAxisWidth () {
    return this._yAxis.getSelfWidth()
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
   * @returns {TechnicalIndicator}
   */
  technicalIndicators () {
    return this._technicalIndicators
  }

  /**
   * 是否无指标
   * @return {boolean}
   */
  isEmptyTechnicalIndicator () {
    return this._technicalIndicators.length === 0
  }

  /**
   * 移除技术指标
   * @param name
   * @return {boolean}
   */
  removeTechnicalIndicator (name) {
    if (name) {
      let deletePos = -1
      for (let i = 0; i < this._technicalIndicators.length; i++) {
        if (this._technicalIndicators[i].name === name) {
          deletePos = i
          break
        }
      }
      if (deletePos > -1) {
        this._technicalIndicators.splice(deletePos, 1)
        return true
      }
    } else {
      this._technicalIndicators = []
      return true
    }
  }

  /**
   * 设置技术指标类型
   * @param technicalIndicator
   * @param isStack
   */
  setTechnicalIndicator (technicalIndicator, isStack) {
    if (technicalIndicator) {
      if (this._includeTechnicalIndicator(technicalIndicator.name)) {
        return false
      }
      const cloneInstance = Object.create(technicalIndicator)
      if (isStack) {
        this._technicalIndicators.push(cloneInstance)
      } else {
        this._technicalIndicators = [cloneInstance]
      }
      this.calcTechnicalIndicator(cloneInstance)
      return true
    }
    return false
  }

  /**
   * 计算单个技术指标
   * @param technicalIndicator
   */
  calcTechnicalIndicator (technicalIndicator) {
    technicalIndicator.result = technicalIndicator.calcTechnicalIndicator(this._chartData.dataList(), technicalIndicator.calcParams, technicalIndicator.plots) || []
  }

  /**
   * 计算所有技术指标
   */
  calcAllTechnicalIndicator () {
    const technicalIndicators = this.technicalIndicators()
    technicalIndicators.forEach(technicalIndicator => {
      this.calcTechnicalIndicator(technicalIndicator)
    })
    return this.computeAxis()
  }
}
