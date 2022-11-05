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
import { AxisStyle, Styles } from '../common/Styles'

import { LineAttrs } from '../extension/figure/line'
import { TextAttrs } from '../extension/figure/text'

import { Tick } from '../componentl/Axis'
import YAxis from '../componentl/YAxis'

import AxisView from './AxisView'

export default class YxisView extends AxisView<YAxis> {
  protected getAxisStyles (styles: Styles): AxisStyle {
    return styles.xAxis
  }

  protected createAxisLine (bounding: Required<Bounding>, styles: AxisStyle): LineAttrs {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const axisLineStyles = styles.axisLine
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

  protected createTickLines (ticks: Tick[], bounding: Required<Bounding>, styles: AxisStyle): LineAttrs[] {
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
      ],
      styles: {
        style: 'solid',
        size: tickLineStyles.size,
        color: tickLineStyles.color,
        dashedValue: []
      }
    }))
  }

  protected createTickTexts (ticks: Tick[], bounding: Required<Bounding>, styles: AxisStyle): TextAttrs[] {
    const yAxis = this.getWidget().getPane().getAxisComponent()
    const axisLineStyles = styles.axisLine
    const tickLineStyles = styles.tickLine
    const tickTextStyles = styles.tickText

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
