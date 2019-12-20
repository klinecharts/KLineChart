## Configuration Details
```js
config = {
  grid: false,
  realTime: {
    timeLine: {
      color: '#D4D4D4',
      size: 1,
      areaFillColor: '#FAFAFA'
    },
    averageLine: {
      display: true,
      color: '#F5A623',
      size: 1
    }
  },
  candle: {
    // 'solid'|'stroke'|'increasing_stroke'|'decreasing_stroke'|'ohlc'
    style: 'solid',
    increasingColor: '#5DB300',
    decreasingColor: '#FF4A4A',
  },
  highestPriceMark: {
    display: true,
    color: '#898989',
    textSize: 10,
    valueFormatter: null
  },
  lowestPriceMark: {
    display: true,
    color: '#898989',
    textSize: 10,
    valueFormatter: null
  },

  lastPriceMark: {
    display: true,
    increasingColor: '#5DB300',
    decreasingColor: '#FF4A4A',
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
      valueFormatter: null
    }
  },

  indicator: {
    lineSize: 1,
    increasingColor: '#5DB300',
    decreasingColor: '#FF4A4A',
    lineColors: ['#898989', '#F5A623', '#F601FF', '#1587DD', '#50A300']
  },
  xAxis: {
    display: true,
    maxHeight: 20,
    minHeight: 10,
    line: {
      display: true,
      color: '#707070',
      size: 1
    },
    tick: {
      text: {
        display: true,
        color: '#707070',
        size: 12,
        margin: 3,
        valueFormatter: null
      },
      line: {
        display: true,
        size: 1,
        length: 3,
        color: '#707070'
      }
    },
    separatorLine: {
      display: false,
      size: 1,
      color: '#B8B8B8',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [8, 8]
    }
  },
  yAxis: {
    display: true,
    // 'left' | 'right'
    position: 'right',
    maxWidth: 20,
    minWidth: 10,
    line: {
      display: true,
      color: '#707070',
      size: 1
    },
    tick: {
      text: {
        display: true,
        // 'outside' | 'inside
        position: 'outside',
        color: '#707070',
        size: 12,
        margin: 3,
        valueFormatter: null
      },
      line: {
        display: true,
        size: 1,
        length: 3,
        color: '#707070'
      }
    },
    separatorLine: {
      display: false,
      size: 1,
      color: '#B8B8B8',
      // 'dash' | 'solid'
      style: 'dash',
      dashValue: [8, 8]
    }
  },
  tooltip: {
    cross: {
      display: true,
      line: {
        // 'dash' | 'solid'
        style: 'solid',
        dashValue: [8, 8],
        size: 1,
        color: '#505050'
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
          marginLeft: 8,
          marginTop: 6,
          marginRight: 8,
          marginBottom: 0,
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
```
