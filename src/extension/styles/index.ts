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

import TypeOrNull from '../../common/TypeOrNull'
import DeepPartial from '../../common/DeepPartial'
import { Styles } from '../../common/Options'

const styles: { [key: string]: DeepPartial<Styles> } = {
  light: {}
}

function registerStyles (name: string, styles: DeepPartial<Styles>): void {
  styles[name] = styles
}

function getStyles (name: string): TypeOrNull<DeepPartial<Styles>> {
  return styles[name] ?? null
}

export {
  registerStyles,
  getStyles
}
