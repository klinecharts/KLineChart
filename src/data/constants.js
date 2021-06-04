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

// 默认技术指标窗口高度
export const DEFAULT_TECHNICAL_INDICATOR_PANE_HEIGHT = 100

// 技术指标窗口id前缀
export const TECHNICAL_INDICATOR_PANE_ID_PREFIX = 'technical_indicator_pane_'

// 图形标记id前缀
export const GRAPHIC_MARK_ID_PREFIX = 'graphic_mark_'

// 蜡烛图窗口id
export const CANDLE_PANE_ID = 'candle_pane'

// 最小单条数据宽度
export const MIN_DATA_SPACE = 1

// 最大单条数据宽度
export const MAX_DATA_SPACE = 50

/**
 * 刷新层级
 * @type {{OVERLAY: number, MAIN: number, NONE: number, FULL: number}}
 */
export const InvalidateLevel = {
  NONE: 0,
  OVERLAY: 1,
  MAIN: 2,
  FULL: 3
}

/**
 * 图表动作
 * @type {{DRAW_CANDLE: string, SCROLL: string, PANE_DRAG: string, ZOOM: string, CROSSHAIR: string, DRAW_TECHNICAL_INDICATOR: string}}
 */
export const ActionType = {
  DRAW_CANDLE: 'drawCandle',
  DRAW_TECHNICAL_INDICATOR: 'drawTechnicalIndicator',
  ZOOM: 'zoom',
  SCROLL: 'scroll',
  CROSSHAIR: 'crosshair',
  PANE_DRAG: 'pane_drag'
}
