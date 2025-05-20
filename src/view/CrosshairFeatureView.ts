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

import type Nullable from '../common/Nullable'
import type Crosshair from '../common/Crosshair'
import type { FeatureIconFontStyle, FeaturePathStyle, FeatureStyle } from '../common/Styles'
import { isString } from '../common/utils/typeChecks'
import { calcTextWidth } from '../common/utils/canvas'

import type { YAxis } from '../component/YAxis'

import type DrawPane from '../pane/DrawPane'
import type DrawWidget from '../widget/DrawWidget'
import View from './View'

interface CrosshairFeatureInfo {
  crosshair: Crosshair
  feature: FeatureStyle
}

export default class CrosshairFeatureView extends View<YAxis> {
  private _activeFeatureInfo: Nullable<CrosshairFeatureInfo> = null

  private readonly _featureClickEvent = (featureInfo: CrosshairFeatureInfo) => () => {
    const pane = this.getWidget().getPane()
    pane.getChart().getChartStore().executeAction('onCrosshairFeatureClick', featureInfo)
    return true
  }

  private readonly _featureMouseMoveEvent = (featureInfo: CrosshairFeatureInfo) => () => {
    this._activeFeatureInfo = featureInfo
    this.getWidget().setForceCursor('pointer')
    return true
  }

  constructor (widget: DrawWidget<DrawPane<YAxis>>) {
    super(widget)
    this.registerEvent('mouseMoveEvent', _ => {
      this._activeFeatureInfo = null
      this.getWidget().setForceCursor(null)
      return false
    })
  }

  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = widget.getPane().getChart().getChartStore()
    const crosshair = chartStore.getCrosshair()
    const weight = this.getWidget()
    const yAxis = weight.getPane().getAxisComponent()
    if (isString(crosshair.paneId) && crosshair.paneId === pane.getId() && yAxis.isInCandle()) {
      const styles = chartStore.getStyles().crosshair
      const features = styles.horizontal.features
      if (styles.show && styles.horizontal.show && features.length > 0) {
        const isRight = yAxis.position === 'right'
        const bounding = weight.getBounding()

        let yAxisTextWidth = 0
        const horizontalTextStyles = styles.horizontal.text
        if (yAxis.inside && horizontalTextStyles.show) {
          const value = yAxis.convertFromPixel(crosshair.y!)
          const range = yAxis.getRange()
          let text = yAxis.displayValueToText(
            yAxis.realValueToDisplayValue(
              yAxis.valueToRealValue(value, { range }),
              { range }
            ),
            chartStore.getSymbol()?.pricePrecision ?? 2
          )
          text = chartStore.getDecimalFold().format(chartStore.getThousandsSeparator().format(text))
          yAxisTextWidth = horizontalTextStyles.paddingLeft +
            calcTextWidth(text, horizontalTextStyles.size, horizontalTextStyles.weight, horizontalTextStyles.family) +
            horizontalTextStyles.paddingRight
        }

        let x = yAxisTextWidth
        if (isRight) {
          x = bounding.width - yAxisTextWidth
        }
        const y = crosshair.y!
        features.forEach(feature => {
          const {
            marginLeft = 0, marginTop = 0, marginRight = 0,
            paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0,
            color, activeColor, backgroundColor, activeBackgroundColor,
            borderRadius, size = 0, type, content
          } = feature
          let width = size
          if (type === 'icon_font') {
            const iconFont = content as FeatureIconFontStyle
            width = paddingLeft + calcTextWidth(iconFont.code, size, 'normal', iconFont.family) + paddingRight
          }
          if (isRight) {
            x -= (width + marginRight)
          } else {
            x += marginLeft
          }
          let finalColor = color
          let finalBackgroundColor = backgroundColor
          if (this._activeFeatureInfo?.feature.id === feature.id) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
            finalColor = activeColor ?? color
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ignore
            finalBackgroundColor = activeBackgroundColor ?? backgroundColor
          }
          const eventHandler = {
            mouseClickEvent: this._featureClickEvent({ crosshair, feature }),
            mouseMoveEvent: this._featureMouseMoveEvent({ crosshair, feature })
          }
          if (type === 'icon_font') {
            const iconFont = content as FeatureIconFontStyle
            this.createFigure({
              name: 'text',
              attrs: {
                text: iconFont.code,
                x,
                y: y + marginTop,
                baseline: 'middle'
              },
              styles: {
                paddingLeft,
                paddingTop,
                paddingRight,
                paddingBottom,
                borderRadius,
                size,
                family: iconFont.family,
                color: finalColor,
                backgroundColor: finalBackgroundColor
              }
            }, eventHandler)?.draw(ctx)
          } else {
            this.createFigure({
              name: 'rect',
              attrs: { x, y: y + marginTop - size / 2, width: size, height: size },
              styles: {
                paddingLeft,
                paddingTop,
                paddingRight,
                paddingBottom,
                color: finalBackgroundColor
              }
            }, eventHandler)?.draw(ctx)
            const path = content as FeaturePathStyle
            this.createFigure({
              name: 'path',
              attrs: { path: path.path, x, y: y + marginTop + paddingTop - size / 2, width: size, height: size },
              styles: {
                style: path.style,
                lineWidth: path.lineWidth,
                color: finalColor
              }
            })?.draw(ctx)
          }
          if (isRight) {
            x -= marginLeft
          } else {
            x += (width + marginRight)
          }
        })
      }
    }
  }
}
