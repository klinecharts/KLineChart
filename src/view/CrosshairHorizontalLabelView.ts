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
import Crosshair from '../common/Crosshair'
import { CrosshairStyle, CrosshairDirectionStyle, YAxisType, PaddingTextStyle } from '../common/Styles'

import Axis from '../componentl/Axis'
import YAxis from '../componentl/YAxis'

import ChartStore from '../store/ChartStore'

import { formatBigNumber, formatPrecision } from '../common/utils/format'
import { createFont, calcTextWidth } from '../common/utils/canvas'

import View from './View'

export default class CrosshairHorizontalLabelView<C extends Axis = YAxis> extends View<C> {
  drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = widget.getPane().getChart().getChartStore()
    const crosshair = chartStore.getCrosshairStore().get()
    const styles = chartStore.getStyleOptions().crosshair
    if (crosshair.paneId !== undefined && crosshair.kLineData !== undefined && this.checkPaneId(crosshair, pane.getId())) {
      if (styles.show) {
        const directionStyles = this.getDirectionStyles(styles)
        const textStyles = directionStyles.text
        if (directionStyles.show && textStyles.show) {
          const axis = pane.getAxisComponent()
          const text = this.getText(crosshair, chartStore, axis)

          ctx.font = createFont(textStyles.size, textStyles.weight, textStyles.family)
          const textWidth = calcTextWidth(ctx, text)

          const rectWidth = textStyles.paddingLeft + textStyles.paddingRight + textWidth + textStyles.borderSize * 2
          const rectHeight = textStyles.paddingTop + textStyles.paddingBottom + textStyles.size + textStyles.borderSize * 2

          const { x: rectX, y: rectY } = this.getRectCoordinate(
            rectWidth, rectHeight, crosshair, bounding, axis, textStyles
          )

          this.createFigure(
            'rect',
            {
              x: rectX,
              y: rectY,
              width: rectWidth,
              height: rectHeight
            },
            {
              color: textStyles.backgroundColor,
              borderColor: textStyles.borderColor,
              borderSize: textStyles.borderSize,
              borderRadius: textStyles.borderRadius
            }
          )?.draw(ctx)

          this.createFigure(
            'text',
            {
              x: rectX + textStyles.paddingLeft,
              y: rectY + rectHeight / 2,
              text
            },
            {
              color: textStyles.color,
              size: textStyles.size,
              family: textStyles.family,
              weight: textStyles.weight,
              baseline: 'middle'
            }
          )?.draw(ctx)
        }
      }
    }
  }

  protected checkPaneId (crosshair: Crosshair, paneId: string): boolean {
    return crosshair.paneId === paneId
  }

  protected getDirectionStyles (styels: CrosshairStyle): CrosshairDirectionStyle {
    return styels.horizontal
  }

  protected getText (crosshair: Crosshair, chartStore: ChartStore, axis: C): string {
    const yAxis = axis as unknown as YAxis
    const value = axis.convertFromPixel(crosshair.y as number)
    let text: string
    if (yAxis.getType() === YAxisType.PERCENTAGE) {
      const visibleDataList = chartStore.getVisibleDataList()
      const fromData = visibleDataList[0]?.data ?? {}
      text = `${((value - fromData.close) / fromData.close * 100).toFixed(2)}%`
    } else {
      const indicators = chartStore.getIndicatorStore().getInstances(crosshair.paneId as string)
      let precision = 0
      let shouldFormatBigNumber = false
      if (yAxis.isInCandle()) {
        precision = chartStore.getPrecision().price
      } else {
        indicators.forEach(indicator => {
          precision = Math.max(indicator.precision, precision)
          if (!shouldFormatBigNumber) {
            shouldFormatBigNumber = indicator.shouldFormatBigNumber
          }
        })
      }
      text = formatPrecision(value, precision)
      if (shouldFormatBigNumber) {
        text = formatBigNumber(text)
      }
    }
    return text
  }

  protected getRectCoordinate (rectWidth: number, rectHeight: number, crosshair: Crosshair, bounding: Required<Bounding>, axis: C, styles: Required<PaddingTextStyle>): Coordinate {
    const yAxis = axis as unknown as YAxis
    let rectX: number
    if (yAxis.isFromZero()) {
      rectX = 0
    } else {
      rectX = bounding.width - rectWidth
    }

    const y = crosshair.y as number
    const rectY = y - styles.borderSize - styles.paddingTop - styles.size / 2

    return { x: rectX, y: rectY }
  }
}
