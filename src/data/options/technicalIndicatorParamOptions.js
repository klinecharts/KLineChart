export const TechnicalIndicatorType = {
  NO: 'NO',
  AVERAGE: 'AVERAGE',
  MA: 'MA',
  VOL: 'VOL',
  MACD: 'MACD',
  BOLL: 'BOLL',
  KDJ: 'KDJ',
  RSI: 'RSI',
  BIAS: 'BIAS',
  BRAR: 'BRAR',
  CCI: 'CCI',
  DMI: 'DMI',
  CR: 'CR',
  PSY: 'PSY',
  DMA: 'DMA',
  TRIX: 'TRIX',
  OBV: 'OBV',
  VR: 'VR',
  WR: 'WR',
  MTM: 'MTM',
  EMV: 'EMV',
  SAR: 'SAR'
}

export const defaultTechnicalIndicatorParamOptions = {
  [TechnicalIndicatorType.MA]: [5, 10, 30, 60],
  [TechnicalIndicatorType.VOL]: [5, 10, 20],
  [TechnicalIndicatorType.MACD]: [12, 26, 9],
  [TechnicalIndicatorType.BOLL]: [20],
  [TechnicalIndicatorType.KDJ]: [9, 3, 3],
  [TechnicalIndicatorType.RSI]: [6, 12, 24],
  [TechnicalIndicatorType.BIAS]: [6, 12, 24],
  [TechnicalIndicatorType.BRAR]: [26],
  [TechnicalIndicatorType.CCI]: [13],
  [TechnicalIndicatorType.DMI]: [14, 6],
  [TechnicalIndicatorType.CR]: [26, 10, 20, 40, 60],
  [TechnicalIndicatorType.PSY]: [12],
  [TechnicalIndicatorType.DMA]: [10, 50, 10],
  [TechnicalIndicatorType.TRIX]: [12, 20],
  [TechnicalIndicatorType.OBV]: [30],
  [TechnicalIndicatorType.VR]: [24, 30],
  [TechnicalIndicatorType.WR]: [13, 34, 89],
  [TechnicalIndicatorType.MTM]: [6, 10],
  [TechnicalIndicatorType.EMV]: [14, 9],
  [TechnicalIndicatorType.SAR]: [2, 2, 20]
}

/**
 * 获取指标数据的key和value
 * @param kLineData
 * @param technicalIndicatorType
 * @param technicalIndicatorParamOptions
 * @returns {{keys: [], values: []}}
 */
export function getTechnicalIndicatorDataKeysAndValues (kLineData, technicalIndicatorType, technicalIndicatorParamOptions) {
  const technicalIndicatorParams = technicalIndicatorParamOptions[technicalIndicatorType] || []
  const technicalIndicatorData = (kLineData || {})[technicalIndicatorType.toLowerCase()] || {}
  let keys = []
  let values = []
  switch (technicalIndicatorType) {
    case TechnicalIndicatorType.MA: {
      technicalIndicatorParams.forEach(p => {
        const key = `ma${p}`
        keys.push(key)
        values.push(technicalIndicatorData[key])
      })
      break
    }
    case TechnicalIndicatorType.MACD: {
      keys = ['diff', 'dea', 'macd']
      values = [technicalIndicatorData.diff, technicalIndicatorData.dea, technicalIndicatorData.macd]
      break
    }
    case TechnicalIndicatorType.VOL: {
      technicalIndicatorParams.forEach(p => {
        const key = `ma${p}`
        keys.push(key)
        values.push(technicalIndicatorData[key])
      })
      keys.push('num')
      values.push(technicalIndicatorData.num)
      break
    }
    case TechnicalIndicatorType.BOLL: {
      keys = ['up', 'mid', 'dn']
      values = [technicalIndicatorData.up, technicalIndicatorData.mid, technicalIndicatorData.dn]
      break
    }
    case TechnicalIndicatorType.BIAS: {
      technicalIndicatorParams.forEach(p => {
        const key = `bias${p}`
        keys.push(key)
        values.push(technicalIndicatorData[key])
      })
      break
    }
    case TechnicalIndicatorType.BRAR: {
      keys = ['br', 'ar']
      values = [technicalIndicatorData.br, technicalIndicatorData.ar]
      break
    }
    case TechnicalIndicatorType.CCI: {
      keys = ['cci']
      values = [technicalIndicatorData.cci]
      break
    }
    case TechnicalIndicatorType.CR: {
      keys = ['cr', 'ma1', 'ma2', 'ma3', 'ma4']
      values = [technicalIndicatorData.cr, technicalIndicatorData.ma1, technicalIndicatorData.ma2, technicalIndicatorData.ma3, technicalIndicatorData.ma4]
      break
    }
    case TechnicalIndicatorType.DMA: {
      keys = ['dif', 'difMa']
      values = [technicalIndicatorData.dif, technicalIndicatorData.difMa]
      break
    }
    case TechnicalIndicatorType.DMI: {
      keys = ['mdi', 'pdi', 'adx', 'adxr']
      values = [technicalIndicatorData.mdi, technicalIndicatorData.pdi, technicalIndicatorData.adx, technicalIndicatorData.adxr]
      break
    }
    case TechnicalIndicatorType.KDJ: {
      keys = ['k', 'd', 'j']
      values = [technicalIndicatorData.k, technicalIndicatorData.d, technicalIndicatorData.j]
      break
    }
    case TechnicalIndicatorType.RSI: {
      technicalIndicatorParams.forEach(p => {
        const key = `rsi${p}`
        keys.push(key)
        values.push(technicalIndicatorData[key])
      })
      break
    }
    case TechnicalIndicatorType.PSY: {
      keys = ['psy']
      values = [technicalIndicatorData.psy]
      break
    }
    case TechnicalIndicatorType.TRIX: {
      keys = ['trix', 'maTrix']
      values = [technicalIndicatorData.trix, technicalIndicatorData.maTrix]
      break
    }
    case TechnicalIndicatorType.OBV: {
      keys = ['obv', 'maObv']
      values = [technicalIndicatorData.obv, technicalIndicatorData.maObv]
      break
    }
    case TechnicalIndicatorType.VR: {
      keys = ['vr', 'maVr']
      values = [technicalIndicatorData.vr, technicalIndicatorData.maVr]
      break
    }
    case TechnicalIndicatorType.WR: {
      keys = ['wr1', 'wr2', 'wr3']
      values = [technicalIndicatorData.wr1, technicalIndicatorData.wr2, technicalIndicatorData.wr3]
      break
    }
    case TechnicalIndicatorType.MTM: {
      keys = ['mtm', 'mtmMa']
      values = [technicalIndicatorData.mtm, technicalIndicatorData.mtmMa]
      break
    }
    case TechnicalIndicatorType.EMV: {
      keys = ['emv', 'maEmv']
      values = [technicalIndicatorData.emv, technicalIndicatorData.maEmv]
      break
    }
    case TechnicalIndicatorType.SAR: {
      keys = ['sar']
      values = [technicalIndicatorData.sar]
      break
    }
  }
  return { keys, values }
}
