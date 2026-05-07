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
import type PickRequired from '../common/PickRequired'

import type Nullable from '../common/Nullable'
import type { UpdateLevel } from '../common/Updater'
import type Bounding from '../common/Bounding'

import { isValid, merge } from '../common/utils/typeChecks'

import type { Axis, AxisCreate } from '../component/Axis'

import type DrawWidget from '../widget/DrawWidget'
import type YAxisWidget from '../widget/YAxisWidget'

import Pane from './Pane'
import { type PaneOptions, PANE_DEFAULT_HEIGHT, PANE_MIN_HEIGHT, PaneIdConstants, YAxisIdConstants } from './types'

import type Chart from '../Chart'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'
import type YAxisImp from '../component/YAxis'
import type { YAxis } from '../component/YAxis'

export default abstract class DrawPane<C extends Axis = Axis> extends Pane {
  private readonly _mainWidget: DrawWidget<DrawPane<C>>
  private readonly _yAxisWidgets = new Map<string, YAxisWidget>()
  private readonly _yAxisComponents = new Map<string, YAxis>()
  private _yAxesBounding: Record<string, Partial<Bounding>> = {}

  private readonly _options: DeepRequired<PaneOptions> = {
    id: '',
    minHeight: PANE_MIN_HEIGHT,
    dragEnabled: true,
    order: 0,
    height: PANE_DEFAULT_HEIGHT,
    // state: 'normal',
    axis: { name: 'normal', scrollZoomEnabled: true }
  }

  constructor (chart: Chart, options: PickRequired<PaneOptions, 'id'>) {
    super(chart, options.id)
    const container = this.getContainer()
    this._mainWidget = this.createMainWidget(container)
    this.setOptions(options)
  }

  setOptions (options: PaneOptions): this {
    merge(this._options, options)
    this.setAxisCursor(options.axis?.scrollZoomEnabled ?? true)
    this.setBounding({ height: this._options.height })
    return this
  }

  protected setAxisCursor (scrollZoomEnabled: boolean): void {
    let container: Nullable<HTMLElement> = null
    let cursor = 'default'
    if (this.getId() === PaneIdConstants.X_AXIS) {
      container = this.getMainWidget().getContainer()
      cursor = 'ew-resize'
    } else {
      container = this.getYAxisWidget()!.getContainer()
      cursor = 'ns-resize'
    }
    if (scrollZoomEnabled) {
      container.style.cursor = cursor
    } else {
      container.style.cursor = 'default'
    }
  }

  createYAxis (axis?: Partial<AxisCreate>): YAxis {
    const yAxisId = axis?.id ?? YAxisIdConstants.DEFAULT
    let yAxis = this._yAxisComponents.get(yAxisId)
    if (!isValid(yAxis)) {
      yAxis = this.createYAxisComponent(axis?.name ?? this._options.axis.name ?? 'normal')
      yAxis.id = yAxisId
      this._yAxisComponents.set(yAxisId, yAxis)
      const yAxisWidget = this.createYAxisWidget(this.getContainer(), yAxis)
      if (isValid(yAxisWidget)) {
        this._yAxisWidgets.set(yAxisId, yAxisWidget)
      }
    }
    ;(yAxis as unknown as YAxisImp).setAutoCalcTickFlag(true)
    yAxis.override({
      ...this._options.axis,
      ...axis,
      name: axis?.name ?? this._options.axis.name ?? 'normal'
    })
    return yAxis
  }

  getOptions (): DeepRequired<PaneOptions> { return this._options }

  getYAxisComponents (): YAxis[] {
    return Array.from(this._yAxisComponents.values())
  }

  getYAxisComponentById (yAxisId?: string): YAxis {
    return this._yAxisComponents.get(yAxisId ?? YAxisIdConstants.DEFAULT)!
  }

  setYAxesBounding (bounding: Record<string, Partial<Bounding>>): void {
    this._yAxesBounding = bounding
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
    if (this._yAxisWidgets.size > 0) {
      this._yAxisWidgets.forEach((yAxisWidget, yAxisId) => {
        yAxisWidget.setBounding(contentBounding)
        if (isValid(this._yAxesBounding[yAxisId])) {
          yAxisWidget.setBounding(this._yAxesBounding[yAxisId])
          return
        }
        const yAxis = this.getYAxisComponentById(yAxisId)
        if (yAxis.position === 'left') {
          if (isValid(leftYAxisBounding)) {
            yAxisWidget.setBounding({ ...leftYAxisBounding, left: 0 })
          }
        } else {
          if (isValid(rightYAxisBounding)) {
            yAxisWidget.setBounding(rightYAxisBounding)
            if (mainBoundingValid) {
              yAxisWidget.setBounding({
                left: (mainBounding.left ?? 0) +
                  (mainBounding.width ?? 0) +
                  (mainBounding.right ?? 0) -
                  (rightYAxisBounding.width ?? 0)
              })
            }
          }
        }
      })
    }
    return this
  }

  getMainWidget (): DrawWidget<DrawPane<C>> { return this._mainWidget }

  getYAxisWidget (): Nullable<YAxisWidget> { return this.getYAxisWidgetById() }

  getYAxisWidgets (): YAxisWidget[] { return Array.from(this._yAxisWidgets.values()) }

  getYAxisWidgetById (yAxisId?: string): Nullable<YAxisWidget> {
    return this._yAxisWidgets.get(yAxisId ?? YAxisIdConstants.DEFAULT) ?? null
  }

  override updateImp (level: UpdateLevel): void {
    this._mainWidget.update(level)
    this._yAxisWidgets.forEach(widget => { widget.update(level) })
  }

  destroy (): void {
    this._mainWidget.destroy()
    this._yAxisWidgets.forEach(widget => { widget.destroy() })
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
    this._yAxisWidgets.forEach(yAxisWidget => {
      const yAxisBounding = yAxisWidget.getBounding()
      ctx.drawImage(
        yAxisWidget.getImage(includeOverlay),
        yAxisBounding.left, 0,
        yAxisBounding.width, yAxisBounding.height
      )
    })
    return canvas
  }

  protected createYAxisComponent (_name: string): YAxis {
    throw new Error('createYAxisComponent is not implemented.')
  }

  protected createYAxisWidget (_container: HTMLElement, _yAxis: YAxis): Nullable<YAxisWidget> { return null }

  protected abstract createMainWidget (container: HTMLElement): DrawWidget<DrawPane<C>>
}
