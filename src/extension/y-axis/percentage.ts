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

import { formatPrecision } from '../../common/utils/format'
import { isValid } from '../../common/utils/typeChecks'
import type { AxisTemplate } from '../../component/Axis'

const percentage: AxisTemplate = {
  name: 'percentage',
  minSpan: () => Math.pow(10, -2),
  displayValueToText: (value) => `${formatPrecision(value, 2)}%`,
  valueToRealValue: (value, { range }) => (range.range === 0 ? range.realFrom : ((value - range.from) / range.range) * range.realRange + range.realFrom),
  realValueToValue: (value, { range }) => (range.realRange === 0 ? range.from : ((value - range.realFrom) / range.realRange) * range.range + range.from),
  createRange: ({ chart, defaultRange }) => {
    const kLineDataList = chart.getDataList()
    const visibleRange = chart.getVisibleRange()
    const kLineData = kLineDataList[visibleRange.from]
    if (isValid(kLineData)) {
      const { from, to, range } = defaultRange
      const base = kLineData.close
      const realFrom = base === 0 ? 0 : ((defaultRange.from - base) / base) * 100
      const realTo = base === 0 ? 0 : ((defaultRange.to - base) / base) * 100
      const realRange = realTo - realFrom
      return {
        from,
        to,
        range,
        realFrom,
        realTo,
        realRange,
        displayFrom: realFrom,
        displayTo: realTo,
        displayRange: realRange
      }
    }
    return defaultRange
  }
}

export default percentage
