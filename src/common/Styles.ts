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

import KLineData from '../common/KLineData'

/**
 * 填充空心样式类型
 */
export const enum StrokeFillType {
  STROKE = 'stroke',
  FILL = 'fill'
}

/**
 * 线的样式
 * @type {{DASHED: string, SOLID: string}}
 */
export const enum LineType {
  DASHED = 'dashed',
  SOLID = 'solid'
}

/**
 * y轴位置
 * @type {{LEFT: string, RIGHT: string}}
 */
export const enum YAxisPosition {
  LEFT = 'left',
  RIGHT = 'right'
}

/**
 * y轴类型
 * @type {{PERCENTAGE: string, LOG: string, NORMAL: string}}
 */
export const enum YAxisType {
  NORMAL = 'normal',
  PERCENTAGE = 'percentage',
  LOG = 'log'
}

/**
 * 蜡烛图样式
 * @type {{AREA: string, OHLC: string, CANDLE_STROKE: string, CANDLE_SOLID: string, CANDLE_DOWN_STROKE: string, CANDLE_UP_STROKE: string}}
 */
export const enum CandleType {
  CANDLE_SOLID = 'candle_solid',
  CANDLE_STROKE = 'candle_stroke',
  CANDLE_UP_STROKE = 'candle_up_stroke',
  CANDLE_DOWN_STROKE = 'candle_down_stroke',
  OHLC = 'ohlc',
  AREA = 'area'
}

/**
 * 说明显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */
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

/**
 * 注解标识类似
 * @type {{RECT: string, TRIANGLE: string, DIAMOND: string, CUSTOM: string, NONE: string, CIRCLE: string}}
 */
export const enum AnnotationSymbolType {
  CIRCLE = 'circle',
  RECT = 'rect',
  TRIANGLE = 'triangle',
  DIAMOND = 'diamond',
  CUSTOM = 'custom',
  NONE = 'none'
}

/**
 * 覆盖物位置
 * @type {{TOP: string, BOTTOM: string, POINT: string}}
 */
export const enum OverlayPosition {
  POINT = 'point',
  TOP = 'top',
  BOTTOM = 'bottom'
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

export interface LineStyle {
  show: boolean
  size: number
  color: string
  style: LineType
  dashedValue: number[]
}

export interface TextStyle {
  show: boolean
  size: number
  color: string
  family: string
  weight: string
}

export interface PaddingTextStyle extends TextStyle {
  paddingLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  borderSize: number
  borderColor: string
  borderRadius: number
  backgroundColor: string
}

export interface MarginTextStyle extends TextStyle {
  marginLeft: number
  marginTop: number
  marginRight: number
  marginBottom: number
}

export interface GridStyle {
  show: boolean
  horizontal: LineStyle
  vertical: LineStyle
}

export interface TooltipStyle {
  showRule: TooltipShowRule
  showType: TooltipShowType
  defaultValue: 'n/a'
  text: Omit<MarginTextStyle, 'show'>
}

/**
 * 默认网格配置
 * @type {{horizontal: {size: number, color: string, dashValue: number[], show: boolean, style: string}, show: boolean, vertical: {size: number, color: string, dashValue: number[], show: boolean, style: string}}}
 */
const defaultGrid: GridStyle = {
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

export interface CandleLastPriceMarkStyle extends ChangeColor {
  show: boolean
  line: Omit<LineStyle, 'color'>
  text: Omit<PaddingTextStyle, 'backgroundColor' | 'borderSize' | 'borderColor'>
}

export interface CandlePriceMarkStyle {
  show: boolean
  high: CandleHighLowPriceMarkStyle
  low: CandleHighLowPriceMarkStyle
  last: CandleLastPriceMarkStyle
}

export interface CandleTooltipRectStyle {
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  offsetLeft: number
  offsetTop: number
  offsetRight: number
  borderRadius: number
  borderSize: number
  borderColor: string
  backgroundColor: string
}

export interface CandleTooltipValuesChild {
  color: string
  value: string
}

export type CandleTooltipValuesCallback = (kLineData: KLineData, styles: CandleStyle) => string[] | CandleTooltipValuesChild[]

export interface CandleTooltipStyle extends TooltipStyle {
  labels: string[]
  values: CandleTooltipValuesCallback | string[] | null
  rect: CandleTooltipRectStyle
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
const defaultCandle: CandleStyle = {
  type: CandleType.CANDLE_SOLID,
  bar: {
    /**
     * 上涨颜色
     */
    upColor: '#26A69A',
    /**
     * 下跌颜色
     */
    downColor: '#EF5350',
    /**
     * 无变化时颜色
     */
    noChangeColor: '#999999'
  },
  area: {
    lineSize: 2,
    lineColor: '#2196F3',
    value: 'close',
    backgroundColor: [{
      offset: 0,
      color: 'rgba(33, 150, 243, 0.01)'
    }, {
      offset: 1,
      color: 'rgba(33, 150, 243, 0.2)'
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
        size: 12,
        paddingLeft: 2,
        paddingTop: 2,
        paddingRight: 2,
        paddingBottom: 2,
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
    labels: ['时间: ', '开: ', '收: ', '高: ', '低: ', '成交量: '],
    values: null,
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
      backgroundColor: '#FEFEFE'
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

export interface IndicatorBarCirleStyle extends ChangeColor {
  style: StrokeFillType
}

export interface IndicatorLastValueMarkStyle {
  show: boolean
  text: Omit<PaddingTextStyle, 'backgroundColor' | 'borderSize' | 'borderColor'>
}

export interface IndicatorTooltipStyle extends TooltipStyle {
  showName: boolean
  showParams: boolean
}

export interface IndicatorStyle {
  ohlc: ChangeColor
  bars: IndicatorBarCirleStyle[]
  lines: Array<Omit<LineStyle, 'show'>>
  circles: IndicatorBarCirleStyle[]
  lastValueMark: IndicatorLastValueMarkStyle
  tooltip: IndicatorTooltipStyle
}

/**
 * 默认的技术指标样式配置
 * @type {{bar: {noChangeColor: string, upColor: string, downColor: string}, line: {size: number, colors: [string, string, string, string, string]}, tooltip: {showParams: boolean, showName: boolean, showRule: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}}, circle: {noChangeColor: string, upColor: string, downColor: string}, lastValueMark: {show: boolean, text: {paddingBottom: number, color: string, size: number, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}}}}
 */
const defaultIndicator: IndicatorStyle = {
  ohlc: {
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  },
  bars: [{
    style: StrokeFillType.FILL,
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
      color: '#2196F3'
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
    style: StrokeFillType.FILL,
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  }],
  lastValueMark: {
    show: false,
    text: {
      show: false,
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 3,
      paddingTop: 2,
      paddingRight: 3,
      paddingBottom: 2,
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

export type AxisLineStyle = Omit<LineStyle, 'style' | 'dashedValue'>

export interface AxisTickLineStyle extends Omit<LineStyle, 'style' | 'dashedValue'> {
  length: number
}

export interface AxisTickTextStyle extends TextStyle {
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
/**
 * 默认x轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, tickText: {paddingBottom: number, color: string, size: number, show: boolean, weight: string, paddingTop: number, family: string}, height: null, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */
const defaultXAxis: XAxisStyle = {
  /**
   * 是否显示整个轴
   */
  show: true,
  /**
   * 高度
   */
  size: 'auto',
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

export interface YAxisStyle extends AxisStyle {
  type: YAxisType
  position: YAxisPosition
  inside: boolean
  reverse: boolean
}

/**
 * 默认y轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, width: null, position: string, tickText: {color: string, size: number, paddingRight: number, show: boolean, weight: string, family: string, paddingLeft: number}, type: string, inside: boolean, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */
const defaultYAxis: YAxisStyle = {
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

export interface CrosshairDirectionStyle {
  show: boolean
  line: LineStyle
  text: PaddingTextStyle
}

export interface CrosshairStyle {
  show: boolean
  horizontal: CrosshairDirectionStyle
  vertical: CrosshairDirectionStyle
}

const defaultCrosshair: CrosshairStyle = {
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
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2,
      borderSize: 1,
      borderColor: '#686D76',
      borderRadius: 2,
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
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2,
      borderSize: 1,
      borderRadius: 2,
      borderColor: '#686D76',
      backgroundColor: '#686D76'
    }
  }
}

export interface ShapePointStyle {
  backgroundColor: string
  borderColor: string
  borderSize: number
  radius: number
  activeBackgroundColor: string
  activeBorderColor: string
  activeBorderSize: number
  activeRadius: number
}

export interface ShapeStyle {
  point: ShapePointStyle
  line: LineStyle
  polygon: PolygonStyle
  text: TextStyle
}

/**
 * 默认图形配置
 * @type {{arc: {style: string, color: string, size: number}, polygon: {style: string, color: string, size: number}, line: {style: string, color: string, size: number, dashValue: number[]}, text: {style: string, marginRight: number, color: string, size: number, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}}
 */
const defaultShape = {
  point: {
    backgroundColor: '#2196F3',
    borderColor: 'rgba(33, 150, 243, 0.35)',
    borderSize: 1,
    radius: 5,
    activeBackgroundColor: '#2196F3',
    activeBorderColor: 'rgba(33, 150, 243, 0.35)',
    activeBorderSize: 3,
    activeRadius: 5
  },
  line: {
    style: LineType.SOLID,
    color: '#2196F3',
    size: 1,
    dashValue: [2, 2]
  },
  polygon: {
    style: StrokeFillType.STROKE,
    stroke: {
      style: LineType.SOLID,
      size: 1,
      color: '#2196F3',
      dashValue: [2, 2]
    },
    fill: {
      color: '#2196F3'
    }
  },
  arc: {
    style: StrokeFillType.STROKE,
    stroke: {
      style: LineType.SOLID,
      size: 1,
      color: '#2196F3',
      dashValue: [2, 2]
    },
    fill: {
      color: '#2196F3'
    }
  },
  text: {
    style: StrokeFillType.FILL,
    color: '#2196F3',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    offset: [0, 0]
  }
}

/**
 * 默认注解信息配置
 * @type {{}}
 */
// const defaultAnnotation = {
//   position: OverlayPosition.TOP,
//   offset: [20, 0],
//   symbol: {
//     type: AnnotationSymbolType.DIAMOND,
//     size: 8,
//     color: '#2196F3',
//     activeSize: 10,
//     activeColor: '#FF9600'
//   }
// }

// const defaultTag = {
//   position: OverlayPosition.POINT,
//   offset: 0,
//   line: {
//     show: true,
//     style: LineType.DASHED,
//     dashValue: [4, 2],
//     size: 1,
//     color: '#2196F3'
//   },
//   text: {
//     color: '#FFFFFF',
//     backgroundColor: '#2196F3',
//     size: 12,
//     family: 'Helvetica Neue',
//     weight: 'normal',
//     paddingLeft: 2,
//     paddingRight: 2,
//     paddingTop: 2,
//     paddingBottom: 2,
//     borderRadius: 2,
//     borderSize: 1,
//     borderColor: '#2196F3'
//   },
//   mark: {
//     offset: 0,
//     color: '#FFFFFF',
//     backgroundColor: '#2196F3',
//     size: 12,
//     family: 'Helvetica Neue',
//     weight: 'normal',
//     paddingLeft: 2,
//     paddingRight: 2,
//     paddingTop: 2,
//     paddingBottom: 2,
//     borderRadius: 2,
//     borderSize: 1,
//     borderColor: '#2196F3'
//   }
// }

export interface SeparatorStyle {
  size: number
  color: string
  fill: boolean
  activeBackgroundColor: string
}

/**
 * 图表之间默认分割配置
 * @type {{size: number, color: string}}
 */
const defaultSeparator: SeparatorStyle = {
  size: 1,
  color: '#DDDDDD',
  fill: true,
  activeBackgroundColor: 'rgba(33, 150, 243, 0.08)'
}

export interface Styles {
  grid: GridStyle
  candle: CandleStyle
  indicator: IndicatorStyle
  xAxis: XAxisStyle
  yAxis: YAxisStyle
  separator: SeparatorStyle
  crosshair: CrosshairStyle
}

export const defaultStyles: Styles = {
  grid: defaultGrid,
  candle: defaultCandle,
  indicator: defaultIndicator,
  xAxis: defaultXAxis,
  yAxis: defaultYAxis,
  separator: defaultSeparator,
  crosshair: defaultCrosshair
  // shape: defaultShape,
  // annotation: defaultAnnotation,
  // tag: defaultTag
}
