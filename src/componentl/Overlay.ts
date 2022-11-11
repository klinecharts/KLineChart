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

import DeepPartial from '../common/DeepPartial'
import TypeOrNull from '../common/TypeOrNull'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'

import Axis from './Axis'

export interface Overlay<S, P, C, O extends Overlay<S, P, C, O>> {
  id: string
  name: string
  points: P
  extendData: any
  styles: TypeOrNull<DeepPartial<S>>
  createFigures: OverlayCreateFiguresCallback<S, P, C, O>
  createExtendFigures: TypeOrNull<OverlayCreateFiguresCallback<S, P, C, O>>
}

export interface OverlayFigure {
  type: string
  attrs: any | any[]
  styles?: any
  isCheckEvent?: boolean
}

export interface OverlayCreateFiguresCallbackParams<S, P, C, O extends Overlay<S, P, C, O>> {
  overlay: O
  coordinates: C
  bounding: Bounding
  barSpace: BarSpace
  precision: Precision
  defaultStyles: S
  xAxis: Axis
  yAxis: Axis
}

export type OverlayEventCallback<O> = (o: O) => boolean

export type OverlayCreateFiguresCallback<S, P, C, O extends Overlay<S, P, C, O>> = (params: OverlayCreateFiguresCallbackParams<S, P, C, O>) => OverlayFigure | OverlayFigure[]

export default abstract class OverlayImp<S, P, C, O extends Overlay<S, P, C, O>> implements Overlay<S, P, C, O> {
  id: string
  name: string
  points: P
  extendData: any
  styles: TypeOrNull<DeepPartial<S>>
  createExtendFigures: TypeOrNull<OverlayCreateFiguresCallback<S, P, C, O>>

  setId (id: string): boolean {
    if (this.id !== undefined) {
      this.id = id
      return true
    }
    return false
  }

  setExtendData (extendData: any): boolean {
    if (extendData !== this.extendData) {
      this.extendData = extendData
      return true
    }
    return false
  }

  setPoints (points: P): boolean {
    if (points !== this.points) {
      this.points = points
      return true
    }
    return false
  }

  setStyles (styles: TypeOrNull<DeepPartial<S>>): boolean {
    if (styles !== this.styles) {
      this.styles = styles
      return true
    }
    return false
  }

  setCreateExtendFiguresCallback (callback: TypeOrNull<OverlayCreateFiguresCallback<S, P, C, O>>): boolean {
    if (callback !== this.createExtendFigures) {
      this.createExtendFigures = callback
      return true
    }
    return false
  }

  abstract createFigures (params: OverlayCreateFiguresCallbackParams<S, P, C, O>): OverlayFigure | OverlayFigure[]
}
