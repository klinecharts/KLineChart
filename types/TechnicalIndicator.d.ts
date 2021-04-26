import { Viewport, KLineData } from './Common';

export declare type TechnicalIndicatorSeries = 'price' | 'volume' | 'normal';

export declare type TechnicalIndicatorPlotType = 'circle' | 'bar' | 'line';

export declare interface TechnicalIndicatorPlotCallbackDataItem {
  kLineData?: KLineData;
  technicalIndicatorData?: any;
}

export declare interface TechnicalIndicatorPlotCallbackData {
  preData?: TechnicalIndicatorPlotCallbackDataItem;
  currentData?: TechnicalIndicatorPlotCallbackDataItem;
  nextData?: TechnicalIndicatorPlotCallbackDataItem;
}

export declare interface TechnicalIndicatorPlot {
  key: string;
  title?: string;
  type?: TechnicalIndicatorPlotType;
  color?: (data: TechnicalIndicatorPlotCallbackData, options: any) => string;
  isStroke?: (data: TechnicalIndicatorPlotCallbackData) => boolean;
}

export declare interface OverrideTechnicalIndicator {
  name: string;
  calcParams?: number[];
  calcParamsAllowDecimal?: any;
  precision?: number;
  styles?: any;
}

export declare interface TechnicalIndicatorRenderDataSource {
  from?: number;
  to?: number;
  kLineDataList?: KLineData[];
  technicalIndicatorDataList?: any[];
}

export declare interface TechnicalIndicator extends OverrideTechnicalIndicator {
  calcTechnicalIndicator: (kLineDataList: KLineData[], calcParams: number[], plots: TechnicalIndicatorPlot[]) => any[];
  series?: TechnicalIndicatorSeries;
  plots?: TechnicalIndicatorPlot[];
  shouldCheckParamCount?: boolean;
  shouldOhlc?: boolean;
  shouldFormatBigNumber?: boolean,
  baseValue?: number;
  minValue?: number;
  maxValue?: number;
  regeneratePlots?: (calcParams?: number[]) => TechnicalIndicatorPlot[];
  render?: (
    ctx: CanvasRenderingContext2D,
    dataSource: TechnicalIndicatorRenderDataSource,
    viewport: Viewport,
    styleOptions: any,
    xAxisConvert: any,
    yAxisConvert: any,
    isCandleTechnicalIndicator: boolean
  ) => void;
}
