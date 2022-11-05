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

export interface Figure<A = any> {
  name: string
  draw: (ctx: CanvasRenderingContext2D, attrs: A) => void
  checkEventOn: (coordinate: Coordinate, attrs: A) => boolean
}

export type FigureConstructor<A = any> = new (attrs: A) => FigureTemplate<A>

export default abstract class FigureTemplate<A = any> extends Element implements Omit<Figure<A>, 'name'> {
  readonly attrs: A

  constructor (attrs: A) {
    super()
    this.attrs = attrs
  }

  checkEventOn (coordinate: Coordinate): boolean {
    return this.checkEventOnImp(coordinate, this.attrs)
  }

  draw (ctx: CanvasRenderingContext2D): void {
    this.drawImp(ctx, this.attrs)
  }

  abstract checkEventOnImp (coordinate: Coordinate, attrs: A): boolean

  abstract drawImp (ctx: CanvasRenderingContext2D, attrs: A): void

  static extend<A> (figure: Omit<Figure<A>, 'name'>): new (attrs: A) => FigureTemplate<A> {
    class Custom extends FigureTemplate<A> {
      checkEventOnImp (coordinate: Coordinate, attrs: A): boolean {
        return figure.checkEventOn(coordinate, attrs)
      }

      drawImp (ctx: CanvasRenderingContext2D, attrs: A): void {
        figure.draw(ctx, attrs)
      }
    }
    return Custom
  }
}
