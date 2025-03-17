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

import type Nullable from './Nullable'
import type { KLineData, NeighborData } from './Data'
import { hexToRgb } from './utils/color'

export interface Margin {
  marginLeft: number
  marginTop: number
  marginRight: number
  marginBottom: number
}

export interface Padding {
  paddingLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
}

export interface Offset {
  offsetLeft: number
  offsetTop: number
  offsetRight: number
  offsetBottom: number
}

/**
 * line type
 */
export enum LineType {
  Dashed = 'dashed',
  Solid = 'solid'
}

export interface LineStyle {
  style: LineType
  size: number
  color: string
  dashedValue: number[]
}

export interface SmoothLineStyle extends LineStyle {
  smooth: boolean | number
}

export interface StateLineStyle extends LineStyle {
  show: boolean
}

export enum PathType {
  Stroke = 'stroke',
  Fill = 'fill',
}

export interface PathStyle {
  style: PathType
  color: string
  lineWidth: number
}

export enum PolygonType {
  Stroke = 'stroke',
  Fill = 'fill',
  StrokeFill = 'stroke_fill'
}

export interface PolygonStyle {
  style: PolygonType
  color: string | CanvasGradient
  borderColor: string
  borderSize: number
  borderStyle: LineType
  borderDashedValue: number[]
}

export interface RectStyle extends PolygonStyle {
  borderRadius: number | number[]
}

export interface TextStyle extends Padding {
  style: PolygonType
  color: string
  size: number
  family: string
  weight: number | string
  borderStyle: LineType
  borderDashedValue: number[]
  borderSize: number
  borderColor: string
  borderRadius: number | number[]
  backgroundColor: string | CanvasGradient
}

export interface StateTextStyle extends TextStyle {
  show: boolean
}

export type LastValueMarkTextStyle = Omit<StateTextStyle, 'backgroundColor'>

export enum TooltipShowRule {
  Always = 'always',
  FollowCross = 'follow_cross',
  None = 'none'
}

export enum TooltipShowType {
  Standard = 'standard',
  Rect = 'rect'
}

export interface ChangeColor {
  upColor: string
  downColor: string
  noChangeColor: string
}

export interface GradientColor {
  offset: number
  color: string
}

export enum FeatureType {
  Path = 'path',
  IconFont = 'icon_font'
}

export interface FeaturePathStyle extends Omit<PathStyle, 'color'> {
  path: string
}

export interface FeatureIconFontStyle {
  family: string
  code: string
}

export interface FeatureStyle extends Padding, Margin {
  id: string
  show: boolean
  backgroundColor: string
  activeBackgroundColor: string
  size: number
  color: string
  activeColor: string
  borderRadius: number | number[]
  type: FeatureType
  content: FeaturePathStyle | FeatureIconFontStyle
}

export interface GridStyle {
  show: boolean
  horizontal: StateLineStyle
  vertical: StateLineStyle
}

export type TooltipTextStyle = Pick<TextStyle, 'color' | 'size' | 'family' | 'weight'> & Margin

export interface TooltipLegendChild {
  text: string
  color: string
}

export interface TooltipLegend {
  title: string | TooltipLegendChild
  value: string | TooltipLegendChild
}

export enum TooltipFeaturePosition {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

export interface TooltipFeatureStyle extends FeatureStyle {
  position: TooltipFeaturePosition
}

export interface TooltipStyle {
  showRule: TooltipShowRule
  showType: TooltipShowType
  defaultValue: string
  text: TooltipTextStyle
  features: TooltipFeatureStyle[]
}

export interface CandleAreaPointStyle {
  show: boolean
  color: string
  radius: number
  rippleColor: string
  rippleRadius: number
  animation: boolean
  animationDuration: number
}

export interface CandleAreaStyle {
  lineSize: number
  lineColor: string
  value: string
  smooth: boolean
  backgroundColor: string | GradientColor[]
  point: CandleAreaPointStyle
}

export interface CandleHighLowPriceMarkStyle {
  show: boolean
  color: string
  textOffset: number
  textSize: number
  textFamily: string
  textWeight: string
}

export type CandleLastPriceMarkLineStyle = Omit<StateLineStyle, 'color'>

export enum CandleLastPriceMarkExtendTextPosition {
  AbovePrice = 'above_price',
  BelowPrice = 'below_price'
}

export type CandleLastPriceMarkExtendTextStyle = LastValueMarkTextStyle & {
  position: CandleLastPriceMarkExtendTextPosition
  updateInterval: number
}
export interface CandleLastPriceMarkStyle extends ChangeColor {
  show: boolean
  compareRule: CandleColorCompareRule
  line: CandleLastPriceMarkLineStyle
  text: LastValueMarkTextStyle
  extendTexts: CandleLastPriceMarkExtendTextStyle[]
}

export interface CandlePriceMarkStyle {
  show: boolean
  high: CandleHighLowPriceMarkStyle
  low: CandleHighLowPriceMarkStyle
  last: CandleLastPriceMarkStyle
}

export enum CandleTooltipRectPosition {
  Fixed = 'fixed',
  Pointer = 'pointer'
}

export interface CandleTooltipRectStyle extends Omit<RectStyle, 'style' | 'borderDashedValue' | 'borderStyle'>, Padding, Offset {
  position: CandleTooltipRectPosition
}

export type CandleTooltipCustomCallback = (data: NeighborData<Nullable<KLineData>>, styles: CandleStyle) => TooltipLegend[]

export interface CandleTooltipStyle extends TooltipStyle, Offset {
  custom: CandleTooltipCustomCallback | TooltipLegend[]
  rect: CandleTooltipRectStyle
}

export enum CandleType {
  CandleSolid = 'candle_solid',
  CandleStroke = 'candle_stroke',
  CandleUpStroke = 'candle_up_stroke',
  CandleDownStroke = 'candle_down_stroke',
  Ohlc = 'ohlc',
  Area = 'area'
}

export enum CandleColorCompareRule {
  CurrentOpen = 'current_open',
  PreviousClose = 'previous_close'
}

export interface CandleBarColor extends ChangeColor {
  compareRule: CandleColorCompareRule
  upBorderColor: string
  downBorderColor: string
  noChangeBorderColor: string
  upWickColor: string
  downWickColor: string
  noChangeWickColor: string
}

export interface CandleStyle {
  type: CandleType
  bar: CandleBarColor
  area: CandleAreaStyle
  priceMark: CandlePriceMarkStyle
  tooltip: CandleTooltipStyle
}

export type IndicatorPolygonStyle = Omit<PolygonStyle, 'color' | 'borderColor'> & ChangeColor

export interface IndicatorLastValueMarkStyle {
  show: boolean
  text: LastValueMarkTextStyle
}

export interface IndicatorTooltipStyle extends TooltipStyle, Offset {
  showName: boolean
  showParams: boolean
}

export interface IndicatorStyle {
  ohlc: Pick<CandleBarColor, 'compareRule' | 'upColor' | 'downColor' | 'noChangeColor'>
  bars: IndicatorPolygonStyle[]
  lines: SmoothLineStyle[]
  circles: IndicatorPolygonStyle[]
  lastValueMark: IndicatorLastValueMarkStyle
  tooltip: IndicatorTooltipStyle
  [key: string]: unknown
}

export type AxisLineStyle = Omit<StateLineStyle, 'style' | 'dashedValue'>

export interface AxisTickLineStyle extends AxisLineStyle {
  length: number
}

export interface AxisTickTextStyle extends Pick<StateTextStyle, 'show' | 'color' | 'weight' | 'family' | 'size'> {
  marginStart: number
  marginEnd: number
}

export interface AxisStyle {
  show: boolean
  size: number | 'auto'
  axisLine: AxisLineStyle
  tickLine: AxisTickLineStyle
  tickText: AxisTickTextStyle
}

export interface CrosshairDirectionStyle {
  show: boolean
  line: StateLineStyle
  text: StateTextStyle
}

export interface CrosshairStyle {
  show: boolean
  horizontal: CrosshairDirectionStyle & { features: TooltipFeatureStyle[] }
  vertical: CrosshairDirectionStyle
}

export interface OverlayPointStyle {
  color: string
  borderColor: string
  borderSize: number
  radius: number
  activeColor: string
  activeBorderColor: string
  activeBorderSize: number
  activeRadius: number
}

export interface OverlayStyle {
  point: OverlayPointStyle
  line: SmoothLineStyle
  rect: RectStyle
  polygon: PolygonStyle
  circle: PolygonStyle
  arc: LineStyle
  text: TextStyle
  [key: string]: unknown
}

export interface SeparatorStyle {
  size: number
  color: string
  fill: boolean
  activeBackgroundColor: string
}

export interface Styles {
  grid: GridStyle
  candle: CandleStyle
  indicator: IndicatorStyle
  xAxis: AxisStyle
  yAxis: AxisStyle
  separator: SeparatorStyle
  crosshair: CrosshairStyle
  overlay: OverlayStyle
}

const Color = {
  RED: '#F92855',
  GREEN: '#2DC08E',
  WHITE: '#FFFFFF',
  GREY: '#76808F',
  BLUE: '#1677FF'
}

function getDefaultGridStyle (): GridStyle {
  return {
    show: true,
    horizontal: {
      show: true,
      size: 1,
      color: '#EDEDED',
      style: LineType.Dashed,
      dashedValue: [2, 2]
    },
    vertical: {
      show: true,
      size: 1,
      color: '#EDEDED',
      style: LineType.Dashed,
      dashedValue: [2, 2]
    }
  }
}

/**
 * Get default candle style
 * @type {{area: {backgroundColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */
function getDefaultCandleStyle (): CandleStyle {
  const highLow = {
    show: true,
    color: Color.GREY,
    textOffset: 5,
    textSize: 10,
    textFamily: 'Helvetica Neue',
    textWeight: 'normal'
  }
  return {
    type: CandleType.CandleSolid,
    bar: {
      compareRule: CandleColorCompareRule.CurrentOpen,
      upColor: Color.GREEN,
      downColor: Color.RED,
      noChangeColor: Color.GREY,
      upBorderColor: Color.GREEN,
      downBorderColor: Color.RED,
      noChangeBorderColor: Color.GREY,
      upWickColor: Color.GREEN,
      downWickColor: Color.RED,
      noChangeWickColor: Color.GREY
    },
    area: {
      lineSize: 2,
      lineColor: Color.BLUE,
      smooth: false,
      value: 'close',
      backgroundColor: [{
        offset: 0,
        color: hexToRgb(Color.BLUE, 0.01)
      }, {
        offset: 1,
        color: hexToRgb(Color.BLUE, 0.2)
      }],
      point: {
        show: true,
        color: Color.BLUE,
        radius: 4,
        rippleColor: hexToRgb(Color.BLUE, 0.3),
        rippleRadius: 8,
        animation: true,
        animationDuration: 1000
      }
    },
    priceMark: {
      show: true,
      high: { ...highLow },
      low: { ...highLow },
      last: {
        show: true,
        compareRule: CandleColorCompareRule.CurrentOpen,
        upColor: Color.GREEN,
        downColor: Color.RED,
        noChangeColor: Color.GREY,
        line: {
          show: true,
          style: LineType.Dashed,
          dashedValue: [4, 4],
          size: 1
        },
        text: {
          show: true,
          style: PolygonType.Fill,
          size: 12,
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          borderColor: 'transparent',
          borderStyle: LineType.Solid,
          borderSize: 0,
          borderDashedValue: [2, 2],
          color: Color.WHITE,
          family: 'Helvetica Neue',
          weight: 'normal',
          borderRadius: 2
        },
        extendTexts: []
      }
    },
    tooltip: {
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
      showRule: TooltipShowRule.Always,
      showType: TooltipShowType.Standard,
      custom: [
        { title: 'time', value: '{time}' },
        { title: 'open', value: '{open}' },
        { title: 'high', value: '{high}' },
        { title: 'low', value: '{low}' },
        { title: 'close', value: '{close}' },
        { title: 'volume', value: '{volume}' }
      ],
      defaultValue: 'n/a',
      rect: {
        position: CandleTooltipRectPosition.Fixed,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        offsetLeft: 4,
        offsetTop: 4,
        offsetRight: 4,
        offsetBottom: 4,
        borderRadius: 4,
        borderSize: 1,
        borderColor: '#F2F3F5',
        color: '#FEFEFE'
      },
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: Color.GREY,
        marginLeft: 8,
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4
      },
      features: []
    }
  }
}

/**
 * Get default indicator style
 */
function getDefaultIndicatorStyle (): IndicatorStyle {
  const alphaGreen = hexToRgb(Color.GREEN, 0.7)
  const alphaRed = hexToRgb(Color.RED, 0.7)
  return {
    ohlc: {
      compareRule: CandleColorCompareRule.CurrentOpen,
      upColor: alphaGreen,
      downColor: alphaRed,
      noChangeColor: Color.GREY
    },
    bars: [{
      style: PolygonType.Fill,
      borderStyle: LineType.Solid,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaGreen,
      downColor: alphaRed,
      noChangeColor: Color.GREY
    }],
    lines: ['#FF9600', '#935EBD', Color.BLUE, '#E11D74', '#01C5C4'].map(color => ({
      style: LineType.Solid,
      smooth: false,
      size: 1,
      dashedValue: [2, 2],
      color
    })),
    circles: [{
      style: PolygonType.Fill,
      borderStyle: LineType.Solid,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaGreen,
      downColor: alphaRed,
      noChangeColor: Color.GREY
    }],
    lastValueMark: {
      show: false,
      text: {
        show: false,
        style: PolygonType.Fill,
        color: Color.WHITE,
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.Solid,
        borderColor: 'transparent',
        borderSize: 0,
        borderDashedValue: [2, 2],
        paddingLeft: 4,
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        borderRadius: 2
      }
    },
    tooltip: {
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
      showRule: TooltipShowRule.Always,
      showType: TooltipShowType.Standard,
      showName: true,
      showParams: true,
      defaultValue: 'n/a',
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: Color.GREY,
        marginLeft: 8,
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4
      },
      features: []
    }
  }
}

function getDefaultAxisStyle (): AxisStyle {
  return {
    show: true,
    size: 'auto',
    axisLine: {
      show: true,
      color: '#DDDDDD',
      size: 1
    },
    tickText: {
      show: true,
      color: Color.GREY,
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      marginStart: 4,
      marginEnd: 6
    },
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#DDDDDD'
    }
  }
}

function getDefaultCrosshairStyle (): CrosshairStyle {
  return {
    show: true,
    horizontal: {
      show: true,
      line: {
        show: true,
        style: LineType.Dashed,
        dashedValue: [4, 2],
        size: 1,
        color: Color.GREY
      },
      text: {
        show: true,
        style: PolygonType.Fill,
        color: Color.WHITE,
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderColor: Color.GREY,
        borderRadius: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: Color.GREY
      },
      features: []
    },
    vertical: {
      show: true,
      line: {
        show: true,
        style: LineType.Dashed,
        dashedValue: [4, 2],
        size: 1,
        color: Color.GREY
      },
      text: {
        show: true,
        style: PolygonType.Fill,
        color: Color.WHITE,
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderColor: Color.GREY,
        borderRadius: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: Color.GREY
      }
    }
  }
}

function getDefaultOverlayStyle (): OverlayStyle {
  const pointBorderColor = hexToRgb(Color.BLUE, 0.35)
  const alphaBg = hexToRgb(Color.BLUE, 0.25)
  function text (): TextStyle {
    return {
      style: PolygonType.Fill,
      color: Color.WHITE,
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2],
      borderSize: 1,
      borderRadius: 2,
      borderColor: Color.BLUE,
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 4,
      paddingBottom: 4,
      backgroundColor: Color.BLUE
    }
  }
  return {
    point: {
      color: Color.BLUE,
      borderColor: pointBorderColor,
      borderSize: 1,
      radius: 5,
      activeColor: Color.BLUE,
      activeBorderColor: pointBorderColor,
      activeBorderSize: 3,
      activeRadius: 5
    },
    line: {
      style: LineType.Solid,
      smooth: false,
      color: Color.BLUE,
      size: 1,
      dashedValue: [2, 2]
    },
    rect: {
      style: PolygonType.Fill,
      color: alphaBg,
      borderColor: Color.BLUE,
      borderSize: 1,
      borderRadius: 0,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    polygon: {
      style: PolygonType.Fill,
      color: Color.BLUE,
      borderColor: Color.BLUE,
      borderSize: 1,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    circle: {
      style: PolygonType.Fill,
      color: alphaBg,
      borderColor: Color.BLUE,
      borderSize: 1,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    arc: {
      style: LineType.Solid,
      color: Color.BLUE,
      size: 1,
      dashedValue: [2, 2]
    },
    text: text()
  }
}

function getDefaultSeparatorStyle (): SeparatorStyle {
  return {
    size: 1,
    color: '#DDDDDD',
    fill: true,
    activeBackgroundColor: hexToRgb(Color.BLUE, 0.08)
  }
}

export function getDefaultStyles (): Styles {
  return {
    grid: getDefaultGridStyle(),
    candle: getDefaultCandleStyle(),
    indicator: getDefaultIndicatorStyle(),
    xAxis: getDefaultAxisStyle(),
    yAxis: getDefaultAxisStyle(),
    separator: getDefaultSeparatorStyle(),
    crosshair: getDefaultCrosshairStyle(),
    overlay: getDefaultOverlayStyle()
  }
}
