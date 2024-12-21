# 🎨 样式配置
图表上看到的不管是点还是线，基本都可以自定义样式。可以通过图表方法`init(ds, options)`或者图表实例方法`setStyles(styles)`进行更改。


## 图解说明
<script setup>
import StyleExplain from '../@views/styles/Explain.vue'
</script>
<StyleExplain/>

## 配置查看

### 网格线 grid

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
  // ...
}
```

### 蜡烛图 candle

```javascript
{
  // 蜡烛图
  candle: {
    // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
    type: 'candle_solid',
    // 蜡烛柱
    bar: {
      upColor: '#2DC08E',
      downColor: '#F92855',
      noChangeColor: '#888888',
      upBorderColor: '#2DC08E',
      downBorderColor: '#F92855',
      noChangeBorderColor: '#888888',
      upWickColor: '#2DC08E',
      downWickColor: '#F92855',
      noChangeWickColor: '#888888'
    },
    // 面积图
    area: {
      lineSize: 2,
      lineColor: '#2196F3',
      value: 'close',
      smooth: false,
      backgroundColor: [{
        offset: 0,
        color: 'rgba(33, 150, 243, 0.01)'
      }, {
        offset: 1,
        color: 'rgba(33, 150, 243, 0.2)'
      }],
      point: {
        show: true,
        color: blue,
        radius: 4,
        rippleColor: getAlphaBlue(0.3),
        rippleRadius: 8,
        animation: true,
        animationDuration: 1000
      }
    },
    priceMark: {
      show: true,
      // 最高价标记
      high: {
        show: true,
        color: '#D9D9D9',
        textOffset: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      // 最低价标记
      low: {
        show: true,
        color: '#D9D9D9',
        textOffset: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal',
      },
      // 最新价标记
      last: {
        show: true,
        upColor: '#2DC08E',
        downColor: '#F92855',
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
          borderSize: 0,
          borderColor: 'transparent',
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
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
      // 自定义显示，可以是回调方法也可以是数组，当是一个方法时，需要返回一个数组
      // 数组的子项类型为 { title, value }
      // title和value可以是字符串或者对象，对象类型为 { text, color }
      // title 或者 title.text 可以是国际化的 key，
      // value 或者 value.text 支持字符串模版
      // 例如：想显示时间，开盘和收盘，配置[{ title: 'time', value: '{time}' }, { title: 'open', value: '{open}' }, { title: 'close', value: '{close}' }]
      custom: [
        { title: 'time', value: '{time}' },
        { title: 'open', value: '{open}' },
        { title: 'high', value: '{high}' },
        { title: 'low', value: '{low}' },
        { title: 'close', value: '{close}' },
        { title: 'volume', value: '{volume}' }
      ],
      defaultValue: 'n/a',
      rect: {
        // 'fixed' | 'pointer'
        position: 'fixed',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        offsetLeft: 4,
        offsetTop: 4,
        offsetRight: 4,
        offsetBottom: 4,
        borderRadius: 4,
        borderSize: 1,
        borderColor: '#f2f3f5',
        color: '#FEFEFE'
      },
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginLeft: 8,
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4
      },
      // 示例：
      // [{
      //   id: 'icon_id',
      //   position: 'left', // 类型有'left'，'middle'，'right'
      //   marginLeft: 8,
      //   marginTop: 6,
      //   marginRight: 0,
      //   marginBottom: 0,
      //   paddingLeft: 1,
      //   paddingTop: 1,
      //   paddingRight: 1,
      //   paddingBottom: 1,
      //   icon: '\ue900',
      //   fontFamily: 'iconfont',
      //   size: 12,
      //   color: '#76808F',
      //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
      //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
      // }]
      icons: []
    }
  },
  // ...
}
```

### 技术指标 indicator

```javascript
{
  // 技术指标
  indicator: {
    ohlc: {
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    },
    bars: [{
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
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
        color: '#935EBD'
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
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
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
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
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
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4,
        marginLeft: 8
      },
      // 示例：
      // [{
      //   id: 'icon_id',
      //   position: 'left', // 类型有'left'，'middle'，'right'
      //   marginLeft: 8,
      //   marginTop: 6,
      //   marginRight: 0,
      //   marginBottom: 0,
      //   paddingLeft: 1,
      //   paddingTop: 1,
      //   paddingRight: 1,
      //   paddingBottom: 1,
      //   icon: '\ue900',
      //   fontFamily: 'iconfont',
      //   size: 12,
      //   color: '#76808F',
      //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
      //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
      // }]
      icons: []
    }
  },
  // ...
}
```

### xAxis

```javascript
{
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
      marginStart: 4,
      marginEnd: 4
    },
    // x轴分割线
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  // ...
}
```

### yAxis

```javascript
{
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
      marginStart: 4,
      marginEnd: 4
    },
    // x轴分割线
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  // ...
}
```

### 图表之间的分割线 separator

```javascript
{
  // 图表之间的分割线
  separator: {
    size: 1,
    color: '#888888',
    fill: true,
    activeBackgroundColor: 'rgba(230, 230, 230, .15)'
  },
  // ...
}
```

### 十字光标 crosshair

```javascript
{
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
  // ...
}
```

### 覆盖物 overlay 

```javascript
{
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
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2],
      borderSize: 0,
      borderRadius: 2,
      borderColor: '#1677FF',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: 'transparent'
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

## 默认完整配置

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
      upColor: '#2DC08E',
      downColor: '#F92855',
      noChangeColor: '#888888',
      upBorderColor: '#2DC08E',
      downBorderColor: '#F92855',
      noChangeBorderColor: '#888888',
      upWickColor: '#2DC08E',
      downWickColor: '#F92855',
      noChangeWickColor: '#888888'
    },
    // 面积图
    area: {
      lineSize: 2,
      lineColor: '#2196F3',
      value: 'close',
      smooth: false,
      backgroundColor: [{
        offset: 0,
        color: 'rgba(33, 150, 243, 0.01)'
      }, {
        offset: 1,
        color: 'rgba(33, 150, 243, 0.2)'
      }],
      point: {
        show: true,
        color: blue,
        radius: 4,
        rippleColor: getAlphaBlue(0.3),
        rippleRadius: 8,
        animation: true,
        animationDuration: 1000
      }
    },
    priceMark: {
      show: true,
      // 最高价标记
      high: {
        show: true,
        color: '#D9D9D9',
        textOffset: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      // 最低价标记
      low: {
        show: true,
        color: '#D9D9D9',
        textOffset: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal',
      },
      // 最新价标记
      last: {
        show: true,
        upColor: '#2DC08E',
        downColor: '#F92855',
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
          borderSize: 0,
          borderColor: 'transparent',
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
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
      // 自定义显示，可以是回调方法也可以是数组，当是一个方法时，需要返回一个数组
      // 数组的子项类型为 { title, value }
      // title和value可以是字符串或者对象，对象类型为 { text, color }
      // title 或者 title.text 可以是国际化的 key，
      // value 或者 value.text 支持字符串模版
      // 例如：想显示时间，开盘和收盘，配置[{ title: 'time', value: '{time}' }, { title: 'open', value: '{open}' }, { title: 'close', value: '{close}' }]
      custom: [
        { title: 'time', value: '{time}' },
        { title: 'open', value: '{open}' },
        { title: 'high', value: '{high}' },
        { title: 'low', value: '{low}' },
        { title: 'close', value: '{close}' },
        { title: 'volume', value: '{volume}' }
      ],
      defaultValue: 'n/a',
      rect: {
        // 'fixed' | 'pointer'
        position: 'fixed',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        offsetLeft: 4,
        offsetTop: 4,
        offsetRight: 4,
        offsetBottom: 4,
        borderRadius: 4,
        borderSize: 1,
        borderColor: '#f2f3f5',
        color: '#FEFEFE'
      },
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: '#D9D9D9',
        marginLeft: 8,
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4
      },
      // 示例：
      // [{
      //   id: 'icon_id',
      //   position: 'left', // 类型有'left'，'middle'，'right'
      //   marginLeft: 8,
      //   marginTop: 6,
      //   marginRight: 0,
      //   marginBottom: 0,
      //   paddingLeft: 1,
      //   paddingTop: 1,
      //   paddingRight: 1,
      //   paddingBottom: 1,
      //   icon: '\ue900',
      //   fontFamily: 'iconfont',
      //   size: 12,
      //   color: '#76808F',
      //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
      //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
      // }]
      icons: []
    }
  },
  // 技术指标
  indicator: {
    ohlc: {
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    },
    bars: [{
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
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
        color: '#935EBD'
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
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
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
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
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
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4,
        marginLeft: 8
      },
      // 示例：
      // [{
      //   id: 'icon_id',
      //   position: 'left', // 类型有'left'，'middle'，'right'
      //   marginLeft: 8,
      //   marginTop: 6,
      //   marginRight: 0,
      //   marginBottom: 0,
      //   paddingLeft: 1,
      //   paddingTop: 1,
      //   paddingRight: 1,
      //   paddingBottom: 1,
      //   icon: '\ue900',
      //   fontFamily: 'iconfont',
      //   size: 12,
      //   color: '#76808F',
      //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
      //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
      // }]
      icons: []
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
      marginStart: 4,
      marginEnd: 4
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
      marginStart: 4,
      marginEnd: 4
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
      // 'fill' | 'stroke' | 'stroke_fill'
      style: 'fill',
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      // 'solid' | 'dashed'
      borderStyle: 'solid',
      borderDashedValue: [2, 2],
      borderSize: 0,
      borderRadius: 2,
      borderColor: '#1677FF',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: 'transparent'
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


