import { Point } from './Common';

export declare interface Tag {
  id: string;
  point: Point;
  text?: string | number;
  mark?: string;
  coordinate?: number;
  styles?: any;
}
