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
import Updater, { UpdateLevel } from '../common/Updater'
import Bounding, { getDefaultBounding } from '../common/Bounding'

import Axis from '../component/Axis'

import DrawWidget from '../widget/DrawWidget'
import SeparatorWidget, { REAL_SEPARATOR_HEIGHT } from '../widget/SeparatorWidget'
import YAxisWidget from '../widget/YAxisWidget'

import Chart from '../Chart'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'
import { isBoolean, isValid, merge } from '../common/utils/typeChecks'

export interface PaneGap {
  top?: number
  bottom?: number
}

export interface PaneAxisOptions {
  scrollZoomEnabled?: boolean
}

export interface PaneOptions {
  id?: string
  height?: number
  minHeight?: number
  dragEnabled?: boolean
  gap?: PaneGap
  axisOptions?: PaneAxisOptions
}

export const PANE_MIN_HEIGHT = 30

export const PANE_DEFAULT_HEIGHT = 100

export const PaneIdConstants = {
  CANDLE: 'candle_pane',
  INDICATOR: 'indcator_pane_',
  XAXIS: 'xaxis_pane'
}

export default abstract class Pane<C extends Axis = Axis> implements Updater {
  private _container: HTMLElement
  private _seriesContiainer: HTMLElement
  private readonly _id: string
  private readonly _chart: Chart
  private _mainWidget: DrawWidget<C>
  private _yAxisWidget: Nullable<YAxisWidget> = null
  private _separatorWidget: Nullable<SeparatorWidget> = null
  private readonly _axis: C = this.createAxisComponent()

  private readonly _bounding: Bounding = getDefaultBounding()

  private _topPane: Nullable<Pane>
  private _bottomPane: Nullable<Pane>

  private readonly _options: DeepRequired<Omit<PaneOptions, 'id' | 'height'>> = { minHeight: PANE_MIN_HEIGHT, dragEnabled: true, gap: { top: 0.2, bottom: 0.1 }, axisOptions: { scrollZoomEnabled: true } }

  constructor (rootContainer: HTMLElement, chart: Chart, id: string, topPane?: Pane, bottomPane?: Pane) {
    this._chart = chart
    this._id = id
    this._topPane = topPane ?? null
    this._bottomPane = bottomPane ?? null
    this._init(rootContainer)
  }

  private _init (rootContainer: HTMLElement): void {
    this._container = rootContainer
    this._seriesContiainer = createDom('div', {
      width: '100%',
      margin: '0',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    })
    this._separatorWidget = this.createSeparatorWidget(rootContainer)
    const lastElement = rootContainer.lastChild
    if (lastElement !== null) {
      rootContainer.insertBefore(this._seriesContiainer, lastElement)
    } else {
      rootContainer.appendChild(this._seriesContiainer)
    }
    this._mainWidget = this.createMainWidget(this._seriesContiainer)
    this._yAxisWidget = this.creatYAxisWidget(this._seriesContiainer)
  }

  getContainer (): HTMLElement {
    return this._seriesContiainer
  }

  getId (): string {
    return this._id
  }

  setOptions (options: Omit<PaneOptions, 'id' | 'height'>): Pane<C> {
    merge(this._options, options)
    let container: HTMLElement
    let cursor: string
    if (this.getId() === PaneIdConstants.XAXIS) {
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

  getOptions (): DeepRequired<Omit<PaneOptions, 'id' | 'height'>> { return this._options }

  getChart (): Chart {
    return this._chart
  }

  getAxisComponent (): C {
    return this._axis
  }

  setBounding (rootBounding: Partial<Bounding>, mainBounding?: Partial<Bounding>, yAxisBounding?: Partial<Bounding>): Pane<C> {
    merge(this._bounding, rootBounding)
    let separatorSize = 0
    if (this._separatorWidget !== null) {
      separatorSize = this._chart.getStyles().separator.size
      const separatorBounding: Partial<Bounding> = { ...rootBounding, height: REAL_SEPARATOR_HEIGHT }
      if (rootBounding.top !== undefined) {
        separatorBounding.top = rootBounding.top - Math.floor((REAL_SEPARATOR_HEIGHT - separatorSize) / 2)
      }
      this._separatorWidget.setBounding(separatorBounding)
    }
    const contentBounding: Partial<Bounding> = {}
    if (rootBounding.height !== undefined) {
      contentBounding.height = rootBounding.height - separatorSize
    }
    if (rootBounding.top !== undefined) {
      contentBounding.top = rootBounding.top + separatorSize
    }
    this._mainWidget.setBounding(contentBounding)
    this._yAxisWidget?.setBounding(contentBounding)
    if (mainBounding !== undefined) {
      this._mainWidget.setBounding(mainBounding)
      this._separatorWidget?.setBounding(mainBounding)
    }
    if (yAxisBounding !== undefined) {
      this._yAxisWidget?.setBounding(yAxisBounding)
    }
    return this
  }

  getTopPane (): Nullable<Pane> {
    return this._topPane
  }

  setTopPane (pane: Nullable<Pane>): Pane<C> {
    this._topPane = pane
    return this
  }

  getBottomPane (): Nullable<Pane> {
    return this._bottomPane
  }

  setBottomPane (pane: Nullable<Pane>): Pane<C> {
    this._bottomPane = pane
    return this
  }

  getBounding (): Bounding {
    return this._bounding
  }

  getMainWidget (): DrawWidget<C> { return this._mainWidget }

  getYAxisWidget (): Nullable<YAxisWidget> { return this._yAxisWidget }

  getSeparatorWidget (): Nullable<SeparatorWidget> { return this._separatorWidget }

  update (level?: UpdateLevel): void {
    if (this._bounding.width !== this._seriesContiainer.offsetWidth) {
      this._seriesContiainer.style.width = `${this._bounding.width}px`
    }
    const seriesHeight = this._mainWidget.getBounding().height
    if (seriesHeight !== this._seriesContiainer.offsetHeight) {
      this._seriesContiainer.style.height = `${seriesHeight}px`
    }
    const l = level ?? UpdateLevel.Drawer
    this._mainWidget.update(l)
    this._yAxisWidget?.update(l)
    this._separatorWidget?.update(l)
  }

  getImage (includeOverlay: boolean): HTMLCanvasElement {
    const { width, height } = this._bounding
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

    let top = 0
    if (this._separatorWidget != null) {
      const separatorHeight = this.getChart().getStyles().separator.size
      top = separatorHeight
      ctx.drawImage(
        this._separatorWidget.getImage(),
        0, 0,
        width, separatorHeight
      )
    }

    const mainBounding = this._mainWidget.getBounding()
    ctx.drawImage(
      this._mainWidget.getImage(includeOverlay),
      mainBounding.left, top,
      mainBounding.width, mainBounding.height
    )
    if (this._yAxisWidget !== null) {
      const yAxisBounding = this._yAxisWidget.getBounding()
      ctx.drawImage(
        this._yAxisWidget.getImage(includeOverlay),
        yAxisBounding.left, top,
        yAxisBounding.width, yAxisBounding.height
      )
    }
    return canvas
  }

  destroy (): void {
    this._container.removeChild(this._seriesContiainer)
    if (this._separatorWidget !== null) {
      this._container.removeChild(this._separatorWidget.getContainer())
    }
  }

  abstract getName (): string

  protected abstract createAxisComponent (): C

  protected createSeparatorWidget (_container: HTMLElement): Nullable<SeparatorWidget> { return null }

  protected creatYAxisWidget (_container: HTMLElement): Nullable<YAxisWidget> { return null }

  protected abstract createMainWidget (container: HTMLElement): DrawWidget<C>
}
