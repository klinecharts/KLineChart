import {
  IndicatorType, LineStyle, CandleStyle, YAxisTextPosition, YAxisPosition,
  TooltipMainChartTextDisplayType, TooltipTextDisplayRule
} from './constants'
/**
 * 默认的样式配置
 * @returns {{realTime: {timeLine: {areaFillColor: string, color: string, size: number}, averageLine: {color: string, size: number, display: boolean}}, indicator: {decreasingColor: string, lineColors: [string, string, string, string, string], increasingColor: string, lineSize: number}, yAxis: {line: {color: string, size: number, display: boolean}, display: boolean, minWidth: number, position: string, tick: {line: {size: number, color: string, display: boolean, length: number}, text: {margin: number, color: string, size: number, display: boolean, valueFormatter: null, position: string}}, separatorLine: {size: number, color: string, dashValue: number[], display: boolean, style: string}, maxWidth: number}, lowestPriceMark: {color: string, display: boolean, text: {margin: number, size: number, valueFormatter: null}}, xAxis: {minHeight: number, maxHeight: number, line: {color: string, size: number, display: boolean}, display: boolean, tick: {line: {size: number, color: string, display: boolean, length: number}, text: {margin: number, color: string, size: number, display: boolean, valueFormatter: null}}, separatorLine: {size: number, color: string, dashValue: number[], display: boolean, style: string}}, lastPriceMark: {decreasingColor: string, line: {dashValue: number[], size: number, display: boolean, style: string}, display: boolean, increasingColor: string, text: {paddingBottom: number, size: number, color: string, display: boolean, paddingRight: number, valueFormatter: null, paddingTop: number, paddingLeft: number}}, grid: boolean, marker: {line: {color: string, size: number}, text: {marginRight: number, color: string, size: number, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}, point: {backgroundColor: string, borderColor: string, activeBorderSize: number, activeRadius: number, activeBorderColor: string, activeBackgroundColor: string, borderSize: number, radius: number}}, candle: {decreasingColor: string, style: string, increasingColor: string}, tooltip: {data: {indicator: {text: {marginRight: number, size: number, color: string, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}}, displayRule: string, base: {floatRect: {fillColor: string, borderColor: string, paddingBottom: number, top: number, borderRadius: number, left: number, paddingRight: number, borderSize: number, paddingTop: number, right: number, paddingLeft: number}, values: null, showType: string, text: {marginRight: number, size: number, color: string, valueFormatter: null, marginBottom: number, marginTop: number, marginLeft: number}, labels: string[]}}, cross: {line: {dashValue: number[], size: number, color: string, style: string}, display: boolean, text: {horizontal: {borderColor: string, backgroundColor: string, paddingBottom: number, color: string, size: number, paddingRight: number, valueFormatter: null, borderSize: number, paddingTop: number, paddingLeft: number}, vertical: {borderColor: string, backgroundColor: string, paddingBottom: number, color: string, size: number, paddingRight: number, valueFormatter: null, borderSize: number, paddingTop: number, paddingLeft: number}}}}, highestPriceMark: {color: string, display: boolean, text: {margin: number, size: number, valueFormatter: null}}}}
 */
export function getDefaultStyle () {
  return {
    grid: false,
    realTime: {
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
      }
    },

    candle: {
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
          showType: TooltipMainChartTextDisplayType.FIXED,
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

    marker: {
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
}

/**
 * 默认的指标参数配置
 */
export function getDefaultIndicatorParams () {
  return {
    [IndicatorType.MA]: [5, 10, 30, 60],
    [IndicatorType.VOL]: [5, 10, 20],
    [IndicatorType.MACD]: [12, 26, 9],
    [IndicatorType.BOLL]: [20],
    [IndicatorType.KDJ]: [9, 3, 3],
    [IndicatorType.RSI]: [6, 12, 24],
    [IndicatorType.BIAS]: [6, 12, 24],
    [IndicatorType.BRAR]: [26],
    [IndicatorType.CCI]: [13],
    [IndicatorType.DMI]: [14, 6],
    [IndicatorType.CR]: [26, 10, 20, 40, 60],
    [IndicatorType.PSY]: [12],
    [IndicatorType.DMA]: [10, 50, 10],
    [IndicatorType.TRIX]: [12, 20],
    [IndicatorType.OBV]: [30],
    [IndicatorType.VR]: [24, 30],
    [IndicatorType.WR]: [13, 34, 89],
    [IndicatorType.MTM]: [6, 10],
    [IndicatorType.EMV]: [14, 9],
    [IndicatorType.SAR]: [2, 2, 20]
  }
}

/**
 * 获取价格精度配置
 * @returns {{pricePrecision: number, volumePrecision: number}}
 */
export function getDefaultPrecision () {
  return {
    pricePrecision: 2,
    volumePrecision: 0
  }
}

/**
 * 获取指标精度
 * @param pricePrecision
 * @param volumePrecision
 * @returns {{[p: string]: *|number}}
 */
export function getIndicatorPrecision (pricePrecision, volumePrecision) {
  return {
    [IndicatorType.NO]: pricePrecision,
    [IndicatorType.MA]: pricePrecision,
    [IndicatorType.VOL]: volumePrecision,
    [IndicatorType.MACD]: 2,
    [IndicatorType.BOLL]: pricePrecision,
    [IndicatorType.KDJ]: 2,
    [IndicatorType.RSI]: 2,
    [IndicatorType.BIAS]: 2,
    [IndicatorType.BRAR]: 4,
    [IndicatorType.CCI]: 4,
    [IndicatorType.DMI]: 4,
    [IndicatorType.CR]: 2,
    [IndicatorType.PSY]: 2,
    [IndicatorType.DMA]: 4,
    [IndicatorType.TRIX]: 4,
    [IndicatorType.OBV]: 4,
    [IndicatorType.VR]: 4,
    [IndicatorType.WR]: 4,
    [IndicatorType.MTM]: 4,
    [IndicatorType.EMV]: 4,
    [IndicatorType.SAR]: pricePrecision
  }
}
