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
 * 主图数据提示显示类型
 * @type {{RECT: string, STANDARD: string}}
 */
export const TooltipCandleShowType = {
  RECT: 'rect',
  STANDARD: 'standard'
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
    color: 'rgba(255, 255, 255, 0.03)',
    style: LineStyle.SOLID,
    // dashValue: [2, 2]
  },
  vertical: {
    show: true,
    size: 1,
    color: 'rgba(255, 255, 255, 0.03)',
    style: LineStyle.SOLID,
    // dashValue: [2, 2]
  }
}

/**
 * 默认蜡烛柱图样式配置
 * @type {{area: {fillColor: [{offset: number, color: string}, {offset: number, color: string}], lineColor: string, lineSize: number, value: string}, bar: {noChangeColor: string, upColor: string, downColor: string}, tooltip: {rect: {offsetTop: number, fillColor: string, borderColor: string, paddingBottom: number, borderRadius: number, paddingRight: number, borderSize: number, offsetLeft: number, paddingTop: number, paddingLeft: number, offsetRight: number}, showRule: string, values: null, showType: string, text: {marginRight: number, size: number, color: string, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, labels: string[]}, type: string, priceMark: {high: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, last: {noChangeColor: string, upColor: string, line: {dashValue: number[], size: number, show: boolean, style: string}, show: boolean, text: {paddingBottom: number, size: number, color: string, paddingRight: number, show: boolean, weight: string, paddingTop: number, family: string, paddingLeft: number}, downColor: string}, low: {textMargin: number, textSize: number, color: string, textFamily: string, show: boolean, textWeight: string}, show: boolean}}}
 */
const defaultCandle = {
  margin: {
    top: 0.15,
    bottom: 0.3
  },
  type: CandleType.CANDLE_SOLID,
  bar: {
    /**
     * 上涨颜色
     */
    upColor: '#3aa057',
    /**
     * 下跌颜色
     */
    downColor: '#a73a47',
    /**
     * 无变化时颜色
     */
    noChangeColor: '#888888',
    upColorOffline: 'rgba(120, 120, 120, 1)',
    downColorOffline: 'rgba(92, 92, 92, 1)',
  },
  area: {
    lineSize: 2,
    lineColor: '#2196F3',
    lineColorOffline: 'rgba(109, 109, 109, 1)',
    value: 'close',
    fillColor: [{
      offset: 0,
      color: 'rgba(33, 150, 243, 0.01)',
      offlineColor: 'rgba(109, 109, 109, 0.01)',
    }, {
      offset: 1,
      color: 'rgba(33, 150, 243, 0.2)',
      offlineColor: 'rgba(109, 109, 109, 0.2)',
    }]
  },
  priceMark: {
    show: true,
    high: {
      show: false,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Open Sans, sans-serif',
      textWeight: 'normal'
    },
    low: {
      show: false,
      color: '#D9D9D9',
      textMargin: 5,
      textSize: 10,
      textFamily: 'Open Sans, sans-serif',
      textWeight: 'normal'
    },
    last: {
      show: true,
      upColor: '#5E68A3',
      downColor: '#5E68A3',
      noChangeColor: '#5E68A3',
      line: {
        show: true,
        style: LineStyle.SOLID,
        dashValue: [4, 4],
        size: 1
      },
      text: {
        show: true,
        size: 13,
        cornerWidth: 10,
        paddingLeft: 3,
        paddingTop: 4,
        paddingRight: 0,
        paddingBottom: 4,
        color: '#FFFFFF',
        family: 'Open Sans, sans-serif',
        weight: 'normal'
      }
    }
  },
  tooltip: {
    showRule: TooltipShowRule.NONE,
    showType: TooltipCandleShowType.STANDARD,
    labels: ['时间', '开', '收', '高', '低', '成交量'],
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
      borderColor: '#3f4254',
      fillColor: 'rgba(17, 17, 17, .3)'
    },
    text: {
      size: 12,
      family: 'Open Sans, sans-serif',
      weight: 'normal',
      color: '#D9D9D9',
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
      color: '#ffffff',
      size: 12,
      family: 'Open Sans, sans-serif',
      weight: 'normal',
      paddingLeft: 3,
      paddingTop: 2,
      paddingRight: 3,
      paddingBottom: 2
    }
  },
  tooltip: {
    showRule: TooltipShowRule.NONE,
    showName: true,
    showParams: true,
    defaultValue: 'n/a',
    text: {
      size: 12,
      family: 'Open Sans, sans-serif',
      weight: 'normal',
      color: '#D9D9D9',
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
    show: false,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    show: true,
    color: '#D9D9D9',
    size: 12,
    family: 'Open Sans, sans-serif',
    weight: 'normal',
    paddingTop: 3,
    paddingBottom: 6
  },
  // tick线
  tickLine: {
    show: false,
    size: 1,
    length: 3,
    color: '#888888'
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
   * 轴线配置
   */
  axisLine: {
    show: false,
    color: '#888888',
    size: 1
  },

  /**
   * tick文字
   */
  tickText: {
    show: true,
    color: '#ffffff',
    size: 14,
    family: 'Open Sans, sans-serif',
    weight: 'normal',
    paddingLeft: 3,
    paddingRight: 6
  },
  // tick线
  tickLine: {
    show: true,
    size: 1,
    length: 10,
    color: 'rgba(0, 0, 0, 0)'
  }
}

const defaultCrosshair = {
  show: true,
  horizontal: {
    show: true,
    line: {
      show: true,
      style: LineStyle.SOLID,
      dashValue: [4, 2],
      size: 1,
      color: 'rgba(255, 255, 255, 0.1)'
    },
    text: {
      show: true,
      color: '#ffffff',
      size: 13,
      family: 'Open Sans, sans-serif',
      weight: 'normal',
      cornerWidth: 10,
      paddingLeft: 3,
      paddingRight: 4,
      paddingTop: 4,
      paddingBottom: 4,
      borderSize: 0,
      borderColor: '#505050',
      backgroundColor: '#232848'
    }
  },
  vertical: {
    show: true,
    line: {
      show: true,
      style: LineStyle.SOLID,
      dashValue: [4, 2],
      size: 1,
      color: 'rgba(255, 255, 255, 0.1)'
    },
    text: {
      show: true,
      color: '#D9D9D9',
      size: 13,
      family: 'Open Sans, sans-serif',
      weight: 'normal',
      paddingLeft: 6,
      paddingRight: 6,
      paddingTop: 2,
      paddingBottom: 2,
      borderSize: 0,
      borderColor: '#232848',
      backgroundColor: '#5E68A3'
    }
  }
}

/**
 * 默认图形标记配置
 * @type {{line: {color: string, size: number}, text: {marginRight: number, color: string, size: number, weight: string, marginBottom: number, family: string, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}}
 */
const defaultGraphicMark = {
  line: {
    color: '#2196F3',
    size: 1
  },
  point: {
    backgroundColor: '#181818',
    borderColor: '#fff',
    borderSize: 1,
    radius: 5,
    activeBackgroundColor: '#181818',
    activeBorderColor: '#fff',
    activeBorderSize: 2,
    activeRadius: 6
  },
  text: {
    color: '#1e88e5',
    size: 12,
    family: 'Open Sans, sans-serif',
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
  color: 'rgb(49, 56, 100)',
  fill: true,
  activeBackgroundColor: 'rgb(49, 56, 100)'
}

const defaultBinany = {
  lastPriceMark: {
    color: "#FF9C00",
    offlineColor: 'rgba(92, 92, 92, 1)',
  },
  tradeDuration: {
    color: "#5A5B9A",
    text: {
      show: true,
      color: "#5A5B9A",
      size: 14
    }
  }
}

const defaultZoomSettings = {
  area: {
    min: 0.021,
    max: 2.5,
    initial: {
      mobile: 0.17,
      desktop: 1
    }
  },
  candle_solid: {
    min: 3,
    max: 50,
    initial: {
     mobile: 3,
     desktop: 8
    }
  },
  ohlc: {
   min: 3,
   max: 50,
   initial: {
    mobile: 3,
    desktop: 8
   }
  }
}

export const defaultStyleOptions = {
  grid: defaultGrid,
  candle: defaultCandle,
  technicalIndicator: defaultTechnicalIndicator,
  xAxis: defaultXAxis,
  yAxis: defaultYAxis,
  separator: defaultSeparator,
  crosshair: defaultCrosshair,
  graphicMark: defaultGraphicMark,
  binany: defaultBinany,
  zoomSettings: defaultZoomSettings
}
