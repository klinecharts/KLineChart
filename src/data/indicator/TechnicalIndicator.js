import { clone, isNumber } from '../../utils/typeChecks'

export default class TechnicalIndicator {
  constructor (name, calcParams = [], plots = [], precision = 4, shouldCheckParamCount) {
    this._name = name
    this._precision = precision
    this._calcParams = calcParams
    this._plots = plots
    this._shouldCheckParamCount = shouldCheckParamCount
    this._result = []
  }

  /**
   * 获取指标名称
   * @returns {*}
   */
  name () {
    return this._name
  }

  /**
   * 精度
   * @returns {number}
   */
  precision () {
    return this._precision
  }

  setPrecision (precision) {
    if (precision >= 0 && isNumber(precision)) {
      this._precision = parseInt(precision, 10)
    }
  }

  /**
   * 计算参数
   * @returns {*[]}
   */
  calcParams () {
    return clone(this._calcParams)
  }

  /**
   * 信息
   * @returns {*[]}
   */
  plots () {
    return this._plots
  }

  setCalcParams (params = []) {
    if (this._shouldCheckParamCount && params.length !== this._calcParams.length) {
      return
    }
    this._calcParams = clone(params)
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
