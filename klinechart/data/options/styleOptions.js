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
 * y轴文字位置
 * @type {{OUTSIDE: string, INSIDE: string}}
 */
export const YAxisTextPosition = {
  INSIDE: 'inside',
  OUTSIDE: 'outside'
}

/**
 * 主图类型
 * @type {{TIME_LINE: string, CANDLE: string}}
 */
export const ChartType = {
  REAL_TIME: 'real_time',
  CANDLE: 'candle'
}

/**
 * 蜡烛图样式
 * @type {{STROKE: string, DECREASING_STROKE: string, OHLC: string, INCREASING_STROKE: string, SOLID: string}}
 */
export const CandleStyle = {
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
export const TooltipTextDisplayRule = {
  ALWAYS: 'always',
  FOLLOW_CROSS: 'follow_cross',
  NONE: 'none'
}

/**
 * 主图数据提示显示类型
 * @type {{FLOAT: string, FIXED: string}}
 */
export const TooltipCandleChartTextDisplayType = {
  FLOAT: 'float',
  FIXED: 'fixed'
}

export const defaultStyleOptions = {
  candle: {
    /**
     * 分时线
     */
    timeLine: {
      color: '#1e88e5',
      size: 1,
      areaFillColor: 'rgba(30, 136, 229, 0.08)'
    },
    /**
     * 均线
     */
    averageLine: {
      display: true,
      color: '#F5A623',
      size: 1
    },
    bar: {
      /**
       * 蜡烛样式
       */
      style: CandleStyle.SOLID,
      /**
       * 上涨颜色
       */
      increasingColor: '#26A69A',
      /**
       * 下跌颜色
       */
      decreasingColor: '#EF5350'
    },

    /**
     * 最大价格标记参数
     */
    highestPriceMark: {
      display: true,
      color: '#D9D9D9',
      text: {
        margin: 5,
        size: 10
      }
    },

    /**
     * 最小价格标记参数
     */
    lowestPriceMark: {
      display: true,
      color: '#D9D9D9',
      text: {
        margin: 5,
        size: 10
      }
    },

    /**
     * 最新价标记参数
     */
    lastPriceMark: {
      display: true,
      increasingColor: '#26A69A',
      decreasingColor: '#EF5350',
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
        color: '#FFFFFF'
      }
    }
  },
  indicator: {
    /**
     * 线的尺寸
     */
    lineSize: 1,
    increasingColor: '#26A69A',
    decreasingColor: '#EF5350',
    lineColors: ['#D9D9D9', '#F5A623', '#F601FF', '#1587DD', '#1e88e5']
  },
  xAxis: {
    /**
     * 是否显示整个轴
     */
    display: true,
    /**
     * x轴最大高度
     */
    maxHeight: 50,
    /**
     * x轴最小高度
     */
    minHeight: 30,
    /**
     * 轴线配置
     */
    line: {
      display: true,
      color: '#888888',
      size: 1
    },

    /**
     * 分割配置
     */
    tick: {
      // 文字
      text: {
        display: true,
        color: '#D9D9D9',
        size: 12,
        margin: 3
      },
      // 线
      line: {
        display: true,
        size: 1,
        length: 3,
        color: '#888888'
      }
    },

    /**
     * 分割线配置
     */
    separatorLine: {
      display: false,
      size: 1,
      color: '#393939',
      style: LineStyle.DASH,
      dashValue: [2, 2]
    }
  },
  yAxis: {
    /**
     * 是否显示整个轴
     */
    display: true,
    /**
     * y轴位置
     */
    position: YAxisPosition.RIGHT,

    /**
     * y轴最大宽度
     */
    maxWidth: 80,

    /**
     * y轴最小宽度
     */
    minWidth: 60,
    /**
     * 轴线配置
     */
    line: {
      display: true,
      color: '#888888',
      size: 1
    },

    /**
     * 分割配置
     */
    tick: {
      // 文字
      text: {
        display: true,
        position: YAxisTextPosition.OUTSIDE,
        color: '#D9D9D9',
        size: 12,
        margin: 3
      },
      // 线
      line: {
        display: true,
        size: 1,
        length: 3,
        color: '#888888'
      }
    },

    /**
     * 分割线配置
     */
    separatorLine: {
      display: true,
      size: 1,
      color: '#393939',
      style: LineStyle.DASH,
      dashValue: [2, 2]
    }
  },
  tooltip: {
    /**
     * 光标线配置
     */
    cross: {
      display: true,
      line: {
        style: LineStyle.DASH,
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        horizontal: {
          color: '#D9D9D9',
          size: 12,
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 2,
          paddingBottom: 2,
          borderSize: 1,
          borderColor: '#505050',
          backgroundColor: '#505050'
        },
        vertical: {
          color: '#D9D9D9',
          size: 12,
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

    /**
     * 数据配置
     */
    data: {
      displayRule: TooltipTextDisplayRule.ALWAYS,
      base: {
        showType: TooltipCandleChartTextDisplayType.FIXED,
        labels: ['时间', '开', '收', '高', '低', '成交量'],
        values: null,
        text: {
          size: 12,
          color: '#D9D9D9',
          marginLeft: 8,
          marginTop: 6,
          marginRight: 8,
          marginBottom: 0
        },
        floatRect: {
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
        }
      },
      indicator: {
        text: {
          size: 12,
          color: '#D9D9D9',
          marginTop: 6,
          marginRight: 8,
          marginBottom: 0,
          marginLeft: 8
        }
      }
    }
  },

  graphicMark: {
    line: {
      color: '#1e88e5',
      size: 1
    },
    point: {
      backgroundColor: '#1e88e5',
      borderColor: '#1e88e5',
      borderSize: 1,
      radius: 4,
      activeBackgroundColor: '#1e88e5',
      activeBorderColor: '#1e88e5',
      activeBorderSize: 1,
      activeRadius: 6
    },
    text: {
      color: '#1e88e5',
      size: 12,
      marginLeft: 2,
      marginRight: 2,
      marginTop: 2,
      marginBottom: 6,
      valueFormatter: null
    }
  }
}
