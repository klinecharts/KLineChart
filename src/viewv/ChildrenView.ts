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

import Widget from '../widget/Widget'

import View from './View'

import { VisibleData } from '../store/ChartStore'
import { BarSpace } from '../store/TimeScaleStore'

export default abstract class ChildrenView extends View<YAxis> {
  draw (ctx: CanvasRenderingContext2D, widget: Widget<YAxis>): void {
    this.drawStart(ctx, widget)
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const visibleDataList = chartStore.getVisibleDataList()
    const barSpace = chartStore.getTimeScaleStore().getBarSpace()
    const dataCount = visibleDataList.length
    const axis = pane.getAxisComponent()
    visibleDataList.forEach((data: VisibleData, index: number) => {
      this.drawChild(ctx, data, barSpace, index, dataCount, axis)
    })
    this.drawEnd(ctx, widget)
  }

  protected drawStart (ctx: CanvasRenderingContext2D, widget: Widget<YAxis>): void {
    this.clear()
  }

  protected drawEnd (ctx: CanvasRenderingContext2D, widget: Widget<YAxis>): void {}

  protected abstract drawChild (ctx: CanvasRenderingContext2D, data: VisibleData, barSpace: BarSpace, index: number, totalCount: number, axis: YAxis): void
}
