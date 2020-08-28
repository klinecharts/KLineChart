export default class Delegate {
  constructor () {
    this._observers = []
  }

  subscribe (observer) {
    if (this._observers.indexOf(observer) < 0) {
      this._observers.push(observer)
    }
  }

  unsubscribe (observer) {
    const index = this._observers.indexOf(observer)
    if (index > -1) {
      this._observers.splice(index, 1)
    }
  }

  execute (data) {
    this._observers.forEach(observer => {
      observer(data)
    })
  }

  hasObservers () {
    return this._observers.length > 0
  }
}
