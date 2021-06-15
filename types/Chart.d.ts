import { OverrideTechnicalIndicator, TechnicalIndicator } from './TechnicalIndicator';
import { KLineData } from './KLineData';
import { CreateGraphicMarkOptions, OverrideGraphicMarkOptions, GraphicMark } from './GraphicMark';
import { PaneOptions } from './Pane';

export declare type ChartActionType = 'drawCandle' | 'drawTechnicalIndicator' | 'zoom' | 'scroll'

export declare type PictureType = 'png' | 'jpeg' | 'bmp';

export declare interface Chart {
  setStyleOptions(options: any): void;
  getStyleOptions(): any;
  setPriceVolumePrecision(pricePrecision: number, volumePrecision: number): void;
  setTimezone(timezone: string): void;
  getTimezone(): string;
  setZoomEnabled(enabled: boolean): void;
  isZoomEnabled(): boolean;
  setScrollEnabled(enabled: boolean): void;
  isScrollEnabled(): boolean;
  setOffsetRightSpace(space: number): void;
  setLeftMinVisibleBarCount(barCount: number): void;
  setRightMinVisibleBarCount(barCount: number): void;
  setDataSpace(space: number): void;
  clearData(): void;
  getDataList(): KLineData[];
  applyNewData(dataList: KLineData[], more?: boolean): void;
  applyMoreData(dataList: KLineData[], more?: boolean): void;
  updateData(data: KLineData): void;
  loadMore(cb: (timestamp: number) => void): void;
  createTechnicalIndicator(name: string, isStack?: boolean, options?: PaneOptions): string | null;
  addCustomTechnicalIndicator(technicalIndicator: TechnicalIndicator): void;
  overrideTechnicalIndicator(override: OverrideTechnicalIndicator): void;
  getTechnicalIndicatorByName(name?: string): any;
  getTechnicalIndicatorByPaneId(paneId: string): any;
  removeTechnicalIndicator(name?: string, paneId?: string): void;
  createGraphicMark(name: string, options?: CreateGraphicMarkOptions): string | null;
  setGraphicMarkOptions(id: string, options: OverrideGraphicMarkOptions): void;
  addCustomGraphicMark(graphicMark: GraphicMark): void;
  removeGraphicMark(graphicMarkId: string): void;
  removeAllGraphicMark(): void;
  subscribeAction (type: ChartActionType, callback: (params: any) => void): void;
  unsubscribeAction (type: ChartActionType, callback: (params: any) => void): void;
  getConvertPictureUrl(includeTooltip?: boolean, includeGraphicMark?: boolean, type?: PictureType, backgroundColor?: string): string;
  resize(): void;
  setChartType(type: 'area' | 'ohlc' | 'candle_solid'): void;
}
