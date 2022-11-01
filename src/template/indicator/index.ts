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

import PickRequired from '../../common/PickRequired'
import TypeOrNull from '../../common/TypeOrNull'

import IndicatorTemplate, { Indicator, IndicatorConstructor } from './Indicator'

// import averagePrice from './averagePrice'
// import awesomeOscillator from './awesomeOscillator'
// import bias from './bias'
// import bollingerBands from './bollingerBands'
// import brar from './brar'
// import bullAndBearIndex from './bullAndBearIndex'
// import commodityChannelIndex from './commodityChannelIndex'
// import currentRatio from './currentRatio'
// import differentOfMovingAverage from './differentOfMovingAverage'
// import directionalMovementIndex from './directionalMovementIndex'
// import easeOfMovementValue from './easeOfMovementValue'
// import exponentialMovingAverage from './exponentialMovingAverage'
// import momentum from './momentum'
// import movingAverage from './movingAverage'
// import movingAverageConvergenceDivergence from './movingAverageConvergenceDivergence'
// import onBalanceVolume from './onBalanceVolume'
// import priceAndVolumeTrend from './priceAndVolumeTrend'
// import psychologicalLine from './psychologicalLine'
// import rateOfChange from './rateOfChange'
// import relativeStrengthIndex from './relativeStrengthIndex'
// import simpleMovingAverage from './simpleMovingAverage'
// import stoch from './stoch'
// import stopAndReverse from './stopAndReverse'
// import tripleExponentiallySmoothedAverage from './tripleExponentiallySmoothedAverage'
// import volume from './volume'
// import volumeRatio from './volumeRatio'
// import williamsR from './williamsR'

const indicators: { [key: string]: IndicatorConstructor } = {}

// const templates = [
//   averagePrice, awesomeOscillator, bias, bollingerBands, brar,
//   bullAndBearIndex, commodityChannelIndex, currentRatio, differentOfMovingAverage,
//   directionalMovementIndex, easeOfMovementValue, exponentialMovingAverage, momentum,
//   movingAverage, movingAverageConvergenceDivergence, onBalanceVolume, priceAndVolumeTrend,
//   psychologicalLine, rateOfChange, relativeStrengthIndex, simpleMovingAverage,
//   stoch, stopAndReverse, tripleExponentiallySmoothedAverage, volume, volumeRatio, williamsR
// ]

// templates.forEach((template: PickRequired<Omit<Indicator, 'result'>, 'calc'>) => {
//   indicators[template.name] = IndicatorTemplate.extend(template)
// })
// @ts-expect-error
const files = require.context('../src/template/indicator/', false)
console.log(files.keys())
files.keys().forEach((key: string) => {
  console.log(files(key).deafult)
  // indicators[template.name] = IndicatorTemplate.extend(template)
})

console.log(files.keys())
function reisterIndicator<D> (indicator: PickRequired<Omit<Indicator<D>, 'result'>, 'calc'>): void {
  indicators[indicator.name] = IndicatorTemplate.extend(indicator)
}

function getIndicatorClass (name: string): TypeOrNull<IndicatorConstructor> {
  return indicators[name] ?? null
}

export { reisterIndicator, getIndicatorClass }
