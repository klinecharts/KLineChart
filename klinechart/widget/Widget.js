import { InvalidateLevel } from '../data/ChartData'

export default class Widget {
  constructor (props) {
    this._chartData = props.chartData
    this._initElement(props.container)
    this._initBefore(props)
    this._mainView = this._createMainView()
    this._crossHairView = this._createCrossHairView()
  }

  _initBefore (props) {}

  /**
   * 初始化element
   * @param container
   * @private
   */
  _initElement (container) {
    this._element = document.createElement('div')
    this._element.style.margin = '0'
    this._element.style.padding = '0'
    this._element.style.position = 'relative'
    this._element.style.overflow = 'hidden'
    container.appendChild(this._element)
  }

  /**
   * 创建主view
   * @private
   */
  _createMainView () {}

  /**
   * 创建十字光标view
   * @private
   */
  _createCrossHairView () {}

  /**
   * 设置尺寸
   * @param width
   * @param height
   */
  setSize (width, height) {
    this._element.style.width = `${width}px`
    this._element.style.height = `${height}px`
    this._mainView.setSize(width, height)
    this._crossHairView.setSize(width, height)
  }

  /**
   * 更新
   * @param level
   */
  invalidate (level) {
    switch (level) {
      case InvalidateLevel.CROSS_HAIR: {
        this._mainView.flush()
        break
      }
      case InvalidateLevel.FULL: {
        this._mainView.flush()
        this._crossHairView.flush()
        break
      }
      default: {
        break
      }
    }
  }
}
