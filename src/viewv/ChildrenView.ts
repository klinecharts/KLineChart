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

import YAxis from '../componentl/YAxis'

import View from './View'

import { VisibleData } from '../store/ChartStore'
import { BarSpace } from '../store/TimeScaleStore'

export type DrawChildCallback = (
  data: VisibleData,
  barSpace: BarSpace,
  index: number
) => void

export type DrawEndCallback = () => void

export default abstract class ChildrenView extends View<YAxis> {
  protected drawChildren (drawChildCallback: DrawChildCallback, drawEndCallback?: DrawEndCallback): void {
    const pane = this.getWidget().getPane()
    const chartStore = pane.getChart().getChartStore()
    const visibleDataList = chartStore.getVisibleDataList()
    const barSpace = chartStore.getTimeScaleStore().getBarSpace()
    visibleDataList.forEach((data: VisibleData, index: number) => {
      drawChildCallback(data, barSpace, index)
    })
    drawEndCallback?.()
  }
}
