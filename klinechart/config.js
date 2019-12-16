export function get () {
  return {
    grid: false,
    candle: {
      /**
       * 图类型
       */
      chartType: 'candle',

      /**
       * 分时图配置
       */
      timeChart: {
        /**
         * 分时
         */
        timeLine: {
          color: '#D4D4D4',
          size: 1,
          areaFillColor: '#FAFAFA'
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

      /**
       * 蜡烛图配置
       */
      candleChart: {
        /**
         * 蜡烛图样式
         */
        candleStyle: 'solid',
        /**
         * 上涨颜色
         */
        increasingColor: '#5DB300',
        /**
         * 下跌颜色
         */
        decreasingColor: '#FF4A4A',

        /**
         * 最大价格标记参数
         */
        highestPriceMark: {
          display: true,
          color: '#898989',
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
          color: '#898989',
          text: {
            margin: 5,
            size: 10,
            valueFormatter: null
          }
        }
      },

      /**
       * 最新价标记参数
       */
      lastPriceMark: {
        display: true,
        increasingColor: '#5DB300',
        decreasingColor: '#FF4A4A',
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
      }
    },
    indicator: {
      /**
       * 线的尺寸
       */
      lineSize: 1,
      increasingColor: '#5DB300',
      decreasingColor: '#FF4A4A',
      lineColors: ['#898989', '#F5A623', '#F601FF', '#1587DD', '#50A300']
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
        color: '#AFAFAF',
        size: 1
      },

      /**
       * 分割配置
       */
      tick: {
        // 文字
        text: {
          display: true,
          color: '#AFAFAF',
          size: 12,
          margin: 3,
          valueFormatter: null
        },
        // 线
        line: {
          display: true,
          size: 1,
          length: 3,
          color: '#AFAFAF'
        }
      },

      /**
       * 分割线配置
       */
      separatorLine: {
        display: false,
        size: 1,
        color: '#B8B8B8',
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
      maxWidth: 60,

      /**
       * y轴最小宽度
       */
      minWidth: 40,
      /**
       * 轴线配置
       */
      line: {
        display: true,
        color: '#AFAFAF',
        size: 1
      },

      /**
       * 分割配置
       */
      tick: {
        // 文字
        text: {
          display: true,
          position: 'inside',
          color: '#AFAFAF',
          size: 12,
          margin: 3,
          valueFormatter: null
        },
        // 线
        line: {
          display: true,
          size: 1,
          length: 3,
          color: '#AFAFAF'
        }
      },

      /**
       * 分割线配置
       */
      separatorLine: {
        display: false,
        size: 1,
        color: '#B8B8B8',
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
          style: 'solid',
          dashValue: [2, 2],
          size: 1,
          color: '#AAAAAA'
        },
        text: {
          horizontal: {
            color: '#EDEDED',
            size: 12,
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
            borderSize: 1,
            borderColor: '#EDEDED',
            backgroundColor: '#505050',
            valueFormatter: null
          },
          vertical: {
            color: '#EDEDED',
            size: 12,
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
            borderSize: 1,
            borderColor: '#EDEDED',
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
            color: '#898989',
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
            borderColor: '#444444',
            fillColor: '#202020'
          }
        },
        indicator: {
          text: {
            size: 12,
            color: '#898989',
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
        color: '#1587DD',
        size: 1
      },
      point: {
        backgroundColor: '#1587DD',
        borderColor: '#1587DD',
        borderSize: 1,
        radius: 4,
        activeBackgroundColor: '#1587DD',
        activeBorderColor: '#1587DD',
        activeBorderSize: 1,
        activeRadius: 6
      },
      text: {
        color: '#1587DD',
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
