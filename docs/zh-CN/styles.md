# 🎨 样式配置
图表上看到的不管是点还是线，基本都可以自定义样式。可以通过图表方法`init(ds, options)`或者图表实例方法`setStyles(styles)`进行更改。

```javascript
{
  // 网格线
  grid: {
    show: true,
    horizontal: {
      show: true,
      size: 1,
      color: '#EDEDED',
      style: 'dashed',
      dashedValue: [2, 2]
    },
    vertical: {
      show: true,
      size: 1,
      color: '#EDEDED',
      style: 'dashed',
      dashedValue: [2, 2]
    }
  },
  // 蜡烛图
  candle: {
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
          // 'solid' | 'dashed'
          style: 'dashed',
          dashedValue: [4, 4],
          size: 1
        },
        text: {
          show: true,
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          size: 12,
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4,
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderSize: 1,
          borderDashedValue: [2, 2],
          color: '#FFFFFF',
          family: 'Helvetica Neue',
          weight: 'normal',
          borderRadius: 2
        }
      }
    },
    // 提示
    tooltip: {
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
      // 显示回调方法，返回数据格式类型需要时一个数组
      // 数组的子项类型为 { title, value }
      // title和value可以是字符串或者对象，对象类型为 { text, color }
      custom: null
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
        backgroundColor: 'rgba(17, 17, 17, .3)'
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
  indicator: {
    ohlc: {
      upColor: 'rgba(38, 166, 154, .65)',
      downColor: 'rgba(239, 83, 80, .65)',
      noChangeColor: '#888888'
    },
    bars: [{
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(38, 166, 154, .65)',
      downColor: 'rgba(239, 83, 80, .65)',
      noChangeColor: '#888888'
    }],
    lines: [
      {
        // 'solid' | 'dashed'
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#FF9600'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#9D65C9'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#2196F3'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#E11D74'
      }, {
        style: 'solid',
        smooth: false,
        size: 1,
        dashedValue: [2, 2],
        color: '#01C5C4'
      }
    ],
    circles: [{
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(38, 166, 154, .65)',
      downColor: 'rgba(239, 83, 80, .65)',
      noChangeColor: '#888888'
    }],
    // 最新值标记
    lastValueMark: {
      show: false,
      text: {
        show: false,
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderSize: 1,
        borderDashedValue: [2, 2],
        paddingLeft: 4,
        paddingTop: 4,
        paddingRight: 4,
        paddingBottom: 4,
        borderRadius: 2
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
    size: 'auto',
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
      marginStrat: 4,
      marginBottom: 4
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
    size: 'auto',
    // 'left' | 'right'
    position: 'right',
    // 'normal' | 'percentage' | 'log'
    type: 'normal',
    inside: false,
    reverse: false,
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
      marginStrat: 4,
      marginBottom: 4
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
        // 'solid'|'dashed'
        style: 'dashed',
        dashedValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderColor: '#686D76',
        borderRadius: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#686D76'
      }
    },
    // 十字光标垂直线及文字
    vertical: {
      show: true,
      line: {
        show: true,
        // 'solid'|'dashed'
        style: 'dashed',
        dashedValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        // 'fill' | 'stroke' | 'stroke_fill'
        style: 'fill',
        color: '#FFFFFF',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        // 'solid' | 'dashed'
        borderStyle: 'solid',
        borderDashedValue: [2, 2],
        borderSize: 1,
        borderColor: '#686D76',
        borderRadius: 2,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#686D76'
      }
    }
  },
  // 覆盖物
  overlay: {
    point: {
      color: '#1677FF',
      borderColor: 'rgba(22, 119, 255, 0.35)',
      borderSize: 1,
      radius: 5,
      activeColor: '#1677FF',
      activeBorderColor: 'rgba(22, 119, 255, 0.35)',
      activeBorderSize: 3,
      activeRadius: 5
    },
    line: {
      // 'solid' | 'dashed'
      style: 'solid',
      smooth: false,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    rect: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderRadius: 0,
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2]
    },
    polygon: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: '#1677FF',
      borderColor: '#1677FF',
      borderSize: 1,
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2]
    },
    circle: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2]
    },
    arc: {
      // 'solid' | 'dashed'
      style: 'solid',
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    text: {
      color: '#1677FF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal'
    },
    rectText: {
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2],
      borderSize: 1,
      borderRadius: 2,
      borderColor: '#1677FF',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 4,
      paddingBottom: 4,
      backgroundColor: '#1677FF'
    }
  }
}
```


