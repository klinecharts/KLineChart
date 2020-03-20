import { InvalidateLevel } from '../data/ChartData'

export default class Series {
  constructor (props) {
    this._container = props.container
    this._chartData = props.chartData
    this._initBefore(props)
    this._initElement()
    this._mainWidget = this._createMainWidget(this._mainWidgetCell, props)
    this._yAxisWidget = this._createYAxisWidget(this._yAxisWidgetCell, props)
  }

  _initBefore (props) {}

  _initElement () {
    this._element = document.createElement('div')
    this._element.style.margin = '0'
    this._element.style.padding = '0'
    this._element.style.width = '100%'
    this._element.style.position = 'relative'
    this._element.style.overflow = 'hidden'
    this._mainWidgetCell = this._createCell()
    this._yAxisWidgetCell = this._createCell()
    this._element.appendChild(this._mainWidgetCell)
    this._element.appendChild(this._yAxisWidgetCell)
    const lastElement = this._container.lastChild
    if (lastElement) {
      this._container.insertBefore(this._element, lastElement)
    } else {
      this._container.appendChild(this._element)
    }
  }

  _createCell () {
    const cell = document.createElement('div')
    cell.style.position = 'absolute'
    cell.style.margin = '0'
    cell.style.padding = '0'
    cell.style.top = '0'
    cell.style.zIndex = '1'
    return cell
  }

  /**
   * 创建主组件
   * @param container
   * @param props
   * @private
   */
  _createMainWidget (container, props) {
  }

  /**
   * 创建y轴组件
   * @param container
   * @param props
   * @private
   */
  _createYAxisWidget (container, props) {
  }

  _setCellSize (cell, size) {
    cell.style.left = `${size.left}px`
    cell.style.width = `${size.width}px`
    cell.style.height = `${size.height}px`
  }

  /**
   * 设置尺寸
   * @param mainWidgetSize
   * @param yAxisWidgetSize
   */
  setSize (mainWidgetSize, yAxisWidgetSize) {
    this._element.style.height = `${mainWidgetSize.height}px`
    this._setCellSize(this._mainWidgetCell, mainWidgetSize)
    this._setCellSize(this._yAxisWidgetCell, yAxisWidgetSize)
    this._mainWidget.setSize(mainWidgetSize.width, mainWidgetSize.height)
    if (this._yAxisWidget) {
      this._yAxisWidget.setSize(yAxisWidgetSize.width, yAxisWidgetSize.height)
    }
  }

  _computeAxis () {}

  /**
   * 刷新
   * @param level
   */
  invalidate (level) {
    if (level === InvalidateLevel.FULL) {
      this._computeAxis()
    }
    this._mainWidget.invalidate(level)
    if (this._yAxisWidget) {
      this._yAxisWidget.invalidate(level)
    }
  }

  /**
   * 销毁
   */
  destroy () {
    this._container.removeChild(this._element)
  }
}
