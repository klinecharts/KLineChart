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

import type Bounding from '../common/Bounding'
import type Crosshair from '../common/Crosshair'
import type { CrosshairStyle, CrosshairDirectionStyle, StateTextStyle } from '../common/Styles'
import { isValid } from '../common/utils/typeChecks'

import type { Axis } from '../component/Axis'
import type { XAxis } from '../component/XAxis'

import type ChartStore from '../Store'

import CrosshairHorizontalLabelView from './CrosshairHorizontalLabelView'
import type { TextAttrs } from '../extension/figure/text'
import { PeriodTypeCrosshairTooltipFormat } from '../common/Period'

export default class CrosshairVerticalLabelView extends CrosshairHorizontalLabelView<XAxis> {
  override compare (crosshair: Crosshair): boolean {
    return isValid(crosshair.timestamp)
  }

  override getDirectionStyles (styles: CrosshairStyle): CrosshairDirectionStyle {
    return styles.vertical
  }

  override getText (crosshair: Crosshair, chartStore: ChartStore): string {
    const timestamp = crosshair.timestamp!
    return chartStore.getInnerFormatter().formatDate(timestamp, PeriodTypeCrosshairTooltipFormat[chartStore.getPeriod()?.type ?? 'day'], 'crosshair')
  }

  override getTextAttrs (text: string, textWidth: number, crosshair: Crosshair, bounding: Bounding, _axis: Axis, styles: StateTextStyle): TextAttrs {
    const x = crosshair.realX!
    let optimalX = 0
    let align: CanvasTextAlign = 'center'
    if (x - textWidth / 2 - styles.paddingLeft < 0) {
      optimalX = 0
      align = 'left'
    } else if (x + textWidth / 2 + styles.paddingRight > bounding.width) {
      optimalX = bounding.width
      align = 'right'
    } else {
      optimalX = x
    }
    return { x: optimalX, y: 0, text, align, baseline: 'top' }
  }
}
