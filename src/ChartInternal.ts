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

import TypeOrNull from './common/TypeOrNull'
import DeepPartial from './common/DeepPartial'
import { UpdateLevel } from './common/Updater'
import { Styles, YAxisPosition } from './common/Styles'

import ChartStore from './store/ChartStore'

import Pane, { PaneOptions, PANE_DEFAULT_HEIGHT, PaneIdConstants } from './pane/Pane'
import CandlePane from './pane/CandlePane'
import IndicatorPane from './pane/IndicatorPane'
import XAxisPane from './pane/XAxisPane'

import Axis from './component/Axis'

import { IndicatorCreate } from './component/Indicator'

import { createId } from './common/utils/id'
import { createDom } from './common/utils/dom'
import { getPixelRatio } from './common/utils/canvas'
// import { isArray, isBoolean, isFunction, isValid, isNumber } from './common/utils/typeChecks'

// import { getPixelRatio } from './common/utils/canvas'

// import Annotation from './component/overlay/Annotation'
// import Tag from './component/overlay/Tag'
// import { perfectOverlayFunc } from './component/overlay/Overlay'

// // 注解id前缀
// const ANNOTATION_ID_PREFIX = 'an_'

export default class ChartInternal {
  private _container: HTMLElement
  private _chartContainer: HTMLElement
  private readonly _chartStore: ChartStore
  private readonly _xAxisPane: XAxisPane
  private readonly _panes: Map<string, IndicatorPane> = new Map()

  constructor (container: HTMLElement, styleOptions?: DeepPartial<Styles>) {
    this._initContainer(container)
    this._chartStore = new ChartStore(this, styleOptions)
    this._xAxisPane = new XAxisPane(this._chartContainer, this, PaneIdConstants.XAXIS)
    this._panes.set(PaneIdConstants.CANDLE, new CandlePane(this._chartContainer, this, PaneIdConstants.CANDLE))
    this.adjustPaneViewport(true, true, true)
  }

  /**
   * 初始化图表容器
   * @param container
   * @private
   */
  private _initContainer (container: HTMLElement): void {
    this._container = container
    this._chartContainer = createDom('div', {
      position: 'relative',
      width: '100%',
      userSelect: 'none',
      outline: 'none',
      borderStyle: 'none',
      cursor: 'crosshair',
      boxSizing: 'border-box'
    })
    this._chartContainer.tabIndex = 1
    container.appendChild(this._chartContainer)
  }

  // /**
  //  * 十字光标观察者
  //  * @private
  //  */
  // _crosshairObserver ({ paneId, dataIndex, kLineData, x, y }) {
  //   if (
  //     this._chartStore.actionStore().has(ActionType.CROSSHAIR) ||
  //     this._chartStore.actionStore().has(ActionType.TOOLTIP)
  //   ) {
  //     const techDatas = {}
  //     this._panes.forEach((_, id) => {
  //       const data = {}
  //       const techDataList = []
  //       const techs = this.chartStore().technicalIndicatorStore().instances(id)
  //       techs.forEach(tech => {
  //         const result = tech.result
  //         const techData = result[dataIndex]
  //         data[tech.name] = techData
  //         techDataList.push({ name: tech.name, data: techData })
  //       })
  //       techDatas[id] = data
  //       this._chartStore.actionStore().execute(ActionType.TOOLTIP, {
  //         paneId: id,
  //         dataIndex,
  //         kLineData,
  //         technicalIndicatorData: techDataList
  //       })
  //     })
  //     if (paneId) {
  //       this._chartStore.actionStore().execute(ActionType.CROSSHAIR, {
  //         paneId,
  //         coordinate: { x, y },
  //         dataIndex,
  //         kLineData,
  //         technicalIndicatorData: techDatas
  //       })
  //     }
  //   }
  // }

  // /**
  //  * 更新所有pane
  //  * @private
  //  */
  // _invalidatePane (invalidateLevel = InvalidateLevel.FULL) {
  //   if (invalidateLevel === InvalidateLevel.OVERLAY) {
  //     this._xAxisPane.invalidate(invalidateLevel)
  //     this._panes.forEach((pane) => {
  //       pane.invalidate(invalidateLevel)
  //     })
  //   } else {
  //     let shouldMeasureWidth = false
  //     this._panes.forEach((pane) => {
  //       const should = pane.yAxis().computeAxis()
  //       if (should) {
  //         shouldMeasureWidth = should
  //       }
  //     })
  //     this.adjustPaneViewport(false, shouldMeasureWidth, true)
  //   }
  // }

  /**
   * 测量pane高度
   * @private
   */
  private _measurePaneHeight (): void {
    const totalHeight = this._container.offsetHeight
    const xAxisHeight = this._xAxisPane.getAxisComponent().getAutoSize()
    let paneExcludeXAxisHeight = totalHeight - xAxisHeight
    if (paneExcludeXAxisHeight < 0) {
      paneExcludeXAxisHeight = 0
    }
    let indicatorPaneTotalHeight = 0
    this._panes.forEach(pane => {
      if (pane.getId() !== PaneIdConstants.CANDLE) {
        let paneHeight = pane.getBounding().height
        const paneMinHeight = pane.getOptions().minHeight
        if (paneHeight < paneMinHeight) {
          paneHeight = paneMinHeight
        }
        if (indicatorPaneTotalHeight + paneHeight > paneExcludeXAxisHeight) {
          indicatorPaneTotalHeight = paneExcludeXAxisHeight
          paneHeight = Math.max(paneExcludeXAxisHeight - indicatorPaneTotalHeight, 0)
        } else {
          indicatorPaneTotalHeight += paneHeight
        }
        pane.setBounding({ height: paneHeight })
      }
    })

    const candlePaneHeight = paneExcludeXAxisHeight - indicatorPaneTotalHeight
    this._panes.get(PaneIdConstants.CANDLE)?.setBounding({ height: candlePaneHeight })

    let top = 0
    this._panes.forEach(pane => {
      pane.setBounding({ top })
      top += pane.getBounding().height
    })
    this._xAxisPane.setBounding({ height: xAxisHeight, top })
  }

  /**
   * 测量pan宽度
   * @private
   */
  private _measurePaneWidth (): void {
    const styles = this._chartStore.getStyleOptions()
    const yAxisStyles = styles.yAxis
    const isYAxisLeft = yAxisStyles.position === YAxisPosition.LEFT
    const isOutside = !yAxisStyles.inside
    const totolWidth = this._container.offsetWidth
    let mainWidth = 0
    let yAxisWidth = Number.MIN_SAFE_INTEGER
    let yAxisLeft = 0
    let mainLeft = 0
    this._panes.forEach(pane => {
      yAxisWidth = Math.max(yAxisWidth, pane.getAxisComponent().getAutoSize())
    })
    if (yAxisWidth > totolWidth) {
      yAxisWidth = totolWidth
    }
    if (isOutside) {
      mainWidth = totolWidth - yAxisWidth
      if (isYAxisLeft) {
        yAxisLeft = 0
        mainLeft = yAxisWidth
      } else {
        yAxisLeft = totolWidth - yAxisWidth
        mainLeft = 0
      }
    } else {
      mainWidth = totolWidth
      mainLeft = 0
      if (isYAxisLeft) {
        yAxisLeft = 0
      } else {
        yAxisLeft = totolWidth - yAxisWidth
      }
    }

    this._chartStore.getTimeScaleStore().setTotalBarSpace(mainWidth)

    const paneBounding = { width: totolWidth }
    const mainBounding = { width: mainWidth, left: mainLeft }
    const yAxisBounding = { width: yAxisWidth, left: yAxisLeft }
    this._panes.forEach((pane) => {
      pane.setBounding(paneBounding, mainBounding, yAxisBounding)
    })
    this._xAxisPane.setBounding(paneBounding, mainBounding, yAxisBounding)
  }

  /**
   * 获取容器
   * @returns
   */
  getContainer (): HTMLElement { return this._container }

  getChartContainer (): HTMLElement { return this._chartContainer }

  getChartStore (): ChartStore { return this._chartStore }

  /**
   * 调整窗口尺寸
   * @param shouldMeasureHeight
   * @param shouldMeasureWidth
   * @param shouldUpdate
   * @param shouldAdjustYAxis
   * @param shouldForceAdjustYAxis
   */
  adjustPaneViewport (
    shouldMeasureHeight: boolean,
    shouldMeasureWidth: boolean,
    shouldUpdate: boolean,
    shouldAdjustYAxis?: boolean,
    shouldForceAdjustYAxis?: boolean
  ): void {
    if (shouldMeasureHeight) {
      this._measurePaneHeight()
    }
    let forceMeasureWidth = shouldMeasureWidth
    const adjustYAxis = shouldAdjustYAxis ?? false
    const forceAdjustYAxis = shouldForceAdjustYAxis ?? false
    if (adjustYAxis || forceAdjustYAxis) {
      this._panes.forEach(pane => {
        const adjust = pane.getAxisComponent().buildTicks(forceAdjustYAxis)
        if (!forceMeasureWidth) {
          forceMeasureWidth = adjust
        }
      })
    }
    if (forceMeasureWidth) {
      this._measurePaneWidth()
    }
    if (shouldUpdate ?? false) {
      this._xAxisPane.getAxisComponent().buildTicks(true)
      this.updatePane(UpdateLevel.ALL)
    }
  }

  updatePane (level: UpdateLevel, paneId?: string): void {
    if (paneId !== undefined) {
      this.getPaneById(paneId)?.update(level)
    } else {
      this._xAxisPane.update(level)
      this._panes.forEach(pane => {
        pane.update(level)
      })
    }
  }

  /**
   * 获取窗口
   * @param paneId
   * @returns
   */
  getPaneById (paneId: string): TypeOrNull<Pane<Axis>> {
    if (paneId === PaneIdConstants.XAXIS) {
      return this._xAxisPane
    }
    return this._panes.get(paneId) ?? null
  }

  /**
   * 移除指标
   * @param paneId
   * @param name
   */
  removeIndicator (paneId: string, name?: string): void {
    const indicatorStore = this._chartStore.getIndicatorStore()
    const removed = indicatorStore.removeInstance(paneId, name)
    if (removed) {
      let shouldMeasureHeight = false
      if (paneId !== PaneIdConstants.CANDLE) {
        if (!indicatorStore.hasInstances(paneId)) {
          const deletePane = this._panes.get(paneId)
          if (deletePane !== undefined) {
            shouldMeasureHeight = true
            const deleteTopPane = deletePane.getTopPane()
            const deleteBottomPane = deletePane.getBottomPane()
            deleteBottomPane?.setTopPane(deleteTopPane)
            deleteTopPane?.setBottomPane(deleteBottomPane)
            deletePane?.destroy()
            this._panes.delete(paneId)
          }
        }
      }
      this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
    }
  }

  /**
   * 设置指标类型
   * @param indicator 技术指标实例
   * @param isStack 是否叠加
   * @param paneOptions 配置
   */
  createIndicator (indicator: IndicatorCreate, isStack: boolean, paneOptions?: PaneOptions): string {
    let paneId: string
    if (paneOptions !== undefined && this._panes.has(paneOptions.id)) {
      paneId = paneOptions.id
      this._chartStore.getIndicatorStore().addInstance(indicator, paneId, isStack).finally(() => {
        this.setPaneOptions(paneOptions, this._panes.get(paneId)?.getAxisComponent().buildTicks(true))
      })
    } else {
      paneId = paneOptions?.id ?? createId(PaneIdConstants.INDICATOR)
      const pane = new IndicatorPane(this._chartContainer, this, paneId, Array.from(this._panes.values()).pop() as unknown as Pane<Axis>)
      const height = paneOptions?.height ?? PANE_DEFAULT_HEIGHT
      pane.setBounding({ height })
      if (paneOptions !== undefined) {
        pane.setOptions(paneOptions)
      }
      this._panes.set(paneId, pane)
      this._chartStore.getIndicatorStore().addInstance(indicator, paneId, isStack).finally(() => {
        this.adjustPaneViewport(true, true, true, true, true)
      })
    }
    return paneId
  }

  /**
   * 设置窗体参数
   * @param options
   * @param forceShouldAdjust
   */
  setPaneOptions (options: PaneOptions, forceShouldAdjust?: boolean): void {
    if (options.id !== PaneIdConstants.CANDLE) {
      const pane = this._panes.get(options.id)
      if (pane !== undefined) {
        let shouldAdjust = forceShouldAdjust ?? false
        let shouldMeasureHeight = false
        if (options.height !== undefined && options.height > 0) {
          const minHeight = Math.max(options.minHeight ?? pane.getOptions().minHeight, 0)
          const height = Math.min(minHeight, options.height)
          options.height = height
          shouldAdjust = true
          shouldMeasureHeight = true
        }
        pane.setOptions(options)
        if (shouldAdjust) {
          this.adjustPaneViewport(shouldMeasureHeight, true, true, true, true)
        }
      }
    }
  }

  /**
   * 获取图表转换为图片后url
   * @param includeOverlay,
   * @param type
   * @param backgroundColor
   */
  getConvertPictureUrl (includeOverlay: boolean, type: string, backgroundColor: string): string {
    const width = this._chartContainer.offsetWidth
    const height = this._chartContainer.offsetHeight
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

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    this._panes.forEach((pane, paneId) => {
      const bounding = pane.getBounding()
      ctx.drawImage(
        pane.getImage(includeOverlay),
        0, bounding.top, width, bounding.height
      )
    })
    const xAxisBounding = this._xAxisPane.getBounding()
    ctx.drawImage(
      this._xAxisPane.getImage(includeOverlay),
      0, xAxisBounding.top, width, xAxisBounding.height
    )
    return canvas.toDataURL(`image/${type}`)
  }

  /**
   * 销毁
   */
  destroy (): void {
    this._panes.forEach(pane => {
      pane.destroy()
    })
    this._panes.clear()
    this._xAxisPane.destroy()
    this._container.removeChild(this._chartContainer)
  }
}
