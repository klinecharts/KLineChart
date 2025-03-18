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

import type { PathStyle } from '../../common/Styles'
import { isValid } from '../../common/utils/typeChecks'

import type { FigureTemplate } from '../../component/Figure'
import { checkCoordinateOnRect } from './rect'

function drawEllipticalArc (ctx: CanvasRenderingContext2D, x1: number, y1: number, args: number[], offsetX: number, offsetY: number, isRelative: boolean): void {
  const [rx, ry, rotation, largeArcFlag, sweepFlag, x2, y2] = args

  const targetX = isRelative ? x1 + x2 : x2 + offsetX
  const targetY = isRelative ? y1 + y2 : y2 + offsetY

  const segments = ellipticalArcToBeziers(x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, targetX, targetY)

  segments.forEach(segment => {
    ctx.bezierCurveTo(segment[0], segment[1], segment[2], segment[3], segment[4], segment[5])
  })
}

function ellipticalArcToBeziers (x1: number, y1: number, rx: number, ry: number, rotation: number, largeArcFlag: number, sweepFlag: number, x2: number, y2: number): number[][] {
  const { cx, cy, startAngle, deltaAngle } = computeEllipticalArcParameters(
    x1, y1, rx, ry, rotation, largeArcFlag, sweepFlag, x2, y2
  )

  const segments: number[][] = []
  const numSegments = Math.ceil(Math.abs(deltaAngle) / (Math.PI / 2))
  for (let i = 0; i < numSegments; i++) {
    const start = startAngle + (i * deltaAngle) / numSegments
    const end = startAngle + ((i + 1) * deltaAngle) / numSegments

    const bezier = ellipticalArcToBezier(cx, cy, rx, ry, rotation, start, end)
    segments.push(bezier)
  }

  return segments
}

function computeEllipticalArcParameters (x1: number, y1: number, rx: number, ry: number, rotation: number, largeArcFlag: number, sweepFlag: number, x2: number, y2: number): { cx: number; cy: number; startAngle: number; deltaAngle: number } {
  const phi = (rotation * Math.PI) / 180

  const dx = (x1 - x2) / 2
  const dy = (y1 - y2) / 2
  const x1p = Math.cos(phi) * dx + Math.sin(phi) * dy
  const y1p = -Math.sin(phi) * dx + Math.cos(phi) * dy

  const lambda = (x1p ** 2) / (rx ** 2) + (y1p ** 2) / (ry ** 2)
  if (lambda > 1) {
    rx *= Math.sqrt(lambda)
    ry *= Math.sqrt(lambda)
  }

  const sign = largeArcFlag === sweepFlag ? -1 : 1
  const numerator = (rx ** 2) * (ry ** 2) - (rx ** 2) * (y1p ** 2) - (ry ** 2) * (x1p ** 2)
  const denominator = (rx ** 2) * (y1p ** 2) + (ry ** 2) * (x1p ** 2)
  const cxp = sign * Math.sqrt(Math.abs(numerator / denominator)) * (rx * y1p / ry)
  const cyp = sign * Math.sqrt(Math.abs(numerator / denominator)) * (-ry * x1p / rx)

  const cx = Math.cos(phi) * cxp - Math.sin(phi) * cyp + (x1 + x2) / 2
  const cy = Math.sin(phi) * cxp + Math.cos(phi) * cyp + (y1 + y2) / 2

  const startAngle = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx)
  let deltaAngle = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - startAngle

  if (deltaAngle < 0 && sweepFlag === 1) {
    deltaAngle += 2 * Math.PI
  } else if (deltaAngle > 0 && sweepFlag === 0) {
    deltaAngle -= 2 * Math.PI
  }

  return { cx, cy, startAngle, deltaAngle }
}

/**
 * Ellipse arc segment to Bezier curve
 * @param cx
 * @param cy
 * @param rx
 * @param ry
 * @param rotation
 * @param startAngle
 * @param endAngle
 * @returns
 */
function ellipticalArcToBezier (cx: number, cy: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number): number[] {
  // 计算控制点
  const alpha = Math.sin(endAngle - startAngle) * (Math.sqrt(4 + 3 * Math.tan((endAngle - startAngle) / 2) ** 2) - 1) / 3
  const cosPhi = Math.cos(rotation)
  const sinPhi = Math.sin(rotation)

  const x1 = cx + rx * Math.cos(startAngle) * cosPhi - ry * Math.sin(startAngle) * sinPhi
  const y1 = cy + rx * Math.cos(startAngle) * sinPhi + ry * Math.sin(startAngle) * cosPhi

  const x2 = cx + rx * Math.cos(endAngle) * cosPhi - ry * Math.sin(endAngle) * sinPhi
  const y2 = cy + rx * Math.cos(endAngle) * sinPhi + ry * Math.sin(endAngle) * cosPhi

  const cp1x = x1 + alpha * (-rx * Math.sin(startAngle) * cosPhi - ry * Math.cos(startAngle) * sinPhi)
  const cp1y = y1 + alpha * (-rx * Math.sin(startAngle) * sinPhi + ry * Math.cos(startAngle) * cosPhi)

  const cp2x = x2 - alpha * (-rx * Math.sin(endAngle) * cosPhi - ry * Math.cos(endAngle) * sinPhi)
  const cp2y = y2 - alpha * (-rx * Math.sin(endAngle) * sinPhi + ry * Math.cos(endAngle) * cosPhi)

  return [cp1x, cp1y, cp2x, cp2y, x2, y2]
}

export function drawPath (ctx: CanvasRenderingContext2D, attrs: PathAttrs | PathAttrs[], styles: Partial<PathStyle>): void {
  let paths: PathAttrs[] = []
  paths = paths.concat(attrs)
  const { lineWidth = 1, color = 'currentColor' } = styles
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color
  ctx.setLineDash([])
  paths.forEach(({ x, y, path }) => {
    const commands = path.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi)
    if (isValid(commands)) {
      const offsetX = x
      const offsetY = y
      ctx.beginPath()
      commands.forEach(command => {
        let currentX = 0
        let currentY = 0
        let startX = 0
        let startY = 0
        const type = command[0]
        const args = command.slice(1).trim().split(/[\s,]+/).map(Number)
        switch (type) {
          case 'M':
            currentX = args[0] + offsetX
            currentY = args[1] + offsetY
            ctx.moveTo(currentX, currentY)
            startX = currentX
            startY = currentY
            break
          case 'm':
            currentX += args[0]
            currentY += args[1]
            ctx.moveTo(currentX, currentY)
            startX = currentX
            startY = currentY
            break
          case 'L':
            currentX = args[0] + offsetX
            currentY = args[1] + offsetY
            ctx.lineTo(currentX, currentY)
            break
          case 'l':
            currentX += args[0]
            currentY += args[1]
            ctx.lineTo(currentX, currentY)
            break
          case 'H':
            currentX = args[0] + offsetX
            ctx.lineTo(currentX, currentY)
            break
          case 'h':
            currentX += args[0]
            ctx.lineTo(currentX, currentY)
            break
          case 'V':
            currentY = args[0] + offsetY
            ctx.lineTo(currentX, currentY)
            break
          case 'v':
            currentY += args[0]
            ctx.lineTo(currentX, currentY)
            break
          case 'C':
            ctx.bezierCurveTo(
              args[0] + offsetX, args[1] + offsetY,
              args[2] + offsetX, args[3] + offsetY,
              args[4] + offsetX, args[5] + offsetY
            )
            currentX = args[4] + offsetX
            currentY = args[5] + offsetY
            break
          case 'c':
            ctx.bezierCurveTo(
              currentX + args[0], currentY + args[1],
              currentX + args[2], currentY + args[3],
              currentX + args[4], currentY + args[5]
            )
            currentX += args[4]
            currentY += args[5]
            break
          case 'S':
            ctx.bezierCurveTo(
              currentX, currentY,
              args[0] + offsetX, args[1] + offsetY,
              args[2] + offsetX, args[3] + offsetY
            )
            currentX = args[2] + offsetX
            currentY = args[3] + offsetY
            break
          case 's':
            ctx.bezierCurveTo(
              currentX, currentY,
              currentX + args[0], currentY + args[1],
              currentX + args[2], currentY + args[3]
            )
            currentX += args[2]
            currentY += args[3]
            break
          case 'Q':
            ctx.quadraticCurveTo(
              args[0] + offsetX, args[1] + offsetY,
              args[2] + offsetX, args[3] + offsetY
            )
            currentX = args[2] + offsetX
            currentY = args[3] + offsetY
            break
          case 'q':
            ctx.quadraticCurveTo(
              currentX + args[0], currentY + args[1],
              currentX + args[2], currentY + args[3]
            )
            currentX += args[2]
            currentY += args[3]
            break
          case 'T':
            ctx.quadraticCurveTo(
              currentX, currentY,
              args[0] + offsetX, args[1] + offsetY
            )
            currentX = args[0] + offsetX
            currentY = args[1] + offsetY
            break
          case 't':
            ctx.quadraticCurveTo(
              currentX, currentY,
              currentX + args[0], currentY + args[1]
            )
            currentX += args[0]
            currentY += args[1]
            break
          case 'A':
            // arc
            // reference https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
            drawEllipticalArc(ctx, currentX, currentY, args, offsetX, offsetY, false)
            currentX = args[5] + offsetX
            currentY = args[6] + offsetY
            break
          case 'a':
            // arc
            // reference https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
            drawEllipticalArc(ctx, currentX, currentY, args, offsetX, offsetY, true)
            currentX += args[5]
            currentY += args[6]
            break
          case 'Z':
          case 'z':
            ctx.closePath()
            currentX = startX
            currentY = startY
            break
          default: { break }
        }
      })
      if (styles.style === 'fill') {
        ctx.fill()
      } else {
        ctx.stroke()
      }
    }
  })
}

export interface PathAttrs {
  x: number
  y: number
  width: number
  height: number
  path: string
}

const path: FigureTemplate<PathAttrs | PathAttrs[], Partial<PathStyle>> = {
  name: 'path',
  checkEventOn: checkCoordinateOnRect,
  draw: (ctx: CanvasRenderingContext2D, attrs: PathAttrs | PathAttrs[], styles: Partial<PathStyle>) => {
    drawPath(ctx, attrs, styles)
  }
}

export default path
