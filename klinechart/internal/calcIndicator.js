import { IndicatorType } from '../internal/constants'
import { isArray } from '../utils/data'

const calcIndicator = {}

export default calcIndicator

/**
 * 计算均价
 * @param dataList
 * @returns {*}
 */
calcIndicator.average = function (dataList) {
  let totalTurnover = 0
  let totalVolume = 0
  return calc(dataList, (i) => {
    const turnover = dataList[i].turnover || 0
    totalVolume += dataList[i].volume || 0
    totalTurnover += turnover
    if (totalVolume !== 0) {
      dataList[i].average = totalTurnover / totalVolume
    } else {
      dataList[i].average = 0
    }
  })
}

/**
 * 计算均线数据
 * 默认参数5，10，20，60
 * @param dataList
 * @param params
 * @returns {*}
 */
calcIndicator[IndicatorType.MA] = function (dataList, params) {
  if (!checkParams(params)) {
    return dataList
  }
  const closeSums = []
  const paramsLength = params.length
  return calc(dataList, (i) => {
    const ma = {}
    const close = dataList[i].close
    for (let j = 0; j < paramsLength; j++) {
      closeSums[j] = (closeSums[j] || 0) + close
      const p = params[j]
      if (i < p) {
        ma[`ma${p}`] = closeSums[j] / (i + 1)
      } else {
        closeSums[j] -= dataList[i - p].close
        ma[`ma${p}`] = closeSums[j] / p
      }
    }
    dataList[i].ma = ma
  })
}

/**
 * 计算成交量包含ma5、ma10、ma20
 * 默认参数5，10，20
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.VOL] = function (dataList, params) {
  if (!checkParams(params)) {
    return dataList
  }
  const volumeSums = []
  const paramsLength = params.length
  return calc(dataList, (i) => {
    const num = dataList[i].volume
    const vol = {}
    for (let j = 0; j < paramsLength; j++) {
      volumeSums[j] = (volumeSums[j] || 0) + num
      const p = params[j]
      if (i < p) {
        vol[`ma${p}`] = volumeSums[j] / (i + 1)
      } else {
        volumeSums[j] -= dataList[i - p].volume
        vol[`ma${p}`] = volumeSums[j] / p
      }
    }
    vol.num = num
    dataList[i].vol = vol
  })
}

/**
 * 计算MACD指标
 *
 * MACD：参数快线移动平均、慢线移动平均、移动平均，
 * 默认参数值12、26、9。
 * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
 * ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
 * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
 * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.MACD] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList
  }
  let emaShort
  let emaLong
  let oldEmaShort = 0
  let oldEmaLong = 0
  let diff = 0
  let dea = 0
  let oldDea = 0
  let macd = 0

  return calc(dataList, (i) => {
    const closePrice = dataList[i].close
    if (i === 0) {
      emaShort = closePrice
      emaLong = closePrice
    } else {
      emaShort = (2 * closePrice + (params[0] - 1) * oldEmaShort) / (params[0] + 1)
      emaLong = (2 * closePrice + (params[1] - 1) * oldEmaLong) / (params[1] + 1)
    }

    diff = emaShort - emaLong
    dea = (diff * 2 + oldDea * (params[2] - 1)) / (params[2] + 1)
    macd = (diff - dea) * 2
    oldEmaShort = emaShort
    oldEmaLong = emaLong
    oldDea = dea

    dataList[i].macd = { diff, dea, macd }
  })
}

/**
 * 计算BOLL指标
 * 默认参数20
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.BOLL] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList
  }
  let closeSum = 0
  let ma// 中轨线
  let md// 标准差
  let up// 上轨线
  let dn// 下轨线

  return calc(dataList, (i) => {
    const closePrice = dataList[i].close
    closeSum += closePrice
    if (i < params[0]) {
      ma = closeSum / (i + 1)
      md = getBollMd(dataList.slice(0, i + 1), ma)
    } else {
      closeSum -= dataList[i - params[0]].close
      ma = closeSum / params[0]
      md = getBollMd(dataList.slice(i - (params[0] - 1), i + 1), ma)
    }
    up = ma + 2 * md
    dn = ma - 2 * md
    dataList[i].boll = { up, mid: ma, dn }
  })
}

/**
 * 计算KDJ
 * 默认参数9，3，3
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.KDJ] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList
  }
  let k
  let d
  let j

  // n日内最低价
  let ln
  // n日内最高价
  let hn

  return calc(dataList, (i) => {
    // n日收盘价
    const cn = dataList[i].close

    if (i < (params[0] - 1)) {
      ln = getLow(dataList.slice(0, i + 1))
      hn = getHigh(dataList.slice(0, i + 1))
    } else {
      ln = getLow(dataList.slice(i - (params[0] - 1), i + 1))
      hn = getHigh(dataList.slice(i - (params[0] - 1), i + 1))
    }
    const rsv = (cn - ln) / (hn - ln === 0 ? 1 : hn - ln) * 100
    // 当日K值=2/3×前一日K值+1/3×当日RSV
    // 当日D值=2/3×前一日D值+1/3×当日K值
    // 若无前一日K 值与D值，则可分别用50来代替。
    // J值=3*当日K值-2*当日D值
    k = (params[1] - 1) / params[1] * (i < (params[0] - 1) ? 50.0 : dataList[i - 1].kdj.k) + 1.0 / params[1] * rsv
    d = (params[2] - 1) / params[2] * (i < (params[0] - 1) ? 50.0 : dataList[i - 1].kdj.d) + 1.0 / params[2] * k
    j = 3.0 * k - 2.0 * d
    dataList[i].kdj = { k, d, j }
  })
}

/**
 * 计算RSI
 * 默认参数6，12，24
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.RSI] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList
  }
  // N日RSI =
  // N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
  let sumCloseA1 = 0
  let sumCloseB1 = 0

  let sumCloseA2 = 0
  let sumCloseB2 = 0

  let sumCloseA3 = 0
  let sumCloseB3 = 0

  let a1
  let b1

  let a2
  let b2

  let a3
  let b3

  return calc(dataList, (i) => {
    const rsi = { [`rsi${params[0]}`]: 0, [`rsi${params[1]}`]: 0, [`rsi${params[2]}`]: 0 }
    if (i > 0) {
      const tmp = dataList[i].close - dataList[i - 1].close
      if (tmp > 0) {
        sumCloseA1 += tmp
        sumCloseA2 += tmp
        sumCloseA3 += tmp
      } else {
        const absTmp = Math.abs(tmp)
        sumCloseB1 += absTmp
        sumCloseB2 += absTmp
        sumCloseB3 += absTmp
      }

      if (i < params[0]) {
        a1 = sumCloseA1 / (i + 1)
        b1 = (sumCloseA1 + sumCloseB1) / (i + 1)
      } else {
        if (i > params[0]) {
          const agoTmp = dataList[i - params[0]].close - dataList[i - params[0] - 1].close
          if (agoTmp > 0) {
            sumCloseA1 -= agoTmp
          } else {
            sumCloseB1 -= Math.abs(agoTmp)
          }
        }
        a1 = sumCloseA1 / params[0]
        b1 = (sumCloseA1 + sumCloseB1) / params[0]
      }
      rsi[`rsi${params[0]}`] = b1 !== 0.0 ? a1 / b1 * 100 : 0.0

      if (i < params[1]) {
        a2 = sumCloseA2 / (i + 1)
        b2 = (sumCloseA2 + sumCloseB2) / (i + 1)
      } else {
        if (i > params[1]) {
          const agoTmp = dataList[i - params[1]].close - dataList[i - params[1] - 1].close
          if (agoTmp > 0) {
            sumCloseA2 -= agoTmp
          } else {
            sumCloseB2 -= Math.abs(agoTmp)
          }
        }
        a2 = sumCloseA2 / params[1]
        b2 = (sumCloseA2 + sumCloseB2) / params[1]
      }
      rsi[`rsi${params[1]}`] = b2 !== 0.0 ? a2 / b2 * 100 : 0.0

      if (i < params[2]) {
        a3 = sumCloseA3 / (i + 1)
        b3 = (sumCloseA3 + sumCloseB3) / (i + 1)
      } else {
        if (i > params[2]) {
          const agoTmp = dataList[i - params[2]].close - dataList[i - params[2] - 1].close
          if (agoTmp > 0) {
            sumCloseA3 -= agoTmp
          } else {
            sumCloseB3 -= Math.abs(agoTmp)
          }
        }
        a3 = sumCloseA3 / params[2]
        b3 = (sumCloseA3 + sumCloseB3) / params[2]
      }
      rsi[`rsi${params[2]}`] = b3 !== 0.0 ? a3 / b3 * 100 : 0.0
    }
    dataList[i].rsi = rsi
  })
}

/**
 * 计算BIAS指标
 * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
 * 默认参数：6，12、24
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.BIAS] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList
  }
  let mean1
  let mean2
  let mean3
  let closes1 = 0
  let closes2 = 0
  let closes3 = 0

  return calc(dataList, (i) => {
    const bias = {}
    const closePrice = dataList[i].close
    closes1 += closePrice
    closes2 += closePrice
    closes3 += closePrice

    if (i < params[0]) {
      mean1 = closes1 / (i + 1)
    } else {
      closes1 -= dataList[i - params[0]].close
      mean1 = closes1 / params[0]
    }
    bias[`bias${params[0]}`] = ((closePrice - mean1) / mean1) * 100

    if (i < params[1]) {
      mean2 = closes2 / (i + 1)
    } else {
      closes2 -= dataList[i - params[1]].close
      mean2 = closes2 / params[1]
    }
    bias[`bias${params[1]}`] = ((closePrice - mean2) / mean2) * 100

    if (i < params[2]) {
      mean3 = closes3 / (i + 1)
    } else {
      closes3 -= dataList[i - params[2]].close
      mean3 = closes3 / params[2]
    }
    bias[`bias${params[2]}`] = ((closePrice - mean3) / mean3) * 100

    dataList[i].bias = bias
  })
}

/**
 * 计算BRAR指标
 * 默认参数是26。
 * 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
 * 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
 * N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
 * 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.BRAR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList
  }
  let br = 0
  let ar = 0
  let hcy = 0
  let cyl = 0
  let ho = 0
  let ol = 0

  return calc(dataList, (i) => {
    const high = dataList[i].high
    const low = dataList[i].low
    const open = dataList[i].open
    ho += (high - open)
    ol += (open - low)
    if (i > 0) {
      const refClose = dataList[i - 1].close
      hcy += (high - refClose)
      cyl += (refClose - low)
      if (i > params[0] - 1) {
        const agoHigh = dataList[i - params[0]].high
        const agoLow = dataList[i - params[0]].low
        const agoOpen = dataList[i - params[0]].open
        if (i > params[0]) {
          const agoRefClose = dataList[i - params[0] - 1].close
          hcy -= (agoHigh - agoRefClose)
          cyl -= (agoRefClose - agoLow)
        }
        ho -= (agoHigh - agoOpen)
        ol -= (agoOpen - agoLow)
      }
      if (ol !== 0) {
        ar = ho / ol * 100
      } else {
        ar = 0
      }
      if (cyl !== 0) {
        br = hcy / cyl * 100
      } else {
        br = 0
      }
    }
    dataList[i].brar = { br, ar }
  })
}

/**
 * 计算CCI指标
 * CCI（N日）=（TP－MA）÷MD÷0.015
 * 其中，TP=（最高价+最低价+收盘价）÷3
 * MA=近N日收盘价的累计之和÷N
 * MD=近N日（MA－收盘价）的累计之和÷N
 * 默认参数13
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.CCI] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList
  }
  let closes = 0.0
  let closeMa
  const closeMaList = []
  let md
  let maCloseSum = 0.0
  let cci

  return calc(dataList, (i) => {
    const closePrice = dataList[i].close
    closes += closePrice

    const tp = (dataList[i].high + dataList[i].low + closePrice) / 3
    if (i < params[0]) {
      closeMa = closes / (i + 1)
      maCloseSum += Math.abs(closeMa - closePrice)
      closeMaList.push(closeMa)
      md = maCloseSum / (i + 1)
    } else {
      const agoClosePrice = dataList[i - params[0]].close
      closes -= agoClosePrice
      closeMa = closes / params[0]
      closeMaList.push(closeMa)
      maCloseSum += Math.abs(closeMa - closePrice)
      maCloseSum -= Math.abs(closeMaList[i - params[0]] - agoClosePrice)
      md = maCloseSum / params[0]
    }
    cci = md !== 0.0 ? (tp - closeMa) / md / 0.015 : 0.0
    dataList[i].cci = { cci }
  })
}

/**
 * 计算DMI
 *
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.DMI] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList
  }
  // 默认参数 14，6
  // MTR:=EXPMEMA(MAX(MAX(HIGH-LOW,ABS(HIGH-REF(CLOSE,1))),ABS(REF(CLOSE,1)-LOW)),N)
  // HD :=HIGH-REF(HIGH,1);
  // LD :=REF(LOW,1)-LOW;
  // DMP:=EXPMEMA(IF(HD>0&&HD>LD,HD,0),N);
  // DMM:=EXPMEMA(IF(LD>0&&LD>HD,LD,0),N);
  //
  // PDI: DMP*100/MTR;
  // MDI: DMM*100/MTR;
  // ADX: EXPMEMA(ABS(MDI-PDI)/(MDI+PDI)*100,MM);
  // ADXR:EXPMEMA(ADX,MM);
  // 公式含义：
  // MTR赋值:最高价-最低价和最高价-昨收的绝对值的较大值和昨收-最低价的绝对值的较大值的N日指数平滑移动平均
  // HD赋值:最高价-昨日最高价
  // LD赋值:昨日最低价-最低价
  // DMP赋值:如果HD>0并且HD>LD,返回HD,否则返回0的N日指数平滑移动平均
  // DMM赋值:如果LD>0并且LD>HD,返回LD,否则返回0的N日指数平滑移动平均
  // 输出PDI:DMP*100/MTR
  // 输出MDI:DMM*100/MTR
  // 输出ADX:MDI-PDI的绝对值/(MDI+PDI)*100的MM日指数平滑移动平均
  // 输出ADXR:ADX的MM日指数平滑移动平均
  let pdi = 0.0
  let mdi = 0.0
  let adx = 0.0
  let adxr = 0.0

  const trList = [0.0]
  let trSum = 0.0
  const dmpList = [0.0]
  let dmpSum = 0.0
  const dmmList = [0.0]
  let dmmSum = 0.0
  const dxList = [0.0]
  let dxSum = 0.0

  return calc(dataList, (i) => {
    if (i > 0) {
      const refClose = dataList[i - 1].close
      const highPrice = dataList[i].high
      const lowPrice = dataList[i].low
      const hl = highPrice - lowPrice
      const hcy = Math.abs(highPrice - refClose)
      const lcy = Math.abs(lowPrice - refClose)
      const hhy = highPrice - dataList[i - 1].high
      const lyl = dataList[i - 1].low - lowPrice
      const tr = Math.max(Math.max(hl, hcy), lcy)
      trSum += tr
      trList.push(tr)

      const h = (hhy > 0.0 && hhy > lyl) ? hhy : 0.0
      dmpSum += h
      dmpList.push(h)

      const l = (lyl > 0 && lyl > hhy) ? lyl : 0.0
      dmmSum += l
      dmmList.push(l)

      if (i > params[0] - 1) {
        trSum -= trList[i - params[0]]
        dmpSum -= dmpList[i - params[0]]
        dmmSum -= dmmList[i - params[0]]
      }

      if (trSum === 0) {
        pdi = 0
        mdi = 0
      } else {
        pdi = dmpSum * 100 / trSum
        mdi = dmmSum * 100 / trSum
      }

      const dx = Math.abs((mdi - pdi)) / (mdi + pdi) * 100
      dxSum += dx
      dxList.push(dx)
      if (i < params[1]) {
        adx = dxSum / (i + 1)
        adxr = adx
      } else {
        const agoAdx = dxList[i - params[1]]
        dxSum -= agoAdx
        adx = dxSum / params[1]
        adxr = (adx + agoAdx) / 2
      }
    }
    dataList[i].dmi = { pdi, mdi, adx, adxr }
  })
}

/**
 * 计算CR
 *
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.CR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 5)) {
    return dataList
  }
  // 默认参数26、10、20、40、60
  // MID:=REF(HIGH+LOW,1)/2;
  // CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
  // MA1:REF(MA(CR,M1),M1/2.5+1);
  // MA2:REF(MA(CR,M2),M2/2.5+1);
  // MA3:REF(MA(CR,M3),M3/2.5+1);
  // MA4:REF(MA(CR,M4),M4/2.5+1);
  // MID赋值:(昨日最高价+昨日最低价)/2
  // 输出带状能量线:0和最高价-MID的较大值的N日累和/0和MID-最低价的较大值的N日累和*100
  // 输出MA1:M1(5)/2.5+1日前的CR的M1(5)日简单移动平均
  // 输出MA2:M2(10)/2.5+1日前的CR的M2(10)日简单移动平均
  // 输出MA3:M3(20)/2.5+1日前的CR的M3(20)日简单移动平均
  // 输出MA4:M4/2.5+1日前的CR的M4日简单移动平均
  let cr = 0
  let ma1
  let ma2
  let ma3
  let ma4
  let p1 = 0
  let p2 = 0
  let ma1Sum = 0
  let ma1Mean
  const ma1List = []
  let ma2Sum = 0
  let ma2Mean
  const ma2List = []
  let ma3Sum = 0
  let ma3Mean
  const ma3List = []
  let ma4Sum = 0
  let ma4Mean
  const ma4List = []

  return calc(dataList, (i) => {
    if (i > 0) {
      const preHighestPrice = dataList[i - 1].high
      const preLowestPrice = dataList[i - 1].low
      const preClosePrice = dataList[i - 1].close
      const preOpenPrice = dataList[i - 1].open
      const preMidPrice = (preHighestPrice + preClosePrice + preLowestPrice + preOpenPrice) / 4

      const highestPrice = dataList[i].high
      const lowestPrice = dataList[i].low

      let highSubPreMid = highestPrice - preMidPrice
      if (highSubPreMid < 0) {
        highSubPreMid = 0
      }
      p1 += highSubPreMid

      let preMidSubLow = preMidPrice - lowestPrice
      if (preMidSubLow < 0) {
        preMidSubLow = 0
      }
      p2 += preMidSubLow

      if (i > params[0]) {
        const firstHighestPrice = dataList[i - params[0] - 1].high
        const firstLowestPrice = dataList[i - params[0] - 1].low
        const firstClosePrice = dataList[i - params[0] - 1].close
        const firstOpenPrice = dataList[i - params[0] - 1].open
        const firstMidPrice = (firstHighestPrice + firstLowestPrice + firstClosePrice + firstOpenPrice) / 4

        const secondHighestPrice = dataList[i - params[0]].high
        const secondLowestPrice = dataList[i - params[0]].low

        let secondHighSubFirstMid = secondHighestPrice - firstMidPrice
        if (secondHighSubFirstMid < 0) {
          secondHighSubFirstMid = 0
        }

        let firstMidSubSecondLow = firstMidPrice - secondLowestPrice
        if (firstMidSubSecondLow < 0) {
          firstMidSubSecondLow = 0
        }
        p1 -= secondHighSubFirstMid
        p2 -= firstMidSubSecondLow
      }

      if (p2 !== 0) {
        cr = p1 / p2 * 100
      }

      const YM = (dataList[i - 1].high + dataList[i - 1].low + dataList[i - 1].close) / 3
      const HYM = dataList[i].high - YM
      p1 += (HYM <= 0 ? 0 : HYM)
      const LYM = YM - dataList[i].low
      p2 += (LYM <= 0 ? 0 : LYM)
    }
    ma1Sum += cr
    ma2Sum += cr
    ma3Sum += cr
    ma4Sum += cr

    if (i < params[1]) {
      ma1Mean = ma1Sum / (i + 1)
    } else {
      ma1Sum -= dataList[i - params[1]].cr.cr
      ma1Mean = ma1Sum / params[1]
    }
    ma1List.push(ma1Mean)

    if (i < params[2]) {
      ma2Mean = ma2Sum / (i + 1)
    } else {
      ma2Sum -= dataList[i - params[2]].cr.cr
      ma2Mean = ma2Sum / params[2]
    }
    ma2List.push(ma2Mean)

    if (i < params[3]) {
      ma3Mean = ma3Sum / (i + 1)
    } else {
      ma3Sum -= dataList[i - params[3]].cr.cr
      ma3Mean = ma3Sum / params[3]
    }
    ma3List.push(ma3Mean)

    if (i < params[4]) {
      ma4Mean = ma4Sum / (i + 1)
    } else {
      ma4Sum -= dataList[i - params[4]].cr.cr
      ma4Mean = ma4Sum / params[4]
    }
    ma4List.push(ma4Mean)

    if (i < 5) {
      ma1 = ma1List[0]
    } else {
      ma1 = ma1List[i - 5]
    }

    if (i < 9) {
      ma2 = ma2List[0]
    } else {
      ma2 = ma2List[i - 9]
    }

    if (i < 17) {
      ma3 = ma3List[0]
    } else {
      ma3 = ma3List[i - 17]
    }

    if (i < 25) {
      ma4 = ma4List[0]
    } else {
      ma4 = ma4List[i - 25]
    }
    dataList[i].cr = { cr, ma1, ma2, ma3, ma4 }
  })
}

/**
 * 计算PSY
 * 默认参数是12。公式：PSY=N日内的上涨天数/N×100%。
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.PSY] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList
  }
  let psy = 0
  let upDay = 0

  return calc(dataList, (i) => {
    if (i > 0) {
      upDay += (dataList[i].close - dataList[i - 1].close > 0 ? 1 : 0)
      if (i < params[0]) {
        psy = upDay / (i + 1) * 100
      } else {
        if (i > params[0]) {
          upDay -= ((dataList[i - params[0] + 1].close - dataList[i - params[0]].close > 0) ? 1.0 : 0.0)
        }
        psy = upDay / params[0] * 100
      }
    }
    dataList[i].psy = { psy }
  })
}

/**
 * 计算DMA
 * 默认参数是10、50、10。
 * 公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.DMA] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList
  }
  let dif
  let difMa
  let ma1Sum = 0
  let ma1
  let ma2Sum = 0
  let ma2
  let difSum = 0
  return calc(dataList, (i) => {
    const closePrice = dataList[i].close

    ma1Sum += closePrice
    ma2Sum += closePrice

    if (i < params[0]) {
      ma1 = ma1Sum / (i + 1)
    } else {
      ma1Sum -= dataList[i - params[0]].close
      ma1 = ma1Sum / params[0]
    }

    if (i < params[1]) {
      ma2 = ma2Sum / (i + 1)
    } else {
      ma2Sum -= dataList[i - params[1]].close
      ma2 = ma2Sum / params[1]
    }
    dif = ma1 - ma2
    difSum += dif

    if (i < params[2]) {
      difMa = difSum / (i + 1)
    } else {
      difSum -= dataList[i - params[2]].dma.dif
      difMa = difSum / params[2]
    }

    dataList[i].dma = { dif, difMa }
  })
}

/**
 * 计算TRIX
 *
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.TRIX] = function (dataList, params) {
  // TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
  // TRIX=(TR-昨日TR)/昨日TR*100；
  // MATRIX=TRIX的M日简单移动平均；
  // 默认参数N设为12，默认参数M设为20；
  // 默认参数12、20
  // 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
  // TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
  // TRMA:MA(TRIX,M)
  if (!checkParamsWithSize(params, 2)) {
    return dataList
  }
  let trix = 0
  let maTrix
  let sumTrix = 0

  let emaClose1
  let oldEmaClose1 = 0.0

  let emaClose2
  let oldEmaClose2 = 0.0

  let emaClose3
  let oldEmaClose3 = 0.0
  const emaClose3List = []

  return calc(dataList, (i) => {
    const closePrice = dataList[i].close
    if (i === 0) {
      emaClose1 = closePrice
      emaClose2 = emaClose1
      emaClose3 = emaClose2
    } else {
      emaClose1 = (2 * closePrice + (params[0] - 1) * oldEmaClose1) / (params[0] + 1)
      emaClose2 = (2 * emaClose1 + (params[0] - 1) * oldEmaClose2) / (params[0] + 1)
      emaClose3 = (2 * emaClose2 + (params[0] - 1) * oldEmaClose3) / (params[0] + 1)
      const refEmaClose3 = emaClose3List[i - 1]
      trix = refEmaClose3 === 0.0 ? 0.0 : (emaClose3 - refEmaClose3) / refEmaClose3 * 100
    }
    oldEmaClose1 = emaClose1
    oldEmaClose2 = emaClose2
    oldEmaClose3 = emaClose3
    emaClose3List.push(emaClose3)
    sumTrix += trix
    if (i < params[1]) {
      maTrix = sumTrix / (i + 1)
    } else {
      sumTrix -= dataList[i - params[1]].trix.trix
      maTrix = sumTrix / params[1]
    }
    dataList[i].trix = { trix, maTrix }
  })
}

/**
 * 计算obv指标
 * VA:=IF(CLOSE>REF(CLOSE,1),VOL,-VOL);
 * OBV:SUM(IF(CLOSE=REF(CLOSE,1),0,VA),0);
 * MAOBV:MA(OBV,M);
 * VA赋值:如果收盘价>昨收,返回成交量(手),否则返回-成交量(手)
 * 输出OBV:如果收盘价=昨收,返回0,否则返回VA的历史累和
 * 输出MAOBV:OBV的M日简单移动平均
 * 默认参数30
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.OBV] = function (dataList, params) {
  if (!checkParamsWithSize(params, 1)) {
    return dataList
  }
  let obv
  let sumObv = 0.0
  let maObv
  let sumVa = 0.0

  return calc(dataList, (i) => {
    const volume = dataList[i].volume
    if (i === 0) {
      obv = volume
      sumVa += volume
    } else {
      const refClosePrice = dataList[i - 1].close
      const closePrice = dataList[i].close
      const va = closePrice > refClosePrice ? volume : -volume

      sumVa += va
      obv = closePrice === refClosePrice ? 0.0 : sumVa
    }
    sumObv += obv
    if (i < params[0]) {
      maObv = sumObv / (i + 1)
    } else {
      sumObv -= dataList[i - params[0]].obv.obv
      maObv = sumObv / params[0]
    }
    dataList[i].obv = { obv, maObv }
  })
}

/**
 * 计算vr指标
 * 默认参数24 ， 30
 * VR=（AVS+1/2CVS）/（BVS+1/2CVS）
 * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为AVS
 * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为BVS
 * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为CVS
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.VR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList
  }
  let avs = 0
  let bvs = 0
  let cvs = 0
  let vr = 0
  let maVr
  let sumVr = 0
  return calc(dataList, (i) => {
    const closePrice = dataList[i].close
    const openPrice = dataList[i].open
    const volume = dataList[i].volume
    if (closePrice > openPrice) {
      avs += volume
    } else if (closePrice < openPrice) {
      bvs += volume
    } else {
      cvs += volume
    }

    if (i > params[0] - 1) {
      const agoClosePrice = dataList[i - params[0]].close
      const agoOpenPrice = dataList[i - params[0]].open
      const agoVolume = dataList[i - params[0]].volume
      if (agoClosePrice > agoOpenPrice) {
        avs -= agoVolume
      } else if (agoClosePrice < agoOpenPrice) {
        bvs -= agoVolume
      } else {
        cvs -= agoVolume
      }
    }

    const v = bvs + 1 / 2 * cvs
    if (v !== 0) {
      vr = (avs + 1 / 2 * cvs) / v * 100
    }
    sumVr += vr
    if (i < params[1]) {
      maVr = sumVr / (i + 1)
    } else {
      sumVr -= dataList[i - params[1]].vr.vr
      maVr = sumVr / params[1]
    }
    dataList[i].vr = { vr, maVr }
  })
}

/**
 * 计算wr指标
 * 默认参数13 34 89
 * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.WR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList
  }
  let wr1
  let wr2
  let wr3
  let h1 = Number.MIN_SAFE_INTEGER
  let l1 = Number.MAX_SAFE_INTEGER
  let h2 = Number.MIN_SAFE_INTEGER
  let l2 = Number.MAX_SAFE_INTEGER
  let h3 = Number.MIN_SAFE_INTEGER
  let l3 = Number.MAX_SAFE_INTEGER

  let hl1
  let hl2
  let hl3

  return calc(dataList, (i) => {
    const closePrice = dataList[i].close
    const highPrice = dataList[i].high
    const lowPrice = dataList[i].low

    if (i < params[0]) {
      h1 = Math.max(highPrice, h1)
      l1 = Math.min(lowPrice, l1)
    } else {
      const highLowPriceArray = getHighLow(dataList.slice(i - params[0], i))
      h1 = highLowPriceArray[0]
      l1 = highLowPriceArray[1]
    }
    hl1 = h1 - l1
    wr1 = hl1 !== 0 ? (h1 - closePrice) / hl1 * 100 : 0.0

    if (i < params[1]) {
      h2 = Math.max(highPrice, h2)
      l2 = Math.min(lowPrice, l2)
    } else {
      const highLowPriceArray = getHighLow(dataList.slice(i - params[1], i))
      h2 = highLowPriceArray[0]
      l2 = highLowPriceArray[1]
    }
    hl2 = h2 - l2
    wr2 = hl2 !== 0 ? (h2 - closePrice) / hl2 * 100 : 0.0

    if (i < params[2]) {
      h3 = Math.max(highPrice, h3)
      l3 = Math.min(lowPrice, l3)
    } else {
      const highLowPriceArray = getHighLow(dataList.slice(i - params[2], i))
      h3 = highLowPriceArray[0]
      l3 = highLowPriceArray[1]
    }
    hl3 = h3 - l3
    wr3 = hl3 !== 0.0 ? (h3 - closePrice) / hl3 * 100 : 0.0

    dataList[i].wr = { wr1, wr2, wr3 }
  })
}

/**
 * 计算mtm指标
 * 默认参数6 10
 * 公式 MTM（N日）=C－CN
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.MTM] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList
  }
  let mtm
  let mtmSum = 0
  let mtmMa
  return calc(dataList, (i) => {
    if (i < params[0]) {
      mtm = 0.0
      mtmMa = 0.0
    } else {
      const closePrice = dataList[i].close
      mtm = closePrice - dataList[i - params[0]].close
      mtmSum += mtm
      if (i < params[0] + params[1]) {
        mtmMa = mtmSum / (i - params[0] + 1)
      } else {
        mtmMa = mtmSum / params[1]
        mtmSum -= dataList[i - params[1]].mtm.mtm
      }
    }
    dataList[i].mtm = { mtm, mtmMa }
  })
}

/**
 * 简易波动指标
 * 默认参数N为14，默认参数M为9
 * 公式：
 * A=（今日最高+今日最低）/2
 * B=（前日最高+前日最低）/2
 * C=今日最高-今日最低
 * EM=（A-B）*C/今日成交额
 * EMV=N日内EM的累和
 * MAEMV=EMV的M日的简单移动平均
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.EMV] = function (dataList, params) {
  if (!checkParamsWithSize(params, 2)) {
    return dataList
  }

  let emv = 0
  let maEmv
  let sumEmv = 0
  let em = 0

  const emList = []

  return calc(dataList, (i) => {
    if (i > 0) {
      const turnover = dataList[i].turnover
      const highestPrice = dataList[i].high
      const lowestPrice = dataList[i].low
      const preHighestPrice = dataList[i - 1].high
      const preLowestPrice = dataList[i - 1].low
      const highSubLow = highestPrice - lowestPrice
      const halfHighAddLow = (highestPrice + lowestPrice) / 2
      const preHalfHighAddLow = (preHighestPrice + preLowestPrice) / 2
      em = (halfHighAddLow - preHalfHighAddLow) * highSubLow / turnover
    }
    emList.push(em)
    if (i < params[0]) {
      emv += em
    } else {
      emv -= emList[i - params[0]]
    }
    sumEmv += emv
    if (i < params[1]) {
      maEmv = sumEmv / (i + 1)
    } else {
      sumEmv -= dataList[i - params[1]].emv.emv
      maEmv = sumEmv / params[1]
    }
    dataList[i].emv = { emv, maEmv }
  })
}

/**
 * 计算sar
 * 默认参数2， 2， 20（开始值，步长，最大值）
 * @param dataList
 * @param params
 * @return
 */
calcIndicator[IndicatorType.SAR] = function (dataList, params) {
  if (!checkParamsWithSize(params, 3)) {
    return dataList
  }
  const startAf = params[0] / 100
  const step = params[1] / 100
  const maxAf = params[2] / 100
  // 加速因子
  let af = startAf
  // 极值
  let ep = -100
  // 判断是上涨还是下跌  false：下跌
  let isIncreasing = false
  let sar = 0

  return calc(dataList, (i) => {
    // 上一个周期的sar
    const preSar = sar
    const highestPrice = dataList[i].high
    const lowestPrice = dataList[i].low
    if (isIncreasing) {
      // 上涨
      if (ep === -100 || ep < highestPrice) {
        // 重新初始化值
        ep = highestPrice
        af = Math.min(af + step, maxAf)
      }
      sar = preSar + af * (ep - preSar)
      const lowestPriceMin = Math.min(dataList[Math.max(1, i) - 1].low, lowestPrice)
      if (sar > dataList[i].low) {
        sar = ep
        // 重新初始化值
        af = startAf
        ep = -100
        isIncreasing = !isIncreasing
      } else if (sar > lowestPriceMin) {
        sar = lowestPriceMin
      }
    } else {
      if (ep === -100 || ep > lowestPrice) {
        // 重新初始化值
        ep = lowestPrice
        af = Math.min(af + step, maxAf)
      }
      sar = preSar + af * (ep - preSar)
      const highestPriceMax = Math.max(dataList[Math.max(1, i) - 1].high, highestPrice)
      if (sar < dataList[i].high) {
        sar = ep
        // 重新初始化值
        af = 0
        ep = -100
        isIncreasing = !isIncreasing
      } else if (sar < highestPriceMax) {
        sar = highestPriceMax
      }
    }
    dataList[i].sar = { sar }
  })
}

/**
 * 计算
 * @param dataList
 * @param calcIndicator
 */
function calc (dataList, calcIndicator) {
  const dataSize = dataList.length
  for (let i = 0; i < dataSize; i++) {
    calcIndicator(i)
  }
  return dataList
}

/**
 * 计算布林指标中的标准差
 *
 * @param list
 * @param ma
 * @return
 */
function getBollMd (list, ma) {
  let sum = 0
  for (let i = 0; i < list.length; i++) {
    const closeMa = list[i].close - ma
    sum += closeMa * closeMa
  }
  const b = sum > 0
  sum = Math.abs(sum)
  const md = Math.sqrt(sum / list.length)
  return b ? md : -1 * md
}

/**
 * 获取list中的最大的最高价
 *
 * @param list
 * @return
 */
function getHigh (list) {
  let high = 0
  if (list && list.length > 0) {
    const size = list.length
    high = list[0].high
    for (let i = 1; i < size; i++) {
      high = Math.max(list[i].high, high)
    }
  }
  return high
}

/**
 * 获取list中的最小的最低价
 *
 * @param list
 * @return
 */
function getLow (list) {
  let low = 0
  if (list && list.length > 0) {
    const size = list.length
    low = list[0].low
    for (let i = 1; i < size; i++) {
      low = Math.min(list[i].low, low)
    }
  }
  return low
}

/**
 * 获取最大最小值
 * @param list
 * @returns {number[]}
 */
function getHighLow (list) {
  let high = 0
  let low = 0
  if (list && list.length > 0) {
    const size = list.length
    high = list[0].high
    low = list[0].low
    for (let i = 1; i < size; i++) {
      high = Math.max(list[i].high, high)
      low = Math.min(list[i].low, low)
    }
  }
  return [high, low]
}

/**
 * 检查参数
 * @param params
 */
function checkParams (params) {
  return params && isArray(params)
}

/**
 * 检查参数, 并检查参数个数
 * @param params
 * @param paramsSize
 */
function checkParamsWithSize (params, paramsSize) {
  return checkParams(params) && params.length === paramsSize
}
