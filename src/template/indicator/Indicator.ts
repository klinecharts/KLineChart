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

import CustomRequired from '../../common/Required'
import KLineData from '../../common/KLineData'
import Bounding from '../../common/Bounding'

import { VisibleRange } from '../../store/TimeScaleStore'
import { IndicatorStyle } from '../../store/styles'

import XAxis from '../../componentl/XAxis'
import YAxis from '../../componentl/YAxis'

export const enum IndicatorSeries {
  NORMAL = 'normal',
  PRICE = 'price',
  VOLUME = 'volume'
}

export interface IndicatorPlotStyle {
  style?: 'fill' | 'stroke' | 'stroke-fill' | 'solid' | 'dashed'
  color?: string
}

export interface IndicatorPlotStylesDataChild<D> {
  kLineData?: KLineData
  indicatorData?: D
}

export interface IndicatorPlotStylesData<D> {
  prev: IndicatorPlotStylesDataChild<D>
  current: IndicatorPlotStylesDataChild<D>
  next: IndicatorPlotStylesDataChild<D>
}

export type IndicatorPlotStylesCallback<D> = (data: IndicatorPlotStylesData<D>, indicator: Indicator<D>, defaultStyles: IndicatorStyle) => IndicatorPlotStyle

export interface IndicatorPlot<D> {
  key: string
  title?: string
  type?: string
  baseValue?: number
  styles?: IndicatorPlotStylesCallback<D>
}

export type IndicatorRegeneratePlotsCallback<D> = (calcParms: any[]) => Array<IndicatorPlot<D>>
export type IndicatorCreateToolTipDataSourceCallback = () => any

export interface IndicatorDrawDataSource<D> {
  kLineDataList: KLineData[]
  indicatorDataList: D[]
}
export interface IndicatorDrawParams<D = any> {
  ctx: CanvasRenderingContext2D
  kLineDataList: KLineData[]
  indicator: Indicator<D>
  visibleRange: VisibleRange
  bounding: Bounding
  defaultStyles: IndicatorStyle
  xAxis: XAxis
  yAxis: YAxis
}

export type IndicatorDrawCallback<D> = (params: IndicatorDrawParams<D>) => boolean
export type IndicatorCalcOptions<D> = Pick<Indicator<D>, 'plots' | 'calcParams' | 'extendData'>
export type IndicatorCalcCallback<D> = (dataList: KLineData[], options: IndicatorCalcOptions<D>) => Promise<D[]> | D[]

export interface Indicator<D = any> {
  // 指标名
  name: string
  // 指标简短名称，用于显示
  shortName?: string
  // 精度
  precision?: number
  // 计算参数
  calcParams?: any[]
  // 是否需要ohlc
  shouldOhlc?: boolean
  // 是否需要格式化大数据值，从1000开始格式化，比如100000是否需要格式化100K
  shouldFormatBigNumber?: boolean
  // 样式
  styles?: IndicatorStyle
  // 扩展数据
  extendData?: any
  // 系列
  series?: IndicatorSeries
  // 数据信息
  plots?: Array<IndicatorPlot<D>>
  // 指定的最小值
  minValue?: number
  // 指定的最大值
  maxValue?: number
  // 计算
  calc?: IndicatorCalcCallback<D>
  // 重新生成数据配置
  regeneratePlots?: IndicatorRegeneratePlotsCallback<D>
  // 创建自定义提示文字
  createToolTipDataSource?: IndicatorCreateToolTipDataSourceCallback
  // 自定义绘制
  draw?: IndicatorDrawCallback<D>
  // 结果
  result?: D[]
}

export type IndicatorConstructor<D = any> = new () => IndicatorTemplate<D>

export function getIndicatorPlotStyles<D> (
  kLineDataList: KLineData[],
  indicatorDataList: D[],
  dataIndex: number,
  plot: IndicatorPlot<D>,
  indicator: Indicator<D>,
  defaultIndicatorStyles: IndicatorStyle,
  defaultPlotStyles: Required<IndicatorPlotStyle>
): Required<IndicatorPlotStyle> {
  const style = defaultPlotStyles.style
  const color = defaultPlotStyles.color
  const cbData = {
    prev: { kLineData: kLineDataList[dataIndex - 1], indicatorData: indicatorDataList[dataIndex - 1] },
    current: { kLineData: kLineDataList[dataIndex], indicatorData: indicatorDataList[dataIndex] },
    next: { kLineData: kLineDataList[dataIndex + 1], indicatorData: indicatorDataList[dataIndex + 1] }
  }
  const plotStyles = plot.styles?.(cbData, indicator, defaultIndicatorStyles) ?? { style, color }
  return {
    style: plotStyles.style ?? style,
    color: plotStyles.color ?? color
  }
}

export default abstract class IndicatorTemplate<D = any> implements CustomRequired<Indicator<D>, 'calc'> {
  name: string
  shortName?: string
  precision?: number
  calcParams?: any[]
  shouldOhlc?: boolean
  shouldFormatBigNumber?: boolean
  styles?: IndicatorStyle
  extendData?: any
  series?: IndicatorSeries
  plots?: Array<IndicatorPlot<D>>
  minValue?: number
  maxValue?: number
  regeneratePlots?: IndicatorRegeneratePlotsCallback<D>
  createToolTipDataSource?: IndicatorCreateToolTipDataSourceCallback
  draw?: IndicatorDrawCallback<D>

  result?: D[] = []

  private _precisionFlag: boolean = false

  constructor (indicator: Indicator<D>) {
    const {
      name, shortName, series, calcParams, plots, precision,
      shouldOhlc, shouldFormatBigNumber,
      minValue, maxValue, styles, extendData
    } = indicator
    this.name = name
    this.shortName = shortName ?? name
    this.series = series ?? IndicatorSeries.NORMAL
    this.precision = precision ?? 4
    this.calcParams = calcParams ?? []
    this.plots = plots ?? []
    this.shouldOhlc = shouldOhlc ?? false
    this.shouldFormatBigNumber = shouldFormatBigNumber ?? false
    this.minValue = minValue
    this.maxValue = maxValue
    this.styles = styles
    this.extendData = extendData
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
    if (this.regeneratePlots !== undefined) {
      this.plots = this.regeneratePlots(params)
    }
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

  setStyles (styles: IndicatorStyle): boolean {
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

  setPlots (plots: any): boolean {
    if (this.plots !== plots) {
      this.plots = plots
      return true
    }
    return false
  }

  async calcIndicator (dataList: KLineData[]): Promise<boolean> {
    try {
      const result = await this.calc(dataList, { plots: this.plots, calcParams: this.calcParams, extendData: this.extendData })
      this.result = result
      return true
    } catch (e) {
      return false
    }
  }

  abstract calc (dataList: KLineData[], options: IndicatorCalcOptions<D>): D[] | Promise<D[]>

  static extend<D> (indicator: CustomRequired<Indicator<D>, 'calc'>): IndicatorConstructor<D> {
    class Custom extends IndicatorTemplate<D> {
      constructor () {
        super(indicator)
      }

      calc (dataList: KLineData[], options: IndicatorCalcOptions<D>): D[] | Promise<D[]> {
        return indicator.calc(dataList, options)
      }
    }
    Custom.prototype.regeneratePlots = indicator.regeneratePlots
    Custom.prototype.createToolTipDataSource = indicator.createToolTipDataSource
    Custom.prototype.draw = indicator.draw
    return Custom
  }
}
