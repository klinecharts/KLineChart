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

import Bounding from '../common/Bounding'
import TechWidget from './IndicatorWidget'

export default class CandleWidget extends TechWidget {
  protected updateMain (ctx: CanvasRenderingContext2D, bounding: Bounding): void {
    throw new Error('Method not implemented.')
  }

  protected updateOverlay (ctx: CanvasRenderingContext2D, bounding: Bounding): void {
    throw new Error('Method not implemented.')
  }
}
