import TechnicalIndicator/* , { TechnicalIndicatorSeries } */ from '../TechnicalIndicator'
 import { ROC } from '../defaultTechnicalIndicatorType'
 
 export default class RateOfChange extends TechnicalIndicator {
   constructor () {
     super({
       name: ROC,
      //  series: TechnicalIndicatorSeries.NORMAL,
       calcParams: [14],
       shouldCheckParamCount: true,
       plots: [
        { key: 'roc', title: 'ROC: ', type: 'line' }
      ]
     })
   }
 
   calcTechnicalIndicator (kLineDataList, calcParams) {
    const result = []
    kLineDataList.forEach((kLineData, i) => {
      const roc = {}
      if (i >= calcParams[0] - 1) {
        const close = kLineData.close
        const agoClose = (kLineDataList[i - calcParams[0]] || kLineDataList[i - (calcParams[0] - 1)]).close
        if (agoClose !== 0) {
          roc.roc = (close - agoClose) / agoClose * 100
        } else {
          roc.roc = 0
        }
      }
      result.push(roc)
    })
    return result
  }
 }