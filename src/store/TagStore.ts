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

// import { isValid } from '../common/utils/typeChecks'

// import InvalidateLevel from '../enum/InvalidateLevel'

// export default class TagStore {
//   constructor (chartStore) {
//     // 刷新回调
//     this._chartStore = chartStore
//     // 标签
//     this._tags = new Map()
//   }

//   /**
//    * 根据id获取tag实例
//    * @param id
//    * @param paneId
//    * @returns
//    */
//   _getById (id, paneId) {
//     const tags = this.get(paneId)
//     if (tags) {
//       return tags.get(id)
//     }
//     return null
//   }

//   /**
//    * 是否包含某一个标签
//    * @param id
//    * @param paneId
//    * @returns
//    */
//   has (id, paneId) {
//     return !!this._getById(id, paneId)
//   }

//   /**
//    * 更新tag
//    * @param id
//    * @param paneId
//    * @param options
//    */
//   update (id, paneId, options) {
//     const tag = this._getById(id, paneId)
//     if (tag) {
//       return tag.update(options)
//     }
//     return false
//   }

//   /**
//   * 根据id获取标签实例
//   * @param tagId
//   * @param paneId
//   * @return
//   */
//   get (paneId) {
//     return this._tags.get(paneId)
//   }

//   /**
//   * 添加标签
//   * @param tags
//   * @param paneId
//   */
//   add (tags, paneId) {
//     if (!this._tags.has(paneId)) {
//       this._tags.set(paneId, new Map())
//     }
//     const idTags = this._tags.get(paneId)
//     tags.forEach(tag => {
//       idTags.set(tag.id(), tag)
//     })
//     this._chartStore.invalidate(InvalidateLevel.OVERLAY)
//   }

//   /**
//   * 移除标签
//   * @param paneId
//   * @param tagId
//   */
//   remove (paneId, tagId) {
//     let shouldInvalidate = false
//     if (isValid(paneId)) {
//       if (this._tags.has(paneId)) {
//         if (isValid(tagId)) {
//           const paneTags = this._tags.get(paneId)
//           const ids = [].concat(tagId)
//           ids.forEach(id => {
//             if (paneTags.has(id)) {
//               shouldInvalidate = true
//               paneTags.delete(id)
//             }
//           })
//           if (paneTags.size === 0) {
//             this._tags.delete(paneId)
//           }
//         } else {
//           shouldInvalidate = true
//           this._tags.delete(paneId)
//         }
//       }
//     } else {
//       shouldInvalidate = true
//       this._tags.clear()
//     }
//     if (shouldInvalidate) {
//       this._chartStore.invalidate(InvalidateLevel.OVERLAY)
//     }
//   }
// }
