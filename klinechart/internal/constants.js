/**
 * 指标类型
 * @type {{NO: string, DMI: string, OBV: string, SAR: string, BIAS: string, MTM: string, CCI: string, RSI: string, TRIX: string, CR: string, EMV: string, KDJ: string, VOL: string, BOLL: string, MA: string, MACD: string, PSY: string, KD: string, DMA: string, WR: string, VR: string, BRAR: string}}
 */
const IndicatorType = {
  NO: 'NO',
  MA: 'MA',
  VOL: 'VOL',
  MACD: 'MACD',
  BOLL: 'BOLL',
  KDJ: 'KDJ',
  RSI: 'RSI',
  BIAS: 'BIAS',
  BRAR: 'BRAR',
  CCI: 'CCI',
  DMI: 'DMI',
  CR: 'CR',
  PSY: 'PSY',
  DMA: 'DMA',
  TRIX: 'TRIX',
  OBV: 'OBV',
  VR: 'VR',
  WR: 'WR',
  MTM: 'MTM',
  EMV: 'EMV',
  SAR: 'SAR'
}

/**
 * 线的样式
 * @type {{DASH: string, SOLID: string}}
 */
const LineStyle = {
  DASH: 'dash',
  SOLID: 'solid'
}

/**
 * y轴位置
 * @type {{LEFT: string, RIGHT: string}}
 */
const YAxisPosition = {
  LEFT: 'left',
  RIGHT: 'right'
}

/**
 * y轴文字位置
 * @type {{OUTSIDE: string, INSIDE: string}}
 */
const YAxisTextPosition = {
  INSIDE: 'inside',
  OUTSIDE: 'outside'
}

/**
 * 主图类型
 * @type {{TIME_LINE: string, CANDLE: string}}
 */
const MainChartType = {
  TIME_LINE: 'time_line',
  CANDLE: 'candle'
}

/**
 * 蜡烛图样式
 * @type {{STROKE: string, DECREASING_STROKE: string, OHLC: string, INCREASING_STROKE: string, SOLID: string}}
 */
const CandleStyle = {
  SOLID: 'solid',
  STROKE: 'stroke',
  INCREASING_STROKE: 'increasing_stroke',
  DECREASING_STROKE: 'decreasing_stroke',
  OHLC: 'ohlc'
}

/**
 * 提示文字显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */
const TooltipTextDisplayRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
}

/**
 * 主图数据提示显示类型
 * @type {{FLOAT: string, FIXED: string}}
 */
const TooltipMainChartTextDisplayType = {
  FLOAT: 'float',
  FIXED: 'fixed'
}

/**
 * 标记图形类型
 * @type {{STRAIGHT_LINE: string, HORIZONTAL_SEGMENT_LINE: string, FIBONACCI_LINE: string, HORIZONTAL_STRAIGHT_LINE: string, PRICE_CHANNEL_LINE: string, VERTICAL_RAY_LINE: string, VERTICAL_SEGMENT_LINE: string, PARALLEL_STRAIGHT_LINE: string, HORIZONTAL_RAY_LINE: string, VERTICAL_STRAIGHT_LINE: string, PRICE_LINE: string, RAY_LINE: string, NONE: string, SEGMENT_LINE: string}}
 */
const MarkerType = {
  NONE: 'none',
  HORIZONTAL_STRAIGHT_LINE: 'horizontalStraightLine',
  VERTICAL_STRAIGHT_LINE: 'verticalStraightLine',
  STRAIGHT_LINE: 'straightLine',
  HORIZONTAL_RAY_LINE: 'horizontalRayLine',
  VERTICAL_RAY_LINE: 'verticalRayLine',
  RAY_LINE: 'rayLine',
  HORIZONTAL_SEGMENT_LINE: 'horizontalSegmentLine',
  VERTICAL_SEGMENT_LINE: 'verticalSegmentLine',
  SEGMENT_LINE: 'segmentLine',
  PRICE_LINE: 'priceLine',
  PRICE_CHANNEL_LINE: 'priceChannelLine',
  PARALLEL_STRAIGHT_LINE: 'parallelStraightLine',
  FIBONACCI_LINE: 'fibonacciLine'
}

/**
 * 标记图形绘制步骤
 * @type {{STEP_3: *, STEP_DONE: *, STEP_1: *, STEP_2: *}}
 */
const MarkerDrawStep = {
  STEP_1: 'step_1',
  STEP_2: 'step_2',
  STEP_3: 'step_3',
  STEP_DONE: 'step_done'
}

export {
  IndicatorType, LineStyle, YAxisPosition, YAxisTextPosition, MainChartType,
  CandleStyle, TooltipTextDisplayRule, TooltipMainChartTextDisplayType,
  MarkerType, MarkerDrawStep
}
