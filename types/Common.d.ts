export declare interface KLineData {
  timestamp: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume?: number;
  turnover?: number;
}

export declare interface Precision {
  price: number;
  volume: number;
}

export declare interface Viewport {
  width?: number;
  height?: number;
  dataSpace?: number;
  barSpace?: number;
}

export declare interface Coordinate {
  x?: number;
  y?: number;
}

export declare interface Point {
  timestamp?: number;
  dataIndex?: number;
  value?: number;
}

export declare interface OverlayEvent {
  id: number | string;
  points?: Point | Point[];
  event?: any;
}
