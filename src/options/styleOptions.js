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

/**
 * 填充空心样式类型
 */
export const StrokeFillStyle = {
  STROKE: 'stroke',
  FILL: 'fill'
}

/**
 * 线的样式
 * @type {{DASH: string, SOLID: string}}
 */
export const LineStyle = {
  DASH: 'dash',
  SOLID: 'solid'
}

/**
 * y轴位置
 * @type {{LEFT: string, RIGHT: string}}
 */
export const YAxisPosition = {
  LEFT: 'left',
  RIGHT: 'right'
}

/**
 * y轴类型
 * @type {{PERCENTAGE: string, LOG: string, NORMAL: string}}
 */
export const YAxisType = {
  NORMAL: 'normal',
  PERCENTAGE: 'percentage',
  LOG: 'log'
}

/**
 * 蜡烛图样式
 * @type {{AREA: string, OHLC: string, CANDLE_STROKE: string, CANDLE_SOLID: string, CANDLE_DOWN_STROKE: string, CANDLE_UP_STROKE: string}}
 */
export const CandleType = {
  CANDLE_SOLID: 'candle_solid',
  CANDLE_STROKE: 'candle_stroke',
  CANDLE_UP_STROKE: 'candle_up_stroke',
  CANDLE_DOWN_STROKE: 'candle_down_stroke',
  OHLC: 'ohlc',
  AREA: 'area'
}

/**
 * 说明显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */
export const TooltipShowRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
}

/**
 * 数据提示显示类型
 * @type {{RECT: string, STANDARD: string}}
 */
export const TooltipShowType = {
  RECT: 'rect',
  STANDARD: 'standard'
}

/**
 * 注解标识类似
 * @type {{RECT: string, TRIANGLE: string, DIAMOND: string, CUSTOM: string, NONE: string, CIRCLE: string}}
 */
export const AnnotationSymbolType = {
  CIRCLE: 'circle',
  RECT: 'rect',
  TRIANGLE: 'triangle',
  DIAMOND: 'diamond',
  CUSTOM: 'custom',
  NONE: 'none'
}

/**
 * 覆盖物位置
 * @type {{TOP: string, BOTTOM: string, POINT: string}}
 */
export const OverlayPosition = {
  POINT: 'point',
  TOP: 'top',
  BOTTOM: 'bottom'
}

/**
 * 默认网格配置
 * @type {{horizontal: {size: number, color: string, dashValue: number[], show: boolean, style: string}, show: boolean, vertical: {size: number, color: string, dashValue: number[], show: boolean, style: string}}}
 */
const defaultGrid = {
  show: true,
  horizontal: {
    show: true,
    size: 1,
    color: '#EDEDED',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  },
  vertical: {
    show: true,
    size: 1,
    color: '#EDEDED',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  }
}

/**
 * 默认蜡烛柱图样式配置
 * @type {{area: {backgroundColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */
const defaultCandle = {
  margin: {
    top: 0.2,
    bottom: 0.1
  },
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
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    low: {
      show: true,
      color: '#76808F',
      textMargin: 5,
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
        style: LineStyle.DASH,
        dashValue: [4, 4],
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

/**
 * 默认的技术指标样式配置
 * @type {{bar: {noChangeColor: string, upColor: string, downColor: string}, line: {size: number, colors: [string, string, string, string, string]}, tooltip: {showParams: boolean, showName: boolean, showRule: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}}, circle: {noChangeColor: string, upColor: string, downColor: string}, lastValueMark: {show: boolean, text: {paddingBottom: number, color: string, size: number, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}}}}
 */
const defaultTechnicalIndicator = {
  margin: {
    top: 0.2,
    bottom: 0.1
  },
  bar: {
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  },
  line: {
    size: 1,
    dashValue: [2, 2],
    colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
  },
  circle: {
    upColor: 'rgba(38, 166, 154, .65)',
    downColor: 'rgba(239, 83, 80, .65)',
    noChangeColor: '#888888'
  },
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

/**
 * 默认x轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, tickText: {paddingBottom: number, color: string, size: number, show: boolean, weight: string, paddingTop: number, family: string}, height: null, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */
const defaultXAxis = {
  /**
   * 是否显示整个轴
   */
  show: true,
  /**
   * 高度
   */
  height: null,
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
    paddingTop: 3,
    paddingBottom: 6
  },
  // tick线
  tickLine: {
    show: true,
    size: 1,
    length: 3,
    color: '#DDDDDD'
  }
}

/**
 * 默认y轴配置
 * @type {{axisLine: {color: string, size: number, show: boolean}, show: boolean, width: null, position: string, tickText: {color: string, size: number, paddingRight: number, show: boolean, weight: string, family: string, paddingLeft: number}, type: string, inside: boolean, tickLine: {size: number, color: string, show: boolean, length: number}}}
 */
const defaultYAxis = {
  /**
   * 是否显示整个轴
   */
  show: true,
  /**
   * 宽度
   */
  width: null,
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
    paddingLeft: 3,
    paddingRight: 6
  },
  // tick线
  tickLine: {
    show: true,
    size: 1,
    length: 3,
    color: '#DDDDDD'
  }
}

const defaultCrosshair = {
  show: true,
  horizontal: {
    show: true,
    line: {
      show: true,
      style: LineStyle.DASH,
      dashValue: [4, 2],
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
      style: LineStyle.DASH,
      dashValue: [4, 2],
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
    style: LineStyle.SOLID,
    color: '#2196F3',
    size: 1,
    dashValue: [2, 2]
  },
  polygon: {
    style: StrokeFillStyle.STROKE,
    stroke: {
      style: LineStyle.SOLID,
      size: 1,
      color: '#2196F3',
      dashValue: [2, 2]
    },
    fill: {
      color: '#2196F3'
    }
  },
  arc: {
    style: StrokeFillStyle.STROKE,
    stroke: {
      style: LineStyle.SOLID,
      size: 1,
      color: '#2196F3',
      dashValue: [2, 2]
    },
    fill: {
      color: '#2196F3'
    }
  },
  text: {
    style: StrokeFillStyle.FILL,
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
const defaultAnnotation = {
  position: OverlayPosition.TOP,
  offset: [20, 0],
  symbol: {
    type: AnnotationSymbolType.DIAMOND,
    size: 8,
    color: '#2196F3',
    activeSize: 10,
    activeColor: '#FF9600'
  }
}

const defaultTag = {
  position: OverlayPosition.POINT,
  offset: 0,
  line: {
    show: true,
    style: LineStyle.DASH,
    dashValue: [4, 2],
    size: 1,
    color: '#2196F3'
  },
  text: {
    color: '#FFFFFF',
    backgroundColor: '#2196F3',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 2,
    borderSize: 1,
    borderColor: '#2196F3'
  },
  mark: {
    offset: 0,
    color: '#FFFFFF',
    backgroundColor: '#2196F3',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 2,
    borderSize: 1,
    borderColor: '#2196F3'
  }
}

/**
 * 图表之间默认分割配置
 * @type {{size: number, color: string}}
 */
const defaultSeparator = {
  size: 1,
  color: '#DDDDDD',
  fill: true,
  activeBackgroundColor: 'rgba(33, 150, 243, 0.08)'
}

export const defaultStyleOptions = {
  grid: defaultGrid,
  candle: defaultCandle,
  technicalIndicator: defaultTechnicalIndicator,
  xAxis: defaultXAxis,
  yAxis: defaultYAxis,
  separator: defaultSeparator,
  crosshair: defaultCrosshair,
  shape: defaultShape,
  annotation: defaultAnnotation,
  tag: defaultTag
}
