import { renderStrokeFillRoundRect } from './rect'
import { renderStrokeFillCircle } from './circle'
import { renderHorizontalLine } from './line'

export function drawDeal(ctx, props, isMobile) {
  const tradeDirection = {
    DOWN: 1,
    UP: 2,
  }

  const upwards = props.direction === tradeDirection.UP
  const color = upwards ? `#3a9f52` : `#a73b48`
  const y = props.y
  const labelX = props.x

  const fillColor = color
  ctx.strokeStyle = color
  ctx.fillStyle = fillColor
  ctx.font = `14px sans-serif`

  const minified = props.text === null
  const arrowWidth = isMobile ? 25 : 30
  const arrowBorder = isMobile ? 7 : 10
  const border = isMobile ? 9 : 14
  const textWidth = minified ? -arrowBorder : ctx.measureText(props.text).width

  const rectWidth = 2 * border - arrowBorder + textWidth + arrowWidth
  const rectHeight = arrowWidth

  // line
  ctx.lineWidth = 1
  ctx.setLineDash([1, 4]);
  renderHorizontalLine(ctx, y, props.x, 5000)

  ctx.setLineDash([]);
  renderHorizontalLine(ctx, y, props.left, props.right)

  renderStrokeFillCircle(ctx, '#ffffff', color, 0.5, { x: props.left, y: y }, 3)
  renderStrokeFillCircle(ctx, '#ffffff', color, 0.5, { x: props.right, y: y }, 3)
  //

  renderStrokeFillRoundRect(ctx, fillColor, '#181e39', 1, labelX - rectWidth, y - rectHeight / 2, rectWidth, rectHeight, 4)

  const textColor = '#dadada'

  ctx.fillStyle = textColor
  ctx.strokeStyle = textColor

  if (!minified) {
    const textBottomBorder = isMobile ? 9 : 10
    ctx.fillText(props.text, labelX - rectWidth + border, y + rectHeight / 2 - textBottomBorder)
  }

  const textEndX = labelX - rectWidth + border + textWidth

  if (upwards) {
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
