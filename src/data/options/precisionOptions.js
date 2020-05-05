/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TechnicalIndicatorType } from '../options/technicalIndicatorParamOptions'

export const defaultPrecisionOptions = {
  price: 2,
  volume: 0,
  [TechnicalIndicatorType.NO]: 2,
  [TechnicalIndicatorType.MA]: 2,
  [TechnicalIndicatorType.EMA]: 2,
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
  [TechnicalIndicatorType.SAR]: 2,
  [TechnicalIndicatorType.POSITION]: 0
}
