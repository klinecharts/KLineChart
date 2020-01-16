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
      style: 'solid',
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
        size: 10,
        valueFormatter: null
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
        size: 10,
        valueFormatter: null
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
        style: 'dash',
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
        valueFormatter: null
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
          margin: 3,
          valueFormatter: null
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
        style: 'dash',
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
      position: 'right',

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
          position: 'outside',
          color: '#D9D9D9',
          size: 12,
          margin: 3,
          valueFormatter: null
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
        style: 'dash',
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
          style: 'dash',
          dashValue: [2, 2],
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
            backgroundColor: '#505050',
            valueFormatter: null
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
            backgroundColor: '#505050',
            valueFormatter: null
          }
        }
      },

      /**
       * 数据配置
       */
      data: {
        displayRule: 'always',
        base: {
          showType: 'fixed',
          labels: ['时间', '开', '收', '高', '低', '成交量'],
          values: null,
          text: {
            size: 12,
            color: '#D9D9D9',
            marginLeft: 8,
            marginTop: 6,
            marginRight: 8,
            marginBottom: 0,
            valueFormatter: null
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
            marginLeft: 8,
            valueFormatter: null
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
    MA: [5, 10, 30, 60],
    VOL: [5, 10, 20],
    MACD: [12, 26, 9],
    BOLL: [20],
    KDJ: [9, 3, 3],
    RSI: [6, 12, 24],
    BIAS: [6, 12, 24],
    BRAR: [26],
    CCI: [13],
    DMI: [14, 6],
    CR: [26, 10, 20, 40, 60],
    PSY: [12],
    DMA: [10, 50, 10],
    TRIX: [12, 20],
    OBV: [30],
    VR: [24, 30],
    WR: [13, 34, 89],
    MTM: [6, 10],
    EMV: [14, 9],
    SAR: [2, 2, 20]
  }
}
