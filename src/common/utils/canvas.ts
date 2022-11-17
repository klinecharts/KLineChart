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

let measureCtx: CanvasRenderingContext2D

/**
 * 获取屏幕比
 * @param canvas
 * @returns {number}
 */
export function getPixelRatio (canvas: HTMLCanvasElement): number {
  return canvas.ownerDocument?.defaultView?.devicePixelRatio ?? 2
}

export function createFont (size?: number, weight?: string | number, family?: string): string {
  return `${weight ?? 'normal'} ${size ?? 12}px ${family ?? 'Helvetica Neue'}`
}

/**
 * 测量文字的宽度
 * @param text
 * @returns {number}
 */
export function calcTextWidth (text: string, size?: number, weight?: string | number, family?: string): number {
  if (measureCtx === undefined) {
    const canvas = document.createElement('canvas')
    const pixelRatio = getPixelRatio(canvas)
    measureCtx = canvas.getContext('2d') as CanvasRenderingContext2D
    measureCtx.scale(pixelRatio, pixelRatio)
  }
  measureCtx.font = createFont(size, weight, family)
  return Math.round(measureCtx.measureText(text).width)
}
