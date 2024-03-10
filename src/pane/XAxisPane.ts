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

import type DrawWidget from '../widget/DrawWidget'
import XAxisWidget from '../widget/XAxisWidget'

import type XAxis from '../component/XAxis'

import DrawPane from './DrawPane'

import { getXAxisClass } from '../extension/x-axis'

export default class XAxisPane extends DrawPane<XAxis> {
  override createAxisComponent (name: string): XAxis {
    const XAxisClass = getXAxisClass(name)
    return new XAxisClass(this)
  }

  override createMainWidget (container: HTMLElement): DrawWidget<DrawPane<XAxis>> {
    return new XAxisWidget(container, this)
  }
}
