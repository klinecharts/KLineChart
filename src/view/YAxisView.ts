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
import { type AxisStyle, type Styles } from '../common/Styles'

import { type LineAttrs } from '../extension/figure/line'
import { type TextAttrs } from '../extension/figure/text'

import { type AxisTick } from '../component/Axis'
import type YAxis from '../component/YAxis'

import AxisView from './AxisView'

export default class YAxisView extends AxisView<YAxis> {
  override getAxisStyles (styles: Styles): AxisStyle {
    return styles.yAxis
  }

  override createAxisLine (bounding: Bounding, styles: AxisStyle): LineAttrs {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const size = styles.axisLine.size
    let x: number
    if (yAxis.isFromZero()) {
      x = 0
    } else {
      x = bounding.width - size
    }
    return {
      coordinates: [
        { x, y: 0 },
        { x, y: bounding.height }
      ]
    }
  }

  override createTickLines (ticks: AxisTick[], bounding: Bounding, styles: AxisStyle): LineAttrs[] {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const axisLineStyles = styles.axisLine
    const tickLineStyles = styles.tickLine

    let startX = 0
    let endX = 0
    if (yAxis.isFromZero()) {
      startX = 0
      if (axisLineStyles.show) {
        startX += axisLineStyles.size
      }
      endX = startX + tickLineStyles.length
    } else {
      startX = bounding.width
      if (axisLineStyles.show) {
        startX -= axisLineStyles.size
      }
      endX = startX - tickLineStyles.length
    }
    return ticks.map(tick => ({
      coordinates: [
        { x: startX, y: tick.coord },
        { x: endX, y: tick.coord }
      ]
    }))
  }

  override createTickTexts (ticks: AxisTick[], bounding: Bounding, styles: AxisStyle): TextAttrs[] {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const axisLineStyles = styles.axisLine
    const tickLineStyles = styles.tickLine
    const tickTextStyles = styles.tickText

    let x = 0
    if (yAxis.isFromZero()) {
      x = tickTextStyles.marginStart
      if (axisLineStyles.show) {
        x += axisLineStyles.size
      }
      if (tickLineStyles.show) {
        x += tickLineStyles.length
      }
    } else {
      x = bounding.width - tickTextStyles.marginEnd
      if (axisLineStyles.show) {
        x -= axisLineStyles.size
      }
      if (tickLineStyles.show) {
        x -= tickLineStyles.length
      }
    }
    const textAlign = this.getWidget().getPane().getAxisComponent().isFromZero() ? 'left' : 'right'
    return ticks.map(tick => ({
      x,
      y: tick.coord,
      text: tick.text,
      align: textAlign,
      baseline: 'middle'
    }))
  }
}
