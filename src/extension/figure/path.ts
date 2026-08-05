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

import type { FigureTemplate } from '../../component/Figure'
import { checkCoordinateOnRect } from './rect'

interface MoveCommand {
  type: 'M'
  x: number
  y: number
}

interface LineCommand {
  type: 'L'
  x: number
  y: number
}

interface CubicCurveCommand {
  type: 'C'
  cp1X: number
  cp1Y: number
  cp2X: number
  cp2Y: number
  x: number
  y: number
}

interface QuadraticCurveCommand {
  type: 'Q'
  cpX: number
  cpY: number
  x: number
  y: number
}

interface CloseCommand {
  type: 'Z'
}

type CompiledPathCommand = MoveCommand | LineCommand | CubicCurveCommand | QuadraticCurveCommand | CloseCommand
type PathToken = string | number

const COMMAND_ARGUMENT_COUNTS: Record<string, number> = {
  A: 7,
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  S: 4,
  T: 2,
  V: 1,
  Z: 0
}

const PATH_CACHE_LIMIT = 256
const EMPTY_PATH: CompiledPathCommand[] = []
const pathCache = new Map<string, CompiledPathCommand[]>()
const tokenRegex = /[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g

function tokenizePath(path: string): PathToken[] | null {
  const tokens: PathToken[] = []
  let lastIndex = 0
  tokenRegex.lastIndex = 0

  let match = tokenRegex.exec(path)
  while (match !== null) {
    if (!/^[\s,]*$/.test(path.slice(lastIndex, match.index))) {
      return null
    }
    const token = match[0]
    if (/^[a-zA-Z]$/.test(token)) {
      tokens.push(token)
    } else {
      const value = Number(token)
      if (!isFinite(value)) {
        return null
      }
      tokens.push(value)
    }
    lastIndex = tokenRegex.lastIndex
    match = tokenRegex.exec(path)
  }

  return /^[\s,]*$/.test(path.slice(lastIndex)) ? tokens : null
}

function resolveCoordinate(value: number, current: number, isRelative: boolean): number {
  return value + (isRelative ? current : 0)
}

function ellipticalArcToBeziers(x1: number, y1: number, radiusX: number, radiusY: number, rotation: number, largeArcFlag: number, sweepFlag: number, x2: number, y2: number): CubicCurveCommand[] {
  let rx = Math.abs(radiusX)
  let ry = Math.abs(radiusY)
  if (x1 === x2 && y1 === y2) {
    return []
  }
  if (rx === 0 || ry === 0) {
    return []
  }

  const phi = ((rotation % 360) * Math.PI) / 180
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const dx = (x1 - x2) / 2
  const dy = (y1 - y2) / 2
  const x1p = cosPhi * dx + sinPhi * dy
  const y1p = -sinPhi * dx + cosPhi * dy

  const lambda = x1p ** 2 / rx ** 2 + y1p ** 2 / ry ** 2
  if (lambda > 1) {
    const scale = Math.sqrt(lambda)
    rx *= scale
    ry *= scale
  }

  const rxSquared = rx ** 2
  const rySquared = ry ** 2
  const x1pSquared = x1p ** 2
  const y1pSquared = y1p ** 2
  const denominator = rxSquared * y1pSquared + rySquared * x1pSquared
  const numerator = Math.max(0, rxSquared * rySquared - denominator)
  const sign = largeArcFlag === sweepFlag ? -1 : 1
  const factor = denominator === 0 ? 0 : sign * Math.sqrt(numerator / denominator)
  const cxp = factor * ((rx * y1p) / ry)
  const cyp = factor * ((-ry * x1p) / rx)
  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2
  const startAngle = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx)
  let deltaAngle = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - startAngle

  if (deltaAngle < 0 && sweepFlag === 1) {
    deltaAngle += 2 * Math.PI
  } else if (deltaAngle > 0 && sweepFlag === 0) {
    deltaAngle -= 2 * Math.PI
  }

  const segmentCount = Math.ceil(Math.abs(deltaAngle) / (Math.PI / 2))
  const segmentAngle = deltaAngle / segmentCount
  const commands: CubicCurveCommand[] = []

  for (let i = 0; i < segmentCount; i++) {
    const start = startAngle + i * segmentAngle
    const end = start + segmentAngle
    const alpha = (4 / 3) * Math.tan((end - start) / 4)
    const startCos = Math.cos(start)
    const startSin = Math.sin(start)
    const endCos = Math.cos(end)
    const endSin = Math.sin(end)
    const startX = cx + rx * startCos * cosPhi - ry * startSin * sinPhi
    const startY = cy + rx * startCos * sinPhi + ry * startSin * cosPhi
    const endX = cx + rx * endCos * cosPhi - ry * endSin * sinPhi
    const endY = cy + rx * endCos * sinPhi + ry * endSin * cosPhi
    const startDx = -rx * startSin * cosPhi - ry * startCos * sinPhi
    const startDy = -rx * startSin * sinPhi + ry * startCos * cosPhi
    const endDx = -rx * endSin * cosPhi - ry * endCos * sinPhi
    const endDy = -rx * endSin * sinPhi + ry * endCos * cosPhi

    commands.push({
      type: 'C',
      cp1X: startX + alpha * startDx,
      cp1Y: startY + alpha * startDy,
      cp2X: endX - alpha * endDx,
      cp2Y: endY - alpha * endDy,
      x: endX,
      y: endY
    })
  }

  return commands
}

function compilePath(path: string): CompiledPathCommand[] {
  const tokens = tokenizePath(path)
  if (tokens === null) {
    return EMPTY_PATH
  }

  const compiled: CompiledPathCommand[] = []
  let index = 0
  let command = ''
  let currentX = 0
  let currentY = 0
  let startX = 0
  let startY = 0
  let cubicControlX = 0
  let cubicControlY = 0
  let quadraticControlX = 0
  let quadraticControlY = 0
  let previousCommand = ''
  let isFirstMoveGroup = false

  while (index < tokens.length) {
    if (typeof tokens[index] === 'string') {
      command = tokens[index++] as string
      const upperCommand = command.toUpperCase()
      if (COMMAND_ARGUMENT_COUNTS[upperCommand] === undefined) {
        return EMPTY_PATH
      }
      if (upperCommand === 'Z') {
        compiled.push({ type: 'Z' })
        currentX = startX
        currentY = startY
        previousCommand = 'Z'
        command = ''
        continue
      }
      isFirstMoveGroup = upperCommand === 'M'
    } else if (command === '') {
      return EMPTY_PATH
    }

    const upperCommand = command.toUpperCase()
    const argumentCount = COMMAND_ARGUMENT_COUNTS[upperCommand]
    if (index + argumentCount > tokens.length) {
      return EMPTY_PATH
    }

    const args: number[] = []
    for (let i = 0; i < argumentCount; i++) {
      const token = tokens[index + i]
      if (typeof token !== 'number') {
        return EMPTY_PATH
      }
      args.push(token)
    }
    index += argumentCount

    const isRelative = command === command.toLowerCase()

    switch (upperCommand) {
      case 'M': {
        const x = resolveCoordinate(args[0], currentX, isRelative)
        const y = resolveCoordinate(args[1], currentY, isRelative)
        if (isFirstMoveGroup) {
          compiled.push({ type: 'M', x, y })
          startX = x
          startY = y
          isFirstMoveGroup = false
        } else {
          compiled.push({ type: 'L', x, y })
        }
        currentX = x
        currentY = y
        break
      }
      case 'L': {
        currentX = resolveCoordinate(args[0], currentX, isRelative)
        currentY = resolveCoordinate(args[1], currentY, isRelative)
        compiled.push({ type: 'L', x: currentX, y: currentY })
        break
      }
      case 'H':
        currentX = resolveCoordinate(args[0], currentX, isRelative)
        compiled.push({ type: 'L', x: currentX, y: currentY })
        break
      case 'V':
        currentY = resolveCoordinate(args[0], currentY, isRelative)
        compiled.push({ type: 'L', x: currentX, y: currentY })
        break
      case 'C': {
        const cp1X = resolveCoordinate(args[0], currentX, isRelative)
        const cp1Y = resolveCoordinate(args[1], currentY, isRelative)
        const cp2X = resolveCoordinate(args[2], currentX, isRelative)
        const cp2Y = resolveCoordinate(args[3], currentY, isRelative)
        const x = resolveCoordinate(args[4], currentX, isRelative)
        const y = resolveCoordinate(args[5], currentY, isRelative)
        compiled.push({ type: 'C', cp1X, cp1Y, cp2X, cp2Y, x, y })
        cubicControlX = cp2X
        cubicControlY = cp2Y
        currentX = x
        currentY = y
        break
      }
      case 'S': {
        const cp1X = previousCommand === 'C' || previousCommand === 'S' ? 2 * currentX - cubicControlX : currentX
        const cp1Y = previousCommand === 'C' || previousCommand === 'S' ? 2 * currentY - cubicControlY : currentY
        const cp2X = resolveCoordinate(args[0], currentX, isRelative)
        const cp2Y = resolveCoordinate(args[1], currentY, isRelative)
        const x = resolveCoordinate(args[2], currentX, isRelative)
        const y = resolveCoordinate(args[3], currentY, isRelative)
        compiled.push({ type: 'C', cp1X, cp1Y, cp2X, cp2Y, x, y })
        cubicControlX = cp2X
        cubicControlY = cp2Y
        currentX = x
        currentY = y
        break
      }
      case 'Q': {
        const cpX = resolveCoordinate(args[0], currentX, isRelative)
        const cpY = resolveCoordinate(args[1], currentY, isRelative)
        const x = resolveCoordinate(args[2], currentX, isRelative)
        const y = resolveCoordinate(args[3], currentY, isRelative)
        compiled.push({ type: 'Q', cpX, cpY, x, y })
        quadraticControlX = cpX
        quadraticControlY = cpY
        currentX = x
        currentY = y
        break
      }
      case 'T': {
        const cpX = previousCommand === 'Q' || previousCommand === 'T' ? 2 * currentX - quadraticControlX : currentX
        const cpY = previousCommand === 'Q' || previousCommand === 'T' ? 2 * currentY - quadraticControlY : currentY
        const x = resolveCoordinate(args[0], currentX, isRelative)
        const y = resolveCoordinate(args[1], currentY, isRelative)
        compiled.push({ type: 'Q', cpX, cpY, x, y })
        quadraticControlX = cpX
        quadraticControlY = cpY
        currentX = x
        currentY = y
        break
      }
      case 'A': {
        if ((args[3] !== 0 && args[3] !== 1) || (args[4] !== 0 && args[4] !== 1)) {
          return EMPTY_PATH
        }
        const x = resolveCoordinate(args[5], currentX, isRelative)
        const y = resolveCoordinate(args[6], currentY, isRelative)
        if (args[0] === 0 || args[1] === 0) {
          compiled.push({ type: 'L', x, y })
        } else {
          compiled.push(...ellipticalArcToBeziers(currentX, currentY, args[0], args[1], args[2], args[3], args[4], x, y))
        }
        currentX = x
        currentY = y
        break
      }
      default:
        return EMPTY_PATH
    }
    previousCommand = upperCommand
  }

  return compiled
}

function getCompiledPath(path: string): CompiledPathCommand[] {
  const cached = pathCache.get(path)
  if (cached !== undefined) {
    return cached
  }

  const compiled = compilePath(path)
  if (pathCache.size >= PATH_CACHE_LIMIT) {
    const oldestKey = pathCache.keys().next().value
    if (oldestKey !== undefined) {
      pathCache.delete(oldestKey)
    }
  }
  pathCache.set(path, compiled)
  return compiled
}

function replayPath(ctx: CanvasRenderingContext2D, commands: CompiledPathCommand[], offsetX: number, offsetY: number): void {
  ctx.beginPath()
  commands.forEach((command) => {
    switch (command.type) {
      case 'M':
        ctx.moveTo(command.x + offsetX, command.y + offsetY)
        break
      case 'L':
        ctx.lineTo(command.x + offsetX, command.y + offsetY)
        break
      case 'C':
        ctx.bezierCurveTo(command.cp1X + offsetX, command.cp1Y + offsetY, command.cp2X + offsetX, command.cp2Y + offsetY, command.x + offsetX, command.y + offsetY)
        break
      case 'Q':
        ctx.quadraticCurveTo(command.cpX + offsetX, command.cpY + offsetY, command.x + offsetX, command.y + offsetY)
        break
      case 'Z':
        ctx.closePath()
        break
    }
  })
}

export function drawPath(ctx: CanvasRenderingContext2D, attrs: PathAttrs | PathAttrs[], styles: Partial<PathStyle>): void {
  const paths = Array.isArray(attrs) ? attrs : [attrs]
  const { style = 'stroke', lineWidth = 1, color = 'currentColor' } = styles
  ctx.lineWidth = lineWidth
  ctx.setLineDash([])
  if (style === 'fill') {
    ctx.fillStyle = color
  } else {
    ctx.strokeStyle = color
  }

  paths.forEach(({ x, y, path }) => {
    const commands = getCompiledPath(path)
    if (commands.length > 0) {
      replayPath(ctx, commands, x, y)
      if (style === 'fill') {
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
