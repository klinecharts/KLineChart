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

import TypeOrNull from '../common/TypeOrNull'
import ExcludePickPartial from '../common/ExcludePickPartial'
import DeepPartial from '../common/DeepPartial'
import Point from '../common/Point'
import Coordinate from '../common/Coordinate'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { AnnotationStyle } from '../common/Styles'

import Axis from './Axis'

export interface AnnotationFigure {
  type: string
  attrs: any
  styles?: any
}

export interface AnnotationCreateFiguresCallbackParams {
  annotation: Annotation
  coordinate: Coordinate
  bounding: Bounding
  barSpace: BarSpace
  precision: Precision
  isActive: boolean
  defaultStyles: AnnotationStyle
  xAxis: Axis
  yAxis: Axis
}

export type AnnotationCreateFiguresCallback = (params: AnnotationCreateFiguresCallbackParams) => AnnotationFigure | AnnotationFigure[]

export type AnnotationEventCllback = (annotation: Annotation) => boolean
export interface Annotation {
  id: string
  name: string
  point: Omit<Point, 'dataIndex'>
  extendData: any
  styles: TypeOrNull<DeepPartial<AnnotationStyle>>
  createPointFigures: TypeOrNull<AnnotationCreateFiguresCallback>
  createExtendFigures: TypeOrNull<AnnotationCreateFiguresCallback>
  onClick: TypeOrNull<AnnotationEventCllback>
  onRightClick: TypeOrNull<AnnotationEventCllback>
  onMouseEnter: TypeOrNull<AnnotationEventCllback>
  onMouseLeave: TypeOrNull<AnnotationEventCllback>
}

export type AnnotationConstructor = new () => AnnotationImp

export type AnnotationCreate = ExcludePickPartial<Annotation, 'name' | 'point'>

export type AnnotationTemplate = ExcludePickPartial<Omit<Annotation, 'id' | 'point'>, 'name'>

export default class AnnotationImp implements Annotation {
  id: string
  name: string
  point: Omit<Point, 'dataIndex'>
  extendData: any
  styles: TypeOrNull<DeepPartial<AnnotationStyle>>
  createPointFigures: TypeOrNull<AnnotationCreateFiguresCallback>
  createExtendFigures: TypeOrNull<AnnotationCreateFiguresCallback>
  onClick: TypeOrNull<AnnotationEventCllback>
  onRightClick: TypeOrNull<AnnotationEventCllback>
  onMouseEnter: TypeOrNull<AnnotationEventCllback>
  onMouseLeave: TypeOrNull<AnnotationEventCllback>

  constructor (annotation: AnnotationTemplate) {
    const {
      name, extendData, styles, createPointFigures, createExtendFigures,
      onClick, onRightClick, onMouseEnter, onMouseLeave
    } = annotation
    this.name = name
    this.extendData = extendData ?? null
    this.styles = styles ?? null
    this.createPointFigures = createPointFigures ?? null
    this.createExtendFigures = createExtendFigures ?? null
    this.onClick = onClick ?? null
    this.onRightClick = onRightClick ?? null
    this.onMouseEnter = onMouseEnter ?? null
    this.onMouseLeave = onMouseLeave ?? null
  }

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

  setPoint (point: Omit<Point, 'dataIndex'>): boolean {
    if (point !== this.point) {
      this.point = point
      return true
    }
    return false
  }

  setStyles (styles: TypeOrNull<DeepPartial<AnnotationStyle>>): boolean {
    if (styles !== this.styles) {
      this.styles = styles
      return true
    }
    return false
  }

  setCreatePointFiguresCallback (callback: TypeOrNull<AnnotationCreateFiguresCallback>): boolean {
    if (callback !== this.createPointFigures) {
      this.createPointFigures = callback
      return true
    }
    return false
  }

  setCreateExtendFiguresCallback (callback: TypeOrNull<AnnotationCreateFiguresCallback>): boolean {
    if (callback !== this.createExtendFigures) {
      this.createExtendFigures = callback
      return true
    }
    return false
  }

  setOnClickCallback (callback: TypeOrNull<AnnotationEventCllback>): boolean {
    if (this.onClick !== callback) {
      this.onClick = callback
      return true
    }
    return false
  }

  setOnRightClickCallback (callback: TypeOrNull<AnnotationEventCllback>): boolean {
    if (this.onRightClick !== callback) {
      this.onRightClick = callback
      return true
    }
    return false
  }

  setOnMouseEnterCallback (callback: TypeOrNull<AnnotationEventCllback>): boolean {
    if (this.onMouseEnter !== callback) {
      this.onMouseEnter = callback
      return true
    }
    return false
  }

  setOnMouseLeaveCallback (callback: TypeOrNull<AnnotationEventCllback>): boolean {
    if (this.onMouseLeave !== callback) {
      this.onMouseLeave = callback
      return true
    }
    return false
  }

  static extend (template: AnnotationTemplate): AnnotationConstructor {
    class Custom extends AnnotationImp {
      constructor () {
        super(template)
      }
    }
    return Custom
  }
}
