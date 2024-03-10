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

export function throttle (func: (...args: any[]) => any, wait?: number): () => void {
  let previous = 0
  return function () {
    const now = Date.now()
    if (now - previous > (wait ?? 20)) {
      func.apply(this, arguments)
      previous = now
    }
  }
}

// export function memoize<R1 = any, R2 = any> (func: (...args: any[]) => R1, resolver?: (...args: any[]) => R2): (...args: any[]) => R1 {
//   if (!isFunction(func) || (isValid(resolver) && !isFunction(resolver))) {
//     throw new TypeError('Expected a function')
//   }
//   const memoized = function (...args: any[]): any {
//     const key = isFunction(resolver) ? resolver.apply(this, args) : args[0]
//     const cache = memoized.cache

//     if (cache.has(key)) {
//       return cache.get(key)
//     }
//     const result = func.apply(this, args)
//     // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
//     memoized.cache = cache.set(key, result) || cache
//     return result
//   }
//   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
//   memoized.cache = new (memoize.Cache || Map)()
//   return memoized
// }
// memoize.Cache = Map
