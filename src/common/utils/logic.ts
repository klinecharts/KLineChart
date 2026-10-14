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

import type { KLineData, NeighborData } from '../Data'
import type Nullable from '../Nullable'
import type { CandleColorCompareRule, ChangeColor, CompareColorCallback } from '../Styles'
import { isFunction, isString, isValid } from './typeChecks'

type CompareColorStyle = ChangeColor & { compareRule: CandleColorCompareRule }

export function getCompareColor(data: NeighborData<Nullable<KLineData>>, styles: CompareColorStyle, color?: Nullable<string | CompareColorCallback>): string {
  if (isFunction<CompareColorCallback>(color)) {
    return color(data)
  }
  if (isString(color)) {
    return color
  }
  const current = data.current
  if (!isValid(current)) {
    return styles.noChangeColor
  }
  const comparePrice = styles.compareRule === 'current_open' ? current.open : (data.prev?.close ?? current.close)
  if (current.close > comparePrice) {
    return styles.upColor
  }
  if (current.close < comparePrice) {
    return styles.downColor
  }
  return styles.noChangeColor
}
