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

class ID {
  private _baseId = 1
  private _prevIdTimestamp: number

  next (prefix?: string): string {
    const timestamp = new Date().getTime()
    if (timestamp === this._prevIdTimestamp) {
      ++this._baseId
    } else {
      this._baseId = 1
    }
    this._prevIdTimestamp = timestamp
    return `${prefix ?? ''}${timestamp}_${this._baseId}`
  }
}

const id = new ID()

function createId (prefix?: string): string {
  return id.next(prefix)
}

export { createId }
