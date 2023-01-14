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

import DeepPartial from './DeepPartial'
import Nullable from './Nullable'
import KLineData from './KLineData'

import { formatDate, formatBigNumber } from './utils/format'

/**
 * line type
 * @type {{DASHED: string, SOLID: string}}
 */
export const enum LineType {
  DASHED = 'dashed',
  SOLID = 'solid'
}

export interface LineStyle {
  style: LineType
  size: number
  color: string
  dashedValue: number[]
}

export interface StateLineStyle extends LineStyle {
  show: boolean
}

export const enum PolygonType {
  STROKE = 'stroke',
  FILL = 'fill',
  STROKE_FILL = 'stroke_fill'
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

export interface TextStyle {
  color: string
  size: number
  family: string
  weight: number | string
}

export interface StateTextStyle extends TextStyle {
  show: boolean
}

export interface RectTextStyle extends TextStyle {
  style: PolygonType
  paddingLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  borderStyle: LineType
  borderDashedValue: number[]
  borderSize: number
  borderColor: string
  borderRadius: number
  backgroundColor: string
}

export interface StateRectTextStyle extends RectTextStyle {
  show: boolean
}

export interface MarginTextStyle extends StateTextStyle {
  marginLeft: number
  marginTop: number
  marginRight: number
  marginBottom: number
}

export type LastValueMarkTextStyle = Omit<StateRectTextStyle, 'backgroundColor' | 'borderColor'>

export const enum TooltipShowRule {
  ALWAYS = 'always',
  FOLLOW_CROSS = 'follow_cross',
  NONE = 'none'
}

/**
 * 数据提示显示类型
 * @type {{RECT: string, STANDARD: string}}
 */
export const enum TooltipShowType {
  RECT = 'rect',
  STANDARD = 'standard'
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

export type TooltipTextStyle = Omit<MarginTextStyle, 'show'>

export interface TooltipDataChild {
  text: string
  color: string
}

export interface TooltipData {
  title: string | TooltipDataChild
  value: string | TooltipDataChild
}

export interface TooltipStyle {
  showRule: TooltipShowRule
  showType: TooltipShowType
  defaultValue: string
  text: TooltipTextStyle
}

function getDefaultGridStyle (): GridStyle {
  return {
    show: true,
    horizontal: {
      show: true,
      size: 1,
      color: '#EDEDED',
      style: LineType.DASHED,
      dashedValue: [2, 2]
    },
    vertical: {
      show: true,
      size: 1,
      color: '#EDEDED',
      style: LineType.DASHED,
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

export interface CandleTooltipRectStyle extends Omit<RectStyle, 'style' | 'borderDashedValue' | 'borderStyle'> {
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  offsetLeft: number
  offsetTop: number
  offsetRight: number
}

export type CandleTooltipCustomCallback = (kLineData: KLineData, styles: CandleStyle) => TooltipData[]

export interface CandleTooltipStyle extends TooltipStyle {
  custom: Nullable<CandleTooltipCustomCallback>
  rect: CandleTooltipRectStyle
}

export const enum CandleType {
  CANDLE_SOLID = 'candle_solid',
  CANDLE_STROKE = 'candle_stroke',
  CANDLE_UP_STROKE = 'candle_up_stroke',
  CANDLE_DOWN_STROKE = 'candle_down_stroke',
  OHLC = 'ohlc',
  AREA = 'area'
}

export interface CandleStyle {
  type: CandleType
  bar: ChangeColor
  area: CandleAreaStyle
  priceMark: CandlePriceMarkStyle
  tooltip: CandleTooltipStyle
}

/**
 * 默认蜡烛柱图样式配置
 * @type {{area: {backgroundColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */
function getDefaultCandleStyle (): CandleStyle {
  return {
    type: CandleType.CANDLE_SOLID,
    bar: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#999999'
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
        upColor: '#26A69A',
        downColor: '#EF5350',
        noChangeColor: '#888888',
        line: {
          show: true,
          style: LineType.DASHED,
          dashedValue: [4, 4],
          size: 1
        },
        text: {
          show: true,
          style: PolygonType.FILL,
          size: 12,
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          borderStyle: LineType.SOLID,
          borderSize: 1,
          borderDashedValue: [2, 2],
          color: '#FFFFFF',
          family: 'Helvetica Neue',
          weight: 'normal',
          borderRadius: 2
        }
      }
    },
    tooltip: {
      showRule: TooltipShowRule.ALWAYS,
      showType: TooltipShowType.STANDARD,
      custom: null,
      defaultValue: 'n/a',
      rect: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 6,
        offsetLeft: 8,
        offsetTop: 8,
        offsetRight: 8,
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
        marginLeft: 8,
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0
      }
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
  lines: LineStyle[]
  circles: IndicatorPolygonStyle[]
  lastValueMark: IndicatorLastValueMarkStyle
  tooltip: IndicatorTooltipStyle
}

function getDefaultIndicatorStyle (): IndicatorStyle {
  return {
    ohlc: {
      upColor: 'rgba(38, 166, 154, .65)',
      downColor: 'rgba(239, 83, 80, .65)',
      noChangeColor: '#888888'
    },
    bars: [{
      style: PolygonType.FILL,
      borderStyle: LineType.SOLID,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(38, 166, 154, .65)',
      downColor: 'rgba(239, 83, 80, .65)',
      noChangeColor: '#888888'
    }],
    lines: [
      {
        style: LineType.SOLID,
        size: 1,
        dashedValue: [2, 2],
        color: '#FF9600'
      }, {
        style: LineType.SOLID,
        size: 1,
        dashedValue: [2, 2],
        color: '#9D65C9'
      }, {
        style: LineType.SOLID,
        size: 1,
        dashedValue: [2, 2],
        color: '#1677FF'
      }, {
        style: LineType.SOLID,
        size: 1,
        dashedValue: [2, 2],
        color: '#E11D74'
      }, {
        style: LineType.SOLID,
        size: 1,
        dashedValue: [2, 2],
        color: '#01C5C4'
      }
    ],
    circles: [{
      style: PolygonType.FILL,
      borderStyle: LineType.SOLID,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(38, 166, 154, .65)',
      downColor: 'rgba(239, 83, 80, .65)',
      noChangeColor: '#888888'
    }],
    lastValueMark: {
      show: false,
      text: {
        show: false,
        style: PolygonType.FILL,
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.SOLID,
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
      showRule: TooltipShowRule.ALWAYS,
      showType: TooltipShowType.STANDARD,
      showName: true,
      showParams: true,
      defaultValue: 'n/a',
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#76808F',
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0,
        marginLeft: 8
      }
    }
  }
}

export type AxisLineStyle = Omit<StateLineStyle, 'style' | 'dashedValue'>

export interface AxisTickLineStyle extends AxisLineStyle {
  length: number
}

export interface AxisTickTextStyle extends StateTextStyle {
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

export const enum YAxisPosition {
  LEFT = 'left',
  RIGHT = 'right'
}

export const enum YAxisType {
  NORMAL = 'normal',
  PERCENTAGE = 'percentage',
  LOG = 'log'
}

export interface YAxisStyle extends AxisStyle {
  type: YAxisType
  position: YAxisPosition
  inside: boolean
  reverse: boolean
}

function getDefaultYAxisStyle (): YAxisStyle {
  return {
    /**
     * 是否显示整个轴
     */
    show: true,
    /**
     * 宽度
     */
    size: 'auto',
    /**
     * y轴类型
     */
    type: YAxisType.NORMAL,
    /**
     * 轴位置
     */
    position: YAxisPosition.RIGHT,
    /**
     * 轴是否在内部
     */
    inside: false,
    /**
     * 轴是否反转
     */
    reverse: false,
    /**
     * 轴线配置
     */
    axisLine: {
      show: true,
      color: '#DDDDDD',
      size: 1
    },
    /**
     * tick文字
     */
    tickText: {
      show: true,
      color: '#76808F',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      marginStart: 4,
      marginEnd: 4
    },
    // tick线
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
  text: StateRectTextStyle
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
        style: LineType.DASHED,
        dashedValue: [4, 2],
        size: 1,
        color: '#76808F'
      },
      text: {
        show: true,
        style: PolygonType.FILL,
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.SOLID,
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
        style: LineType.DASHED,
        dashedValue: [4, 2],
        size: 1,
        color: '#76808F'
      },
      text: {
        show: true,
        style: PolygonType.FILL,
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        borderStyle: LineType.SOLID,
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
  line: LineStyle
  rect: RectStyle
  polygon: PolygonStyle
  circle: PolygonStyle
  arc: LineStyle
  text: TextStyle
  rectText: RectTextStyle
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
      style: LineType.SOLID,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    rect: {
      style: PolygonType.FILL,
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderRadius: 0,
      borderStyle: LineType.SOLID,
      borderDashedValue: [2, 2]
    },
    polygon: {
      style: PolygonType.FILL,
      color: '#1677FF',
      borderColor: '#1677FF',
      borderSize: 1,
      borderStyle: LineType.SOLID,
      borderDashedValue: [2, 2]
    },
    circle: {
      style: PolygonType.FILL,
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderStyle: LineType.SOLID,
      borderDashedValue: [2, 2]
    },
    arc: {
      style: LineType.SOLID,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    text: {
      color: '#1677FF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal'
    },
    rectText: {
      style: PolygonType.FILL,
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      borderStyle: LineType.SOLID,
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

export const enum FormatDateType {
  TOOLTIP,
  CROSSHAIR,
  XAXIS
}

export type FormatDate = (dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format: string, type: FormatDateType) => string

export type FormatBigNumber = (value: string | number) => string

export interface CustomApi {
  formatDate: FormatDate
  formatBigNumber: FormatBigNumber
}

export function getDefaultCustomApi (): CustomApi {
  return {
    formatDate,
    formatBigNumber
  }
}

export const defaultLocale = 'en-US'

export interface Locales {
  time: string
  open: string
  high: string
  low: string
  close: string
  volume: string
}

export interface Options {
  locale?: string
  timezone?: string
  styles?: string | DeepPartial<Styles>
  customApi?: Partial<CustomApi>
}
