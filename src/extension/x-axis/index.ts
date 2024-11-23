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

import XAxisImp, { type XAxisTemplate, type XAxisConstructor } from '../../component/XAxis'

import normal from './normal'

const xAxises: Record<string, XAxisConstructor> = {
  normal: XAxisImp.extend(normal)
}

function registerXAxis (axis: XAxisTemplate): void {
  xAxises[axis.name] = XAxisImp.extend(axis)
}

function getXAxisClass (name: string): XAxisConstructor {
  return xAxises[name] ?? xAxises.normal
}

export {
  registerXAxis,
  getXAxisClass
}
