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
import type ExcludePickPartial from '../common/ExcludePickPartial'
import { type KLineData } from '../common/Data'
import type Bounding from '../common/Bounding'
import type VisibleRange from '../common/VisibleRange'
import type BarSpace from '../common/BarSpace'
import type Crosshair from '../common/Crosshair'
import { type IndicatorStyle, type IndicatorPolygonStyle, type SmoothLineStyle, type RectStyle, type TextStyle, type TooltipIconStyle, type LineStyle, type LineType, type PolygonType, type TooltipLegend } from '../common/Styles'
import { isNumber, isValid, merge, isBoolean, isString, clone } from '../common/utils/typeChecks'

import { type XAxis } from './XAxis'
import { type YAxis } from './YAxis'

import { formatValue } from '../common/utils/format'

import { type ArcAttrs } from '../extension/figure/arc'
import { type RectAttrs } from '../extension/figure/rect'
import { type TextAttrs } from '../extension/figure/text'

export enum IndicatorSeries {
  Normal = 'normal',
  Price = 'price',
  Volume = 'volume'
}

export type IndicatorFigureStyle = Partial<Omit<SmoothLineStyle, 'style'>> & Partial<Omit<RectStyle, 'style'>> & Partial<TextStyle> & Partial<{ style: LineType[keyof LineType] | PolygonType[keyof PolygonType] }> & Record<string, any>

export type IndicatorFigureAttrs = Partial<ArcAttrs> & Partial<LineStyle> & Partial<RectAttrs> & Partial<TextAttrs> & Record<string, any>

export interface IndicatorFigureCallbackBrother<PCN> {
  prev: PCN
  current: PCN
  next: PCN
}

export type IndicatorFigureAttrsCallbackCoordinate<D> = IndicatorFigureCallbackBrother<Record<keyof D, number> & { x: number }>

export type IndicatorFigureAttrsCallbackData<D> = IndicatorFigureCallbackBrother<D>

export interface IndicatorFigureAttrsCallbackParams<D> {
  data: IndicatorFigureAttrsCallbackData<Nullable<D>>
  coordinate: IndicatorFigureAttrsCallbackCoordinate<D>
  bounding: Bounding
  barSpace: BarSpace
  xAxis: XAxis
  yAxis: YAxis
}

export interface IndicatorFigureStylesCallbackDataChild<D> {
  kLineData?: KLineData
  indicatorData?: D
}

export type IndicatorFigureStylesCallbackData<D> = IndicatorFigureCallbackBrother<IndicatorFigureStylesCallbackDataChild<D>>

export type IndicatorFigureAttrsCallback<D> = (params: IndicatorFigureAttrsCallbackParams<D>) => IndicatorFigureAttrs
export type IndicatorFigureStylesCallback<D> = (data: IndicatorFigureStylesCallbackData<D>, indicator: Indicator<D>, defaultStyles: IndicatorStyle) => IndicatorFigureStyle

export interface IndicatorFigure<D = any> {
  key: string
  title?: string
  type?: string
  baseValue?: number
  attrs?: IndicatorFigureAttrsCallback<D>
  styles?: IndicatorFigureStylesCallback<D>
}

export type IndicatorRegenerateFiguresCallback<D> = (calcParams: any[]) => Array<IndicatorFigure<D>>

export interface IndicatorTooltipData {
  name: string
  calcParamsText: string
  icons: TooltipIconStyle[]
  values: TooltipLegend[]
}

export interface IndicatorCreateTooltipDataSourceParams<D> {
  kLineDataList: KLineData[]
  indicator: Indicator<D>
  visibleRange: VisibleRange
  bounding: Bounding
  crosshair: Crosshair
  defaultStyles: IndicatorStyle
  xAxis: XAxis
  yAxis: YAxis
}

export type IndicatorCreateTooltipDataSourceCallback<D> = (params: IndicatorCreateTooltipDataSourceParams<D>) => IndicatorTooltipData

export interface IndicatorDrawParams<D> {
  ctx: CanvasRenderingContext2D
  kLineDataList: KLineData[]
  indicator: Indicator<D>
  visibleRange: VisibleRange
  bounding: Bounding
  barSpace: BarSpace
  defaultStyles: IndicatorStyle
  xAxis: XAxis
  yAxis: YAxis
}

export type IndicatorDrawCallback<D> = (params: IndicatorDrawParams<D>) => boolean
export type IndicatorCalcCallback<D> = (dataList: KLineData[], indicator: Indicator<D>) => Promise<D[]> | D[]
export type IndicatorShouldUpdateCallback<D> = (prev: Indicator<D>, current: Indicator<D>) => (boolean | { calc: boolean, draw: boolean })

export interface Indicator<D = any> {
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
  calcParams: any[]

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
  extendData: any

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
  styles: Nullable<Partial<IndicatorStyle>>

  /**
   *  Should update, should calc or draw
   */
  shouldUpdate: Nullable<IndicatorShouldUpdateCallback<D>>

  /**
   * Indicator calculation
   */
  calc: IndicatorCalcCallback<D>

  /**
   * Regenerate figure configuration
   */
  regenerateFigures: Nullable<IndicatorRegenerateFiguresCallback<D>>

  /**
   * Create custom tooltip text
   */
  createTooltipDataSource: Nullable<IndicatorCreateTooltipDataSourceCallback<D>>

  /**
   * Custom draw
   */
  draw: Nullable<IndicatorDrawCallback<D>>

  /**
   * Calculation result
   */
  result: D[]
}

export type IndicatorTemplate<D = any> = ExcludePickPartial<Omit<Indicator<D>, 'result'>, 'name' | 'calc'>

export type IndicatorCreate<D = any> = ExcludePickPartial<Omit<Indicator<D>, 'result'>, 'name'>

export type IndicatorConstructor<D = any> = new () => IndicatorImp<D>

export type EachFigureCallback<D> = (figure: IndicatorFigure<D>, figureStyles: IndicatorFigureStyle, index: number) => void

export function eachFigures<D = any> (
  kLineDataList: KLineData[],
  indicator: Indicator<D>,
  dataIndex: number,
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
    if (isValid(defaultFigureStyles)) {
      const cbData = {
        prev: { kLineData: kLineDataList[dataIndex - 1], indicatorData: result[dataIndex - 1] },
        current: { kLineData: kLineDataList[dataIndex], indicatorData: result[dataIndex] },
        next: { kLineData: kLineDataList[dataIndex + 1], indicatorData: result[dataIndex + 1] }
      }
      const ss = figure.styles?.(cbData, indicator, defaultStyles)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      eachFigureCallback(figure, { ...defaultFigureStyles, ...ss }, figureIndex)
    }
  })
}

export default class IndicatorImp<D = any> implements Indicator<D> {
  name: string
  shortName: string
  precision = 4
  calcParams: any[] = []
  shouldOhlc = false
  shouldFormatBigNumber = false
  visible = true
  zLevel = 0
  extendData: any
  series = IndicatorSeries.Normal
  figures: Array<IndicatorFigure<D>> = []
  minValue: Nullable<number> = null
  maxValue: Nullable<number> = null
  styles: Nullable<Partial<IndicatorStyle>> = null
  shouldUpdate: IndicatorShouldUpdateCallback<D> = (prev, current) => {
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

  calc: IndicatorCalcCallback<D> = () => []
  regenerateFigures: Nullable<IndicatorRegenerateFiguresCallback<D>> = null
  createTooltipDataSource: Nullable<IndicatorCreateTooltipDataSourceCallback<D>> = null
  draw: Nullable<IndicatorDrawCallback<D>> = null
  result: D[] = []

  private _prevIndicator: Indicator<D>
  private _lockSeriesPrecision: boolean = false

  constructor (indicator: IndicatorTemplate<D>) {
    this.override(indicator)
  }

  override (indicator: Partial<Indicator<D>>): void {
    const { result, ...currentOthers } = this
    this._prevIndicator = { ...clone(currentOthers), result }
    const {
      name,
      shortName,
      precision,
      styles,
      ...others
    } = indicator
    if (!isString(this.name)) {
      this.name = name ?? ''
    }
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

  static extend<D = any> (template: IndicatorTemplate<D>): IndicatorConstructor<D> {
    class Custom extends IndicatorImp<D> {
      constructor () {
        super(template)
      }
    }
    return Custom
  }
}
