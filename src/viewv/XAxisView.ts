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
import XAxis from '../componentl/XAxis'

import AxisView from './AxisView'
import { AxisStyle, AxisLineStyle, AxisTickLineStyle, AxisTickTextStyle } from '../store/styles'

export default class XAxisView extends AxisView<XAxis> {
  protected getAxisStyles (styles: any): AxisStyle {
    return styles.xAxis
  }

  protected createAxisLine (bounding: Bounding, styles: AxisStyle): LineAttrs {
    const axisLineStyles = styles.axisLine as Required<AxisLineStyle>
    return {
      coordinates: [
        { x: 0, y: 0 },
        { x: bounding.width, y: 0 }
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
    const tickLineStyles = styles.tickLine as Required<AxisTickLineStyle>
    const axisLineSize = styles.axisLine?.size as number
    return ticks.map(tick => ({
      coordinates: [
        { x: tick.coord, y: 0 },
        { x: tick.coord, y: axisLineSize + tickLineStyles.length }
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
    const tickTickStyles = styles.tickText as Required<AxisTickTextStyle>
    const axisLineSize = styles.axisLine?.size as number
    const tickLineLength = styles.tickLine?.length as number
    return ticks.map(tick => ({
      x: tick.coord,
      y: axisLineSize + tickLineLength + tickTickStyles.marginStart,
      text: tick.text,
      styles: {
        style: 'fill',
        color: tickTickStyles.color,
        size: tickTickStyles.size,
        family: tickTickStyles.family,
        weight: tickTickStyles.weight,
        align: 'center',
        baseline: 'top'
      }
    }))
  }
}
