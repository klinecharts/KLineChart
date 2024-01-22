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

import type Nullable from '../../common/Nullable'
import type DeepPartial from '../../common/DeepPartial'
import { type Styles } from '../../common/Styles'

import light from './light'
import dark from './dark'

const styles: Record<string, DeepPartial<Styles>> = {
  light,
  dark
}

function registerStyles (name: string, ss: DeepPartial<Styles>): void {
  styles[name] = ss
}

function getStyles (name: string): Nullable<DeepPartial<Styles>> {
  return styles[name] ?? null
}

export {
  registerStyles,
  getStyles
}
