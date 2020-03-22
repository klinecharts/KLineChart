import { InvalidateLevel } from '../data/ChartData'

export default class Series {
  constructor (props) {
    this._container = props.container
    this._chartData = props.chartData
    this._width = -1
    this._height = -1
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
    this._width = this._element.offsetWidth
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
  _createMainWidget (container, props) {}

  /**
   * 创建y轴组件
   * @param container
   * @param props
   * @private
   */
  _createYAxisWidget (container, props) {}

  /**
   * 设置cell的尺寸
   * @param cell
   * @param size
   * @private
   */
  _setCellSize (cell, size) {
    cell.style.left = `${size.left}px`
    cell.style.width = `${size.width}px`
    cell.style.height = `${size.height}px`
  }

  /**
   * 计算轴
   * @private
   */
  _computeAxis () {}

  /**
   * 获取宽度
   * @returns {number}
   */
  width () {
    return this._width
  }

  /**
   * 获取高度
   */
  height () {
    return this._height
  }

  /**
   * 设置临时高度
   * @param height
   */
  setTempHeight (height) {
    this._height = height
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
    this._height = mainWidgetSize.height
    this._mainWidget.setSize(mainWidgetSize.width, mainWidgetSize.height)
    if (this._yAxisWidget) {
      this._yAxisWidget.setSize(yAxisWidgetSize.width, yAxisWidgetSize.height)
    }
  }

  /**
   * 刷新
   * @param level
   */
  invalidate (level) {
    if (level === InvalidateLevel.FULL) {
      this._computeAxis()
    }
    if (level !== InvalidateLevel.GRAPHIC_MARK) {
      if (this._yAxisWidget) {
        this._yAxisWidget.invalidate(level)
      }
    }
    this._mainWidget.invalidate(level)
  }

  /**
   * 销毁
   */
  destroy () {
    this._container.removeChild(this._element)
    delete this
  }
}
