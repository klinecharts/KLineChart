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
import EaseOfMovementValue from './directionalmovement/EaseOfMovementValue'

import {
  MA, EMA, VOL, MACD, KDJ, BOLL, RSI,
  BIAS, BRAR, CCI, DMI, CR, PSY, DMA,
  TRIX, OBV, VR, WR, MTM, EMV, SAR
} from './technicalIndicatorType'
import { isValid } from '../../utils/typeChecks'
import { formatBigNumber, formatPrecision } from '../../utils/format'

/**
 * 创建技术指标集合
 */
export function createTechnicalIndicators () {
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
    [EMV]: new EaseOfMovementValue(),
    [SAR]: new StopAndReverse()
  }
}

export function getTechnicalIndicatorInfo (technicalIndicatorData = {}, technicalIndicator, yAxis) {
  const calcParams = technicalIndicator.calcParams
  const plots = technicalIndicator.plots
  const precision = technicalIndicator.precision
  const isVolumeTechnicalIndicator = technicalIndicator.isVolumeTechnicalIndicator

  const labels = []
  const values = []
  let name = technicalIndicator.name
  if (calcParams.length > 0) {
    name = `${name}(${calcParams.join(',')})`
  }
  plots.forEach(plot => {
    labels.push(plot.key.toUpperCase())
    let value = technicalIndicatorData[plot.key]
    let y
    if (isValid(value)) {
      y = yAxis.convertToPixel(value)
      value = formatPrecision(value, precision)
      if (isVolumeTechnicalIndicator) {
        value = formatBigNumber(value)
      }
    }
    values.push({ value, y })
  })
  return { labels, values, name }
}
