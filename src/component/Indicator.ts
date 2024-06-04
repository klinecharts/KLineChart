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
import type KLineData from '../common/KLineData'
import type Bounding from '../common/Bounding'
import type VisibleRange from '../common/VisibleRange'
import type BarSpace from '../common/BarSpace'
import type Crosshair from '../common/Crosshair'
import { type IndicatorStyle, type IndicatorPolygonStyle, type SmoothLineStyle, type RectStyle, type TextStyle, type TooltipIconStyle, type LineStyle, type LineType, type PolygonType, type TooltipLegend } from '../common/Styles'

import { type XAxis } from './XAxis'
import { type YAxis } from './YAxis'

import { formatValue } from '../common/utils/format'
import { isValid, merge, clone } from '../common/utils/typeChecks'

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

export type IndicatorRegenerateFiguresCallback<D = any> = (calcParams: any[]) => Array<IndicatorFigure<D>>

export interface IndicatorTooltipData {
  name: string
  calcParamsText: string
  icons: TooltipIconStyle[]
  values: TooltipLegend[]
}

export interface IndicatorCreateTooltipDataSourceParams<D = any> {
  kLineDataList: KLineData[]
  indicator: Indicator<D>
  visibleRange: VisibleRange
  bounding: Bounding
  crosshair: Crosshair
  defaultStyles: IndicatorStyle
  xAxis: XAxis
  yAxis: YAxis
}

export type IndicatorCreateTooltipDataSourceCallback<D = any> = (params: IndicatorCreateTooltipDataSourceParams<D>) => IndicatorTooltipData

export interface IndicatorDrawParams<D = any> {
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

export type IndicatorDrawCallback<D = any> = (params: IndicatorDrawParams<D>) => boolean
export type IndicatorCalcCallback<D> = (dataList: KLineData[], indicator: Indicator<D>) => Promise<D[]> | D[]

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
  createTooltipDataSource: Nullable<IndicatorCreateTooltipDataSourceCallback>

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

export type EachFigureCallback = (figure: IndicatorFigure, figureStyles: IndicatorFigureStyle, index: number) => void

export function eachFigures<D> (
  kLineDataList: KLineData[],
  indicator: Indicator<D>,
  dataIndex: number,
  defaultStyles: IndicatorStyle,
  eachFigureCallback: EachFigureCallback
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

export default abstract class IndicatorImp<D = any> implements Indicator<D> {
  name: string
  shortName: string
  precision: number
  calcParams: any[]
  shouldOhlc: boolean
  shouldFormatBigNumber: boolean
  visible: boolean
  zLevel: number
  extendData: any
  series: IndicatorSeries
  figures: Array<IndicatorFigure<D>>
  minValue: Nullable<number>
  maxValue: Nullable<number>
  styles: Nullable<Partial<IndicatorStyle>>
  regenerateFigures: Nullable<IndicatorRegenerateFiguresCallback<D>>
  createTooltipDataSource: Nullable<IndicatorCreateTooltipDataSourceCallback>
  draw: Nullable<IndicatorDrawCallback<D>>

  result: D[] = []

  private _precisionFlag: boolean = false

  constructor (indicator: IndicatorTemplate) {
    const {
      name, shortName, series, calcParams, figures, precision,
      shouldOhlc, shouldFormatBigNumber, visible, zLevel,
      minValue, maxValue, styles, extendData,
      regenerateFigures, createTooltipDataSource, draw
    } = indicator
    this.name = name
    this.shortName = shortName ?? name
    this.series = series ?? IndicatorSeries.Normal
    this.precision = precision ?? 4
    this.calcParams = calcParams ?? []
    this.figures = figures ?? []
    this.shouldOhlc = shouldOhlc ?? false
    this.shouldFormatBigNumber = shouldFormatBigNumber ?? false
    this.visible = visible ?? true
    this.zLevel = zLevel ?? 0
    this.minValue = minValue ?? null
    this.maxValue = maxValue ?? null
    this.styles = clone(styles ?? {})
    this.extendData = extendData
    this.regenerateFigures = regenerateFigures ?? null
    this.createTooltipDataSource = createTooltipDataSource ?? null
    this.draw = draw ?? null
  }

  setShortName (shortName: string): boolean {
    if (this.shortName !== shortName) {
      this.shortName = shortName
      return true
    }
    return false
  }

  setSeries (series: IndicatorSeries): boolean {
    if (this.series !== series) {
      this.series = series
      return true
    }
    return false
  }

  setPrecision (precision: number, flag?: boolean): boolean {
    const f = flag ?? false
    const optimalPrecision = Math.floor(precision)
    if (optimalPrecision !== this.precision && precision >= 0 && (!f || (f && !this._precisionFlag))) {
      this.precision = optimalPrecision
      if (!f) {
        this._precisionFlag = true
      }
      return true
    }
    return false
  }

  setCalcParams (params: any[]): boolean {
    this.calcParams = params
    this.figures = this.regenerateFigures?.(params) ?? this.figures
    return true
  }

  setShouldOhlc (shouldOhlc: boolean): boolean {
    if (this.shouldOhlc !== shouldOhlc) {
      this.shouldOhlc = shouldOhlc
      return true
    }
    return false
  }

  setShouldFormatBigNumber (shouldFormatBigNumber: boolean): boolean {
    if (this.shouldFormatBigNumber !== shouldFormatBigNumber) {
      this.shouldFormatBigNumber = shouldFormatBigNumber
      return true
    }
    return false
  }

  setVisible (visible: boolean): boolean {
    if (this.visible !== visible) {
      this.visible = visible
      return true
    }
    return false
  }

  setZLevel (zLevel: number): boolean {
    if (this.zLevel !== zLevel) {
      this.zLevel = zLevel
      return true
    }
    return false
  }

  setStyles (styles: Partial<IndicatorStyle>): boolean {
    merge(this.styles, styles)
    return true
  }

  setExtendData (extendData: any): boolean {
    if (this.extendData !== extendData) {
      this.extendData = extendData
      return true
    }
    return false
  }

  setFigures (figures: IndicatorFigure[]): boolean {
    if (this.figures !== figures) {
      this.figures = figures
      return true
    }
    return false
  }

  setMinValue (value: Nullable<number>): boolean {
    if (this.minValue !== value) {
      this.minValue = value
      return true
    }
    return false
  }

  setMaxValue (value: Nullable<number>): boolean {
    if (this.maxValue !== value) {
      this.maxValue = value
      return true
    }
    return false
  }

  setRegenerateFigures (callback: Nullable<IndicatorRegenerateFiguresCallback>): boolean {
    if (this.regenerateFigures !== callback) {
      this.regenerateFigures = callback
      return true
    }
    return false
  }

  setCreateTooltipDataSource (callback: Nullable<IndicatorCreateTooltipDataSourceCallback>): boolean {
    if (this.createTooltipDataSource !== callback) {
      this.createTooltipDataSource = callback
      return true
    }
    return false
  }

  setDraw (callback: Nullable<IndicatorDrawCallback>): boolean {
    if (this.draw !== callback) {
      this.draw = callback
      return true
    }
    return false
  }

  async calcIndicator (dataList: KLineData[]): Promise<boolean> {
    try {
      const result = await this.calc(dataList, this)
      this.result = result
      return true
    } catch (e) {
      return false
    }
  }

  abstract calc (dataList: KLineData[], indicator: Indicator<D>): D[] | Promise<D[]>

  static extend<D> (template: IndicatorTemplate): IndicatorConstructor<D> {
    class Custom extends IndicatorImp<D> {
      constructor () {
        super(template)
      }

      calc (dataList: KLineData[], indicator: Indicator<D>): D[] | Promise<D[]> {
        return template.calc(dataList, indicator)
      }
    }
    return Custom
  }
}
