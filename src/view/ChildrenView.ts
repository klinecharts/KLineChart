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

import View from './View'
import type { VisibleRangeData } from '../common/Data'
import type BarSpace from '../common/BarSpace'
import type { YAxis } from '../component/YAxis'

export type EachChildCallback = (
  data: VisibleRangeData,
  barSpace: BarSpace,
  index: number
) => void

export default abstract class ChildrenView extends View<YAxis> {
  protected eachChildren (childCallback: EachChildCallback): void {
    const pane = this.getWidget().getPane()
    const chartStore = pane.getChart().getChartStore()
    const visibleRangeDataList = chartStore.getVisibleRangeDataList()
    const barSpace = chartStore.getBarSpace()
    const dataLength = visibleRangeDataList.length
    let index = 0
    while (index < dataLength) {
      childCallback(visibleRangeDataList[index], barSpace, index)
      ++index
    }
  }
}
