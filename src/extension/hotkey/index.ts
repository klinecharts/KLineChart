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

import type { HotkeyTemplate } from '../../common/Hotkey'

import scrollLeft from './scrollLeft'
import scrollRight from './scrollRight'
import zoomIn from './zoomIn'
import zoomOut from './zoomOut'

const hotkeys: Record<string, HotkeyTemplate> = {
  [scrollLeft.name]: scrollLeft,
  [scrollRight.name]: scrollRight,
  [zoomIn.name]: zoomIn,
  [zoomOut.name]: zoomOut
}

function registerHotkey<E = unknown> (hotkey: HotkeyTemplate<E>): void {
  hotkeys[hotkey.name] = hotkey as HotkeyTemplate
}

function getHotkey (name: string): Nullable<HotkeyTemplate> {
  return hotkeys[name] ?? null
}

function getSupportedHotkeys (): string[] {
  return Object.keys(hotkeys)
}

export { registerHotkey, getHotkey, getSupportedHotkeys }
