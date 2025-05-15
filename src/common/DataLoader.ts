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

import type Nullable from './Nullable'
import type { KLineData } from './Data'
import type SymbolInfo from './SymbolInfo'
import type { Period } from './Period'

export type DataLoadType = 'init' | 'forward' | 'backward' | 'update'

export type DataLoadMore = boolean | {
  backward: boolean
  forward: boolean
}

export interface DataLoaderGetBarsParams {
  type: DataLoadType
  timestamp: Nullable<number>
  symbol: SymbolInfo
  period: Period
  callback: (data: KLineData[], more?: DataLoadMore) => void
}

export interface DataLoaderSubscribeBarParams {
  symbol: SymbolInfo
  period: Period
  callback: (data: KLineData) => void
}

export type DataLoaderUnsubscribeBarParams = Omit<DataLoaderSubscribeBarParams, 'callback'>

export interface DataLoader {
  getBars: (params: DataLoaderGetBarsParams) => void | Promise<void>
  subscribeBar?: (params: DataLoaderSubscribeBarParams) => void
  unsubscribeBar?: (params: DataLoaderUnsubscribeBarParams) => void
}
