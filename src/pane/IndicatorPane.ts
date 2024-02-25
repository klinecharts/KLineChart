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

import type Nullable from '../common/Nullable'

import type DrawWidget from '../widget/DrawWidget'
import IndicatorWidget from '../widget/IndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'

import type YAxis from '../component/YAxis'

import { getYAxisClass } from '../extension/y-axis'

import DrawPane from './DrawPane'

export default class IndicatorPane extends DrawPane<YAxis> {
  override createAxisComponent (name?: string): YAxis {
    const YAxisClass = getYAxisClass(name ?? 'default')
    return new YAxisClass(this)
  }

  override createMainWidget (container: HTMLElement): DrawWidget<DrawPane<YAxis>> {
    return new IndicatorWidget(container, this)
  }

  override createYAxisWidget (container: HTMLElement): Nullable<YAxisWidget> {
    return new YAxisWidget(container, this)
  }
}
