import {
  KLineData, Precision, Viewport, OverlayEvent,
  CoordinatePoint, TimestampPricePoint
} from './Common';

import { Chart, PictureType, ChartActionType } from './Chart';
import {
  GraphicMarkDataSourceDrawType, GraphicMarkDataSourceDrawStyle,
  GraphicMarkDataSource, GraphicMarkDataSourceItem,
  CreateGraphicMarkOptions,
  OverrideGraphicMarkOptions, GraphicMark
} from './GraphicMark';
import {
  AnnotationCheckParams,
  AnnotationDrawExtendParams,
  Annotation
} from './Annotation';

import { PaneOptions } from './Pane';
import {
  TechnicalIndicatorSeries, TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, OverrideTechnicalIndicator,
  TechnicalIndicatorRenderDataSource,
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
  KLineData, Precision, Viewport, OverlayEvent, PaneOptions,
  CoordinatePoint, TimestampPricePoint,
  GraphicMarkDataSourceDrawType, GraphicMarkDataSourceDrawStyle,
  GraphicMarkDataSource, GraphicMarkDataSourceItem,
  CreateGraphicMarkOptions, OverrideGraphicMarkOptions, GraphicMark,
  AnnotationCheckParams, AnnotationDrawExtendParams, Annotation,
  TechnicalIndicatorSeries, TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, OverrideTechnicalIndicator,
  TechnicalIndicatorRenderDataSource,
  TechnicalIndicator
}
