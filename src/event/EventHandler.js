import { EventType } from './EventBase'

export function isTouch (event) {
  return event.type === EventType.TOUCH
}

export function isMouse (event) {
  return event.type === EventType.MOUSE
}

export default class EventHandler {
  constructor (chartData) {
    this._chartData = chartData
    this._seriesSize = {}
  }

  _checkEventPointX (x) {
    return x > 0 && x < this._seriesSize.contentRight - this._seriesSize.contentLeft
  }

  setSeriesSize (seriesSize) {
    this._seriesSize = seriesSize
  }
}
