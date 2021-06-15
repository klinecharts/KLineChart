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

/**
 * 获取屏幕比
 * @param canvas
 * @returns {number}
 */
 export function getPixelRatio (canvas) {
	return (canvas.ownerDocument && canvas.ownerDocument.defaultView && canvas.ownerDocument.defaultView.devicePixelRatio) || 1
  }
  
  /**
   * 测量文字的宽度
   * @param ctx
   * @param text
   * @returns {number}
   */
  export function calcTextWidth (ctx, text) {
	return Math.round(ctx.measureText(text).width)
  }
  
  /**
   * 创建字体
   * @param fontSize
   * @param fontFamily
   * @param fontWeight
   * @returns {string}
   */
  export function createFont (fontSize = 12, fontWeight = 'normal', fontFamily = 'Helvetica Neue') {
	return `${fontWeight} ${fontSize}px ${fontFamily}`
  }
  
  export function hexToRGBA(inputHex, opacity) {
	  var hex = inputHex.replace("#", "");
	  if (inputHex.indexOf("#") > -1 && (hex.length === 3 || hex.length === 6)) {
  
		  var multiplier = hex.length === 3 ? 1 : 2;
  
		  var r = parseInt(hex.substring(0, 1 * multiplier), 16);
		  var g = parseInt(hex.substring(1 * multiplier, 2 * multiplier), 16);
		  var b = parseInt(hex.substring(2 * multiplier, 3 * multiplier), 16);
  
		  var result = "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
  
		  return result;
	  }
	  return inputHex;
  }