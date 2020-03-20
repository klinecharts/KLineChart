import EventBase from './EventBase'

export class CrossHairEvent {
  constructor (target, chartData, tag) {
    this._chartData = chartData
    this._tag = tag
    this._event = new EventBase(target, {
      mouseLeaveEvent: this._eventLeave.bind(this),
      mouseMoveEvent: this._eventMove.bind(this)
    }, {
      treatVertTouchDragAsPageScroll: true,
      treatHorzTouchDragAsPageScroll: true
    })
  }

  _eventLeave () {
    this._chartData.setCrossHairSeriesTag(null)
  }

  _eventMove (event) {
    this._chartData.setCrossHairPoint({ x: event.localX, y: event.localY })
    this._chartData.setCrossHairSeriesTag(this._tag)
  }

  destroy () {
    this._event.destroy()
  }
}
