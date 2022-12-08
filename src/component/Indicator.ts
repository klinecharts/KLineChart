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

import TypeOrNull from '../common/TypeOrNull'
import ExcludePickPartial from '../common/ExcludePickPartial'
import KLineData from '../common/KLineData'
import Bounding from '../common/Bounding'
import VisibleRange from '../common/VisibleRange'
import BarSpace from '../common/BarSpace'
import Crosshair from '../common/Crosshair'
import { IndicatorStyle, IndicatorPolygonStyle, LineStyle, LineType, PolygonType, TooltipData } from '../common/Options'

import { XAxis } from './XAxis'
import { YAxis } from './YAxis'

import { formatValue } from '../common/utils/format'
import { isValid } from '../common/utils/typeChecks'

export const enum IndicatorSeries {
  NORMAL = 'normal',
  PRICE = 'price',
  VOLUME = 'volume'
}

export interface IndicatorFigureStyle {
  style?: LineType[keyof LineType] | PolygonType[keyof PolygonType]
  color?: string
}

export interface IndicatorFigureStylesCallbackDataChild<D> {
  kLineData?: KLineData
  indicatorData?: D
}

export interface IndicatorFigureStylesCallbackData<D> {
  prev: IndicatorFigureStylesCallbackDataChild<D>
  current: IndicatorFigureStylesCallbackDataChild<D>
  next: IndicatorFigureStylesCallbackDataChild<D>
}

export type IndicatorFigureStylesCallback<D> = (data: IndicatorFigureStylesCallbackData<D>, indicator: Indicator<D>, defaultStyles: IndicatorStyle) => IndicatorFigureStyle

export interface IndicatorFigure<D = any> {
  key: string
  title?: string
  type?: string
  baseValue?: number
  styles?: IndicatorFigureStylesCallback<D>
}

export type IndicatorRegenerateFiguresCallback<D = any> = (calcParms: any[]) => Array<IndicatorFigure<D>>

export interface IndicatorTooltipData {
  name?: string
  calcParamsText?: string
  values?: TooltipData[]
}

export interface IndicatorCreateToolTipDataSourceParams<D = any> {
  kLineDataList: KLineData[]
  indicator: Indicator<D>
  visibleRange: VisibleRange
  bounding: Bounding
  crosshair: Crosshair
  defaultStyles: IndicatorStyle
  xAxis: XAxis
  yAxis: YAxis
}

export type IndicatorCreateToolTipDataSourceCallback<D = any> = (params: IndicatorCreateToolTipDataSourceParams<D>) => IndicatorTooltipData

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
  // 指标名
  name: string
  // 指标简短名称，用于显示
  shortName: string
  // 精度
  precision: number
  // 计算参数
  calcParams: any[]
  // 是否需要ohlc
  shouldOhlc: boolean
  // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K
  shouldFormatBigNumber: boolean
  // 扩展数据
  extendData: any
  // 系列
  series: IndicatorSeries
  // 数据信息
  figures: Array<IndicatorFigure<D>>
  // 指定的最小值
  minValue: TypeOrNull<number>
  // 指定的最大值
  maxValue: TypeOrNull<number>
  // 样式
  styles: TypeOrNull<Partial<IndicatorStyle>>
  // 计算
  calc: IndicatorCalcCallback<D>
  // 重新生成数图形配置
  regenerateFigures: TypeOrNull<IndicatorRegenerateFiguresCallback<D>>
  // 创建自定义提示文字
  createToolTipDataSource: TypeOrNull<IndicatorCreateToolTipDataSourceCallback>
  // 自定义绘制
  draw: TypeOrNull<IndicatorDrawCallback<D>>
  // 结果
  result: D[]
}

export type IndicatorTemplate<D = any> = ExcludePickPartial<Omit<Indicator<D>, 'reult'>, 'name' | 'calc'>

export type IndicatorCreate<D = any> = ExcludePickPartial<Omit<Indicator<D>, 'reult'>, 'name'>

export type IndicatorConstructor<D = any> = new () => IndicatorImp<D>

export type EachFigureCallback = (figure: IndicatorFigure, figureStyles: Required<IndicatorFigureStyle>, defaultFigureStyles: any, count: number) => void

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

  const lineStyles = formatValue(styles, 'lines', defaultStyles.lines) as LineStyle[]
  const lineStyleCount = lineStyles.length

  let circleCount = 0
  let barCount = 0
  let lineCount = 0

  let typeCount = 0

  let defaultFigureStyles
  let defaultFigureStyle
  let defaultFigureColor
  figures.forEach(figure => {
    switch (figure.type) {
      case 'circle': {
        defaultFigureStyles = circleStyles[circleCount % circleStyleCount]
        defaultFigureStyle = defaultFigureStyles.style
        defaultFigureColor = defaultFigureStyles.noChangeColor
        typeCount = circleCount
        circleCount++
        break
      }
      case 'bar': {
        defaultFigureStyles = barStyles[barCount % barStyleCount]
        defaultFigureStyle = defaultFigureStyles.style
        defaultFigureColor = defaultFigureStyles.noChangeColor
        typeCount = barCount
        barCount++
        break
      }
      case 'line': {
        defaultFigureStyles = lineStyles[lineCount % lineStyleCount]
        defaultFigureStyle = defaultFigureStyles.style
        defaultFigureColor = defaultFigureStyles.color
        typeCount = lineCount
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
      const figureStyles = figure.styles?.(cbData, indicator, defaultStyles) ?? { style: defaultFigureStyle, color: defaultFigureColor }
      eachFigureCallback(figure, {
        style: (figureStyles.style ?? defaultFigureStyle) as (LineType & PolygonType),
        color: figureStyles.color ?? defaultFigureColor
      }, defaultFigureStyles, typeCount)
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
  extendData: any
  series: IndicatorSeries
  figures: Array<IndicatorFigure<D>>
  minValue: TypeOrNull<number>
  maxValue: TypeOrNull<number>
  styles: TypeOrNull<Partial<IndicatorStyle>>
  regenerateFigures: TypeOrNull<IndicatorRegenerateFiguresCallback<D>>
  createToolTipDataSource: TypeOrNull<IndicatorCreateToolTipDataSourceCallback>
  draw: TypeOrNull<IndicatorDrawCallback<D>>

  result: D[] = []

  private _precisionFlag: boolean = false

  constructor (indicator: IndicatorTemplate) {
    const {
      name, shortName, series, calcParams, figures, precision,
      shouldOhlc, shouldFormatBigNumber,
      minValue, maxValue, styles, extendData,
      regenerateFigures, createToolTipDataSource, draw
    } = indicator
    this.name = name
    this.shortName = shortName ?? name
    this.series = series ?? IndicatorSeries.NORMAL
    this.precision = precision ?? 4
    this.calcParams = calcParams ?? []
    this.figures = figures ?? []
    this.shouldOhlc = shouldOhlc ?? false
    this.shouldFormatBigNumber = shouldFormatBigNumber ?? false
    this.minValue = minValue ?? null
    this.maxValue = maxValue ?? null
    this.styles = styles ?? null
    this.extendData = extendData
    this.regenerateFigures = regenerateFigures ?? null
    this.createToolTipDataSource = createToolTipDataSource ?? null
    this.draw = draw ?? null
  }

  /**
   * 设置简短名称
   * @param shortName
   * @returns
   */
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

  /**
   * 设置精度
   * @param precision
   * @param flag
   * @returns
   */
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

  /**
   * 设置计算参数
   * @param params
   * @returns
   */
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

  setStyles (styles: TypeOrNull<Partial<IndicatorStyle>>): boolean {
    if (this.styles !== styles) {
      this.styles = styles
      return true
    }
    return false
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

  setMinValue (value: TypeOrNull<number>): boolean {
    if (this.minValue !== value) {
      this.minValue = value
      return true
    }
    return false
  }

  setMaxValue (value: TypeOrNull<number>): boolean {
    if (this.maxValue !== value) {
      this.maxValue = value
      return true
    }
    return false
  }

  setRegenerateFigures (callback: TypeOrNull<IndicatorRegenerateFiguresCallback>): boolean {
    if (this.regenerateFigures !== callback) {
      this.regenerateFigures = callback
      return true
    }
    return false
  }

  setCreateToolTipDataSource (callback: TypeOrNull<IndicatorCreateToolTipDataSourceCallback>): boolean {
    if (this.createToolTipDataSource !== callback) {
      this.createToolTipDataSource = callback
      return true
    }
    return false
  }

  setDraw (callback: TypeOrNull<IndicatorDrawCallback>): boolean {
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
