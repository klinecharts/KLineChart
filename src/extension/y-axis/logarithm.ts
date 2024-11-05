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

import { log10, index10 } from '../../common/utils/number'
import type { AxisTemplate } from '../../component/Axis'

const logarithm: AxisTemplate = {
  name: 'logarithm',
  minSpan: (precision) => 0.05 * index10(-precision),
  valueToRealValue: (value) => value < 0 ? -log10(Math.abs(value)) : log10(value),
  realValueToDisplayValue: (value) => value < 0 ? -index10(Math.abs(value)) : index10(value),
  displayValueToRealValue: (value) => value < 0 ? -log10(Math.abs(value)) : log10(value),
  realValueToValue: (value) => value < 0 ? -index10(Math.abs(value)) : index10(value),
  createRange: ({ defaultRange }) => {
    const { from, to, range } = defaultRange
    const realFrom = from < 0 ? -log10(Math.abs(from)) : log10(from)
    const realTo = to < 0 ? -log10(Math.abs(to)) : log10(to)
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
