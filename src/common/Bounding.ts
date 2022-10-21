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

export interface BoundingLike {
  width?: number
  height?: number
  left?: number
  right?: number
  top?: number
  bottom?: number
}

export default class Bounding implements Required<BoundingLike> {
  width: number
  height: number
  left: number
  right: number
  top: number
  bottom: number

  constructor (bounding?: BoundingLike) {
    if (bounding !== undefined) {
      this.merge(bounding)
    }
  }

  merge (bounding: BoundingLike): void {
    const { width, height, left, right, top, bottom } = bounding
    if (width !== undefined) {
      this.width = width
    }
    if (height !== undefined) {
      this.height = height
    }
    if (left !== undefined) {
      this.left = left
    }
    if (right !== undefined) {
      this.right = right
    }
    if (top !== undefined) {
      this.top = top
    }
    if (bottom !== undefined) {
      this.bottom = bottom
    }
  }
}
