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

import type Nullable from '../Nullable'
import { isValid } from './typeChecks'

let measureCtx: Nullable<CanvasRenderingContext2D> = null

const TEXT_WIDTH_CACHE_SIZE = 2048

const textWidthCache = new Map<string, number>()

let fontLoadClearSubscribed = false

function ensureFontLoadClear(): void {
  if (!fontLoadClearSubscribed) {
    fontLoadClearSubscribed = true
    document.fonts.ready.then(() => {
      textWidthCache.clear()
    })
  }
}

/**
 * Measure the width of text with the font currently set on the ctx, cached by font and text
 * @param ctx
 * @param text
 * @returns {number}
 */
export function measureTextWidth(ctx: CanvasRenderingContext2D, text: string): number {
  const key = `${ctx.font}\u0000${text}`
  const cached = textWidthCache.get(key)
  if (cached !== undefined) {
    return cached
  }
  ensureFontLoadClear()
  const width = ctx.measureText(text).width
  if (textWidthCache.size >= TEXT_WIDTH_CACHE_SIZE) {
    const oldestKey = textWidthCache.keys().next().value
    if (oldestKey !== undefined) {
      textWidthCache.delete(oldestKey)
    }
  }
  textWidthCache.set(key, width)
  return width
}

/**
 * Get pixel ratio
 * @param canvas
 * @returns {number}
 */
export function getPixelRatio(canvas: HTMLCanvasElement): number {
  return canvas.ownerDocument.defaultView?.devicePixelRatio ?? 1
}

export function createFont(size?: number, weight?: string | number, family?: string): string {
  return `${weight ?? 'normal'} ${size ?? 12}px ${family ?? 'Helvetica Neue'}`
}

/**
 * Measure the width of text
 * @param text
 * @returns {number}
 */
export function calcTextWidth(text: string, size?: number, weight?: string | number, family?: string): number {
  if (!isValid(measureCtx)) {
    const canvas = document.createElement('canvas')
    const pixelRatio = getPixelRatio(canvas)
    measureCtx = canvas.getContext('2d')!
    measureCtx.scale(pixelRatio, pixelRatio)
  }
  measureCtx.font = createFont(size, weight, family)
  return Math.round(measureTextWidth(measureCtx, text))
}
