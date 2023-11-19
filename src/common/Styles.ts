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

import Nullable from './Nullable'
import KLineData from './KLineData'

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
  smooth: boolean
}

export interface StateLineStyle extends LineStyle {
  show: boolean
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
  borderRadius: number
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
  borderRadius: number
  backgroundColor: string | CanvasGradient
}

/**
 * @deprecated
 * Starting from v10, it will be deleted
 */
export type RectTextStyle = TextStyle

export interface StateTextStyle extends TextStyle {
  show: boolean
}

/**
 * @deprecated
 * Starting from v10, it will be deleted
 */
export type StateRectTextStyle = StateTextStyle

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

export interface GridStyle {
  show: boolean
  horizontal: StateLineStyle
  vertical: StateLineStyle
}

export type TooltipTextStyle = Pick<TextStyle, 'color' | 'size' | 'family' | 'weight'> & Margin

export interface TooltipDataChild {
  text: string
  color: string
}

export interface TooltipData {
  title: string | TooltipDataChild
  value: string | TooltipDataChild
}

export enum TooltipIconPosition {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}
export interface TooltipIconStyle extends Padding, Margin {
  id: string
  position: TooltipIconPosition
  color: string
  activeColor: string
  size: number
  fontFamily: string
  icon: string
  backgroundColor: string
  activeBackgroundColor: string
}

export interface TooltipStyle {
  showRule: TooltipShowRule
  showType: TooltipShowType
  defaultValue: string
  text: TooltipTextStyle
  icons: TooltipIconStyle[]
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

export interface CandleAreaStyle {
  lineSize: number
  lineColor: string
  value: string
  backgroundColor: string | GradientColor[]
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
export interface CandleLastPriceMarkStyle extends ChangeColor {
  show: boolean
  line: CandleLastPriceMarkLineStyle
  text: LastValueMarkTextStyle
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

export interface CandleTooltipRectStyle extends Omit<RectStyle, 'style' | 'borderDashedValue' | 'borderStyle'>, Padding {
  position: CandleTooltipRectPosition
  offsetLeft: number
  offsetTop: number
  offsetRight: number
  offsetBottom: number
}

export interface CandleTooltipCustomCallbackData {
  prev: Nullable<KLineData>
  current: KLineData
  next: Nullable<KLineData>
}

export type CandleTooltipCustomCallback = (data: CandleTooltipCustomCallbackData, styles: CandleStyle) => TooltipData[]

export interface CandleTooltipStyle extends TooltipStyle {
  custom: Nullable<CandleTooltipCustomCallback> | Nullable<TooltipData[]>
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

export interface CandleBarColor extends ChangeColor {
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

/**
 * Get default candle style
 * @type {{area: {backgroundColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */
function getDefaultCandleStyle (): CandleStyle {
  return {
    type: CandleType.CandleSolid,
    bar: {
      upColor: '#2DC08E',
      downColor: '#F92855',
      noChangeColor: '#888888',
      upBorderColor: '#2DC08E',
      downBorderColor: '#F92855',
      noChangeBorderColor: '#888888',
      upWickColor: '#2DC08E',
      downWickColor: '#F92855',
      noChangeWickColor: '#888888'
    },
    area: {
      lineSize: 2,
      lineColor: '#1677FF',
      value: 'close',
      backgroundColor: [{
        offset: 0,
        color: 'rgba(22, 119, 255, 0.01)'
      }, {
        offset: 1,
        color: 'rgba(22, 119, 255, 0.2)'
      }]
    },
    priceMark: {
      show: true,
      high: {
        show: true,
        color: '#76808F',
        textOffset: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      low: {
        show: true,
        color: '#76808F',
        textOffset: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      last: {
        show: true,
        upColor: '#2DC08E',
        downColor: '#F92855',
        noChangeColor: '#888888',
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
          color: '#FFFFFF',
          family: 'Helvetica Neue',
          weight: 'normal',
          borderRadius: 2
        }
      }
    },
    tooltip: {
      showRule: TooltipShowRule.Always,
      showType: TooltipShowType.Standard,
      custom: null,
      defaultValue: 'n/a',
      rect: {
        position: CandleTooltipRectPosition.Fixed,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 8,
        offsetLeft: 10,
        offsetTop: 8,
        offsetRight: 10,
        offsetBottom: 8,
        borderRadius: 4,
        borderSize: 1,
        borderColor: '#F2F3F5',
        color: '#FEFEFE'
      },
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#76808F',
        marginLeft: 10,
        marginTop: 8,
        marginRight: 6,
        marginBottom: 0
      },
      icons: []
    }
  }
}

export type IndicatorPolygonStyle = Omit<PolygonStyle, 'color' | 'borderColor'> & ChangeColor

export interface IndicatorLastValueMarkStyle {
  show: boolean
  text: LastValueMarkTextStyle
}

export interface IndicatorTooltipStyle extends TooltipStyle {
  showName: boolean
  showParams: boolean
}

export interface IndicatorStyle {
  ohlc: ChangeColor
  bars: IndicatorPolygonStyle[]
  lines: SmoothLineStyle[]
  circles: IndicatorPolygonStyle[]
  lastValueMark: IndicatorLastValueMarkStyle
  tooltip: IndicatorTooltipStyle
  [key: string]: any
}

/**
 * Get default indicator style
 */
function getDefaultIndicatorStyle (): IndicatorStyle {
  return {
    ohlc: {
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    },
    bars: [{
      style: PolygonType.Fill,
      borderStyle: LineType.Solid,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    }],
    lines: [
      {
        style: LineType.Solid,
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#FF9600'
      }, {
        style: LineType.Solid,
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#935EBD'
      }, {
        style: LineType.Solid,
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#1677FF'
      }, {
        style: LineType.Solid,
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#E11D74'
      }, {
        style: LineType.Solid,
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#01C5C4'
      }
    ],
    circles: [{
      style: PolygonType.Fill,
      borderStyle: LineType.Solid,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    }],
    lastValueMark: {
      show: false,
      text: {
        show: false,
        style: PolygonType.Fill,
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.Solid,
        borderColor: 'transparent',
        borderSize: 1,
        borderDashedValue: [2, 2],
        paddingLeft: 4,
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        borderRadius: 2
      }
    },
    tooltip: {
      showRule: TooltipShowRule.Always,
      showType: TooltipShowType.Standard,
      showName: true,
      showParams: true,
      defaultValue: 'n/a',
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#76808F',
        marginLeft: 10,
        marginTop: 8,
        marginRight: 6,
        marginBottom: 0
      },
      icons: []
    }
  }
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

export type XAxisStyle = AxisStyle

function getDefaultXAxisStyle (): XAxisStyle {
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
      color: '#76808F',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      marginStart: 4,
      marginEnd: 4
    },
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#DDDDDD'
    }
  }
}

export enum YAxisPosition {
  Left = 'left',
  Right = 'right'
}

export enum YAxisType {
  Normal = 'normal',
  Percentage = 'percentage',
  Log = 'log'
}

export interface YAxisStyle extends AxisStyle {
  type: YAxisType
  position: YAxisPosition
  inside: boolean
  reverse: boolean
}

function getDefaultYAxisStyle (): YAxisStyle {
  return {
    show: true,
    size: 'auto',
    type: YAxisType.Normal,
    position: YAxisPosition.Right,
    inside: false,
    reverse: false,
    axisLine: {
      show: true,
      color: '#DDDDDD',
      size: 1
    },
    tickText: {
      show: true,
      color: '#76808F',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      marginStart: 4,
      marginEnd: 4
    },
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#DDDDDD'
    }
  }
}

export interface CrosshairDirectionStyle {
  show: boolean
  line: StateLineStyle
  text: StateTextStyle
}

export interface CrosshairStyle {
  show: boolean
  horizontal: CrosshairDirectionStyle
  vertical: CrosshairDirectionStyle
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
        color: '#76808F'
      },
      text: {
        show: true,
        style: PolygonType.Fill,
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderColor: '#686D76',
        borderRadius: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#686D76'
      }
    },
    vertical: {
      show: true,
      line: {
        show: true,
        style: LineType.Dashed,
        dashedValue: [4, 2],
        size: 1,
        color: '#76808F'
      },
      text: {
        show: true,
        style: PolygonType.Fill,
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.Solid,
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderRadius: 2,
        borderColor: '#686D76',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#686D76'
      }
    }
  }
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
  /**
   * @deprecated
   * Starting from v10, it will be deleted
   */
  rectText: TextStyle
  [key: string]: any
}

function getDefaultOverlayStyle (): OverlayStyle {
  return {
    point: {
      color: '#1677FF',
      borderColor: 'rgba(22, 119, 255, 0.35)',
      borderSize: 1,
      radius: 5,
      activeColor: '#1677FF',
      activeBorderColor: 'rgba(22, 119, 255, 0.35)',
      activeBorderSize: 3,
      activeRadius: 5
    },
    line: {
      style: LineType.Solid,
      smooth: false,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    rect: {
      style: PolygonType.Fill,
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderRadius: 0,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    polygon: {
      style: PolygonType.Fill,
      color: '#1677FF',
      borderColor: '#1677FF',
      borderSize: 1,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    circle: {
      style: PolygonType.Fill,
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    arc: {
      style: LineType.Solid,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    text: {
      style: PolygonType.Fill,
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2],
      borderSize: 1,
      borderRadius: 2,
      borderColor: '#1677FF',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 4,
      paddingBottom: 4,
      backgroundColor: '#1677FF'
    },
    rectText: {
      style: PolygonType.Fill,
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2],
      borderSize: 1,
      borderRadius: 2,
      borderColor: '#1677FF',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 4,
      paddingBottom: 4,
      backgroundColor: '#1677FF'
    }
  }
}

export interface SeparatorStyle {
  size: number
  color: string
  fill: boolean
  activeBackgroundColor: string
}

function getDefaultSeparatorStyle (): SeparatorStyle {
  return {
    size: 1,
    color: '#DDDDDD',
    fill: true,
    activeBackgroundColor: 'rgba(33, 150, 243, 0.08)'
  }
}

export interface Styles {
  grid: GridStyle
  candle: CandleStyle
  indicator: IndicatorStyle
  xAxis: XAxisStyle
  yAxis: YAxisStyle
  separator: SeparatorStyle
  crosshair: CrosshairStyle
  overlay: OverlayStyle
}

export function getDefaultStyles (): Styles {
  return {
    grid: getDefaultGridStyle(),
    candle: getDefaultCandleStyle(),
    indicator: getDefaultIndicatorStyle(),
    xAxis: getDefaultXAxisStyle(),
    yAxis: getDefaultYAxisStyle(),
    separator: getDefaultSeparatorStyle(),
    crosshair: getDefaultCrosshairStyle(),
    overlay: getDefaultOverlayStyle()
  }
}
