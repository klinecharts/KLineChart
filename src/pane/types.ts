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

export interface PaneGap {
  top?: number
  bottom?: number
}

export interface PaneAxisOptions {
  name?: string
  scrollZoomEnabled?: boolean
}

export const enum PanePosition {
  Top = 'top',
  Bottom = 'bottom'
}

export interface PaneOptions {
  id?: string
  height?: number
  minHeight?: number
  dragEnabled?: boolean
  position?: PanePosition
  gap?: PaneGap
  axisOptions?: PaneAxisOptions
}

export const PANE_MIN_HEIGHT = 30

export const PANE_DEFAULT_HEIGHT = 100

export const PaneIdConstants = {
  CANDLE: 'candle_pane',
  INDICATOR: 'indicator_pane_',
  X_AXIS: 'x_axis_pane'
}
