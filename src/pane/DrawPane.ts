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

import type DeepRequired from '../common/DeepRequired'
import type Nullable from '../common/Nullable'
import { type UpdateLevel } from '../common/Updater'
import type Bounding from '../common/Bounding'

import { isString, isValid, merge } from '../common/utils/typeChecks'

import type Axis from '../component/Axis'

import type DrawWidget from '../widget/DrawWidget'
import type YAxisWidget from '../widget/YAxisWidget'

import Pane from './Pane'
import { type PaneOptions, PANE_MIN_HEIGHT, PaneIdConstants } from './types'

import type Chart from '../Chart'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'
import type PickPartial from '../common/PickPartial'

export default abstract class DrawPane<C extends Axis = Axis> extends Pane {
  private readonly _mainWidget: DrawWidget<DrawPane<C>>
  private readonly _yAxisWidget: Nullable<YAxisWidget> = null

  private _axis: C

  private readonly _options: PickPartial<DeepRequired<Omit<PaneOptions, 'id' | 'height'>>, 'position'> = { minHeight: PANE_MIN_HEIGHT, dragEnabled: true, gap: { top: 0.2, bottom: 0.1 }, axisOptions: { name: 'default', scrollZoomEnabled: true } }

  constructor (rootContainer: HTMLElement, afterElement: Nullable<HTMLElement>, chart: Chart, id: string, options: Omit<PaneOptions, 'id' | 'height'>) {
    super(rootContainer, afterElement, chart, id)
    const container = this.getContainer()
    this._mainWidget = this.createMainWidget(container)
    this._yAxisWidget = this.createYAxisWidget(container)
    this.setOptions(options)
  }

  setOptions (options: Omit<PaneOptions, 'id' | 'height'>): this {
    const name = options.axisOptions?.name
    if (
      (this._options.axisOptions.name !== name && isString(name)) ||
      !isValid(this._axis)
    ) {
      this._axis = this.createAxisComponent(name ?? 'default')
    }
    merge(this._options, options)
    let container: HTMLElement
    let cursor: string
    if (this.getId() === PaneIdConstants.X_AXIS) {
      container = this.getMainWidget().getContainer()
      cursor = 'ew-resize'
    } else {
      container = this.getYAxisWidget()!.getContainer()
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

  override setBounding (rootBounding: Partial<Bounding>, mainBounding?: Partial<Bounding>, yAxisBounding?: Partial<Bounding>): this {
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

  destroy (): void {
    super.destroy()
    this._mainWidget.destroy()
    this._yAxisWidget?.destroy()
  }

  override getImage (includeOverlay: boolean): HTMLCanvasElement {
    const { width, height } = this.getBounding()
    const canvas = createDom('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d')!
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

  protected abstract createAxisComponent (name: string): C

  protected createYAxisWidget (_container: HTMLElement): Nullable<YAxisWidget> { return null }

  protected abstract createMainWidget (container: HTMLElement): DrawWidget<DrawPane<C>>
}
