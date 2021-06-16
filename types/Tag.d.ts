import { TimestampPricePoint } from './Common';

export declare interface Tag {
  id: string;
  point: TimestampPricePoint;
  text?: string | number;
  mark?: string;
  coordinate?: number;
  styles?: any;
}
