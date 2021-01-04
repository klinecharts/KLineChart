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

import averagePrice from './extension/technicalindicator/directionalmovement/averagePrice'
import bullAndBearIndex from './extension/technicalindicator/directionalmovement/bullAndBearIndex'
import differentOfMovingAverage from './extension/technicalindicator/directionalmovement/differentOfMovingAverage'
import directionalMovementIndex from './extension/technicalindicator/directionalmovement/directionalMovementIndex'
import easeOfMovementValue from './extension/technicalindicator/directionalmovement/easeOfMovementValue'
import exponentialMovingAverage from './extension/technicalindicator/directionalmovement/exponentialMovingAverage'
import movingAverage from './extension/technicalindicator/directionalmovement/movingAverage'
import movingAverageConvergenceDivergence from './extension/technicalindicator/directionalmovement/movingAverageConvergenceDivergence'
import simpleMovingAverage from './extension/technicalindicator/directionalmovement/simpleMovingAverage'
import tripleExponentiallySmoothedAverage from './extension/technicalindicator/directionalmovement/tripleExponentiallySmoothedAverage'

import brar from './extension/technicalindicator/momentum/brar'
import currentRatio from './extension/technicalindicator/momentum/currentRatio'
import momentum from './extension/technicalindicator/momentum/momentum'
import psychologicalLine from './extension/technicalindicator/momentum/psychologicalLine'
import rateOfChange from './extension/technicalindicator/momentum/rateOfChange'
import volumeRatio from './extension/technicalindicator/momentum/volumeRatio'

import awesomeOscillator from './extension/technicalindicator/oscillators/awesomeOscillator'
import bias from './extension/technicalindicator/oscillators/bias'
import commodityChannelIndex from './extension/technicalindicator/oscillators/commodityChannelIndex'
import relativeStrengthIndex from './extension/technicalindicator/oscillators/relativeStrengthIndex'
import stockIndicatorKDJ from './extension/technicalindicator/oscillators/stockIndicatorKDJ'
import williamsR from './extension/technicalindicator/oscillators/williamsR'

import bollingerBands from './extension/technicalindicator/volatility/bollingerBands'
import stopAndReverse from './extension/technicalindicator/volatility/stopAndReverse'

import onBalanceVolume from './extension/technicalindicator/volume/onBalanceVolume'
import priceAndVolumeTrend from './extension/technicalindicator/volume/priceAndVolumeTrend'
import volume from './extension/technicalindicator/volume/volume'

import extension from './extension/extension'
import { version, init, dispose } from './core'

extension.addTechnicalIndicator([
  averagePrice, bullAndBearIndex, differentOfMovingAverage, directionalMovementIndex, easeOfMovementValue,
  exponentialMovingAverage, movingAverage, movingAverageConvergenceDivergence, simpleMovingAverage, tripleExponentiallySmoothedAverage,
  brar, currentRatio, momentum, psychologicalLine, rateOfChange, volumeRatio,
  awesomeOscillator, bias, commodityChannelIndex, relativeStrengthIndex, stockIndicatorKDJ, williamsR,
  bollingerBands, stopAndReverse,
  onBalanceVolume, priceAndVolumeTrend, volume
])

export { version, init, dispose, extension }
