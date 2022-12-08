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

import Bounding from '../common/Bounding'
import Crosshair from '../common/Crosshair'
import { CrosshairStyle, CrosshairDirectionStyle, StateRectTextStyle } from '../common/Options'

import XAxis from '../component/XAxis'

import ChartStore from '../store/ChartStore'

import CrosshairHorizontalLabelView from './CrosshairHorizontalLabelView'
import { TextAttrs } from '../extension/figure/text'

export default class CrosshairVerticalLabelView extends CrosshairHorizontalLabelView<XAxis> {
  protected checkPaneId (crosshair: Crosshair): boolean {
    return crosshair.dataIndex === crosshair.realDataIndex
  }

  protected getDirectionStyles (styles: CrosshairStyle): CrosshairDirectionStyle {
    return styles.vertical
  }

  protected getText (crosshair: Crosshair, chartStore: ChartStore, axis: XAxis): string {
    const timestamp = crosshair.kLineData?.timestamp as number
    return chartStore.getCustomApi().formatDate(chartStore.getTimeScaleStore().getDateTimeFormat(), timestamp, 'YYYY-MM-DD hh:mm')
  }

  protected getTextAttrs (text: string, textWidth: number, crosshair: Crosshair, bounding: Bounding, axis: XAxis, styles: StateRectTextStyle): TextAttrs {
    const x = crosshair.realX as number
    let optimalX: number
    if (x - textWidth / 2 - styles.paddingLeft < 0) {
      optimalX = styles.paddingLeft + textWidth / 2
    } else if (x + textWidth / 2 + styles.paddingRight > bounding.width) {
      optimalX = bounding.width - styles.paddingRight - textWidth / 2
    } else {
      optimalX = x
    }
    return { x: optimalX, y: 0, text, align: 'center', baseline: 'top' }
  }
}
