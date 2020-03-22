import { InvalidateLevel } from '../data/ChartData'

export default class Widget {
  constructor (props) {
    this._initElement(props.container)
    this._mainView = this._createMainView(this._element, props)
    this._expandView = this._createExpandView(this._element, props)
    this._floatLayerView = this._createFloatLayerView(this._element, props)
  }

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
   * @param container
   * @param props
   * @private
   */
  _createMainView (container, props) {}

  /**
   * 创建拓展的view
   * @param container
   * @param props
   * @private
   */
  _createExpandView (container, props) {}

  /**
   * 创建浮层view
   * @param container
   * @param props
   * @private
   */
  _createFloatLayerView (container, props) {}

  /**
   * 设置尺寸
   * @param width
   * @param height
   */
  setSize (width, height) {
    this._element.style.width = `${width}px`
    this._element.style.height = `${height}px`
    this._mainView.setSize(width, height)
    this._floatLayerView.setSize(width, height)
  }

  /**
   * 更新
   * @param level
   */
  invalidate (level) {
    switch (level) {
      case InvalidateLevel.FLOAT_LAYER: {
        this._floatLayerView.flush()
        break
      }
      case InvalidateLevel.FULL: {
        this._mainView.flush()
        this._floatLayerView.flush()
        break
      }
      default: {
        break
      }
    }
  }
}
