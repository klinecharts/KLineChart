import { OverrideTechnicalIndicator, TechnicalIndicator } from './TechnicalIndicator';
import { KLineData } from './KLineData';
import { PaneType, PaneOptions } from './Pane';
import { DrawActionType, DrawActionCallbackParams } from './DrawAction'
import { GraphicMark } from './GraphicMark'

export type PictureType = 'png' | 'jpeg' | 'bmp';

export interface Chart {
  setStyleOptions(options: any): void;
  getStyleOptions(): any;
  overrideTechnicalIndicator(override: OverrideTechnicalIndicator): void;
  getTechnicalIndicatorInfo(technicalIndicatorType?: string): any;
  setPriceVolumePrecision(pricePrecision: number, volumePrecision: number): void;
  setTechnicalIndicatorPrecision(precision: number, technicalIndicatorType?: string): void;
  setTimezone(timezone: string): void;
  getTimezone(): string;
  resize(): void;
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
  setTechnicalIndicatorType(technicalIndicatorType: string, isStack?: boolean, paneId?: string): void;
  getTechnicalIndicatorType(paneId?: string): string[];
  createPane(type?: PaneType, options?: PaneOptions): string | null;
  removePane(paneId: string): void
  addCustomTechnicalIndicator(technicalIndicatorInfo: TechnicalIndicator): void;
  removeTechnicalIndicator(technicalIndicatorType?: string, paneId?: string): void;
  createGraphicMark(graphicMarkType: string): string | null;
  addCustomGraphicMark(graphicMark: GraphicMark): void;
  removeAllGraphicMark(): void;
  subscribeDrawAction (type: DrawActionType, callback: (params: DrawActionCallbackParams) => void): void;
  unsubscribeDrawAction (type: DrawActionType, callback: (params: DrawActionCallbackParams) => void): void;
  getConvertPictureUrl(includeFloatLayer?: boolean, includeGraphicMark?: boolean, type?: PictureType, backgroundColor?: string): string;
}
