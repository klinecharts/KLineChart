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

import View, { PlotType } from './View'

import { CandleType, LineStyle } from '../data/options/styleOptions'
import { renderHorizontalLine, renderVerticalLine, renderLine } from '../renderer/line'
import { isValid } from '../utils/typeChecks'
import { ActionType } from '../data/ChartData'

export default class TechnicalIndicatorView extends View {
  constructor (container, chartData, xAxis, yAxis, additionalDataProvider) {
    super(container, chartData)
    this._xAxis = xAxis
    this._yAxis = yAxis
    this._additionalDataProvider = additionalDataProvider
  }

  _draw () {
    this._drawGrid()
    this._drawTechnicalIndicators()
  }

  /**
   * 绘制网格
   * @private
   */
  _drawGrid () {
    const gridOptions = this._chartData.styleOptions().grid
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
   * @private
   */
  _drawTechnicalIndicators () {
    const technicalIndicatorOptions = this._chartData.styleOptions().technicalIndicator
    const technicalIndicators = this._additionalDataProvider.technicalIndicators()
    technicalIndicators.forEach(technicalIndicator => {
      const plots = technicalIndicator.plots
      const lines = []
      const dataList = this._chartData.dataList()
      const technicalIndicatorResult = technicalIndicator.result
      const styles = technicalIndicator.styles || technicalIndicatorOptions
      // 技术指标自定义绘制
      if (technicalIndicator.render) {
        this._ctx.save()
        technicalIndicator.render(
          this._ctx,
          {
            from: this._chartData.from(),
            to: this._chartData.to(),
            kLineDataList: this._chartData.dataList(),
            technicalIndicatorDataList: technicalIndicatorResult
          },
          {
            width: this._width,
            height: this._height,
            dataSpace: this._chartData.dataSpace(),
            barSpace: this._chartData.barSpace()
          },
          styles,
          {
            convertFromPixel: this._xAxis.convertFromPixel.bind(this._xAxis),
            convertToPixel: this._xAxis.convertToPixel.bind(this._xAxis)
          },
          {
            convertFromPixel: this._yAxis.convertFromPixel.bind(this._yAxis),
            convertToPixel: this._yAxis.convertToPixel.bind(this._yAxis)
          },
          this._yAxis.isCandleYAxis()
        )
        this._ctx.restore()
      }

      let baseValue = technicalIndicator.baseValue
      if (!isValid(baseValue)) {
        baseValue = this._yAxis.min()
      }
      const baseValueY = this._yAxis.convertToPixel(baseValue)
      const isCandleYAxis = this._yAxis.isCandleYAxis()

      this._ctx.lineWidth = 1

      this._drawGraphics(
        (x, i, kLineData, halfBarSpace, barSpace) => {
          const technicalIndicatorData = technicalIndicatorResult[i] || {}
          let lineValueIndex = 0
          if (technicalIndicator.shouldOhlc && !isCandleYAxis) {
            this._drawCandleBar(x, halfBarSpace, barSpace, i, kLineData, styles.bar, CandleType.OHLC)
          }
          const coordinateY = {}
          plots.forEach(plot => {
            const value = technicalIndicatorData[plot.key]
            const valueY = this._yAxis.convertToPixel(value)
            coordinateY[plot.key] = valueY
            switch (plot.type) {
              case PlotType.CIRCLE: {
                if (isValid(value)) {
                  const cbData = {
                    preData: { kLineData: dataList[i - 1], technicalIndicatorData: technicalIndicatorResult[i - 1] },
                    currentData: { kLineData, technicalIndicatorData },
                    nextData: { kLineData: dataList[i + 1], technicalIndicatorData: technicalIndicatorResult[i + 1] }
                  }
                  const circle = {
                    x,
                    y: valueY,
                    radius: halfBarSpace,
                    color: (plot.color && plot.color(cbData, styles)) || styles.circle.noChangeColor,
                    isStroke: plot.isStroke ? plot.isStroke(cbData) : true
                  }
                  this._drawCircle(circle)
                }
                break
              }
              case PlotType.BAR: {
                if (isValid(value)) {
                  const cbData = {
                    preData: { kLineData: dataList[i - 1], technicalIndicatorData: technicalIndicatorResult[i - 1] },
                    currentData: { kLineData, technicalIndicatorData },
                    nextData: { kLineData: dataList[i + 1], technicalIndicatorData: technicalIndicatorResult[i + 1] }
                  }
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
                  bar.color = (plot.color && plot.color(cbData, styles)) || styles.bar.noChangeColor
                  bar.isStroke = plot.isStroke ? plot.isStroke(cbData) : false
                  this._drawBar(bar)
                }
                break
              }
              case PlotType.LINE: {
                let line = null
                if (isValid(value)) {
                  line = { x: x, y: valueY }
                }
                if (lines[lineValueIndex]) {
                  lines[lineValueIndex].push(line)
                } else {
                  lines[lineValueIndex] = [line]
                }
                lineValueIndex++
                break
              }
              default: { break }
            }
            this._drawActionExecute(ActionType.drawTechnicalIndicator, {
              ctx: this._ctx,
              kLineData,
              dataIndex: i,
              technicalIndicatorData,
              technicalIndicatorName: technicalIndicator.name,
              coordinate: { x, ...coordinateY },
              viewport: { width: this._width, height: this._height },
              barSpace,
              halfBarSpace,
              isCandle: isCandleYAxis
            })
          })
        },
        () => {
          this._drawLines(lines, styles)
        }
      )
    })
  }

  /**
   * 绘制图形
   * @param onDrawing
   * @param onDrawEnd
   * @private
   */
  _drawGraphics (onDrawing, onDrawEnd) {
    const visibleDataList = this._chartData.visibleDataList()
    const barSpace = this._chartData.barSpace()
    const halfBarSpace = barSpace / 2
    visibleDataList.forEach(({ x, index, data }, n) => {
      onDrawing(x, index, data, halfBarSpace, barSpace, n)
    })
    onDrawEnd && onDrawEnd()
  }

  /**
   * 绘制线
   * @param lines
   * @param technicalIndicatorOptions
   */
  _drawLines (lines, technicalIndicatorOptions) {
    const colors = technicalIndicatorOptions.line.colors || []
    const colorSize = colors.length
    this._ctx.lineWidth = technicalIndicatorOptions.line.size
    renderLine(this._ctx, () => {
      lines.forEach((lineItem, i) => {
        this._ctx.strokeStyle = colors[i % colorSize]
        this._ctx.beginPath()
        let isStart = true
        lineItem.forEach(line => {
          if (isValid(line)) {
            if (isStart) {
              this._ctx.moveTo(line.x, line.y)
              isStart = false
            } else {
              this._ctx.lineTo(line.x, line.y)
            }
          }
        })
        this._ctx.stroke()
        this._ctx.closePath()
      })
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
   * @param dataIndex
   * @param kLineData
   * @param barOptions
   * @param barStyle
   * @private
   */
  _drawCandleBar (x, halfBarSpace, barSpace, dataIndex, kLineData, barOptions, barStyle) {
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
    const highY = this._yAxis.convertToPixel(high)
    const lowY = this._yAxis.convertToPixel(low)

    const highEndY = Math.min(openY, closeY)
    const lowStartY = Math.max(openY, closeY)
    this._ctx.fillRect(x - 0.5, highY, 1, highEndY - highY)
    this._ctx.fillRect(x - 0.5, lowStartY, 1, lowY - lowStartY)

    const barHeight = Math.max(1, lowStartY - highEndY)
    switch (barStyle) {
      case CandleType.CANDLE_SOLID: {
        this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight)
        break
      }
      case CandleType.CANDLE_STROKE: {
        this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight)
        break
      }
      case CandleType.CANDLE_UP_STROKE: {
        if (close > open) {
          this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight)
        } else {
          this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight)
        }
        break
      }
      case CandleType.CANDLE_DOWN_STROKE: {
        if (close > open) {
          this._ctx.fillRect(x - halfBarSpace, highEndY, barSpace, barHeight)
        } else {
          this._ctx.strokeRect(x - halfBarSpace + 0.5, highEndY, barSpace - 1, barHeight)
        }
        break
      }
      default: {
        this._ctx.fillRect(x - 0.5, highY, 1, lowY - highY)
        this._ctx.fillRect(x - halfBarSpace, openY - 0.5, halfBarSpace, 1)
        this._ctx.fillRect(x, closeY - 0.5, halfBarSpace, 1)
        break
      }
    }
    this._drawActionExecute(ActionType.drawCandle, {
      ctx: this._ctx,
      dataIndex,
      kLineData,
      coordinate: { x, open: openY, close: closeY, high: highY, low: lowY },
      viewport: { width: this._width, height: this._height },
      barSpace,
      halfBarSpace,
      isCandle: this._yAxis.isCandleYAxis()
    })
  }

  /**
   * 执行绘制事件监听
   * @param type
   * @param data
   * @private
   */
  _drawActionExecute (type, data) {
    this._chartData.actionExecute(
      type,
      data,
      () => {
        this._ctx.save()
      },
      () => {
        this._ctx.restore()
      }
    )
  }
}
