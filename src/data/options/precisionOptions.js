import { TechnicalIndicatorType } from '../options/technicalIndicatorParamOptions'

export const defaultPrecisionOptions = {
  price: 2,
  volume: 0,
  [TechnicalIndicatorType.NO]: 2,
  [TechnicalIndicatorType.MA]: 2,
  [TechnicalIndicatorType.VOL]: 0,
  [TechnicalIndicatorType.MACD]: 2,
  [TechnicalIndicatorType.BOLL]: 2,
  [TechnicalIndicatorType.KDJ]: 2,
  [TechnicalIndicatorType.RSI]: 2,
  [TechnicalIndicatorType.BIAS]: 2,
  [TechnicalIndicatorType.BRAR]: 4,
  [TechnicalIndicatorType.CCI]: 4,
  [TechnicalIndicatorType.DMI]: 4,
  [TechnicalIndicatorType.CR]: 2,
  [TechnicalIndicatorType.PSY]: 2,
  [TechnicalIndicatorType.DMA]: 4,
  [TechnicalIndicatorType.TRIX]: 4,
  [TechnicalIndicatorType.OBV]: 4,
  [TechnicalIndicatorType.VR]: 4,
  [TechnicalIndicatorType.WR]: 4,
  [TechnicalIndicatorType.MTM]: 4,
  [TechnicalIndicatorType.EMV]: 4,
  [TechnicalIndicatorType.SAR]: 2
}
