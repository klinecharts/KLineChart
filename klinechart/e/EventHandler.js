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
    return x > this._seriesSize.contentLeft && x < this._seriesSize.contentRight
  }

  setSeriesSize (seriesSize) {
    this._seriesSize = seriesSize
  }
}
