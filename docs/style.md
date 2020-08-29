```js
config = {
  grid: {
    display: true,
    horizontal: {
      display: true,
      size: 1,
      color: '#393939',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [2, 2]
    },
    vertical: {
      display: false,
      size: 1,
      color: '#393939',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [2, 2]
    }
  },
  candleStick: {
    bar: {
      // 'solid'|'stroke'|'up_stroke'|'down_stroke'|'ohlc'
      style: 'solid',
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    },
    priceMark: {
      display: true,
      high: {
        display: true,
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      low: {
        display: true,
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal',
      },
      last: {
        display: true,
        upColor: '#26A69A',
        downColor: '#EF5350',
        noChangeColor: '#888888',
        line: {
          display: true,
          // 'solid'|'dash'
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
          family: 'Helvetica Neue',
          weight: 'normal'
        }
      }
    }
  },
  realTime: {
    timeLine: {
      color: '#1e88e5',
      size: 1,
      areaFillColor: 'rgba(30, 136, 229, 0.08)'
    },
    averageLine: {
      display: true,
      color: '#FF9600',
      size: 1
    }
  },
  technicalIndicator: {
    bar: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    },
    line: {
      size: 1,
      colors: ['#D9D9D9', '#FF9600', '#F632FF', '#2196F3', '#9157DB']
    },
    circle: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    },
    lastValueMark: {
      display: false,
      textColor: '#ffffff',
      textSize: 12,
      textFamily: 'Helvetica Neue',
      textWeight: 'normal',
      textPaddingLeft: 3,
      textPaddingTop: 2,
      textPaddingRight: 3,
      textPaddingBottom: 2
    }
  },
  xAxis: {
    display: true,
    height: null,
    axisLine: {
      display: true,
      color: '#888888',
      size: 1
    },
    tickText: {
      display: true,
      color: '#D9D9D9',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      paddingTop: 3,
      paddingBottom: 6
    },
    tickLine: {
      display: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  yAxis: {
    display: true,
    width: null,
    // 'left' | 'right'
    position: 'right',
    // 'normal' | 'percentage'
    type: 'normal',
    inside: false,
    axisLine: {
      display: true,
      color: '#888888',
      size: 1
    },
    tickText: {
      display: true,
      color: '#D9D9D9',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      paddingLeft: 3,
      paddingRight: 6
    },
    tickLine: {
      display: true,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  separator: {
    size: 1,
    color: '#888888',
    fill: true
  },
  floatLayer: {
    crossHair: {
      display: true,
      horizontal: {
        display: true,
        line: {
          display: true,
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [4, 2],
          size: 1,
          color: '#888888'
        },
        text: {
          display: true,
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
      vertical: {
        display: true,
        line: {
          display: true,
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [4, 2],
          size: 1,
          color: '#888888'
        },
        text: {
          display: true,
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
    prompt: {
      // 'always' | 'follow_cross' | 'none'
      displayRule: 'always',
      candleStick: {
        // 'standard' | 'rect'
        showType: 'standard',
        labels: ['时间', '开', '收', '高', '低', '成交量'],
        values: null,
        rect: {
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
        },
        text: {
          size: 12,
          color: '#D9D9D9',
          family: 'Helvetica Neue',
          weight: 'normal',
          marginLeft: 8,
          marginTop: 6,
          marginRight: 8,
          marginBottom: 0
        }
      },
      technicalIndicator: {
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
    }
  },
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
  }
}
```
