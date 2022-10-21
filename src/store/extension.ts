/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TechnicalIndicator } from './IndicatorStore'
import { Shape } from './ShapeStore'

export interface Extension {
  addTechnicalIndicatorTemplate: (...template: Array<TechnicalIndicator<any>>) => void
  addShapeTemplate: (...templates: Shape[]) => void
}

class ExtensionImp implements Extension {
  private _techExtensions: Array<TechnicalIndicator<any>> = []
  private _shapeExtensions: Shape[] = []

  addTechnicalIndicatorTemplate (...templates: Array<TechnicalIndicator<any>>): void {
    this._techExtensions = this._techExtensions.concat(templates)
  }

  getTechExtensions (): Array<TechnicalIndicator<any>> {
    return this._techExtensions
  }

  addShapeTemplate (...templates: Shape[]): void {
    this._shapeExtensions = this._shapeExtensions.concat(templates)
  }

  getShapeExtensions (): Shape[] {
    return this._shapeExtensions
  }
}

const extension: ExtensionImp = new ExtensionImp()

export default extension
