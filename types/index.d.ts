import {
  KLineData, Precision, Viewport, OverlayEvent,
  Coordinate, Point
} from './Common';

import { Chart, PictureType, ChartActionType } from './Chart';
import {
  ShapeMode, ShapeElementType,
  ShapeDataSource, ShapeDataSourceItem,
  OverrideShape, Shape, ShapeTemplate,
  ShapeCheckOnParams, ShapeCreateDataSourceParams,
  ShapeEventPressMoveParams, ShapeEventMoveDrawingParams,
  ShapeDrawExtendParams
} from './Shape';
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
  TechnicalIndicator, TechnicalIndicatorRenderParams, TechnicalIndicatorTemplate
} from './TechnicalIndicator';

export declare interface extension {
  addTechnicalIndicatorTemplate: (template: TechnicalIndicatorTemplate | TechnicalIndicatorTemplate[]) => void;
  addShapeTemplate: (template: ShapeTemplate | ShapeTemplate[]) => void;
}

export declare function version(): string;

export declare function init(ds: HTMLDivElement | string, style?: any): Chart | null;

export declare function dispose(dcs: HTMLDivElement | Chart | string): void;

export {
  Chart, PictureType, ChartActionType,
  KLineData, Precision, Viewport, OverlayEvent, PaneOptions,
  Coordinate, Point,
  ShapeMode, ShapeElementType,
  ShapeDataSource, ShapeDataSourceItem,
  OverrideShape, Shape, ShapeTemplate,
  ShapeCheckOnParams, ShapeCreateDataSourceParams,
  ShapeEventPressMoveParams, ShapeEventMoveDrawingParams,
  ShapeDrawExtendParams,
  AnnotationCheckParams, AnnotationDrawParams, Annotation,
  Tag,
  TechnicalIndicatorPlotType,
  TechnicalIndicatorPlotCallbackDataItem, TechnicalIndicatorPlotCallbackData,
  TechnicalIndicatorPlot, TechnicalIndicatorRenderDataSource,
  TechnicalIndicator, TechnicalIndicatorRenderParams, TechnicalIndicatorTemplate
}
