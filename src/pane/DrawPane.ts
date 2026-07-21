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


import type Chart from '../Chart'
import type Bounding from '../common/Bounding'
import type DeepRequired from '../common/DeepRequired'

import type Nullable from '../common/Nullable'
import type PickRequired from '../common/PickRequired'
import type { UpdateLevel } from '../common/Updater'
import { getPixelRatio } from '../common/utils/canvas'
import { createDom } from '../common/utils/dom'
import { isBoolean, isNumber, isValid, merge } from '../common/utils/typeChecks'
import type { Axis } from '../component/Axis'
import type YAxisImp from '../component/YAxis'
import type { YAxis, YAxisOverride } from '../component/YAxis'
import type DrawWidget from '../widget/DrawWidget'
import type YAxisWidget from '../widget/YAxisWidget'
import Pane from './Pane'
import { PaneIdConstants, type PaneOptions } from './types'

export default abstract class DrawPane<C extends Axis = Axis> extends Pane {
  private readonly _mainWidget: DrawWidget<DrawPane<C>>
  private readonly _yAxisWidgets = new Map<string, YAxisWidget>()
  private readonly _yAxisComponents = new Map<string, YAxis>()
  private readonly _manualYAxisIds = new Set<string>()
  private _defaultYAxisId: Nullable<string> = null
  private _yAxesBounding: Record<string, Partial<Bounding>> = {}

  private readonly _options: PaneOptions

  constructor (chart: Chart, options: PaneOptions) {
    super(chart, options.id)
    const container = this.getContainer()
    this._mainWidget = this.createMainWidget(container)
    this._options = options
  }

  setOptions (options: Partial<PaneOptions>): this {
    merge(this._options, options)
    if (isNumber(options.height) && options.height > 0) {
      this.setBounding({ height: this._options.height })
    }
    return this
  }

  protected setAxisCursor (scrollZoomEnabled?: boolean, yAxisId?: string): void {
    let container: Nullable<HTMLElement> = null
    let cursor = 'default'
    if (this.getId() === PaneIdConstants.X_AXIS) {
      container = this.getMainWidget().getContainer()
      cursor = 'ew-resize'
    } else {
      container = this.getYAxisWidgetById(yAxisId)?.getContainer() ?? null
      cursor = 'ns-resize'
    }
    if (!isValid(container) || !isBoolean(scrollZoomEnabled)) {
      return
    }
    if (scrollZoomEnabled) {
      container.style.cursor = cursor
    } else {
      container.style.cursor = 'default'
    }
  }

  createOrOverrideYAxis (override: PickRequired<YAxisOverride, 'id'>): YAxis {
    const axis = { ...override, paneId: this.getId() }
    const yAxisId = axis.id
    const yAxisName = axis.name ?? 'normal'
    const needWidget = axis.needWidget ?? true
    let yAxis = this._yAxisComponents.get(yAxisId)
    const shouldCreateYAxis = !isValid(yAxis) || (isValid(axis.name) && yAxis.name !== axis.name)
    if (shouldCreateYAxis) {
      this._yAxisWidgets.get(yAxisId)?.destroy()
      this._yAxisWidgets.delete(yAxisId)
      yAxis = this.createYAxisComponent(yAxisName)
      yAxis.id = yAxisId
      yAxis.paneId = this.getId()
      this._yAxisComponents.set(yAxisId, yAxis)
      this._defaultYAxisId ??= yAxisId
      if (needWidget) {
        const yAxisWidget = this.createYAxisWidget(this.getContainer(), yAxis)
        if (isValid(yAxisWidget)) {
          this._yAxisWidgets.set(yAxisId, yAxisWidget)
        }
      }
    } else if (isBoolean(axis.needWidget) && isValid(yAxis)) {
      const yAxisWidget = this._yAxisWidgets.get(yAxisId)
      if (axis.needWidget && !isValid(yAxisWidget)) {
        const newYAxisWidget = this.createYAxisWidget(this.getContainer(), yAxis)
        if (isValid(newYAxisWidget)) {
          this._yAxisWidgets.set(yAxisId, newYAxisWidget)
        }
      } else if (!axis.needWidget && isValid(yAxisWidget)) {
        yAxisWidget.destroy()
        this._yAxisWidgets.delete(yAxisId)
      }
    }
    if (!isValid(yAxis)) {
      throw new Error('create yAxis failed.')
    }
    ;(yAxis as unknown as YAxisImp).setAutoCalcTickFlag(true)
    yAxis.override({
      ...axis,
      name: yAxisName
    })
    this.setAxisCursor(yAxis.scrollZoomEnabled, yAxisId)
    // Inherit the pane's current geometry. Recreating the axis (e.g. via
    // `overrideYAxis({ name })`) destroys the old widget, and follow-up
    // layouts only measure width, so without this the new widget keeps
    // height 0 and the axis collapses (squashed bars, no ticks).
    const bounding = this.getBounding()
    this._yAxisWidgets.get(yAxisId)?.setBounding({ height: bounding.height, top: bounding.top })
    return yAxis
  }

  getOptions (): DeepRequired<PaneOptions> { return this._options }

  getYAxisComponents (): YAxis[] {
    return Array.from(this._yAxisComponents.values())
  }

  getWidgetYAxisComponents (): YAxis[] {
    return Array.from(this._yAxisWidgets.keys()).map(id => this._yAxisComponents.get(id)!)
  }

  hasYAxisComponent (yAxisId: string): boolean {
    return this._yAxisComponents.has(yAxisId)
  }

  setManualYAxis (yAxisId: string, manual: boolean): void {
    if (manual) {
      this._manualYAxisIds.add(yAxisId)
    } else {
      this._manualYAxisIds.delete(yAxisId)
    }
  }

  isManualYAxis (yAxisId: string): boolean {
    return this._manualYAxisIds.has(yAxisId)
  }

  removeYAxis (yAxisId: string): boolean {
    const yAxis = this._yAxisComponents.get(yAxisId)
    if (!isValid(yAxis)) {
      return false
    }
    this._yAxisComponents.delete(yAxisId)
    this._manualYAxisIds.delete(yAxisId)
    if (this._defaultYAxisId === yAxisId) {
      this._defaultYAxisId = this._yAxisComponents.keys().next().value ?? null
    }
    const yAxisWidget = this._yAxisWidgets.get(yAxisId)
    if (isValid(yAxisWidget)) {
      yAxisWidget.destroy()
      this._yAxisWidgets.delete(yAxisId)
    }
    this._yAxesBounding = Object.keys(this._yAxesBounding).reduce<Record<string, Partial<Bounding>>>((bounding, id) => {
      if (id !== yAxisId) {
        bounding[id] = this._yAxesBounding[id]
      }
      return bounding
    }, {})
    return true
  }

  getDefaultYAxisId (): Nullable<string> {
    return this._defaultYAxisId
  }

  isDefaultYAxis (yAxisId: string): boolean {
    return this._defaultYAxisId === yAxisId
  }

  getYAxisComponentById (yAxisId?: string): YAxis {
    const id = yAxisId ?? this.getDefaultYAxisId()
    return this._yAxisComponents.get(id!)!
  }

  getYAxisWidgetById (yAxisId?: string): Nullable<YAxisWidget> {
    const id = yAxisId ?? this.getDefaultYAxisId()
    return isValid(id) ? this._yAxisWidgets.get(id) ?? null : null
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
