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
import Point from '../common/Point'
import Coordinate from '../common/Coordinate'

import { AnnotationStyle } from '../common/Styles'

import OverlayImp, { Overlay, OverlayCreateFiguresCallbackParams, OverlayEventCallback, OverlayFigure } from './Overlay'

export interface Annotation extends Overlay<AnnotationStyle, Omit<Point, 'dataIndex'>, Coordinate, Annotation> {
  onClick: TypeOrNull<OverlayEventCallback<Annotation>>
  onRightClick: TypeOrNull<OverlayEventCallback<Annotation>>
  onMouseEnter: TypeOrNull<OverlayEventCallback<Annotation>>
  onMouseLeave: TypeOrNull<OverlayEventCallback<Annotation>>
}

export type AnnotationConstructor = new () => AnnotationImp

export type AnnotationCreate = ExcludePickPartial<Annotation, 'name' | 'points'>

export type AnnotationTemplate = ExcludePickPartial<Omit<Annotation, 'id' | 'points'>, 'name' | 'createFigures'>

export default abstract class AnnotationImp extends OverlayImp<AnnotationStyle, Omit<Point, 'dataIndex'>, Coordinate, AnnotationImp> implements Annotation {
  onClick: TypeOrNull<OverlayEventCallback<Annotation>>
  onRightClick: TypeOrNull<OverlayEventCallback<Annotation>>
  onMouseEnter: TypeOrNull<OverlayEventCallback<Annotation>>
  onMouseLeave: TypeOrNull<OverlayEventCallback<Annotation>>

  constructor (annotation: AnnotationTemplate) {
    const {
      name, extendData, styles, createExtendFigures,
      onClick, onRightClick, onMouseEnter, onMouseLeave
    } = annotation
    super()
    this.name = name
    this.extendData = extendData ?? null
    this.styles = styles ?? null
    this.createExtendFigures = createExtendFigures ?? null
    this.onClick = onClick ?? null
    this.onRightClick = onRightClick ?? null
    this.onMouseEnter = onMouseEnter ?? null
    this.onMouseLeave = onMouseLeave ?? null
  }

  setOnClickCallback (callback: TypeOrNull<OverlayEventCallback<Annotation>>): boolean {
    if (this.onClick !== callback) {
      this.onClick = callback
      return true
    }
    return false
  }

  setOnRightClickCallback (callback: TypeOrNull<OverlayEventCallback<Annotation>>): boolean {
    if (this.onRightClick !== callback) {
      this.onRightClick = callback
      return true
    }
    return false
  }

  setOnMouseEnterCallback (callback: TypeOrNull<OverlayEventCallback<Annotation>>): boolean {
    if (this.onMouseEnter !== callback) {
      this.onMouseEnter = callback
      return true
    }
    return false
  }

  setOnMouseLeaveCallback (callback: TypeOrNull<OverlayEventCallback<Annotation>>): boolean {
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

      createFigures (params: OverlayCreateFiguresCallbackParams<AnnotationStyle, Omit<Point, 'dataIndex'>, Coordinate, AnnotationImp>): OverlayFigure | OverlayFigure[] {
        return template.createFigures(params)
      }
    }
    return Custom
  }
}
