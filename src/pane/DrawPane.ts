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

import DeepRequired from '../common/DeepRequired'
import Nullable from '../common/Nullable'
import { UpdateLevel } from '../common/Updater'
import Bounding from '../common/Bounding'

import { isValid, merge } from '../common/utils/typeChecks'

import Axis from '../component/Axis'

import DrawWidget from '../widget/DrawWidget'
import YAxisWidget from '../widget/YAxisWidget'

import Pane from './Pane'
import { PaneOptions, PANE_MIN_HEIGHT, PaneIdConstants } from './types'

import Chart from '../Chart'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'
import PickPartial from '../common/PickPartial'

export default abstract class DrawPane<C extends Axis = Axis> extends Pane {
  private readonly _mainWidget: DrawWidget<DrawPane<C>>
  private readonly _yAxisWidget: Nullable<YAxisWidget> = null

  private readonly _axis: C = this.createAxisComponent()

  private readonly _options: PickPartial<DeepRequired<Omit<PaneOptions, 'id' | 'height'>>, 'position'> = { minHeight: PANE_MIN_HEIGHT, dragEnabled: true, gap: { top: 0.2, bottom: 0.1 }, axisOptions: { scrollZoomEnabled: true } }

  constructor (rootContainer: HTMLElement, afterElement: Nullable<HTMLElement>, chart: Chart, id: string) {
    super(rootContainer, afterElement, chart, id)
    const container = this.getContainer()
    this._mainWidget = this.createMainWidget(container)
    this._yAxisWidget = this.createYAxisWidget(container)
  }

  setOptions (options: Omit<PaneOptions, 'id' | 'height'>): DrawPane<C> {
    merge(this._options, options)
    let container: HTMLElement
    let cursor: string
    if (this.getId() === PaneIdConstants.X_AXIS) {
      container = this.getMainWidget().getContainer()
      cursor = 'ew-resize'
    } else {
      container = this.getYAxisWidget()?.getContainer() as HTMLElement
      cursor = 'ns-resize'
    }
    if (options.axisOptions?.scrollZoomEnabled ?? true) {
      container.style.cursor = cursor
    } else {
      container.style.cursor = 'default'
    }
    return this
  }

  getOptions (): PickPartial<DeepRequired<Omit<PaneOptions, 'id' | 'height'>>, 'position'> { return this._options }

  getAxisComponent (): C {
    return this._axis
  }

  override setBounding (rootBounding: Partial<Bounding>, mainBounding?: Partial<Bounding>, yAxisBounding?: Partial<Bounding>): DrawPane {
    merge(this.getBounding(), rootBounding)
    const contentBounding: Partial<Bounding> = {}
    if (isValid(rootBounding.height)) {
      contentBounding.height = rootBounding.height
    }
    if (isValid(rootBounding.top)) {
      contentBounding.top = rootBounding.top
    }
    this._mainWidget.setBounding(contentBounding)
    this._yAxisWidget?.setBounding(contentBounding)
    if (isValid(mainBounding)) {
      this._mainWidget.setBounding(mainBounding)
    }
    if (isValid(yAxisBounding)) {
      this._yAxisWidget?.setBounding(yAxisBounding)
    }
    return this
  }

  getMainWidget (): DrawWidget<DrawPane<C>> { return this._mainWidget }

  getYAxisWidget (): Nullable<YAxisWidget> { return this._yAxisWidget }

  override updateImp (level: UpdateLevel): void {
    this._mainWidget.update(level)
    this._yAxisWidget?.update(level)
  }

  override getImage (includeOverlay: boolean): HTMLCanvasElement {
    const { width, height } = this.getBounding()
    const canvas = createDom('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    const mainBounding = this._mainWidget.getBounding()
    ctx.drawImage(
      this._mainWidget.getImage(includeOverlay),
      mainBounding.left, 0,
      mainBounding.width, mainBounding.height
    )
    if (this._yAxisWidget !== null) {
      const yAxisBounding = this._yAxisWidget.getBounding()
      ctx.drawImage(
        this._yAxisWidget.getImage(includeOverlay),
        yAxisBounding.left, 0,
        yAxisBounding.width, yAxisBounding.height
      )
    }
    return canvas
  }

  protected abstract createAxisComponent (): C

  protected createYAxisWidget (_container: HTMLElement): Nullable<YAxisWidget> { return null }

  protected abstract createMainWidget (container: HTMLElement): DrawWidget<DrawPane<C>>
}
