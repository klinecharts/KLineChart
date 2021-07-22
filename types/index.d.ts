import {
  KLineData, Precision, Viewport, OverlayEvent,
  Coordinate, Point
} from './Common';

import { Chart, PictureType, ChartActionType } from './Chart';
import {
  GraphicMarkDataSourceDrawType, GraphicMarkDataSourceDrawStyle,
  GraphicMarkDataSource, GraphicMarkDataSourceItem,
  OverrideGraphicMark, GraphicMark, CustomGraphicMark,
  GraphicMarkCheckOnParams, GraphicMarkCreateDataSourceParams,
  GraphicMarkEventPressMoveParams, GraphicMarkEventMoveDrawingParams,
  GraphicMarkDrawExtendParams
} from './GraphicMark';
import {
  AnnotationCheckParams,
  AnnotationDrawParams,
  Annotation
} from './Annotation';

import { Tag } from './Tag';

import { PaneOptions } from './Pane';
import {
  TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, TechnicalIndicatorRenderDataSource,
  TechnicalIndicator, CustomTechnicalIndicatorRenderParams, CustomTechnicalIndicator
} from './TechnicalIndicator';

export declare interface extension {
  addTechnicalIndicator: (technicalIndicators: CustomTechnicalIndicator | CustomTechnicalIndicator[]) => void;
  addGraphicMark: (graphicMarks: CustomTechnicalIndicator | CustomTechnicalIndicator[]) => void;
}

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart | null;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;

export {
  Chart, PictureType, ChartActionType,
  KLineData, Precision, Viewport, OverlayEvent, PaneOptions,
  Coordinate, Point,
  GraphicMarkDataSourceDrawType, GraphicMarkDataSourceDrawStyle,
  GraphicMarkDataSource, GraphicMarkDataSourceItem,
  OverrideGraphicMark, GraphicMark, CustomGraphicMark,
  GraphicMarkCheckOnParams, GraphicMarkCreateDataSourceParams,
  GraphicMarkEventPressMoveParams, GraphicMarkEventMoveDrawingParams,
  GraphicMarkDrawExtendParams,
  AnnotationCheckParams, AnnotationDrawParams, Annotation,
  Tag,
  TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, TechnicalIndicatorRenderDataSource,
  TechnicalIndicator, CustomTechnicalIndicatorRenderParams, CustomTechnicalIndicator
}
