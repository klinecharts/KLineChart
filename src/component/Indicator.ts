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

import type Nullable from '../common/Nullable'
import type DeepPartial from '../common/DeepPartial'
import type ExcludePickPartial from '../common/ExcludePickPartial'
import type { KLineData, NeighborData } from '../common/Data'
import type Bounding from '../common/Bounding'
import type BarSpace from '../common/BarSpace'
import type Crosshair from '../common/Crosshair'
import type { IndicatorStyle, IndicatorPolygonStyle, SmoothLineStyle, RectStyle, TextStyle, TooltipFeatureStyle, LineStyle, LineType, TooltipLegend } from '../common/Styles'
import { isNumber, isValid, merge, isBoolean, isString, clone, isFunction } from '../common/utils/typeChecks'
import type { DataLoadType } from '../common/DataLoader'

import type { XAxis } from './XAxis'
import type { YAxis } from './YAxis'

import { formatValue } from '../common/utils/format'

import type { ArcAttrs } from '../extension/figure/arc'
import type { RectAttrs } from '../extension/figure/rect'
import type { TextAttrs } from '../extension/figure/text'
import type { Chart } from '../Chart'

export type IndicatorSeries = 'normal' | 'price' | 'volume'

export type IndicatorFigureStyle = Partial<Omit<SmoothLineStyle, 'style'>> & Partial<Omit<RectStyle, 'style'>> & Partial<TextStyle> & Partial<{ style: LineType[keyof LineType] }> & Record<string, unknown>

export type IndicatorFigureAttrs = Partial<ArcAttrs> & Partial<LineStyle> & Partial<RectAttrs> & Partial<TextAttrs> & Record<string, unknown>

export interface IndicatorFigureAttrsCallbackParams<D> {
  data: NeighborData<Nullable<D>>
  coordinate: NeighborData<Record<keyof D, number> & { x: number }>
  bounding: Bounding
  barSpace: BarSpace
  xAxis: XAxis
  yAxis: YAxis
}

export interface IndicatorFigureStylesCallbackParams<D> {
  data: NeighborData<Nullable<D>>
  indicator: Indicator<D>
  defaultStyles?: IndicatorStyle
}

export type IndicatorFigureAttrsCallback<D> = (params: IndicatorFigureAttrsCallbackParams<D>) => IndicatorFigureAttrs
export type IndicatorFigureStylesCallback<D> = (params: IndicatorFigureStylesCallbackParams<D>) => IndicatorFigureStyle

export interface IndicatorFigure<D = unknown> {
  key: string
  title?: string
  type?: string
  baseValue?: number
  attrs?: IndicatorFigureAttrsCallback<D>
  styles?: IndicatorFigureStylesCallback<D>
}

export type IndicatorRegenerateFiguresCallback<D, C> = (calcParams: C[]) => Array<IndicatorFigure<D>>

export interface IndicatorTooltipData {
  name: string
  calcParamsText: string
  features: TooltipFeatureStyle[]
  legends: TooltipLegend[]
}

export interface IndicatorCreateTooltipDataSourceParams<D> {
  chart: Chart
  indicator: Indicator<D>
  bounding: Bounding
  crosshair: Crosshair
  xAxis: XAxis
  yAxis: YAxis
}

export type IndicatorCreateTooltipDataSourceCallback<D> = (params: IndicatorCreateTooltipDataSourceParams<D>) => IndicatorTooltipData

export type IndicatorEventTarget = 'feature'

export interface IndicatorDrawParams<D, C, E> {
  ctx: CanvasRenderingContext2D
  chart: Chart
  indicator: Indicator<D, C, E>
  bounding: Bounding
  xAxis: XAxis
  yAxis: YAxis
}

export type IndicatorDrawCallback<D, C, E> = (params: IndicatorDrawParams<D, C, E>) => boolean

export type IndicatorCalcCallback<D, C, E> = (dataList: KLineData[], indicator: Indicator<D, C, E>) => Promise<Record<number, D>> | Record<number, D>

export type IndicatorShouldUpdateCallback<D, C, E> = (prev: Indicator<D, C, E>, current: Indicator<D, C, E>) => (boolean | { calc: boolean, draw: boolean })

export type IndicatorDataState = 'loading' | 'error' | 'ready'

export interface IndicatorOnDataStateChangeParams<D> {
  state: IndicatorDataState
  type: DataLoadType

  indicator: Indicator<D>
}
export type IndicatorOnDataStateChangeCallback<D> = (params: IndicatorOnDataStateChangeParams<D>) => void

export interface Indicator<D = unknown, C = unknown, E = unknown> {
  /**
   * Unique id
   */
  id: string

  /**
   * Pane id
   */
  paneId: string

  /**
   * Indicator name
   */
  name: string

  /**
   * Short name, for display
   */
  shortName: string

  /**
   * Precision
   */
  precision: number

  /**
   * Calculation parameters
   */
  calcParams: C[]

  /**
   * Whether ohlc column is required
   */
  shouldOhlc: boolean

  /**
   * Whether large data values need to be formatted, starting from 1000, for example, whether 100000 needs to be formatted with 100K
   */
  shouldFormatBigNumber: boolean

  /**
   * Whether the indicator is visible
   */
  visible: boolean

  /**
   * Z index
   */
  zLevel: number

  /**
   * Extend data
   */
  extendData: E

  /**
   * Indicator series
   */
  series: IndicatorSeries

  /**
   * Figure configuration information
   */
  figures: Array<IndicatorFigure<D>>

  /**
   * Specified minimum value
   */
  minValue: Nullable<number>

  /**
   * Specified maximum value
   */
  maxValue: Nullable<number>

  /**
   * Style configuration
   */
  styles: Nullable<DeepPartial<IndicatorStyle>>

  /**
   *  Should update, should calc or draw
   */
  shouldUpdate: Nullable<IndicatorShouldUpdateCallback<D, C, E>>

  /**
   * Indicator calculation
   */
  calc: IndicatorCalcCallback<D, C, E>

  /**
   * Regenerate figure configuration
   */
  regenerateFigures: Nullable<IndicatorRegenerateFiguresCallback<D, C>>

  /**
   * Create custom tooltip text
   */
  createTooltipDataSource: Nullable<IndicatorCreateTooltipDataSourceCallback<D>>

  /**
   * Custom draw
   */
  draw: Nullable<IndicatorDrawCallback<D, C, E>>

  /**
   * Data state change
   */
  onDataStateChange: Nullable<IndicatorOnDataStateChangeCallback<D>>

  /**
   * Calculation result
   */
  result: Record<number, D>
}

export type IndicatorTemplate<D = unknown, C = unknown, E = unknown> = ExcludePickPartial<Omit<Indicator<D, C, E>, 'result' | 'paneId'>, 'name' | 'calc'>

export type IndicatorCreate<D = unknown, C = unknown, E = unknown> = ExcludePickPartial<Omit<Indicator<D, C, E>, 'result'>, 'name'>

export type IndicatorOverride<D = unknown, C = unknown, E = unknown> = Partial<Omit<Indicator<D, C, E>, 'result'>>

export type IndicatorFilter = Partial<Pick<Indicator, 'id' | 'paneId' | 'name'>>

export type IndicatorConstructor<D = unknown, C = unknown, E = unknown> = new () => IndicatorImp<D, C, E>

export type EachFigureCallback<D> = (figure: IndicatorFigure<D>, figureStyles: IndicatorFigureStyle, index: number) => void

export function eachFigures<D = unknown> (
  indicator: Indicator,
  timestamps: NeighborData<Nullable<number>>,
  defaultStyles: IndicatorStyle,
  eachFigureCallback: EachFigureCallback<D>
): void {
  const result = indicator.result
  const figures = indicator.figures
  const styles = indicator.styles

  const circleStyles = formatValue(styles, 'circles', defaultStyles.circles) as IndicatorPolygonStyle[]
  const circleStyleCount = circleStyles.length

  const barStyles = formatValue(styles, 'bars', defaultStyles.bars) as IndicatorPolygonStyle[]
  const barStyleCount = barStyles.length

  const lineStyles = formatValue(styles, 'lines', defaultStyles.lines) as SmoothLineStyle[]
  const lineStyleCount = lineStyles.length

  let circleCount = 0
  let barCount = 0
  let lineCount = 0

  // eslint-disable-next-line @typescript-eslint/init-declarations  -- ignore
  let defaultFigureStyles
  let figureIndex = 0
  figures.forEach(figure => {
    switch (figure.type) {
      case 'circle': {
        figureIndex = circleCount
        const styles = circleStyles[circleCount % circleStyleCount]
        defaultFigureStyles = { ...styles, color: styles.noChangeColor }
        circleCount++
        break
      }
      case 'bar': {
        figureIndex = barCount
        const styles = barStyles[barCount % barStyleCount]
        defaultFigureStyles = { ...styles, color: styles.noChangeColor }
        barCount++
        break
      }
      case 'line': {
        figureIndex = lineCount
        defaultFigureStyles = lineStyles[lineCount % lineStyleCount]
        lineCount++
        break
      }
      default: { break }
    }
    if (isValid(figure.type)) {
      const ss = figure.styles?.({
        data: {
          prev: result[timestamps.prev ?? ''],
          current: result[timestamps.current ?? ''],
          next: result[timestamps.next ?? '']
        },
        indicator,
        defaultStyles
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      eachFigureCallback(figure, { ...defaultFigureStyles, ...ss }, figureIndex)
    }
  })
}

export default class IndicatorImp<D = unknown, C = unknown, E = unknown> implements Indicator<D, C, E> {
  id: string
  paneId: string
  name: string
  shortName: string
  precision = 4
  calcParams: C[] = []
  shouldOhlc = false
  shouldFormatBigNumber = false
  visible = true
  zLevel = 0
  extendData: E
  series: IndicatorSeries = 'normal'
  figures: Array<IndicatorFigure<D>> = []
  minValue: Nullable<number> = null
  maxValue: Nullable<number> = null
  styles: Nullable<Partial<IndicatorStyle>> = null
  shouldUpdate: IndicatorShouldUpdateCallback<D, C, E> = (prev, current) => {
    const calc = JSON.stringify(prev.calcParams) !== JSON.stringify(current.calcParams) ||
      prev.figures !== current.figures ||
      prev.calc !== current.calc
    const draw = calc ||
      prev.shortName !== current.shortName ||
      prev.series !== current.series ||
      prev.minValue !== current.minValue ||
      prev.maxValue !== current.maxValue ||
      prev.precision !== current.precision ||
      prev.shouldOhlc !== current.shouldOhlc ||
      prev.shouldFormatBigNumber !== current.shouldFormatBigNumber ||
      prev.visible !== current.visible ||
      prev.zLevel !== current.zLevel ||
      prev.extendData !== current.extendData ||
      prev.regenerateFigures !== current.regenerateFigures ||
      prev.createTooltipDataSource !== current.createTooltipDataSource ||
      prev.draw !== current.draw

    return { calc, draw }
  }

  calc: IndicatorCalcCallback<D, C, E> = () => ({})
  regenerateFigures: Nullable<IndicatorRegenerateFiguresCallback<D, C>> = null
  createTooltipDataSource: Nullable<IndicatorCreateTooltipDataSourceCallback<D>> = null
  draw: Nullable<IndicatorDrawCallback<D, C, E>> = null

  onDataStateChange: Nullable<IndicatorOnDataStateChangeCallback<D>> = null

  result: Record<number, D> = {}

  private _prevIndicator: Indicator<D, C, E>
  private _lockSeriesPrecision = false

  constructor (indicator: IndicatorTemplate<D, C, E>) {
    this.override(indicator)
    this._lockSeriesPrecision = false
  }

  override (indicator: Partial<Indicator<D, C, E>>): void {
    const { result, ...currentOthers } = this
    this._prevIndicator = { ...clone(currentOthers), result }
    const {
      id,
      name,
      shortName,
      precision,
      styles,
      figures,
      calcParams,
      ...others
    } = indicator
    if (!isString(this.id) && isString(id)) {
      this.id = id
    }
    if (!isString(this.name)) {
      this.name = name ?? ''
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition  -- ignore
    this.shortName = shortName ?? this.shortName ?? this.name
    if (isNumber(precision)) {
      this.precision = precision
      this._lockSeriesPrecision = true
    }

    if (isValid(styles)) {
      this.styles ??= {}
      merge(this.styles, styles)
    }
    merge(this, others)
    if (isValid(calcParams)) {
      this.calcParams = calcParams
      if (isFunction(this.regenerateFigures)) {
        this.figures = this.regenerateFigures(this.calcParams)
      }
    }
    this.figures = figures ?? this.figures
  }

  setSeriesPrecision (precision: number): void {
    if (!this._lockSeriesPrecision) {
      this.precision = precision
    }
  }

  shouldUpdateImp (): ({ calc: boolean, draw: boolean, sort: boolean }) {
    const sort = this._prevIndicator.zLevel !== this.zLevel
    const result = this.shouldUpdate(this._prevIndicator, this)
    if (isBoolean(result)) {
      return { calc: result, draw: result, sort }
    }
    return { ...result, sort }
  }

  async calcImp (dataList: KLineData[]): Promise<boolean> {
    try {
      const result = await this.calc(dataList, this)
      this.result = result
      return true
    } catch (e) {
      return false
    }
  }

  static extend<D = unknown> (template: IndicatorTemplate<D>): IndicatorConstructor<D> {
    class Custom extends IndicatorImp<D> {
      constructor () {
        super(template)
      }
    }
    return Custom
  }
}
