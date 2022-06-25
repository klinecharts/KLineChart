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

import View from './View'

import { CandleType, LineStyle } from '../options/styleOptions'
import { TechnicalIndicatorPlotType, getTechnicalIndicatorPlotStyle } from '../component/technicalindicator/TechnicalIndicator'
import { renderHorizontalLine, renderVerticalLine, renderLine } from '../renderer/line'
import { isValid } from '../utils/typeChecks'

export default class TechnicalIndicatorView extends View {
  constructor (container, chartStore, xAxis, yAxis, paneId) {
    super(container, chartStore)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._paneId = paneId
  }

  _draw () {
    this._ctx.globalCompositeOperation = 'destination-over'
    this._drawContent()
  }

  _drawContent () {
    this._drawTechs()
    this._drawGrid()
  }

  /**
   * 绘制网格
   */
  _drawGrid () {
    const gridOptions = this._chartStore.styleOptions().grid
    if (!gridOptions.show) {
      return
    }
    const gridHorizontalOptions = gridOptions.horizontal
    this._ctx.save()
    if (gridHorizontalOptions.show) {
      this._ctx.strokeStyle = gridHorizontalOptions.color
      this._ctx.lineWidth = gridHorizontalOptions.size
      if (gridHorizontalOptions.style === LineStyle.DASH) {
        this._ctx.setLineDash(gridHorizontalOptions.dashValue)
      } else {
        this._ctx.setLineDash([])
      }
      this._yAxis.ticks().forEach(tick => {
        renderHorizontalLine(this._ctx, tick.y, 0, this._width)
      })
    }

    const gridVerticalOptions = gridOptions.vertical
    if (gridVerticalOptions.show) {
      this._ctx.strokeStyle = gridVerticalOptions.color
      this._ctx.lineWidth = gridVerticalOptions.size
      if (gridVerticalOptions.style === LineStyle.DASH) {
        this._ctx.setLineDash(gridVerticalOptions.dashValue)
      } else {
        this._ctx.setLineDash([])
      }
      this._xAxis.ticks().forEach(tick => {
        renderVerticalLine(this._ctx, tick.x, 0, this._height)
      })
    }
    this._ctx.restore()
  }

  /**
   * 绘制指标
   */
  _drawTechs () {
    this._ctx.globalCompositeOperation = 'source-over'
    const to = this._chartStore.timeScaleStore().to()
    const techOptions = this._chartStore.styleOptions().technicalIndicator
    const techs = this._chartStore.technicalIndicatorStore().instances(this._paneId)
    techs.forEach(tech => {
      const plots = tech.plots
      const lines = []
      const dataList = this._chartStore.dataList()
      const techResult = tech.result
      const styles = tech.styles || techOptions
      // 技术指标自定义绘制
      if (tech.render) {
        this._ctx.save()
        tech.render({
          ctx: this._ctx,
          dataSource: {
            from: this._chartStore.timeScaleStore().from(),
            to,
            kLineDataList: this._chartStore.dataList(),
            technicalIndicatorDataList: techResult
          },
          viewport: {
            width: this._width,
            height: this._height,
            dataSpace: this._chartStore.timeScaleStore().dataSpace(),
            barSpace: this._chartStore.timeScaleStore().barSpace()
          },
          styles,
          xAxis: this._xAxis,
          yAxis: this._yAxis
        })
        this._ctx.restore()
      }
      const lineColors = styles.line.colors || []
      const lineColorSize = lineColors.length
      const linePlotStyles = []
      const lineCoordinates = []
      const isCandleYAxis = this._yAxis.isCandleYAxis()

      this._ctx.lineWidth = 1
      this._drawGraphics(
        (x, i, kLineData, halfBarSpace, barSpace) => {
          const techData = techResult[i] || {}
          let lineCount = 0
          if (tech.shouldOhlc && !isCandleYAxis) {
            this._drawCandleBar(x, halfBarSpace, barSpace, kLineData, styles.bar, CandleType.OHLC)
          }
          plots.forEach(plot => {
            const value = techData[plot.key]
            const valueY = this._yAxis.convertToPixel(value)
            switch (plot.type) {
              case TechnicalIndicatorPlotType.CIRCLE: {
                if (isValid(value)) {
                  const plotStyle = getTechnicalIndicatorPlotStyle(
                    dataList, techResult, i, plot, styles, { color: styles.circle.noChangeColor, isStroke: true }
                  )
                  this._drawCircle({
                    x,
                    y: valueY,
                    radius: halfBarSpace,
                    color: plotStyle.color,
                    isStroke: plotStyle.isStroke
                  })
                }
                break
              }
              case TechnicalIndicatorPlotType.BAR: {
                if (isValid(value)) {
                  let baseValue
                  if (isValid(plot.baseValue)) {
                    baseValue = plot.baseValue
                  } else {
                    baseValue = this._yAxis.min()
                  }
                  const baseValueY = this._yAxis.convertToPixel(baseValue)
                  const height = Math.abs(baseValueY - valueY)
                  const bar = {
                    x: x - halfBarSpace,
                    width: halfBarSpace * 2,
                    height: Math.max(1, height)
                  }
                  if (valueY > baseValueY) {
                    bar.y = baseValueY
                  } else {
                    bar.y = height < 1 ? baseValueY - 1 : valueY
                  }
                  const plotStyle = getTechnicalIndicatorPlotStyle(
                    dataList, techResult, i, plot, styles, { color: styles.bar.noChangeColor }
                  )
                  bar.color = plotStyle.color
                  bar.isStroke = plotStyle.isStroke
                  this._drawBar(bar)
                }
                break
              }
              case TechnicalIndicatorPlotType.LINE: {
                let plotStyle = null
                if (isValid(value)) {
                  plotStyle = getTechnicalIndicatorPlotStyle(
                    dataList, techResult, i, plot, styles, { color: lineColors[lineCount % lineColorSize] }
                  )
                  const coordinate = { x: x, y: valueY }
                  const prePlotStyle = linePlotStyles[lineCount]
                  if (!lineCoordinates[lineCount]) {
                    lineCoordinates[lineCount] = []
                  }
                  lineCoordinates[lineCount].push(coordinate)
                  if (prePlotStyle) {
                    if (prePlotStyle.color !== plotStyle.color) {
                      lines.push({ color: prePlotStyle.color, isDashed: prePlotStyle.isDashed, coordinates: lineCoordinates[lineCount] })
                      lineCoordinates[lineCount] = [coordinate]
                    } else {
                      if (prePlotStyle.isDashed !== plotStyle.isDashed) {
                        lines.push({ color: prePlotStyle.color, isDashed: prePlotStyle.isDashed, coordinates: lineCoordinates[lineCount] })
                        lineCoordinates[lineCount] = [coordinate]
                      }
                    }
                  }
                  if (i === to - 1) {
                    lines.push({ color: plotStyle.color, isDashed: plotStyle.isDashed, coordinates: lineCoordinates[lineCount] })
                  }
                }
                linePlotStyles[lineCount] = plotStyle
                lineCount++
                break
              }
              default: { break }
            }
          })
        },
        () => {
          this._drawLines(lines, styles)
        }
      )
    })
    this._ctx.globalCompositeOperation = 'destination-over'
  }

  /**
   * 绘制图形
   * @param onDrawing
   * @param onDrawEnd
   */
  _drawGraphics (onDrawing, onDrawEnd) {
    const visibleDataList = this._chartStore.visibleDataList()
    const barSpace = this._chartStore.timeScaleStore().barSpace()
    const halfBarSpace = this._chartStore.timeScaleStore().halfBarSpace()
    visibleDataList.forEach(({ x, index, data }, n) => {
      onDrawing(x, index, data, halfBarSpace, barSpace, n)
    })
    onDrawEnd && onDrawEnd()
  }

  /**
   * 绘制线
   * @param lines
   * @param techOptions
   */
  _drawLines (lines, techOptions) {
    this._ctx.lineWidth = techOptions.line.size
    lines.forEach(line => {
      this._ctx.strokeStyle = line.color
      if (line.isDashed) {
        this._ctx.setLineDash(techOptions.line.dashValue)
      } else {
        this._ctx.setLineDash([])
      }
      renderLine(this._ctx, line.coordinates)
    })
  }

  /**
   * 绘制柱
   */
  _drawBar (bar) {
    if (bar.isStroke) {
      this._ctx.strokeStyle = bar.color
      this._ctx.strokeRect(bar.x + 0.5, bar.y, bar.width - 1, bar.height)
    } else {
      this._ctx.fillStyle = bar.color
      this._ctx.fillRect(bar.x, bar.y, bar.width, bar.height)
    }
  }

  /**
   * 绘制圆点
   * @param circle
   * @private
   */
  _drawCircle (circle) {
    this._ctx.strokeStyle = circle.color
    this._ctx.fillStyle = circle.color
    this._ctx.beginPath()
    this._ctx.arc(circle.x, circle.y, circle.radius, Math.PI * 2, 0, true)
    if (circle.isStroke) {
      this._ctx.stroke()
    } else {
      this._ctx.fill()
    }
    this._ctx.closePath()
  }

  /**
   * 绘制蜡烛柱
   * @param x
   * @param halfBarSpace
   * @param barSpace
   * @param kLineData
   * @param barOptions
   * @param barStyle
   */
  _drawCandleBar (x, halfBarSpace, barSpace, kLineData, barOptions, barStyle) {
    const { open, close, high, low } = kLineData
    if (close > open) {
      this._ctx.strokeStyle = barOptions.upColor
      this._ctx.fillStyle = barOptions.upColor
    } else if (close < open) {
      this._ctx.strokeStyle = barOptions.downColor
      this._ctx.fillStyle = barOptions.downColor
    } else {
      this._ctx.strokeStyle = barOptions.noChangeColor
      this._ctx.fillStyle = barOptions.noChangeColor
    }
    const openY = this._yAxis.convertToPixel(open)
    const closeY = this._yAxis.convertToPixel(close)
    const priceY = [
      openY, closeY,
      this._yAxis.convertToPixel(high),
      this._yAxis.convertToPixel(low)
    ]
    priceY.sort((a, b) => a - b)
    this._ctx.fillRect(x - 0.5, priceY[0], 1, priceY[1] - priceY[0])
    this._ctx.fillRect(x - 0.5, priceY[2], 1, priceY[3] - priceY[2])

    const barHeight = Math.max(1, priceY[2] - priceY[1])
    switch (barStyle) {
      case CandleType.CANDLE_SOLID: {
        this._ctx.fillRect(x - halfBarSpace, priceY[1], barSpace, barHeight)
        break
      }
      case CandleType.CANDLE_STROKE: {
        this._ctx.strokeRect(x - halfBarSpace + 0.5, priceY[1], barSpace - 1, barHeight)
        break
      }
      case CandleType.CANDLE_UP_STROKE: {
        if (close > open) {
          this._ctx.strokeRect(x - halfBarSpace + 0.5, priceY[1], barSpace - 1, barHeight)
        } else {
          this._ctx.fillRect(x - halfBarSpace, priceY[1], barSpace, barHeight)
        }
        break
      }
      case CandleType.CANDLE_DOWN_STROKE: {
        if (close > open) {
          this._ctx.fillRect(x - halfBarSpace, priceY[1], barSpace, barHeight)
        } else {
          this._ctx.strokeRect(x - halfBarSpace + 0.5, priceY[1], barSpace - 1, barHeight)
        }
        break
      }
      default: {
        this._ctx.fillRect(x - 0.5, priceY[0], 1, priceY[3] - priceY[0])
        this._ctx.fillRect(x - halfBarSpace, openY, halfBarSpace, 1)
        this._ctx.fillRect(x, closeY, halfBarSpace, 1)
        break
      }
    }
  }
}
