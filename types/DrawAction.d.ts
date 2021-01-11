import { KLineData } from './KLineData';

export declare type DrawActionType = 'drawCandle' | 'drawTechnicalIndicator';

export declare interface DrawActionCallbackParams {
  ctx: CanvasRenderingContext2D;
  kLineData: KLineData;
  dataIndex: number;
  technicalIndicatorData?: any
  technicalIndicatorName?: string
  coordinate: any;
  barSpace: number;
  halfBarSpace: number;
  isCandle: boolean;
}
