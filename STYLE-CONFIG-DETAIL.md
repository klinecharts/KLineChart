## Style Configuration Details
```js
config = {
  candle: {
    timeLine: {
      color: '#1e88e5',
      size: 1,
      areaFillColor: 'rgba(30, 136, 229, 0.08)'
    },
    averageLine: {
      display: true,
      color: '#F5A623',
      size: 1
    },
    bar: {
      // 'solid'|'stroke'|'increasing_stroke'|'decreasing_stroke'|'ohlc'
      style: 'solid',
      increasingColor: '#26A69A',
      decreasingColor: '#EF5350',
    },
    highestPriceMark: {
      display: true,
      color: '#D9D9D9',
      text: {
        margin: 5,
        size: 10
        }
    },
    lowestPriceMark: {
      display: true,
      color: '#D9D9D9',
      text: {
        margin: 5,
        size: 10
      }
    },

    lastPriceMark: {
      display: true,
      increasingColor: '#26A69A',
      decreasingColor: '#EF5350',
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
        color: '#FFFFFF'
      }
    }
  },

  indicator: {
    lineSize: 1,
    increasingColor: '#26A69A',
    decreasingColor: '#EF5350',
    lineColors: ['#D9D9D9', '#F5A623', '#F601FF', '#1587DD', '#50A300']
  },
  xAxis: {
    display: true,
    maxHeight: 50,
    minHeight: 30,
    line: {
      display: true,
      color: '#888888',
      size: 1
    },
    tick: {
      text: {
        display: true,
        color: '#D9D9D9',
        size: 12,
        margin: 3
      },
      line: {
        display: true,
        size: 1,
        length: 3,
        color: '#888888'
      }
    },
    separatorLine: {
      display: false,
      size: 1,
      color: '#393939',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [2, 2]
    }
  },
  yAxis: {
    display: true,
    // 'left' | 'right'
    position: 'right',
    maxWidth: 80,
    minWidth: 60,
    line: {
      display: true,
      color: '#888888',
      size: 1
    },
    tick: {
      text: {
        display: true,
        // 'outside' | 'inside
        position: 'outside',
        color: '#D9D9D9',
        size: 12,
        margin: 3
      },
      line: {
        display: true,
        size: 1,
        length: 3,
        color: '#888888'
      }
    },
    separatorLine: {
      display: true,
      size: 1,
      color: '#393939',
      // 'dash' | 'solid'
      style: 'dash',
      dashValue: [2, 2]
    }
  },
  tooltip: {
    cross: {
      display: true,
      line: {
        // 'dash' | 'solid'
        style: 'solid',
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
    data: {
      // 'always'|'follow_cross'|'none'
      displayRule: 'always',
      base: {
        // 'fixed' | 'float'
        showType: 'fixed',
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
          marginLeft: 8,
          marginTop: 6,
          marginRight: 8,
          marginBottom: 0
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
      marginBottom: 6
    }
  }
}
```
