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

import { index10, log10 } from '../../common/utils/number'
import type { AxisTemplate } from '../../component/Axis'

function valueToLogarithm(value: number): number {
  return value < 0 ? -log10(1 - value) : log10(1 + value)
}

function logarithmToValue(value: number): number {
  return value < 0 ? 1 - index10(-value) : index10(value) - 1
}

const logarithm: AxisTemplate = {
  name: 'logarithm',
  minSpan: (precision) => 0.05 * index10(-precision),
  valueToRealValue: (value) => valueToLogarithm(value),
  realValueToDisplayValue: (value) => logarithmToValue(value),
  displayValueToRealValue: (value) => valueToLogarithm(value),
  realValueToValue: (value) => logarithmToValue(value),
  createRange: ({ defaultRange }) => {
    const { from, to, range } = defaultRange
    const realFrom = valueToLogarithm(from)
    const realTo = valueToLogarithm(to)
    return {
      from,
      to,
      range,
      realFrom,
      realTo,
      realRange: realTo - realFrom,
      displayFrom: from,
      displayTo: to,
      displayRange: range
    }
  }
}

export default logarithm
