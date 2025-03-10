```javascript
const styles = {
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
    // 'candle_solid' | 'candle_stroke' | 'candle_up_stroke' | 'candle_down_stroke' | 'ohlc' | 'area'
    type: 'candle_solid',
    bar: {
      // 'current_open' | 'previous_close'
      compareRule: 'current_open',
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
      smooth: false,
      value: 'close',
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
        // 'current_open' | 'previous_close'
        compareRule: 'current_open',
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
    tooltip: {
      offsetLeft: 4,
      offsetTop: 6,
      offsetRight: 4,
      offsetBottom: 6,
      // 'always' | 'follow_cross' | 'none'
      showRule: 'always',
      // 'standard' | 'rect'
      showType: 'standard',
      // e.g.
      // [{ title: 'time', value: '{time}' }, { title: 'close', value: '{close}' }]
      // [{ title: { text: 'time', color: '#fff' }, value: { text: '{time}', color: '#fff' } }, { title: 'close', value: '{close}' }]
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
      // e.g.
      // [{
      //    id: 'icon_id',
      //    position: 'left', // 'left', 'middle', 'right'
      //    marginLeft: 8,
      //    marginTop: 6,
      //    marginRight: 0,
      //    marginBottom: 0,
      //    paddingLeft: 1,
      //    paddingTop: 1,
      //    paddingRight: 1,
      //    paddingBottom: 1,
      //    size: 12,
      //    color: '#76808F',
      //    activeColor: '#76808F',
      //    backgroundColor: 'rgba(33, 150, 243, 0.2)',
      //    activeBackgroundColor: 'rgba(33, 150, 243, 0.4)',
      //    type: 'path', // 'path', 'iconFont'
      //    path: {
      //      style: 'stroke', // 'stroke', 'fill'
      //      path: 'M6.81029,6.02908L11.7878,1.02746C12.0193,0.79483,12.0193,0.445881,11.7878,0.213247C11.5563,-0.019386,11.209,-0.019386,10.9775,0.213247L6,5.21486L1.02251,0.174475C0.790997,-0.0581583,0.44373,-0.0581583,0.212219,0.174475C-0.0192925,0.407108,-0.0192925,0.756058,0.212219,0.988691L5.18971,6.02908L0.173633,11.0307C-0.0578778,11.2633,-0.0578778,11.6123,0.173633,11.8449C0.289389,11.9612,0.44373,12,0.598071,12C0.752411,12,0.906752,11.9612,1.02251,11.8449L6,6.8433L10.9775,11.8449C11.0932,11.9612,11.2476,12,11.4019,12C11.5563,12,11.7106,11.9612,11.8264,11.8449C12.0579,11.6123,12.0579,11.2633,11.8264,11.0307L6.81029,6.02908Z',
      //      lineWidth: 1,
      //    },
      //    iconFont: {
      //      content: '\ue900',
      //      family: 'iconfont'
      //    }
      // }]
      features: []
    }
  },
  indicator: {
    ohlc: {
      // 'current_open' | 'previous_close'
      compareRule: 'current_open',
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
      // e.g.
      // [{
      //    id: 'icon_id',
      //    position: 'left', // 'left', 'middle', 'right'
      //    marginLeft: 8,
      //    marginTop: 6,
      //    marginRight: 0,
      //    marginBottom: 0,
      //    paddingLeft: 1,
      //    paddingTop: 1,
      //    paddingRight: 1,
      //    paddingBottom: 1,
      //    size: 12,
      //    color: '#76808F',
      //    activeColor: '#76808F',
      //    backgroundColor: 'rgba(33, 150, 243, 0.2)',
      //    activeBackgroundColor: 'rgba(33, 150, 243, 0.4)',
      //    type: 'path', // 'path', 'iconFont'
      //    path: {
      //      style: 'stroke', // 'stroke', 'fill'
      //      path: 'M6.81029,6.02908L11.7878,1.02746C12.0193,0.79483,12.0193,0.445881,11.7878,0.213247C11.5563,-0.019386,11.209,-0.019386,10.9775,0.213247L6,5.21486L1.02251,0.174475C0.790997,-0.0581583,0.44373,-0.0581583,0.212219,0.174475C-0.0192925,0.407108,-0.0192925,0.756058,0.212219,0.988691L5.18971,6.02908L0.173633,11.0307C-0.0578778,11.2633,-0.0578778,11.6123,0.173633,11.8449C0.289389,11.9612,0.44373,12,0.598071,12C0.752411,12,0.906752,11.9612,1.02251,11.8449L6,6.8433L10.9775,11.8449C11.0932,11.9612,11.2476,12,11.4019,12C11.5563,12,11.7106,11.9612,11.8264,11.8449C12.0579,11.6123,12.0579,11.2633,11.8264,11.0307L6.81029,6.02908Z',
      //      lineWidth: 1,
      //    },
      //    iconFont: {
      //      content: '\ue900',
      //      family: 'iconfont'
      //    }
      // }]
      features: []
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
      marginStart: 4,
      marginEnd: 4
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
      marginStart: 4,
      marginEnd: 4
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
        // 'solid' | 'dashed'
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
      backgroundColor: '#1677FF'
    }
  }
}
```