/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
