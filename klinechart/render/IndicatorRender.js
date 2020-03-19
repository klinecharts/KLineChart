import View from './Render'
import { DATA_MARGIN_SPACE_RATE } from '../data/ChartData'
import { IndicatorType } from '../internal/constants'

class IndicatorRender extends View {
  constructor (handler, storage, yAxisRender) {
    super(handler, storage)
    this.yAxisRender = yAxisRender
  }

  /**
   * 绘制图与图直接的分割线
   * @param ctx
   * @param xAxis
   */
  renderHorizontalSeparatorLine (ctx, xAxis) {
    const lineSize = xAxis.line.size
    ctx.strokeStyle = xAxis.line.color
    ctx.lineWidth = lineSize
    ctx.beginPath()
    ctx.moveTo(this.handler.contentLeft(), this.handler.contentTop() + lineSize)
    ctx.lineTo(this.handler.contentRight(), this.handler.contentTop() + lineSize)
    ctx.stroke()
    ctx.closePath()
  }

  /**
   * 绘制指标
   * @param ctx
   * @param indicatorType
   * @param indicator
   * @param indicatorParams
   * @param isMainIndicator
   */
  renderIndicator (ctx, indicatorType, indicator, indicatorParams, isMainIndicator = false) {
    let onRendering
    const params = indicatorParams[indicatorType] || []
    const linePoints = []
    switch (indicatorType) {
      case IndicatorType.MA: {
        const dataKeys = []
        params.forEach(p => {
          dataKeys.push(`ma${p}`)
        })
        onRendering = (x, i, kLineData, halfBarSpace) => {
          this.ohlcIndicatorRendering(
            ctx, i, x, halfBarSpace, indicator,
            kLineData, indicatorType, dataKeys,
            isMainIndicator, (values) => {
              this.prepareLinePoints(x, values, linePoints)
            }
          )
        }
        break
      }

      case IndicatorType.MACD: {
        onRendering = (x, i, kLineData, halfBarSpace) => {
          const macd = kLineData.macd || {}
          this.prepareLinePoints(x, [macd.diff, macd.dea], linePoints)
          const refKLineData = this.storage.dataList[i - 1] || {}
          const macdValue = macd.macd
          const refMacdValue = (refKLineData.macd || {}).macd || Number.MIN_SAFE_INTEGER
          if (macdValue > 0) {
            ctx.strokeStyle = indicator.increasingColor
            ctx.fillStyle = indicator.increasingColor
          } else {
            ctx.strokeStyle = indicator.decreasingColor
            ctx.fillStyle = indicator.decreasingColor
          }
          const isFill = !((refMacdValue || refMacdValue === 0) && macdValue > refMacdValue)
          this.renderBars(ctx, x, halfBarSpace, macdValue, isFill)
        }
        break
      }

      case IndicatorType.VOL: {
        onRendering = (x, i, kLineData, halfBarSpace) => {
          const vol = kLineData.vol || {}
          const lineValues = []
          params.forEach(p => {
            lineValues.push(vol[`ma${p}`])
          })
          this.prepareLinePoints(x, lineValues, linePoints)
          const refKLineData = this.storage.dataList[i - 1] || {}
          const close = kLineData.close
          const refClose = (refKLineData || {}).close || Number.MIN_SAFE_INTEGER
          if (close > refClose) {
            ctx.fillStyle = indicator.increasingColor
          } else {
            ctx.fillStyle = indicator.decreasingColor
          }
          this.renderBars(ctx, x, halfBarSpace, vol.num, true)
        }
        break
      }

      case IndicatorType.BOLL: {
        onRendering = (x, i, kLineData, halfBarSpace) => {
          this.ohlcIndicatorRendering(
            ctx, i, x, halfBarSpace, indicator,
            kLineData, indicatorType, ['up', 'mid', 'dn'],
            isMainIndicator, (values) => {
              this.prepareLinePoints(x, values, linePoints)
            }
          )
        }
        break
      }

      case IndicatorType.BIAS: {
        onRendering = (x, i, kLineData) => {
          const bias = kLineData.bias || {}
          const lineValues = []
          params.forEach(p => {
            lineValues.push(bias[`bias${p}`])
          })
          this.prepareLinePoints(x, lineValues, linePoints)
        }
        break
      }

      case IndicatorType.BRAR: {
        onRendering = (x, i, kLineData) => {
          const brar = kLineData.brar || {}
          this.prepareLinePoints(x, [brar.br, brar.ar], linePoints)
        }
        break
      }

      case IndicatorType.CCI: {
        onRendering = (x, i, kLineData) => {
          const cci = kLineData.cci || {}
          this.prepareLinePoints(x, [cci.cci], linePoints)
        }
        break
      }

      case IndicatorType.CR: {
        onRendering = (x, i, kLineData) => {
          const cr = kLineData.cr || {}
          this.prepareLinePoints(x, [cr.cr, cr.ma1, cr.ma2, cr.ma3, cr.ma4], linePoints)
        }
        break
      }

      case IndicatorType.DMA: {
        onRendering = (x, i, kLineData) => {
          const dma = kLineData.dma || {}
          this.prepareLinePoints(x, [dma.dif, dma.difMa], linePoints)
        }
        break
      }

      case IndicatorType.DMI: {
        onRendering = (x, i, kLineData) => {
          const dmi = kLineData.dmi || {}
          this.prepareLinePoints(x, [dmi.mdi, dmi.pdi, dmi.adx, dmi.adxr], linePoints)
        }
        break
      }

      case IndicatorType.KDJ: {
        onRendering = (x, i, kLineData) => {
          const kdj = kLineData.kdj || {}
          this.prepareLinePoints(x, [kdj.k, kdj.d, kdj.j], linePoints)
        }
        break
      }

      case IndicatorType.RSI: {
        onRendering = (x, i, kLineData) => {
          const rsi = kLineData.rsi || {}
          const lineValues = []
          params.forEach(p => {
            lineValues.push(rsi[`rsi${p}`])
          })
          this.prepareLinePoints(x, lineValues, linePoints)
        }
        break
      }

      case IndicatorType.PSY: {
        onRendering = (x, i, kLineData) => {
          const psy = kLineData.psy || {}
          this.prepareLinePoints(x, [psy.psy], linePoints)
        }
        break
      }

      case IndicatorType.TRIX: {
        onRendering = (x, i, kLineData) => {
          const trix = kLineData.trix || {}
          this.prepareLinePoints(x, [trix.trix, trix.maTrix], linePoints)
        }
        break
      }

      case IndicatorType.OBV: {
        onRendering = (x, i, kLineData) => {
          const obv = kLineData.obv || {}
          this.prepareLinePoints(x, [obv.obv, obv.maObv], linePoints)
        }
        break
      }

      case IndicatorType.VR: {
        onRendering = (x, i, kLineData) => {
          const vr = kLineData.vr || {}
          this.prepareLinePoints(x, [vr.vr, vr.maVr], linePoints)
        }
        break
      }

      case IndicatorType.WR: {
        onRendering = (x, i, kLineData) => {
          const wr = kLineData.wr || {}
          this.prepareLinePoints(x, [wr.wr1, wr.wr2, wr.wr3], linePoints)
        }
        break
      }

      case IndicatorType.MTM: {
        onRendering = (x, i, kLineData) => {
          const mtm = kLineData.mtm || {}
          this.prepareLinePoints(x, [mtm.mtm, mtm.mtmMa], linePoints)
        }
        break
      }

      case IndicatorType.EMV: {
        onRendering = (x, i, kLineData) => {
          const emv = kLineData.emv || {}
          this.prepareLinePoints(x, [emv.emv, emv.maEmv], linePoints)
        }
        break
      }

      case IndicatorType.SAR: {
        onRendering = (x, i, kLineData, halfBarSpace) => {
          this.ohlcIndicatorRendering(
            ctx, i, x, halfBarSpace, indicator,
            kLineData, indicatorType, ['sar'],
            isMainIndicator, (values) => {
              const sar = values[0]
              if (sar || sar === 0) {
                const dataY = this.yAxisRender.getY(sar)
                if (sar < (kLineData.high + kLineData.low) / 2) {
                  ctx.strokeStyle = indicator.increasingColor
                } else {
                  ctx.strokeStyle = indicator.decreasingColor
                }
                ctx.beginPath()
                ctx.arc(x, dataY, halfBarSpace, Math.PI * 2, 0, true)
                ctx.stroke()
                ctx.closePath()
              }
            }
          )
        }
      }
    }
    this.renderGraphics(
      ctx, onRendering,
      () => {
        this.renderLines(ctx, linePoints, indicator)
      }
    )
  }

  /**
   * 需要绘制ohlc指标每条数据渲染
   * @param ctx
   * @param i
   * @param x
   * @param halfBarSpace
   * @param indicator
   * @param kLineData
   * @param indicatorType
   * @param dataKeys
   * @param isMainIndicator
   * @param prepare
   */
  ohlcIndicatorRendering (
    ctx, i, x, halfBarSpace, indicator,
    kLineData, indicatorType,
    dataKeys, isMainIndicator, prepare
  ) {
    const indicatorData = kLineData[indicatorType.toLowerCase()] || {}
    const values = []
    dataKeys.forEach(key => {
      values.push(indicatorData[key])
    })
    if (prepare) {
      prepare(values)
    }
    if (!isMainIndicator) {
      const refKLineData = this.storage.dataList[i - 1] || {}
      this.renderOhlc(
        ctx, halfBarSpace, x, kLineData,
        refKLineData, indicator.increasingColor, indicator.decreasingColor
      )
    }
  }

  /**
   * 绘制图形
   */
  renderGraphics (ctx, onRendering, onRenderEnd) {
    let startX = this.handler.contentLeft()
    const dataSpace = this.storage.dataSpace * (1 - DATA_MARGIN_SPACE_RATE)
    const halfBarSpace = dataSpace / 2
    const lastPos = Math.min(this.storage.dataList.length, this.storage.minPos + this.storage.range)
    for (let i = this.storage.minPos; i < lastPos; i++) {
      const endX = startX + dataSpace
      const x = (startX + endX) / 2
      const kLineData = this.storage.dataList[i]
      if (onRendering) {
        onRendering(x, i, kLineData, halfBarSpace)
      }
      startX += this.storage.dataSpace
    }
    if (onRenderEnd) {
      onRenderEnd()
    }
  }

  /**
   * 准备绘制线的数据
   * @param x
   * @param lineValues
   * @param linePoints
   */
  prepareLinePoints (x, lineValues, linePoints) {
    for (let i = 0; i < lineValues.length; i++) {
      const value = lineValues[i]
      const valueY = this.yAxisRender.getY(value)
      if (!linePoints[i]) {
        linePoints[i] = [{ x: x, y: valueY }]
      } else {
        linePoints[i].push({ x: x, y: valueY })
      }
    }
  }

  /**
   * 绘制线
   * @param ctx
   * @param linePoints
   * @param indicator
   */
  renderLines (ctx, linePoints, indicator) {
    const colors = indicator.lineColors
    const pointCount = linePoints.length
    const lineColorSize = (indicator.lineColors || []).length
    ctx.lineWidth = indicator.lineSize
    for (let i = 0; i < pointCount; i++) {
      const points = linePoints[i]
      if (points.length > 0) {
        ctx.strokeStyle = colors[i % lineColorSize]
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j].x, points[j].y)
        }
        ctx.stroke()
        ctx.closePath()
      }
    }
  }

  /**
   * 绘制柱状图
   * @param ctx
   * @param x
   * @param halfBarSpace
   * @param barData
   * @param isFill
   */
  renderBars (ctx, x, halfBarSpace, barData, isFill) {
    if (barData || barData === 0) {
      ctx.lineWidth = 1
      const dataY = this.yAxisRender.getY(barData)
      const zeroY = this.yAxisRender.getY(0)
      let y = dataY
      if (barData < 0) {
        y = zeroY
      }
      let barHeight = Math.abs(zeroY - dataY)
      if (barHeight < 1) {
        barHeight = 1
      }
      if (isFill) {
        ctx.fillRect(x - halfBarSpace, y, halfBarSpace * 2, barHeight)
      } else {
        ctx.strokeRect(x - halfBarSpace, y, halfBarSpace * 2, barHeight)
      }
    }
  }

  /**
   * 绘制ohlc
   * @param ctx
   * @param halfBarSpace
   * @param x
   * @param kLineData
   * @param refKLineData
   * @param increasingColor
   * @param decreasingColor
   */
  renderOhlc (ctx, halfBarSpace, x, kLineData, refKLineData, increasingColor, decreasingColor) {
    const openY = this.yAxisRender.getY(kLineData.open)
    const closeY = this.yAxisRender.getY(kLineData.close)
    const highY = this.yAxisRender.getY(kLineData.high)
    const lowY = this.yAxisRender.getY(kLineData.low)
    if (kLineData.close > refKLineData.close) {
      ctx.strokeStyle = increasingColor
    } else {
      ctx.strokeStyle = decreasingColor
    }
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, highY)
    ctx.lineTo(x, lowY)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(x - halfBarSpace, openY)
    ctx.lineTo(x, openY)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(x + halfBarSpace, closeY)
    ctx.lineTo(x, closeY)
    ctx.stroke()
    ctx.closePath()
  }
}

export default IndicatorRender
