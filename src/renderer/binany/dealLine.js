import { roundRect } from '../rect.js'
import { hexToRGBA } from '../../utils/canvas.js'

// In dark UI white looks too bright
const white = `#dadada`

function point(ctx, x, y, r) {
  ctx.save()

  ctx.fillStyle = white
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

function line(ctx, startX, endX, y, dash = null, opacity = 1) {
  ctx.save()

  ctx.beginPath()
  if (dash !== null) ctx.setLineDash(dash)
  if (opacity) ctx.strokeStyle = hexToRGBA(ctx.strokeStyle, opacity)
  ctx.moveTo(startX, y)
  ctx.lineTo(endX, y)
  ctx.closePath()
  ctx.stroke()

  ctx.restore()
}

function dealLine(ctx, isMobile, startX, endX, y, labelX, width) {
  line(ctx, startX, endX, y)
  line(ctx, labelX, startX, y, [2, 6], 0.5)
  line(ctx, width, endX, y, [2, 6], 0.5)
  point(ctx, startX, y, isMobile ? 2 : 3)
  point(ctx, endX, y, isMobile ? 2 : 3)
}

function drawCanvas(props, isMobile, ctx, moreProps) {
  // const xScale = moreProps.xScale
  // const yScale = moreProps.chartConfig.yScale

  const y = props.yValue !== undefined ? yScale(props.yValue) : moreProps.height / 2
  const startX = xScale(props.startX)
  const endX = xScale(props.endX)

  ctx.strokeStyle = props.upwards ? `#3a9f52` : `#a73b48`
  ctx.fillStyle = props.upwards ? `#3a9f52` : `#a73b48`
  ctx.font = `14px sans-serif`

  let { labelX } = props
  labelX += xScale(0)
  const minified = props.text === null
  const arrowWidth = isMobile ? 25 : 30
  const arrowBorder = isMobile ? 7 : 10
  const border = isMobile ? 9 : 14
  const textWidth = minified ? -arrowBorder : ctx.measureText(props.text).width

  const rectWidth = 2 * border - arrowBorder + textWidth + arrowWidth
  const rectHeight = arrowWidth

  roundRect(ctx, labelX - rectWidth, y - rectHeight / 2, rectWidth, rectHeight, 4, true, true)
  dealLine(ctx, isMobile, startX, endX, y, labelX, moreProps.width)

  const textColor = white

  ctx.fillStyle = textColor
  ctx.strokeStyle = textColor

  if (!minified) {
    const textBottomBorder = isMobile ? 9 : 10
    ctx.fillText(props.text, labelX - rectWidth + border, y + rectHeight / 2 - textBottomBorder)
  }

  const textEndX = labelX - rectWidth + border + textWidth

  if (props.upwards) {
    ctx.beginPath()
    ctx.lineWidth = 1.5
    ctx.moveTo(textEndX + arrowBorder, y + rectHeight / 2 - arrowBorder)
    ctx.lineTo(textEndX + arrowWidth - arrowBorder, y + rectHeight / 2 - arrowWidth + arrowBorder)
    ctx.stroke()
    ctx.lineWidth = 1.25
    ctx.lineTo(
      textEndX + arrowWidth - arrowBorder,
      y + rectHeight / 2 - arrowBorder - arrowBorder * 0.2,
    )
    ctx.moveTo(textEndX + arrowWidth - arrowBorder, y + rectHeight / 2 - arrowWidth + arrowBorder)
    ctx.lineTo(textEndX + arrowBorder * 1.2, y + rectHeight / 2 - arrowWidth + arrowBorder)

    ctx.moveTo(textEndX + arrowBorder, y + rectHeight / 2 - arrowWidth + arrowBorder)
    ctx.closePath()
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.lineWidth = 1.5
    ctx.moveTo(textEndX + arrowBorder, y + rectHeight / 2 - arrowWidth + arrowBorder)
    ctx.lineTo(textEndX + arrowWidth - arrowBorder, y + rectHeight / 2 - arrowBorder)
    ctx.stroke()
    ctx.lineWidth = 1.25
    ctx.lineTo(
      textEndX + arrowWidth - arrowBorder,
      y + rectHeight / 2 - arrowWidth + arrowBorder * 1.2,
    )
    ctx.moveTo(textEndX + arrowWidth - arrowBorder, y + rectHeight / 2 - arrowBorder)
    ctx.lineTo(textEndX + arrowBorder * 1.2, y + rectHeight / 2 - arrowBorder)

    ctx.moveTo(textEndX + arrowBorder, y + rectHeight / 2 - arrowWidth + arrowBorder)
    ctx.closePath()
    ctx.stroke()
  }
}

export default drawCanvas