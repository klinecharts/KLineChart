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

import Coordinate from '../common/Coordinate'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { OverlayStyle } from '../common/Styles'

import Axis from '../component/Axis'
import XAxis from '../component/XAxis'
import Overlay, { OverlayFigure } from '../component/Overlay'

import OverlayVerticalTooltipView from './OverlayVerticalTooltipView'

export default class OverlayHorizontalTooltipView extends OverlayVerticalTooltipView<XAxis> {
  getFigures (
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    barSpace: BarSpace,
    precision: Precision,
    defaultStyles: OverlayStyle,
    xAxis: Axis,
    yAxis: Axis
  ): OverlayFigure | OverlayFigure[] {
    return overlay.createXAxisFigures({ overlay, coordinates, bounding, barSpace, precision, defaultStyles, xAxis, yAxis })
  }
}
