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
import MovingAverage from './directionalmovement/MovingAverage'
import ExponentialMovingAverage from './directionalmovement/ExponentialMovingAverage'
import Volume from './volume/Volume'
import MovingAverageConvergenceDivergence from './directionalmovement/MovingAverageConvergenceDivergence'
import BollingerBands from './volatility/BollingerBands'
import StockIndicatorKDJ from './oscillators/StockIndicatorKDJ'
import RelativeStrengthIndex from './oscillators/RelativeStrengthIndex'
import Bias from './oscillators/Bias'
import Brar from './momentum/Brar'
import CommodityChannelIndex from './oscillators/CommodityChannelIndex'
import DirectionalMovementIndex from './directionalmovement/DirectionalMovementIndex'
import CurrentRatio from './momentum/CurrentRatio'
import PsychologicalLine from './momentum/PsychologicalLine'
import DifferentOfMovingAverage from './directionalmovement/DifferentOfMovingAverage'
import TripleExponentiallySmoothedAverage from './directionalmovement/TripleExponentiallySmoothedAverage'
import OnBalanceVolume from './volume/OnBalanceVolume'
import VolumeRatio from './momentum/VolumeRatio'
import WilliamsR from './oscillators/WilliamsR'
import Momentum from './momentum/Momentum'
import StopAndReverse from './volatility/StopAndReverse'

export const NO = 'NO'
export const AVERAGE = 'AVERAGE'
export const MA = 'MA'
export const EMA = 'EMA'
export const VOL = 'VOL'
export const MACD = 'MACD'
export const BOLL = 'BOLL'
export const KDJ = 'KDJ'
export const RSI = 'RSI'
export const BIAS = 'BIAS'
export const BRAR = 'BRAR'
export const CCI = 'CCI'
export const DMI = 'DMI'
export const CR = 'CR'
export const PSY = 'PSY'
export const DMA = 'DMA'
export const TRIX = 'TRIX'
export const OBV = 'OBV'
export const VR = 'VR'
export const WR = 'WR'
export const MTM = 'MTM'
export const EMV = 'EMV'
export const SAR = 'SAR'

export default function createTechnicalIndicator () {
  return {
    [MA]: new MovingAverage(),
    [EMA]: new ExponentialMovingAverage(),
    [VOL]: new Volume(),
    [MACD]: new MovingAverageConvergenceDivergence(),
    [BOLL]: new BollingerBands(),
    [KDJ]: new StockIndicatorKDJ(),
    [RSI]: new RelativeStrengthIndex(),
    [BIAS]: new Bias(),
    [BRAR]: new Brar(),
    [CCI]: new CommodityChannelIndex(),
    [DMI]: new DirectionalMovementIndex(),
    [CR]: new CurrentRatio(),
    [PSY]: new PsychologicalLine(),
    [DMA]: new DifferentOfMovingAverage(),
    [TRIX]: new TripleExponentiallySmoothedAverage(),
    [OBV]: new OnBalanceVolume(),
    [VR]: new VolumeRatio(),
    [WR]: new WilliamsR(),
    [MTM]: new Momentum(),
    [EMV]: new ExponentialMovingAverage(),
    [SAR]: new StopAndReverse()
  }
}
