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

import TypeOrNull from '../common/TypeOrNull'

import SeparatorWidget from '../widget/SeparatorWidget'
import DrawWidget from '../widget/DrawWidget'
import IndicatorWidget from '../widget/IndicatorWidget'
import YAxisWidget from '../widget/YAxisWidget'

import YAxis from '../component/YAxis'

import Pane from './Pane'

export default class IndicatorPane extends Pane<YAxis> {
  getName (): string {
    return 'indicator'
  }

  protected createAxisComponent (): YAxis {
    return new YAxis(this)
  }

  protected createMainWidget (container: HTMLElement): DrawWidget<YAxis> {
    return new IndicatorWidget(container, this)
  }

  protected createSeparatorWidget (container: HTMLElement): TypeOrNull<SeparatorWidget> {
    return new SeparatorWidget(container, this)
  }

  protected creatYAxisWidget (container: HTMLElement): TypeOrNull<YAxisWidget> {
    return new YAxisWidget(container, this)
  }
}
