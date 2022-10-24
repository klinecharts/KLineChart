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

import { LineAttrs } from '../template/figure/line'
import { TextAttrs } from '../template/figure/text'

import { Tick } from '../componentl/Axis'
import YAxis from '../componentl/YAxis'

import AxisView from './AxisView'
import { AxisStyle, AxisLineStyle, AxisTickLineStyle, AxisTickTextStyle } from '../store/styles'

export default class YxisView extends AxisView<YAxis> {
  protected getAxisStyles (styles: any): AxisStyle {
    return styles.xAxis
  }

  protected createAxisLine (bounding: Bounding, styles: AxisStyle): LineAttrs {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const axisLineStyles = styles.axisLine as Required<AxisLineStyle>
    let x: number
    if (yAxis.isFromZero()) {
      x = 0
    } else {
      x = bounding.width - 1
    }
    return {
      coordinates: [
        { x, y: 0 },
        { x, y: bounding.height }
      ],
      styles: {
        style: 'solid',
        size: axisLineStyles.size,
        color: axisLineStyles.color,
        dashedValue: []
      }
    }
  }

  protected createTickLines (ticks: Tick[], bounding: Bounding, styles: AxisStyle): LineAttrs[] {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const axisLineStyles = styles.axisLine as Required<AxisLineStyle>
    const tickLineStyles = styles.tickLine as Required<AxisTickLineStyle>

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
      ],
      styles: {
        style: 'solid',
        size: tickLineStyles.size,
        color: tickLineStyles.color,
        dashedValue: []
      }
    }))
  }

  protected createTickTexts (ticks: Tick[], bounding: Bounding, styles: AxisStyle): TextAttrs[] {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const axisLineStyles = styles.axisLine as Required<AxisLineStyle>
    const tickLineStyles = styles.tickLine as Required<AxisTickLineStyle>
    const tickTextStyles = styles.tickText as Required<AxisTickTextStyle>

    let x = 0
    let align
    if (yAxis.isFromZero()) {
      x = tickTextStyles.marginStart
      if (axisLineStyles.show) {
        x += axisLineStyles.size
      }
      if (tickLineStyles.show) {
        x += tickLineStyles.length
      }
      align = 'left'
    } else {
      x = bounding.width - tickTextStyles.marginEnd
      if (axisLineStyles.show) {
        x -= axisLineStyles.size
      }
      if (tickLineStyles.show) {
        x -= tickLineStyles.length
      }
      align = 'right'
    }
    return ticks.map(tick => ({
      x,
      y: tick.coord,
      text: tick.text,
      styles: {
        style: 'fill',
        color: tickTextStyles.color,
        size: tickTextStyles.size,
        family: tickTextStyles.family,
        weight: tickTextStyles.weight,
        align,
        baseline: 'middle'
      }
    }))
  }
}
