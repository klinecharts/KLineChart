# 🎨 Style
Whether you see a point or a line on the chart, you can basically customize the style. Changes can be made via the chart method `init(ds, options)` or the chart instance method `setStyles(styles)`.

## Picture explanation
[![Styles](/images/style.jpg)](/images/style.jpg)
<div
  style="display:flex;flex-direction:row;align-items:center;flex-wrap:wrap;">
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      1
    </strong>
    &nbsp;grid.horizontal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      2
    </strong>
    &nbsp;grid.vertical&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      3
    </strong>
    &nbsp;candle.bar&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      4
    </strong>
    &nbsp;candle.candle.priceMark.last.line&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      5
    </strong>
    &nbsp;candle.candle.priceMark.last.text&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      6
    </strong>
    &nbsp;candle.candle.priceMark.high&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      7
    </strong>
    &nbsp;candle.candle.priceMark.low&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      8
    </strong>
    &nbsp;candle.candle.tooltip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      9
    </strong>
    &nbsp;indicator.ohlc&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      10
    </strong>
    &nbsp;indicator.lastValueMark&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      11
    </strong>
    &nbsp;indicator.tooltip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      12
    </strong>
    &nbsp;xAxis.axisLine&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      13
    </strong>
    &nbsp;xAxis.tickLine&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      14
    </strong>
    &nbsp;xAxis.tickText&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      15
    </strong>
    &nbsp;yAxis.axisLine&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      16
    </strong>
    &nbsp;yAxis.tickLine&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      17
    </strong>
    &nbsp;yAxis.tickText&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      18
    </strong>
    &nbsp;separator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      19
    </strong>
    &nbsp;crosshair.horizontal.line&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      20
    </strong>
    &nbsp;crosshair.horizontal.text&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      21
    </strong>
    &nbsp;crosshair.vertical.line&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      22
    </strong>
    &nbsp;crosshair.vertical.text&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>
  <span
    style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <strong align="center"
      style="display:inline-block;width:16px;height:16px;border-radius:8px;background-color:#F01D1D;color:#fff;font-size:12px;line-height:16px">
      23
    </strong>
    &nbsp;overlay
  </span>
</div>


## Default full configuration
```javascript
{
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
  candle: {
    // 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
    type: 'candle_solid',
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
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      low: {
        show: true,
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal',
      },
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
          borderSize: 1,
          borderDashedValue: [2, 2],
          color: '#FFFFFF',
          family: 'Helvetica Neue',
          weight: 'normal',
          borderRadius: 2
        }
      }
    },
    tooltip: {
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
      // Display callback methods, and return an array of data format types when required
      // The subitem type of the array is {title, value}
      // Title and value can be strings or objects, and the object type is {text, color}
      custom: null
      defaultValue: 'n/a',
      rect: {
       // 'fixed' | 'pointer'
        position: 'fixed',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 6,
        offsetLeft: 10,
        offsetTop: 8,
        offsetRight: 10,
        offsetBottom: 8,
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
        marginLeft: 10,
        marginTop: 8,
        marginRight: 6,
        marginBottom: 0
      },
      // sample:
      // [{
      //   id: 'icon_id',
      //   position: 'left', // types include 'left', 'middle', 'right'
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
      upColor: 'rgba(45, 192, 142, .7)',
      downColor: 'rgba(249, 40, 85, .7)',
      noChangeColor: '#888888'
    }],
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
        marginTop: 8,
        marginRight: 6,
        marginBottom: 0,
        marginLeft: 10
      },
      // sample:
      // [{
      //   id: 'icon_id',
      //   position: 'left', // types include 'left', 'middle', 'right'
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
  xAxis: {
    show: true,
    size: 'auto',
    axisLine: {
      show: true,
      color: '#888888',
      size: 1
    },
    tickText: {
      show: true,
      color: '#D9D9D9',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      marginStrat: 4,
      marginBottom: 4
    },
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  yAxis: {
    show: true,
    size: 'auto',
    // 'left' | 'right'
    position: 'right',
    // 'normal' | 'percentage' | 'log'
    type: 'normal',
    inside: false,
    reverse: false,
    axisLine: {
      show: true,
      color: '#888888',
      size: 1
    },
    tickText: {
      show: true,
      color: '#D9D9D9',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      marginStrat: 4,
      marginBottom: 4
    },
    tickLine: {
      show: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  separator: {
    size: 1,
    color: '#888888',
    fill: true,
    activeBackgroundColor: 'rgba(230, 230, 230, .15)'
  },
  crosshair: {
    show: true,
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
