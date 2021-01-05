import { KLineData } from './KLineData'

export type DrawActionType = 'drawCandle' | 'drawTechnicalIndicator'

export interface DrawActionCallbackParams {
  ctx: CanvasRenderingContext2D;
  kLineData: KLineData;
  dataIndex: number;
  technicalIndicatorData?: any
  technicalIndicatorType?: string
  coordinate: any;
  barSpace: number;
  halfBarSpace: number;
  isCandle: boolean;
}
