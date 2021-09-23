import { ShapeTemplate } from './Shape';
import { TechnicalIndicatorTemplate } from './TechnicalIndicator';

interface Extension {
  addTechnicalIndicatorTemplate: (template: TechnicalIndicatorTemplate | TechnicalIndicatorTemplate[]) => void;
  addShapeTemplate: (template: ShapeTemplate | ShapeTemplate[]) => void;
}

export declare const extension: Extension;
