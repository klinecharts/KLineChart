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
