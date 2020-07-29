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
 * @type {{PERCENTAGE: string, NORMAL: string}}
 */
export const YAxisType = {
  NORMAL: 'normal',
  PERCENTAGE: 'percentage'
}

/**
 * 主图类型
 * @type {{TIME_LINE: string, CANDLE: string}}
 */
export const ChartType = {
  REAL_TIME: 'real_time',
  CANDLE_STICK: 'candle_stick'
}

/**
 * 蜡烛图样式
 * @type {{STROKE: string, DECREASING_STROKE: string, OHLC: string, INCREASING_STROKE: string, SOLID: string}}
 */
export const CandleStickStyle = {
  SOLID: 'solid',
  STROKE: 'stroke',
  UP_STROKE: 'up_stroke',
  DOWN_STROKE: 'down_stroke',
  OHLC: 'ohlc'
}

/**
 * 提示文字显示规则
 * @type {{FOLLOW_CROSS: string, NONE: string, ALWAYS: string}}
 */
export const FloatLayerPromptDisplayRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
}

/**
 * 主图数据提示显示类型
 * @type {{FLOAT: string, FIXED: string}}
 */
export const FloatLayerPromptCandleStickTextDisplayType = {
  RECT: 'rect',
  STANDARD: 'standard'
}

/**
 * 默认网格配置
 * @type {{horizontal: {size: number, color: string, dashValue: number[], display: boolean, style: string}, display: boolean, vertical: {size: number, color: string, dashValue: number[], display: boolean, style: string}}}
 */
const defaultGrid = {
  display: true,
  horizontal: {
    display: true,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  },
  vertical: {
    display: false,
    size: 1,
    color: '#393939',
    style: LineStyle.DASH,
    dashValue: [2, 2]
  }
}

/**
 * 默认蜡烛柱图配置
 * @type {{bar: {upColor: string, style: string, downColor: string}}}
 */
const defaultCandleStick = {
  bar: {
    /**
     * 蜡烛样式
     */
    style: CandleStickStyle.SOLID,
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
    noChangeColor: '#888888'
  },
  priceMark: {
    display: true,
    high: {
      display: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    low: {
      display: true,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal'
    },
    last: {
      display: true,
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888',
      line: {
        display: true,
        style: LineStyle.DASH,
        dashValue: [4, 4],
        size: 1
      },
      text: {
        display: true,
        size: 12,
        paddingLeft: 2,
        paddingTop: 2,
        paddingRight: 2,
        paddingBottom: 2,
        color: '#FFFFFF',
        family: 'Helvetica Neue',
        weight: 'normal'
      }
    }
  }
}

/**
 * 默认的分时图配置
 * @type {{timeLine: {areaFillColor: string, color: string, size: number}, averageLine: {color: string, size: number, display: boolean}}}
 */
const defaultRealTime = {
  timeLine: {
    color: '#2196F3',
    size: 1,
    areaFillColor: 'rgba(33, 150, 243, 0.08)'
  },
  /**
   * 均线
   */
  averageLine: {
    display: true,
    color: '#FF9600',
    size: 1
  }
}

/**
 * 默认的技术指标图配置
 * @type {{decreasingColor: string, lineColors: [string, string, string, string, string], increasingColor: string, lineSize: number}}
 */
const defaultTechnicalIndicator = {
  bar: {
    upColor: '#26A69A',
    downColor: '#EF5350',
    noChangeColor: '#888888'
  },
  line: {
    size: 1,
    colors: ['#D9D9D9', '#FF9600', '#F632FF', '#2196F3', '#9157DB']
  },
  circle: {
    upColor: '#26A69A',
    downColor: '#EF5350',
    noChangeColor: '#888888'
  },
  lastValueMark: {
    display: false,
    textColor: '#ffffff',
    textSize: 12,
    textFamily: 'Helvetica Neue',
    textWeight: 'normal',
    textPaddingLeft: 3,
    textPaddingTop: 2,
    textPaddingRight: 3,
    textPaddingBottom: 2
  }
}

/**
 * 默认x轴配置
 * @type {{minHeight: number, maxHeight: number, axisLine: {color: string, size: number, display: boolean}, display: boolean, tickText: {margin: number, color: string, size: number, display: boolean}, tickLine: {size: number, color: string, display: boolean, length: number}}}
 */
const defaultXAxis = {
  /**
   * 是否显示整个轴
   */
  display: true,
  /**
   * 轴线配置
   */
  axisLine: {
    display: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    display: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingTop: 3,
    paddingBottom: 6
  },
  // tick线
  tickLine: {
    display: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
}

/**
 * 默认y轴配置
 * @type {{axisLine: {color: string, size: number, display: boolean}, display: boolean, minWidth: number, position: string, tickText: {margin: number, color: string, size: number, display: boolean, position: string}, type: string, maxWidth: number, tickLine: {size: number, color: string, display: boolean, length: number}}}
 */
const defaultYAxis = {
  /**
   * 是否显示整个轴
   */
  display: true,
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
   * 轴线配置
   */
  axisLine: {
    display: true,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    display: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    paddingLeft: 3,
    paddingRight: 6
  },
  // tick线
  tickLine: {
    display: true,
    size: 1,
    length: 3,
    color: '#888888'
  }
}

/**
 * 默认浮层配置
 * @type {{display: boolean}}
 */
const defaultFloatLayer = {
  crossHair: {
    display: true,
    horizontal: {
      display: true,
      line: {
        display: true,
        style: LineStyle.DASH,
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        display: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingBottom: 2,
        borderSize: 1,
        borderColor: '#505050',
        backgroundColor: '#505050'
      }
    },
    vertical: {
      display: true,
      line: {
        display: true,
        style: LineStyle.DASH,
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        display: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingBottom: 2,
        borderSize: 1,
        borderColor: '#505050',
        backgroundColor: '#505050'
      }
    }
  },
  prompt: {
    displayRule: FloatLayerPromptDisplayRule.ALWAYS,
    candleStick: {
      showType: FloatLayerPromptCandleStickTextDisplayType.STANDARD,
      labels: ['时间', '开', '收', '高', '低', '成交量'],
      values: null,
      rect: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 6,
        left: 8,
        top: 8,
        right: 8,
        borderRadius: 4,
        borderSize: 1,
        borderColor: '#3f4254',
        fillColor: 'rgba(17, 17, 17, .3)'
      },
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginLeft: 8,
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0
      }
    },
    technicalIndicator: {
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0,
        marginLeft: 8
      },
      point: {
        display: true,
        radius: 3
      }
    }
  }
}

/**
 * 默认图形标记配置
 * @type {{line: {color: string, size: number}, text: {marginRight: number, color: string, size: number, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}}
 */
const defaultGraphicMark = {
  line: {
    color: '#2196F3',
    size: 1
  },
  point: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
    borderSize: 1,
    radius: 4,
    activeBackgroundColor: '#2196F3',
    activeBorderColor: '#2196F3',
    activeBorderSize: 1,
    activeRadius: 6
  },
  text: {
    color: '#1e88e5',
    size: 12,
    family: 'Helvetica Neue',
    weight: 'normal',
    marginLeft: 2,
    marginRight: 2,
    marginTop: 2,
    marginBottom: 6
  }
}

/**
 * 图表之间默认分割配置
 * @type {{size: number, color: string}}
 */
const defaultSeparator = {
  size: 1,
  color: '#888888',
  fill: true
}

export const defaultStyleOptions = {
  grid: defaultGrid,
  candleStick: defaultCandleStick,
  realTime: defaultRealTime,
  technicalIndicator: defaultTechnicalIndicator,
  xAxis: defaultXAxis,
  yAxis: defaultYAxis,
  separator: defaultSeparator,
  floatLayer: defaultFloatLayer,
  graphicMark: defaultGraphicMark
}
