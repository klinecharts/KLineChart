
function getData (baseTimestamp = Date.now(), basePrice = 5000, dataSize = 800) {
    const dataList = []
    let timestamp = Math.floor(baseTimestamp / 60 / 1000) * 60 * 1000
    let baseValue = basePrice
    const prices = []
    for (let i = 0; i < dataSize; i++) {
      baseValue = baseValue + Math.random() * 20 - 10
      for (let j = 0; j < 4; j++) {
        prices[j] = (Math.random() - 0.5) * 12 + baseValue
      }
      prices.sort()
      const openIdx = +Math.round(Math.random() * 3).toFixed(0)
      let closeIdx = +Math.round(Math.random() * 2).toFixed(0)
      if (closeIdx === openIdx) {
        closeIdx++
      }
      const volume = Math.random() * 50 + 10
      timestamp -= 60 * 1000
      const kLineModel = {
        open: prices[openIdx],
        low: prices[0],
        high: prices[3],
        close: prices[closeIdx],
        volume: volume,
        timestamp
      }
      kLineModel.turnover = (kLineModel.open + kLineModel.close + kLineModel.high + kLineModel.low) / 4 * volume
      dataList.unshift(kLineModel)
    }
    return dataList
  }