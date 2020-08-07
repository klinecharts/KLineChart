export  const priceAndVolumeTrend = {
    name: 'PVTss',
    plots: [
      { key: 'pvt', type: 'line' }
    ],
    calcTechnicalIndicator: (kLineDataList) => {
      const result = []
      let sum = 0
      kLineDataList.forEach((kLineData, i) => {
        // console.log(i)
        const pvt = {}
        if (i > 0) {
          const close = kLineData.close
          const volume = kLineData.volume
          const preClose = kLineDataList[i - 1].close
          let x = 0
          if (preClose !== 0) {
            x = (close - preClose) / preClose * volume
          }
          sum += x
          pvt.pvt = sum
        }
        result.push(pvt)
      })
      return result
    }
  }
  