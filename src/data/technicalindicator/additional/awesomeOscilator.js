import TechnicalIndicator, { TechnicalIndicatorSeries } from '../TechnicalIndicator'
 import { AO } from '../defaultTechnicalIndicatorType'
 
 export default class AwesomeOscilator extends TechnicalIndicator {
   constructor () {
     super({
       name: AO,
       series: TechnicalIndicatorSeries.NORMAL,
       calcParams: [5, 34],
       precision: 2,
       baseValue: 0,
       plots: [
         {
           key: 'ao',
           type: 'bar',
           color: (data, technicalIndicatorOptions) => {
            const { preData, currentData } = data
            const preAo = (preData.technicalIndicatorData || {}).ao
            const ao = (currentData.technicalIndicatorData || {}).ao
            if (ao > preAo) {
              return technicalIndicatorOptions.bar.upColor
            } else {
              return technicalIndicatorOptions.bar.downColor
            }
          },
          isStroke: (data) => {
            const { preData, currentData } = data
            const preAo = (preData.technicalIndicatorData || {}).ao
            const ao = (currentData.technicalIndicatorData || {}).ao
            return ao > preAo
          }
        }
       ]
     })
   }
 
   calcTechnicalIndicator (kLineDataList, calcParams) {
    const periodShort = calcParams[0]
    const periodLong = calcParams[1]

    const maxParam = Math.max(periodShort, periodLong)
    const result = []
    let shortSum = 0
    let longSum = 0
    let short = 0
    let long = 0

    kLineDataList.forEach((kLineData, i) => {
      const ao = {}
      const middle = (kLineData.low + kLineData.high) / 2
      shortSum += middle
      longSum += middle

      if (i >= periodShort - 1) {
        short = shortSum / periodShort
        const agoKLineData = kLineDataList[i - (periodShort - 1)]
        shortSum -= ((agoKLineData.low + agoKLineData.high) / 2)
      }

      if (i >= periodLong - 1) {
        long = longSum / periodLong
        const agoKLineData = kLineDataList[i - (periodLong - 1)]
        longSum -= ((agoKLineData.low + agoKLineData.high) / 2)
      }

      if (i >= maxParam - 1) {
        ao.ao = short - long
      }

      result.push(ao)
    })

    return result
  }
 }