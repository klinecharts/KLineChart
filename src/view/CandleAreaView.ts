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

import type Coordinate from '../common/Coordinate'
import type VisibleData from '../common/VisibleData'
import { type GradientColor } from '../common/Styles'
import Animation from '../common/Animation'
import { isNumber, isArray, isValid } from '../common/utils/typeChecks'
import { UpdateLevel } from '../common/Updater'

import ChildrenView from './ChildrenView'

import { lineTo } from '../extension/figure/line'
import type Nullable from '../common/Nullable'

export default class CandleAreaView extends ChildrenView {
  private readonly _ripplePoint = this.createFigure({
    name: 'circle',
    attrs: {
      x: 0,
      y: 0,
      r: 0
    },
    styles: {
      style: 'fill'
    }
  })

  private _animationFrameTime = 0

  private readonly _animation = new Animation({ iterationCount: Infinity }).doFrame((time) => {
    this._animationFrameTime = time
    const pane = this.getWidget().getPane()
    pane.getChart().updatePane(UpdateLevel.Main, pane.getId())
  })

  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chart = pane.getChart()
    const dataList = chart.getDataList()
    const lastDataIndex = dataList.length - 1
    const bounding = widget.getBounding()
    const yAxis = pane.getAxisComponent()
    const styles = chart.getStyles().candle.area
    const coordinates: Coordinate[] = []
    let minY = Number.MAX_SAFE_INTEGER
    let areaStartX: number = Number.MIN_SAFE_INTEGER
    let ripplePointCoordinate: Nullable<Coordinate> = null
    this.eachChildren((data: VisibleData) => {
      const { data: kLineData, x } = data
      const value = kLineData?.[styles.value]
      if (isNumber(value)) {
        const y = yAxis.convertToPixel(value)
        if (areaStartX === Number.MIN_SAFE_INTEGER) {
          areaStartX = x
        }
        coordinates.push({ x, y })
        minY = Math.min(minY, y)
        if (data.dataIndex === lastDataIndex) {
          ripplePointCoordinate = { x, y }
        }
      }
    })

    if (coordinates.length > 0) {
      this.createFigure({
        name: 'line',
        attrs: { coordinates },
        styles: {
          color: styles.lineColor,
          size: styles.lineSize,
          smooth: styles.smooth
        }
      }
      )?.draw(ctx)

      // render area
      const backgroundColor = styles.backgroundColor
      let color: string | CanvasGradient
      if (isArray<GradientColor>(backgroundColor)) {
        const gradient = ctx.createLinearGradient(0, bounding.height, 0, minY)
        try {
          backgroundColor.forEach(({ offset, color }) => {
            gradient.addColorStop(offset, color)
          })
        } catch (e) {
        }
        color = gradient
      } else {
        color = backgroundColor
      }
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(areaStartX, bounding.height)
      ctx.lineTo(coordinates[0].x, coordinates[0].y)
      lineTo(ctx, coordinates, styles.smooth)
      ctx.lineTo(coordinates[coordinates.length - 1].x, bounding.height)
      ctx.closePath()
      ctx.fill()
    }

    const pointStyles = styles.point
    if (pointStyles.show && isValid(ripplePointCoordinate)) {
      this.createFigure({
        name: 'circle',
        attrs: {
          x: ripplePointCoordinate!.x,
          y: ripplePointCoordinate!.y,
          r: pointStyles.radius
        },
        styles: {
          style: 'fill',
          color: pointStyles.color
        }
      })?.draw(ctx)
      let rippleRadius = pointStyles.rippleRadius
      if (pointStyles.animation) {
        rippleRadius = pointStyles.radius + this._animationFrameTime / pointStyles.animationDuration * (pointStyles.rippleRadius - pointStyles.radius)
        this._animation.setDuration(pointStyles.animationDuration).start()
      }
      this._ripplePoint
        ?.setAttrs({
          x: ripplePointCoordinate!.x,
          y: ripplePointCoordinate!.y,
          r: rippleRadius
        })
        .setStyles({ style: 'fill', color: pointStyles.rippleColor }).draw(ctx)
    } else {
      this.stopAnimation()
    }
  }

  stopAnimation (): void {
    this._animation.stop()
  }
}
