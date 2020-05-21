import {
  MA, EMA, VOL, MACD, KDJ, BOLL, RSI,
  BIAS, BRAR, CCI, DMI, CR, PSY, DMA,
  TRIX, OBV, VR, WR, MTM, EMV, SAR
} from './technicalIndicatorType'

const technicalIndicatorCalcParams = {
  [MA]: [5, 10, 30, 60],
  [EMA]: [6, 12, 20],
  [VOL]: [5, 10, 20],
  [MACD]: [12, 26, 9],
  [BOLL]: [20],
  [KDJ]: [9, 3, 3],
  [RSI]: [6, 12, 24],
  [BIAS]: [6, 12, 24],
  [BRAR]: [26],
  [CCI]: [13],
  [DMI]: [14, 6],
  [CR]: [26, 10, 20, 40, 60],
  [PSY]: [12],
  [DMA]: [10, 50, 10],
  [TRIX]: [12, 20],
  [OBV]: [30],
  [VR]: [24, 30],
  [WR]: [13, 34, 89],
  [MTM]: [6, 10],
  [EMV]: [14, 9],
  [SAR]: [2, 2, 20]
}

export default technicalIndicatorCalcParams
