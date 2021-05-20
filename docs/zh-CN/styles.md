# 样式说明

```javascript
{
  // 网格线
  grid: {
    show: true,
    // 网格水平线
    horizontal: {
      show: true,
      size: 1,
      color: '#393939',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [2, 2]
    },
   	// 网格垂直线
    vertical: {
      show: false,
      size: 1,
      color: '#393939',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [2, 2]
    }
  },
  // 蜡烛图
  candle: {
    // 蜡烛图上下间距，大于1为绝对值，大于0小余1则为比例
    margin: {
      top: 0.2,
      bottom: 0.1
    },
    // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
    type: 'candle_solid',
    // 蜡烛柱
    bar: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    },
    // 面积图
    area: {
      lineSize: 2,
      lineColor: '#2196F3',
      value: 'close',
      fillColor: [{
        offset: 0,
        color: 'rgba(33, 150, 243, 0.01)'
      }, {
        offset: 1,
        color: 'rgba(33, 150, 243, 0.2)'
      }]
    },
    priceMark: {
      show: true,
      // 最高价标记
      high: {
        show: true,
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      // 最低价标记
      low: {
        show: true,
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal',
      },
      // 最新价标记
      last: {
        show: true,
        upColor: '#26A69A',
        downColor: '#EF5350',
        noChangeColor: '#888888',
        line: {
          show: true,
          // 'solid'|'dash'
          style: 'dash',
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
          weight: 'normal'
        }
      }
    },
    // 提示
    tooltip: {
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
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
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginLeft: 8,
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0
      }
    }
  },
  // 技术指标
  technicalIndicator: {
    margin: {
      top: 0.2,
      bottom: 0.1
    },
    bar: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    },
    line: {
      size: 1,
      colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
    },
    circle: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    },
    // 最新值标记
    lastValueMark: {
      show: false,
      text: {
        show: false,
        color: '#ffffff',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        paddingLeft: 3,
        paddingTop: 2,
        paddingRight: 3,
        paddingBottom: 2
      }
    },
    // 提示
    tooltip: {
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
      showName: true,
      showParams: true,
      defaultValue: 'n/a',
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0,
        marginLeft: 8
      }
    }
  },
  // x轴
  xAxis: {
    show: true,
    height: null,
    // x轴线
    axisLine: {
      show: true,
      color: '#888888',
      size: 1
    },
    // x轴分割文字
    tickText: {
      show: true,
      color: '#D9D9D9',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      paddingTop: 3,
      paddingBottom: 6
    },
    // x轴分割线
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  // y轴
  yAxis: {
    show: true,
    width: null,
    // 'left' | 'right'
    position: 'right',
    // 'normal' | 'percentage'
    type: 'normal',
    inside: false,
    // y轴线
    axisLine: {
      show: true,
      color: '#888888',
      size: 1
    },
    // x轴分割文字
    tickText: {
      show: true,
      color: '#D9D9D9',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      paddingLeft: 3,
      paddingRight: 6
    },
    // x轴分割线
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  // 图表之间的分割线
  separator: {
    size: 1,
    color: '#888888',
    fill: true,
    activeBackgroundColor: 'rgba(230, 230, 230, .15)'
  },
  // 十字光标
  crosshair: {
    show: true,
    // 十字光标水平线及文字
    horizontal: {
      show: true,
      line: {
        show: true,
        // 'solid'|'dash'
        style: 'dash',
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
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
    // 十字光标垂直线及文字
    vertical: {
      show: true,
      line: {
        show: true,
        // 'solid'|'dash'
        style: 'dash',
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
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
  // 图形标记
  graphicMark: {
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
    polygon: {
      stroke: {
        size: 1,
        color: '#2196F3'
      },
      fill: {
        color: 'rgba(33, 150, 243, 0.1)'
      }
    },
    arc: {
      stroke: {
        size: 1,
        color: '#2196F3'
      },
      fill: {
        color: 'rgba(33, 150, 243, 0.1)'
      }
    },
    text: {
      color: '#2196F3',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      marginLeft: 2,
      marginRight: 2,
      marginTop: 2,
      marginBottom: 6
    }
  },
  annotation: {
    symbol: {
      // 'diamond' | 'circle' | 'rect' | 'triangle' | 'custom' | 'none'
      type: 'diamond',
      // 'top' | 'bottom' | 'point'
      position: 'top',
      size: 8,
      color: '#1e88e5',
      activeSize: 10,
      activeColor: '#FF9600',
      offset: [0, 20]
    }
  }
}
```


