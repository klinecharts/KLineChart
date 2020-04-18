import EventHandler from './EventHandler'

export default class KeyBoardEventHandler extends EventHandler {
  /**
   * 键盘事件
   * @param event
   */
  keyBoardDownEvent (event) {
    if (event.shiftKey) {
      switch (event.code) {
        case 'ArrowUp': {
          this._chartData.zoom(-0.05, this._chartData.crossHairPoint())
          break
        }
        case 'ArrowDown': {
          this._chartData.zoom(0.05, this._chartData.crossHairPoint())
          break
        }
        case 'ArrowLeft': {
          this._chartData.startScroll()
          this._chartData.scroll(-this._chartData.dataSpace())
          break
        }
        case 'ArrowRight': {
          this._chartData.startScroll()
          this._chartData.scroll(this._chartData.dataSpace())
          break
        }
        default: {
          break
        }
      }
    }
  }
}
