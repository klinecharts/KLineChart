import { Chart, PictureType, ChartActionType } from './Chart';
import {
  GraphicMarkViewport,
  CoordinatePoint, TimestampPricePoint,
  GraphicMarkDataSourceDrawType, GraphicMarkDataSourceDrawStyle,
  GraphicMarkDataSource, GraphicMarkDataSourceItem,
  PriceVolumePrecision, CreateGraphicMarkOptions,
  OverrideGraphicMarkOptions, GraphicMark
} from './GraphicMark';
import { KLineData } from './KLineData';
import { PaneOptions } from './Pane';
import {
  TechnicalIndicatorSeries, TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, OverrideTechnicalIndicator,
  TechnicalIndicatorRenderDataSource, TechnicalIndicatorRenderViewport,
  TechnicalIndicator
} from './TechnicalIndicator';

export declare interface extension {
  addTechnicalIndicator: (technicalIndicators: TechnicalIndicator | TechnicalIndicator[]) => void;
  addGraphicMark: (graphicMarks: GraphicMark | GraphicMark[]) => void;
}

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart | null;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;

export {
  Chart, PictureType, ChartActionType,
  GraphicMarkViewport, CoordinatePoint, TimestampPricePoint,
  GraphicMarkDataSourceDrawType, GraphicMarkDataSourceDrawStyle,
  GraphicMarkDataSource, GraphicMarkDataSourceItem,
  PriceVolumePrecision, CreateGraphicMarkOptions,
  OverrideGraphicMarkOptions, GraphicMark,
  KLineData, PaneOptions,
  TechnicalIndicatorSeries, TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, OverrideTechnicalIndicator,
  TechnicalIndicatorRenderDataSource, TechnicalIndicatorRenderViewport,
  TechnicalIndicator
}
