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

// import { hasAction } from '../enum/ActionType'

// class Delegate {
//   constructor () {
//     this._observers = []
//   }

//   subscribe (observer) {
//     if (this._observers.indexOf(observer) < 0) {
//       this._observers.push(observer)
//     }
//   }

//   unsubscribe (observer) {
//     const index = this._observers.indexOf(observer)
//     if (index > -1) {
//       this._observers.splice(index, 1)
//     } else {
//       this._observers = []
//     }
//   }

//   execute (data) {
//     this._observers.forEach(observer => {
//       observer(data)
//     })
//   }

//   hasObservers () {
//     return this._observers.length > 0
//   }
// }

// export default class ActionStore {
//   constructor () {
//     // 事件代理
//     this._delegates = new Map()
//   }

//   /**
//    * 事件执行
//    * @param type
//    * @param data
//    */
//   execute (type, data) {
//     if (this.has(type)) {
//       this._delegates.get(type).execute(data)
//     }
//   }

//   /**
//    * 是否有事件监听
//    * @param type
//    * @return {boolean}
//    */
//   has (type) {
//     return this._delegates.has(type) && this._delegates.get(type).hasObservers()
//   }

//   /**
//    * 订阅事件
//    * @param type
//    * @param callback
//    * @return {boolean}
//    */
//   subscribe (type, callback) {
//     if (!this._delegates.has(type)) {
//       this._delegates.set(type, new Delegate())
//     }
//     this._delegates.get(type).subscribe(callback)
//   }

//   /**
//    * 取消事件订阅
//    * @param type
//    * @param callback
//    * @return {boolean}
//    */
//   unsubscribe (type, callback) {
//     if (hasAction(type)) {
//       const delegate = this._delegates.get(type)
//       if (delegate) {
//         delegate.unsubscribe(callback)
//         if (!delegate.hasObservers()) {
//           this._delegates.delete(type)
//         }
//       }
//     }
//   }
// }
