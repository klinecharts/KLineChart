type IndicatorType = 'NO' | 'MA' | 'VOL' | 'MACD' | 'BOLL' | 'KDJ' | 'KD' | 'RSI' | 'BIAS' | 'BRAR' | 'CCI' | 'DMI' | 'CR' | 'PSY' | 'DMA' | 'TRIX' | 'OBV' | 'VR' | 'WR' | 'MTM' | 'EMV' | 'SAR'
type MarkerType = 'none' | 'horizontalStraightLine' | 'verticalStraightLine' | 'straightLine' | 'horizontalRayLine' | 'verticalRayLine' | 'rayLine' | 'horizontalSegmentLine' | 'verticalSegmentLine' | 'segmentLine' | 'priceLine' | 'priceChannelLine' | 'parallelStraightLine' | 'fibonacciLine'
type ChartType = 'candle' | 'real_time'

export interface KLineData {
  open: number
  close: number
  high: number
  low: number
  volume: number
  timestamp: number
  turnover: number
}

type PictureType = 'png' | 'jpeg' | 'bmp'

type ChartComponentType = 'candle' | 'vol' | 'subIndicator' | 'tooltip' | 'marker'

export interface Chart {
  setStyle(style: any): void
  addData(data: KLineData[] | KLineData, pos?: number): void
  setMainIndicatorType(indicatorType: IndicatorType): void
  setSubIndicatorType(indicatorType: IndicatorType): void
  setIndicatorParams(indicatorType: IndicatorType, params: number[])
  showVolChart(isShow: boolean): void
  setDefaultRange(range: number): void
  setMinRange(range: number): void
  setMaxRange(range: number): void
  getDataList(): KLineData[]
  setMainChartType(chartType: ChartType): void
  getMainIndicatorType(): IndicatorType
  getSubIndicatorType(): IndicatorType
  getStyle(): any
  isShowVolChart(): boolean
  clearData(): void
  getConvertPictureUrl(pictureType?: PictureType, excludes?: ChartComponentType[]): string
  drawMarker(markerType: MarkerType): void
  clearAllMarker(): void
}

export const version: string

export function init(dom: HTMLElement, style?: any): Chart
