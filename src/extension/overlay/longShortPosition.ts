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

import { i18n } from '../i18n'
import { isNumber, isValid } from '../../common/utils/typeChecks'
import type Nullable from '../../common/Nullable'
import type DeepPartial from '../../common/DeepPartial'
import type Point from '../../common/Point'
import type Coordinate from '../../common/Coordinate'
import type { OverlayTemplate, OverlayFigure, OverlayCreateFiguresCallback, OverlayCreateFiguresCallbackParams } from '../../component/Overlay'
import type { RectAttrs } from '../figure/rect'
import type { TextStyle, LineStyle, RectStyle } from '../../common/Styles'
import type { KLineData } from '../../common/Data'

export interface PositionOverlayExtend {
  hovered: boolean;
  selected: boolean;
}

export interface PositionOverlayStyle {
  target: RectStyle;
  loss: RectStyle;
  targetText: TextStyle;
  lossText: TextStyle;
  midLine: LineStyle;
}

function getDefaultPositionStyle (): DeepPartial<PositionOverlayStyle> {
  return {
    target: { color: '#279d8233' },
    loss: { color: '#f2385a33' },
    midLine: { color: '#76808F', size: 1 },
    targetText: {
      backgroundColor: '#279d82'
    },
    lossText: {
      backgroundColor: '#f2385a'
    }
  }
}

/**
 * Constrain the point alignment based on the anchor point by constraint type.
 *
 * @param perform - The point to be constrained
 * @param anchor - The anchor point to align with
 * @param constraint - The constraint type, can be "top", "bottom", "vertical", or "horizontal"
 */
function constrainPointPosition (
  perform: Partial<Point>,
  anchor: Partial<Point>,
  constraint: 'top' | 'bottom' | 'vertical' | 'horizontal'
): void {
  if (constraint === 'top') {
    if (!isNumber(perform.value) || !isNumber(anchor.value)) return
    if (perform.value < anchor.value) {
      perform.value = anchor.value
    }
  } else if (constraint === 'bottom') {
    if (!isNumber(perform.value) || !isNumber(anchor.value)) return
    if (perform.value > anchor.value) {
      perform.value = anchor.value
    }
  } else if (constraint === 'vertical') {
    perform.timestamp = anchor.timestamp
    perform.dataIndex = anchor.dataIndex
  } else {
    perform.value = anchor.value
  }
}

function createRect (start: Coordinate, end: Coordinate): RectAttrs {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(start.x - end.x),
    height: Math.abs(start.y - end.y)
  }
}

function createPositionRects (
  isLong: boolean
): (params: OverlayCreateFiguresCallbackParams<PositionOverlayExtend>) => OverlayFigure[] {
  return ({ coordinates, overlay, yAxis, xAxis }) => {
    if (!isValid(yAxis) || !isValid(xAxis)) return []
    if (coordinates.length < 2) return []
    const figures: OverlayFigure[] = []
    figures.push({
      type: 'rect',
      attrs: createRect(coordinates[0], coordinates[1]),
      styles: isLong ? overlay.styles?.target : overlay.styles?.loss
    })
    figures.push({
      type: 'line',
      attrs: {
        coordinates: [{ x: coordinates[0].x, y: coordinates[1].y }, coordinates[1]]
      },
      styles: overlay.styles?.midLine
    })

    if (!isValid(coordinates[2])) return figures
    figures.push({
      type: 'rect',
      attrs: createRect(coordinates[1], coordinates[2]),
      styles: isLong ? overlay.styles?.loss : overlay.styles?.target
    })
    return figures
  }
}

interface RiskInfo {
  riskReward: number;
  entryPoint?: Pick<Point, 'value' | 'timestamp'>;
  upPoint?: Pick<Point, 'value' | 'timestamp'>;
  downPoint?: Pick<Point, 'value' | 'timestamp'>;
}

/**
 * Calculate the profit and loss information and risk-reward ratio.
 *
 * @param data - The KLine data array.
 * @param start - The start dataindex.
 * @param end - The end dataindex.
 * @param entry - The entry price.
 * @param target - The target price.
 * @param loss - The loss price.
 * @param isLong - Whether the position is long or short.
 */
function calcRiskInfo (data: KLineData[], start: number, end: number, entry: number, up: number, down: number): Nullable<RiskInfo> {
  if (start === end) return null
  if (entry === up || entry === down || down >= up) return null

  let entryPoint: Nullable<Pick<Point, 'value' | 'timestamp'>> = null
  let upPoint: Nullable<Pick<Point, 'value' | 'timestamp'>> = null
  let downPoint: Nullable<Pick<Point, 'value' | 'timestamp'>> = null
  for (let i = start; i <= end; i++) {
    const bar = data[i]
    if (bar.low <= entry && entry <= bar.high && !isValid(entryPoint)) entryPoint = { timestamp: bar.timestamp, value: entry }
    if (!isValid(entryPoint)) continue

    if (bar.high >= up) {
      upPoint = { timestamp: bar.timestamp, value: up }
      break
    }
    if (bar.low <= down) {
      downPoint = { timestamp: bar.timestamp, value: down }
      break
    }
  }

  const riskInfo: RiskInfo = { riskReward: (up - entry) / (entry - down) }
  if (!isValid(entryPoint)) return riskInfo
  riskInfo.entryPoint = entryPoint

  if (isValid(upPoint)) riskInfo.upPoint = upPoint
  else if (isValid(downPoint)) riskInfo.downPoint = downPoint
  else {
    const lastBar = data[end]
    if (lastBar.close > entry) riskInfo.upPoint = { timestamp: lastBar.timestamp, value: lastBar.close }
    else { riskInfo.downPoint = { timestamp: lastBar.timestamp, value: lastBar.close } }
  }
  return riskInfo
}

function createPositionInfo (
  isLong: boolean
): (params: OverlayCreateFiguresCallbackParams<PositionOverlayExtend>) => OverlayFigure[] {
  return ({ chart, coordinates, overlay, yAxis, xAxis }) => {
    if (!isValid(yAxis) || !isValid(xAxis)) return []
    if (coordinates.length < 3) return []
    if (overlay.currentStep !== -1) return []
    if (!overlay.extendData.hovered && !overlay.extendData.selected) return []

    const locale = chart.getLocale()
    const points = overlay.points
    if (
      !isNumber(points[0].value) ||
      !isNumber(points[1].value) ||
      !isNumber(points[2].value) ||
      !isNumber(points[0].timestamp) ||
      !isNumber(points[1].timestamp) ||
      !isNumber(points[2].timestamp)
    ) {
      return []
    }

    let precision = 0
    if (yAxis.isInCandle()) {
      precision = chart.getPrecision().price
    } else {
      const indicators = chart.getIndicators({ paneId: overlay.paneId })
      indicators.forEach((indicator) => {
        precision = Math.max(precision, indicator.precision)
      })
    }
    const figures: OverlayFigure[] = []
    const xText =
      (xAxis.convertTimestampToPixel(points[0].timestamp) +
        xAxis.convertTimestampToPixel(points[1].timestamp)) /
      2

    const upValue = chart
      .getDecimalFold()
      .format(
        chart.getThousandsSeparator().format((points[0].value - points[1].value).toFixed(precision))
      )
    const upPercent = 100 * (points[0].value / points[1].value - 1)
    const upLabel = isLong ? i18n('target', locale) : i18n('loss', locale)
    figures.push({
      type: 'text',
      attrs: {
        x: xText,
        y: coordinates[0].y,
        text: `${upLabel}${upValue} (${upPercent.toFixed(2)}%)`,
        baseline: 'bottom',
        align: 'center'
      },
      styles: isLong ? overlay.styles?.targetText : overlay.styles?.lossText
    })

    const downValue = chart
      .getDecimalFold()
      .format(
        chart.getThousandsSeparator().format((points[1].value - points[2].value).toFixed(precision))
      )
    const downPercent = -100 * (points[2].value / points[1].value - 1)
    const downLabel = isLong ? i18n('loss', locale) : i18n('target', locale)
    figures.push({
      type: 'text',
      attrs: {
        x: xText,
        y: coordinates[2].y,
        text: `${downLabel}${downValue} (${downPercent.toFixed(2)}%)`,
        baseline: 'top',
        align: 'center'
      },
      styles: isLong ? overlay.styles?.lossText : overlay.styles?.targetText
    })

    // const riskInfo = calcRiskInfo(chart.getDataList(), )
    return figures
  }
}

function createPositionCallback (isLong: boolean): OverlayCreateFiguresCallback<PositionOverlayExtend> {
  return (params) => {
    const rects = createPositionRects(isLong)(params)
    const infos = createPositionInfo(isLong)(params)
    return [...rects, ...infos]
  }
}

/**
 * Position Overlay Template
 *
 * Three-point drawing specification:
 * 1. First Point (Top):
 *    - Determines take-profit price
 *    - Maintains vertical alignment with third point
 * 2. Second Point (Middle):
 *    - Defines entry price position
 *    - Controls horizontal width of the position area
 * 3. Third Point (Bottom):
 *    - Specifies stop-loss price
 *    - Vertically aligned with first point
 */
const positionTemplate: Omit<
  OverlayTemplate<PositionOverlayExtend>,
  'name' | 'createPointFigures'
> = {
  styles: getDefaultPositionStyle(),
  totalStep: 4,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  extendData: { hovered: false, selected: false },
  onMouseEnter: ({ overlay }) => { overlay.extendData.hovered = true },
  onMouseLeave: ({ overlay }) => { overlay.extendData.hovered = false },
  onSelected: ({ overlay }) => { overlay.extendData.selected = true },
  onDeselected: ({ overlay }) => { overlay.extendData.selected = false },
  performEventPressedMove: ({ points, performPoint, performPointIndex }) => {
    if (performPointIndex === 0) {
      // Constrain first point above second point
      constrainPointPosition(performPoint, points[1], 'top')
      // Sync third point's X with first point
      constrainPointPosition(points[2], performPoint, 'vertical')
    } else if (performPointIndex === 1) {
      // Keep second point between first and third
      constrainPointPosition(performPoint, points[0], 'bottom')
      constrainPointPosition(performPoint, points[2], 'top')
    } else if (performPointIndex === 2) {
      // Constrain third point below second
      constrainPointPosition(performPoint, points[1], 'bottom')
      // Sync first point's X with third
      constrainPointPosition(points[0], performPoint, 'vertical')
    }
  },
  performEventMoveForDrawing: ({ points, performPoint, currentStep }) => {
    if (currentStep === 2) {
      // Constrain second point below first
      constrainPointPosition(performPoint, points[0], 'bottom')
    } else if (currentStep === 3) {
      // Constrain third point below second
      constrainPointPosition(performPoint, points[1], 'bottom')

      if (points[1].timestamp === performPoint.timestamp) {
        // Handle initial drawing alignment
        constrainPointPosition(performPoint, points[0], 'vertical')
      } else {
        // Maintain vertical alignment after placement
        constrainPointPosition(points[0], performPoint, 'vertical')
      }
    }
  }
}

export const longPosition: OverlayTemplate<PositionOverlayExtend> = {
  name: 'longPosition',
  createPointFigures: createPositionCallback(true),
  ...positionTemplate
}

export const shortPosition: OverlayTemplate<PositionOverlayExtend> = {
  name: 'shortPosition',
  createPointFigures: createPositionCallback(false),
  ...positionTemplate
}
