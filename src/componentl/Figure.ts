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

import Coordinate from '../common/Coordinate'
import Element from '../common/Element'

export const DEVIATION = 2

export interface FigureAttrsStyles<A, S> {
  attrs: A
  styles: S
}

export interface Figure<A = any, S = any> {
  name: string
  draw: (ctx: CanvasRenderingContext2D, attrs: A, styles: S) => void
  checkEventOn: (coordinate: Coordinate, attrs: A, styles: S) => boolean
}

export type FigureConstructor<A = any, S = any> = new (attrs: A, styles: S) => FigureImp<A, S>

export default abstract class FigureImp<A = any, S = any> extends Element implements Omit<Figure<A, S>, 'name'> {
  private readonly _attrs: A
  private readonly _styles: S

  constructor (attrs: A, styles: S) {
    super()
    this._attrs = attrs
    this._styles = styles
  }

  checkEventOn (coordinate: Coordinate): boolean {
    return this.checkEventOnImp(coordinate, this._attrs, this._styles)
  }

  draw (ctx: CanvasRenderingContext2D): void {
    this.drawImp(ctx, this._attrs, this._styles)
  }

  abstract checkEventOnImp (coordinate: Coordinate, attrs: A, styles: S): boolean

  abstract drawImp (ctx: CanvasRenderingContext2D, attrs: A, styles: S): void

  static extend<A, S> (figure: Omit<Figure<A, S>, 'name'>): new (attrs: A, styles: S) => FigureImp<A, S> {
    class Custom extends FigureImp<A, S> {
      checkEventOnImp (coordinate: Coordinate, attrs: A, styles: S): boolean {
        return figure.checkEventOn(coordinate, attrs, styles)
      }

      drawImp (ctx: CanvasRenderingContext2D, attrs: A, styles: S): void {
        figure.draw(ctx, attrs, styles)
      }
    }
    return Custom
  }
}
