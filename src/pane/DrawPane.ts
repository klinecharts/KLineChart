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
import type { UpdateLevel } from '../common/Updater'
import type Bounding from '../common/Bounding'

import { isValid, merge } from '../common/utils/typeChecks'

import type { Axis } from '../component/Axis'

import type DrawWidget from '../widget/DrawWidget'
import type YAxisWidget from '../widget/YAxisWidget'

import Pane from './Pane'
import { type PaneOptions, PANE_DEFAULT_HEIGHT, PANE_MIN_HEIGHT, PaneIdConstants } from './types'

import type Chart from '../Chart'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'
import YAxisImp, { type YAxis } from '../component/YAxis'

export default abstract class DrawPane<C extends Axis = Axis> extends Pane {
  private readonly _mainWidget: DrawWidget<DrawPane<C>>
  private readonly _yAxisWidget: Nullable<YAxisWidget> = null

  private _axis: C

  private readonly _options: DeepRequired<PaneOptions> = {
    id: '',
    minHeight: PANE_MIN_HEIGHT,
    dragEnabled: true,
    order: 0,
    height: PANE_DEFAULT_HEIGHT,
    state: 'normal',
    axis: { name: 'normal', scrollZoomEnabled: true }
  }

  constructor (chart: Chart, id: string, options: Omit<PaneOptions, 'id' | 'height'>) {
    super(chart, id)
    const container = this.getContainer()
    this._mainWidget = this.createMainWidget(container)
    this._yAxisWidget = this.createYAxisWidget(container)
    this.setOptions(options)
  }

  setOptions (options: PaneOptions): this {
    const paneId = this.getId()
    if (paneId === PaneIdConstants.CANDLE || paneId === PaneIdConstants.X_AXIS) {
      const axisName = options.axis?.name
      if (
        !isValid(this._axis) ||
        (isValid(axisName) && this._options.axis.name !== axisName)
      ) {
        this._axis = this.createAxisComponent(axisName ?? 'normal')
      }
    } else {
      if (!isValid(this._axis)) {
        this._axis = this.createAxisComponent('normal')
      }
    }
    if (this._axis instanceof YAxisImp) {
      this._axis.setAutoCalcTickFlag(true)
    }
    merge(this._options, options)
    this._axis.override({
      ...this._options.axis,
      name: options.axis?.name ?? 'normal'
    })
    let container: Nullable<HTMLElement> = null
    let cursor = 'default'
    if (this.getId() === PaneIdConstants.X_AXIS) {
      container = this.getMainWidget().getContainer()
      cursor = 'ew-resize'
    } else {
      container = this.getYAxisWidget()!.getContainer()
      cursor = 'ns-resize'
    }
    if (options.axis?.scrollZoomEnabled ?? true) {
      container.style.cursor = cursor
    } else {
      container.style.cursor = 'default'
    }
    return this
  }

  getOptions (): DeepRequired<PaneOptions> { return this._options }

  getAxisComponent (): C {
    return this._axis
  }

  override setBounding (
    rootBounding: Partial<Bounding>,
    mainBounding?: Partial<Bounding>,
    leftYAxisBounding?: Partial<Bounding>,
    rightYAxisBounding?: Partial<Bounding>
  ): this {
    merge(this.getBounding(), rootBounding)
    const contentBounding: Partial<Bounding> = {}
    if (isValid(rootBounding.height)) {
      contentBounding.height = rootBounding.height
    }
    if (isValid(rootBounding.top)) {
      contentBounding.top = rootBounding.top
    }
    this._mainWidget.setBounding(contentBounding)
    const mainBoundingValid = isValid(mainBounding)
    if (mainBoundingValid) {
      this._mainWidget.setBounding(mainBounding)
    }
    if (isValid(this._yAxisWidget)) {
      this._yAxisWidget.setBounding(contentBounding)
      const yAxis = this._axis as unknown as YAxis
      if (yAxis.position === 'left') {
        if (isValid(leftYAxisBounding)) {
          this._yAxisWidget.setBounding({ ...leftYAxisBounding, left: 0 })
        }
      } else {
        if (isValid(rightYAxisBounding)) {
          this._yAxisWidget.setBounding(rightYAxisBounding)
          if (mainBoundingValid) {
            this._yAxisWidget.setBounding({
              left: (mainBounding.left ?? 0) +
                (mainBounding.width ?? 0) +
                (mainBounding.right ?? 0) -
                (rightYAxisBounding.width ?? 0)
            })
          }
        }
      }
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
