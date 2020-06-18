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

import TechnicalIndicator from './TechnicalIndicator'

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
import { isArray, isFunction, isNumber, isValid } from '../../utils/typeChecks'
import { formatBigNumber, formatPrecision } from '../../utils/format'
import { DEV } from '../../utils/env'

/**
 * 创建技术指标集合
 */
export function createTechnicalIndicators () {
  return {
    [MA]: {
      structure: MovingAverage,
      precision: 4,
      calcParams: [5, 10, 30, 60]
    },
    [EMA]: {
      structure: ExponentialMovingAverage,
      precision: 4,
      calcParams: [6, 12, 20]
    },
    [VOL]: {
      structure: Volume,
      precision: 0,
      calcParams: [5, 10, 20]
    },
    [MACD]: {
      structure: MovingAverageConvergenceDivergence,
      precision: 4,
      calcParams: [12, 26, 9]
    },
    [BOLL]: {
      structure: BollingerBands,
      precision: 4,
      calcParams: [20]
    },
    [KDJ]: {
      structure: StockIndicatorKDJ,
      precision: 4,
      calcParams: [9, 3, 3]
    },
    [RSI]: {
      structure: RelativeStrengthIndex,
      precision: 4,
      calcParams: [6, 12, 24]
    },
    [BIAS]: {
      structure: Bias,
      precision: 4,
      calcParams: [6, 12, 24]
    },
    [BRAR]: {
      structure: Brar,
      precision: 4,
      calcParams: [26]
    },
    [CCI]: {
      structure: CommodityChannelIndex,
      precision: 4,
      calcParams: [13]
    },
    [DMI]: {
      structure: DirectionalMovementIndex,
      precision: 4,
      calcParams: [14, 6]
    },
    [CR]: {
      structure: CurrentRatio,
      precision: 4,
      calcParams: [26, 10, 20, 40, 60]
    },
    [PSY]: {
      structure: PsychologicalLine,
      precision: 4,
      calcParams: [12, 6]
    },
    [DMA]: {
      structure: DifferentOfMovingAverage,
      precision: 4,
      calcParams: [10, 50, 10]
    },
    [TRIX]: {
      structure: TripleExponentiallySmoothedAverage,
      precision: 4,
      calcParams: [12, 20]
    },
    [OBV]: {
      structure: OnBalanceVolume,
      precision: 4,
      calcParams: [30]
    },
    [VR]: {
      structure: VolumeRatio,
      precision: 4,
      calcParams: [24, 30]
    },
    [WR]: {
      structure: WilliamsR,
      precision: 4,
      calcParams: [6, 10, 14]
    },
    [MTM]: {
      structure: Momentum,
      precision: 4,
      calcParams: [6, 10]
    },
    [EMV]: {
      structure: EaseOfMovementValue,
      precision: 4,
      calcParams: [14, 9]
    },
    [SAR]: {
      structure: StopAndReverse,
      precision: 4,
      calcParams: [2, 2, 20]
    }
  }
}

/**
 * 创建一个新的技术指标
 * @param name
 * @param calcParams
 * @param plots
 * @param precision
 * @param shouldCheckParamCount
 * @param shouldOhlc
 * @param shouldFormatBigNumber
 * @param baseValue
 * @param minValue
 * @param maxValue
 * @param calcTechnicalIndicator
 * @param regeneratePlots
 * @returns {null|{precision: (*|number), calcParams: (*|[]), structure: NewTechnicalIndicator}}
 */
export function createNewTechnicalIndicator ({
  name, calcParams, plots, precision, shouldCheckParamCount,
  shouldOhlc, shouldFormatBigNumber, baseValue, minValue, maxValue,
  calcTechnicalIndicator, regeneratePlots
}) {
  if (!name || !isFunction(calcTechnicalIndicator)) {
    if (DEV) {
      console.warn(
        'The required attribute "name" and method "calcTechnicalIndicator" are missing, and new technical indicator cannot be generated!!!'
      )
    }
    return null
  }
  class NewTechnicalIndicator extends TechnicalIndicator {
    constructor () {
      super(
        {
          name,
          calcParams,
          plots,
          precision,
          shouldCheckParamCount,
          shouldOhlc,
          shouldFormatBigNumber,
          baseValue,
          minValue,
          maxValue
        }
      )
    }
  }
  NewTechnicalIndicator.prototype.calcTechnicalIndicator = calcTechnicalIndicator
  if (regeneratePlots) {
    NewTechnicalIndicator.prototype.regeneratePlots = regeneratePlots
  }
  return {
    structure: NewTechnicalIndicator,
    precision: isValid(precision) && isNumber(precision) && precision >= 0 ? precision : 4,
    calcParams: isArray(calcParams) ? calcParams : []
  }
}

/**
 * 获取技术指标信息
 * @param technicalIndicatorData
 * @param technicalIndicator
 * @param yAxis
 * @returns {{values: [], name: string, labels: []}}
 */
export function getTechnicalIndicatorInfo (technicalIndicatorData = {}, technicalIndicator, yAxis) {
  const calcParams = technicalIndicator.calcParams
  const plots = technicalIndicator.plots
  const precision = technicalIndicator.precision
  const shouldFormatBigNumber = technicalIndicator.shouldFormatBigNumber

  const labels = []
  const values = []
  let name = ''
  if (plots.length > 0) {
    name = technicalIndicator.name
  }
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
      if (shouldFormatBigNumber) {
        value = formatBigNumber(value)
      }
    }
    values.push({ value, y })
  })
  return { labels, values, name }
}
