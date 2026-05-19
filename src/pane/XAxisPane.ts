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

import { isValid } from '../common/utils/typeChecks'
import type PickRequired from '../common/PickRequired'

import type DrawWidget from '../widget/DrawWidget'
import XAxisWidget from '../widget/XAxisWidget'

import type { XAxis, XAxisOverride } from '../component/XAxis'

import DrawPane from './DrawPane'
import type { PaneOptions } from './types'

import { getXAxisClass } from '../extension/x-axis'

import type Chart from '../Chart'

export default class XAxisPane extends DrawPane<XAxis> {
  private _xAxis: XAxis

  constructor (chart: Chart, options: PickRequired<PaneOptions, 'id'>) {
    super(chart, options)
    this.overrideXAxis({ name: 'normal', scrollZoomEnabled: true })
  }

  override setOptions (options: PaneOptions): this {
    return super.setOptions(options)
  }

  overrideXAxis (xAxis: XAxisOverride): this {
    const axisName = xAxis.name
    if (
      !isValid(this._xAxis) ||
      (isValid(axisName) && this._xAxis.name !== axisName)
    ) {
      this._xAxis = this.createXAxisComponent(axisName ?? 'normal')
    }
    this._xAxis.override(xAxis)
    this.setAxisCursor(this._xAxis.scrollZoomEnabled)
    return this
  }

  getXAxisComponent (): XAxis {
    return this._xAxis
  }

  private createXAxisComponent (name: string): XAxis {
    const XAxisClass = getXAxisClass(name)
    return new XAxisClass(this)
  }

  override createMainWidget (container: HTMLElement): DrawWidget<DrawPane<XAxis>> {
    return new XAxisWidget(container, this)
  }
}
