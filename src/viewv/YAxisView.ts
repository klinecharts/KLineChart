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

import GraphTemplate from '../template/figure/Figure'
import { LineAttrs } from '../template/figure/line'
import { TextAttrs } from '../template/figure/text'

import { Tick } from '../componentl/Axis'
import AxisView, { AxisStyle } from './AxisView'

export type YAxisStyle = AxisStyle & { width: number | 'auto', type: 'normal' | 'percentage' | 'log', position: 'left' | 'right', inside: boolean, reverse: boolean }

export default class YAxisView extends AxisView {
  protected createAxisLine (styles: AxisStyle): GraphTemplate<LineAttrs> {
    throw new Error('Method not implemented.')
  }

  protected createTickLine (tick: Tick, styles: AxisStyle): GraphTemplate<LineAttrs> {
    throw new Error('Method not implemented.')
  }

  protected createTickText (tick: Tick, styles: AxisStyle): GraphTemplate<TextAttrs> {
    throw new Error('Method not implemented.')
  }
}
