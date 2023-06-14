import{_ as s,o as n,c as a,V as l}from"./chunks/framework.98960eec.js";const A=JSON.parse('{"title":"Overlay","description":"","frontmatter":{},"headers":[],"relativePath":"en-US/guide/overlay.md","filePath":"en-US/guide/overlay.md","lastUpdated":1686770656000}'),p={name:"en-US/guide/overlay.md"},o=l(`<h1 id="overlay" tabindex="-1">Overlay <a class="header-anchor" href="#overlay" aria-label="Permalink to &quot;Overlay&quot;">​</a></h1><p>This document introduces the built-in overlays in the chart and how to customize a overlay.</p><h2 id="built-in-overlay-types" tabindex="-1">Built-in overlay types <a class="header-anchor" href="#built-in-overlay-types" aria-label="Permalink to &quot;Built-in overlay types&quot;">​</a></h2><p><code>horizontalRayLine</code>, <code>horizontalSegment</code>, <code>horizontalStraightLine</code>, <code>verticalRayLine</code>, <code>verticalSegment</code>, <code>verticalStraightLine</code>, <code>rayLine</code>, <code>segment</code>, <code>straightLine</code>, <code>priceLine</code>, <code>priceChannelLine</code>, <code>parallelL</code>filineLine<code>, ci </code>, <code>simpleAnnotation</code>, <code>simpleTag</code></p><h2 id="custom-overlays" tabindex="-1">Custom overlays <a class="header-anchor" href="#custom-overlays" aria-label="Permalink to &quot;Custom overlays&quot;">​</a></h2><p>Customize an overlay, then add it globally through <code>klinecharts.registerOverlay</code>, add it to the chart and use it like the built-in overlay.</p><h3 id="attribute-description" tabindex="-1">Attribute description <a class="header-anchor" href="#attribute-description" aria-label="Permalink to &quot;Attribute description&quot;">​</a></h3><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight vp-code-dark"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Name, a required field, used as the unique identifier for overlay creation</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">name</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// How many steps are needed in total to complete the drawing, not necessary</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">totalStep</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Whether to lock, do not trigger events, not necessary</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">lock</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Do you need visible</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">visible</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Draw level</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">zLevel</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Do you need the graphics corresponding to the default points, not necessary</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">needDefaultPointFigure</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Do you need the graphics on the default X-axis, not necessary</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">needDefaultXAxisFigure</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Do you need the graphics on the default Y axis, not necessary</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">needDefaultYAxisFigure</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// mode, options are \`normal\`, \`weak_magnet\`, \`strong_magnet\`, not required</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">mode</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">normal</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">weak_magnet</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">strong_magnet</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// mode sensitivity, only valid when mode is weak_magnet</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">modeSensitivity</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// point information, not required</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">points</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// timestamp</span></span>
<span class="line"><span style="color:#F07178;">    timestamp</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// data index</span></span>
<span class="line"><span style="color:#F07178;">    dataIndex</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// corresponding to the value of the y-axis</span></span>
<span class="line"><span style="color:#F07178;">    value</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}&gt;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Extended data, not required</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">extendData</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">any</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// style, not required, the type participates in the overlay in [style]</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">styles</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayStyle</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Create graphics corresponding to points, not required</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">createPointFigures</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// overlay instance</span></span>
<span class="line"><span style="color:#F07178;">    overlay</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Overlay</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// coordinate information corresponding to points</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">: </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#F07178;">      x</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">      y</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// window size information</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">bounding</span><span style="color:#F07178;">: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// width</span></span>
<span class="line"><span style="color:#F07178;">      width</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// high</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">height</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// distance to the left</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">left</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// distance to the right</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">right</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// distance from top</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">top</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// distance from bottom</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">bottom</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// information about the size of the candlestick</span></span>
<span class="line"><span style="color:#F07178;">    barSpace</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// candlestick size</span></span>
<span class="line"><span style="color:#F07178;">      bar</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">halfBar</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// candlesticks do not include dimensions of gaps between candlesticks</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">gapBar</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">halfGapBar</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// precision</span></span>
<span class="line"><span style="color:#F07178;">    precision</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// price precision</span></span>
<span class="line"><span style="color:#F07178;">      price</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// Quantity precision</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">volume</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// thousands separator</span></span>
<span class="line"><span style="color:#F07178;">    thousandsSeparator</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">string</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// Constructor for objects that format date and time, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat for details</span></span>
<span class="line"><span style="color:#F07178;">    dateTimeFormat</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Intl</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">DateTimeFormat</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// The default style, that is, the overlay in the global style configuration, the type participates in the overlay in [style]</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">defaultStyles</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">OverlayStyle</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// x-axis component, some built-in conversion methods</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">xAxis</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">XAxis</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// y-axis component, with some built-in conversion methods</span></span>
<span class="line"><span style="color:#F07178;">    yAxis</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">YAxis</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">) </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// No special meaning, can be used for extension fields</span></span>
<span class="line"><span style="color:#F07178;">    key?</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">string</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// Graphic type, one of the return values of klinecharts.getSupportFigures</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">type</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">string</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// The properties of the graphic corresponding to the type</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">attrs</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">any</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">any</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// The style of the graphic corresponding to type</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">styles</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">any</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// Whether to ignore the event</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ignoreEvent</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayFigureIgnoreEventType</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#F07178;">    key</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#F07178;">    type</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#F07178;">    attrs</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#F07178;">    styles</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">any</span></span>
<span class="line"><span style="color:#F07178;">    ignoreEvent</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayFigureIgnoreEventType</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Create graphics on the X axis, not required, parameters and return values are consistent with \`createPointFigures\`</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">createXAxisFigures</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Create graphics on the Y axis, not required, parameters and return values are consistent with \`createPointFigures\`</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">createYAxisFigures</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Handle the movement operation during the drawing process, which can be defaulted and triggered during the movement drawing process</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">performEventMoveForDrawing</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// current step</span></span>
<span class="line"><span style="color:#F07178;">    currentStep</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// model</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">mode</span><span style="color:#F07178;">: </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">normal</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">weak_magnet</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">strong_magnet</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// point information</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">points</span><span style="color:#F07178;">: </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// timestamp</span></span>
<span class="line"><span style="color:#F07178;">      timestamp</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// data index</span></span>
<span class="line"><span style="color:#F07178;">      dataIndex</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// corresponding to the value of the y-axis</span></span>
<span class="line"><span style="color:#F07178;">      value</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}&gt;,</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// index of the event point</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">performPointIndex</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// Information about the point where the event is located</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">performPoint</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">) </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">void,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Handle the press and move operation, which can be defaulted, and is triggered during the movement of a certain operation point</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// The callback parameters are consistent with \`performEventMoveForDrawing\`</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">performEventPressedMove</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayPerformEventParams</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">void</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// draw start callback event, can be default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDrawStart</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// callback event during drawing, can be defaulted</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDrawing</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Draw end callback event, can be default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDrawEnd</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// click callback event, default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onClick</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// double click callback event, default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDoubleClick</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// The right-click callback event, which can be defaulted, needs to return a value of type boolean. If it returns true, the built-in right-click delete will be invalid</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onRightClick</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Hold down and drag to start the callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onPressedMoveStart</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Press and hold the drag callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onPressedMoving</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Hold down and drag to end the callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">onPressedMoveEnd</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Mouse move event, can be default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onMouseEnter</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Mouse out event, default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onMouseLeave</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// delete callback event, default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onRemoved</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Select the callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onSelected</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// cancel callback event, default</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDeselected</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Name, a required field, used as the unique identifier for overlay creation</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">name</span><span style="color:#24292E;">: string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// How many steps are needed in total to complete the drawing, not necessary</span></span>
<span class="line"><span style="color:#24292E;">  totalStep</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Whether to lock, do not trigger events, not necessary</span></span>
<span class="line"><span style="color:#24292E;">  lock</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Do you need visible</span></span>
<span class="line"><span style="color:#24292E;">  visible</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Draw level</span></span>
<span class="line"><span style="color:#24292E;">  zLevel</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Do you need the graphics corresponding to the default points, not necessary</span></span>
<span class="line"><span style="color:#24292E;">  needDefaultPointFigure</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Do you need the graphics on the default X-axis, not necessary</span></span>
<span class="line"><span style="color:#24292E;">  needDefaultXAxisFigure</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Do you need the graphics on the default Y axis, not necessary</span></span>
<span class="line"><span style="color:#24292E;">  needDefaultYAxisFigure</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// mode, options are \`normal\`, \`weak_magnet\`, \`strong_magnet\`, not required</span></span>
<span class="line"><span style="color:#24292E;">  mode</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;normal&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;weak_magnet&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;strong_magnet&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// mode sensitivity, only valid when mode is weak_magnet</span></span>
<span class="line"><span style="color:#24292E;">  modeSensitivity</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// point information, not required</span></span>
<span class="line"><span style="color:#24292E;">  points</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// timestamp</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">timestamp</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// data index</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">dataIndex</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// corresponding to the value of the y-axis</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">value</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">  }&gt;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Extended data, not required</span></span>
<span class="line"><span style="color:#24292E;">  extendData</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> any</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// style, not required, the type participates in the overlay in [style]</span></span>
<span class="line"><span style="color:#24292E;">  styles</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> OverlayStyle</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Create graphics corresponding to points, not required</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">createPointFigures</span><span style="color:#24292E;">: ({</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// overlay instance</span></span>
<span class="line"><span style="color:#24292E;">    overlay: Overlay</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// coordinate information corresponding to points</span></span>
<span class="line"><span style="color:#24292E;">    coordinates: </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">x</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">y</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    }&gt;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// window size information</span></span>
<span class="line"><span style="color:#24292E;">    bounding: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// width</span></span>
<span class="line"><span style="color:#24292E;">      width: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// high</span></span>
<span class="line"><span style="color:#24292E;">      height: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// distance to the left</span></span>
<span class="line"><span style="color:#24292E;">      left: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// distance to the right</span></span>
<span class="line"><span style="color:#24292E;">      right: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// distance from top</span></span>
<span class="line"><span style="color:#24292E;">      top: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// distance from bottom</span></span>
<span class="line"><span style="color:#24292E;">      bottom: number</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// information about the size of the candlestick</span></span>
<span class="line"><span style="color:#24292E;">    barSpace: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// candlestick size</span></span>
<span class="line"><span style="color:#24292E;">      bar: number</span></span>
<span class="line"><span style="color:#24292E;">      halfBar: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// candlesticks do not include dimensions of gaps between candlesticks</span></span>
<span class="line"><span style="color:#24292E;">      gapBar: number</span></span>
<span class="line"><span style="color:#24292E;">      halfGapBar: number</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// precision</span></span>
<span class="line"><span style="color:#24292E;">    precision: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// price precision</span></span>
<span class="line"><span style="color:#24292E;">      price: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// Quantity precision</span></span>
<span class="line"><span style="color:#24292E;">      volume: number</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// thousands separator</span></span>
<span class="line"><span style="color:#24292E;">    thousandsSeparator: string,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Constructor for objects that format date and time, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat for details</span></span>
<span class="line"><span style="color:#24292E;">    dateTimeFormat: Intl. DateTimeFormat</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The default style, that is, the overlay in the global style configuration, the type participates in the overlay in [style]</span></span>
<span class="line"><span style="color:#24292E;">    defaultStyles: OverlayStyle</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// x-axis component, some built-in conversion methods</span></span>
<span class="line"><span style="color:#24292E;">    xAxis: XAxis,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// y-axis component, with some built-in conversion methods</span></span>
<span class="line"><span style="color:#24292E;">    yAxis: YAxis</span></span>
<span class="line"><span style="color:#24292E;">  }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> ({</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// No special meaning, can be used for extension fields</span></span>
<span class="line"><span style="color:#24292E;">    key?: string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Graphic type, one of the return values of klinecharts.getSupportFigures</span></span>
<span class="line"><span style="color:#24292E;">    type: string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The properties of the graphic corresponding to the type</span></span>
<span class="line"><span style="color:#24292E;">    attrs: any </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> any[]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The style of the graphic corresponding to type</span></span>
<span class="line"><span style="color:#24292E;">    styles</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> any</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Whether to ignore the event</span></span>
<span class="line"><span style="color:#24292E;">    ignoreEvent</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> OverlayFigureIgnoreEventType[]</span></span>
<span class="line"><span style="color:#24292E;">  }) </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">key</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">attrs</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">styles</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">ignoreEvent</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayFigureIgnoreEventType</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">  }&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Create graphics on the X axis, not required, parameters and return values are consistent with \`createPointFigures\`</span></span>
<span class="line"><span style="color:#24292E;">  createXAxisFigures</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Create graphics on the Y axis, not required, parameters and return values are consistent with \`createPointFigures\`</span></span>
<span class="line"><span style="color:#24292E;">  createYAxisFigures</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Handle the movement operation during the drawing process, which can be defaulted and triggered during the movement drawing process</span></span>
<span class="line"><span style="color:#24292E;">  performEventMoveForDrawing</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> ({</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// current step</span></span>
<span class="line"><span style="color:#24292E;">    currentStep: number</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// model</span></span>
<span class="line"><span style="color:#24292E;">    mode: </span><span style="color:#032F62;">&#39;normal&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;weak_magnet&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;strong_magnet&#39;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// point information</span></span>
<span class="line"><span style="color:#24292E;">    points: </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// timestamp</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">timestamp</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// data index</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">dataIndex</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// corresponding to the value of the y-axis</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">value</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    }&gt;,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// index of the event point</span></span>
<span class="line"><span style="color:#24292E;">    performPointIndex</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Information about the point where the event is located</span></span>
<span class="line"><span style="color:#24292E;">    performPoint</span></span>
<span class="line"><span style="color:#24292E;">  }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Handle the press and move operation, which can be defaulted, and is triggered during the movement of a certain operation point</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// The callback parameters are consistent with \`performEventMoveForDrawing\`</span></span>
<span class="line"><span style="color:#24292E;">  performEventPressedMove</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">params</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayPerformEventParams</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// draw start callback event, can be default</span></span>
<span class="line"><span style="color:#24292E;">  onDrawStart</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// callback event during drawing, can be defaulted</span></span>
<span class="line"><span style="color:#24292E;">  onDrawing</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Draw end callback event, can be default</span></span>
<span class="line"><span style="color:#24292E;">  onDrawEnd</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// click callback event, default</span></span>
<span class="line"><span style="color:#24292E;">  onClick</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// double click callback event, default</span></span>
<span class="line"><span style="color:#24292E;">  onDoubleClick</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// The right-click callback event, which can be defaulted, needs to return a value of type boolean. If it returns true, the built-in right-click delete will be invalid</span></span>
<span class="line"><span style="color:#24292E;">  onRightClick</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Hold down and drag to start the callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#24292E;">  onPressedMoveStart</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Press and hold the drag callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#24292E;">  onPressedMoving</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Hold down and drag to end the callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">onPressedMoveEnd</span><span style="color:#24292E;">: (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Mouse move event, can be default</span></span>
<span class="line"><span style="color:#24292E;">  onMouseEnter</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Mouse out event, default</span></span>
<span class="line"><span style="color:#24292E;">  onMouseLeave</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// delete callback event, default</span></span>
<span class="line"><span style="color:#24292E;">  onRemoved</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Select the callback event, which can be defaulted</span></span>
<span class="line"><span style="color:#24292E;">  onSelected</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// cancel callback event, default</span></span>
<span class="line"><span style="color:#24292E;">  onDeselected</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h3><p>A filled, bordered circle is used to illustrate how to configure.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight vp-code-dark"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">   </span><span style="color:#676E95;font-style:italic;">// name</span></span>
<span class="line"><span style="color:#F07178;">   </span><span style="color:#FFCB6B;">name</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sampleCircle</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">   </span><span style="color:#676E95;font-style:italic;">// Three steps are required to complete the drawing of a circle</span></span>
<span class="line"><span style="color:#F07178;">   </span><span style="color:#FFCB6B;">totalStep</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">   </span><span style="color:#676E95;font-style:italic;">// Create the graphic information corresponding to the point</span></span>
<span class="line"><span style="color:#F07178;">   </span><span style="color:#FFCB6B;">createPointFigures</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">({</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;font-style:italic;">scoordinates</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">})</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">     </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">length</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">xDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Math</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">abs</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">yDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Math</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">abs</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">       </span><span style="color:#676E95;font-style:italic;">// Determine the coordinates of the circle generated by the corresponding point</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">radius</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Math</span><span style="color:#89DDFF;">.</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">sqrt</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">xDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">xDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">yDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">yDis</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">       </span><span style="color:#676E95;font-style:italic;">// The chart has built-in basic graphics &#39;circle&#39;, which can be used directly</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">         key</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sampleCircle</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">         type</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">circle</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">         attrs</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">           </span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">           r</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">radius</span></span>
<span class="line"><span style="color:#F07178;">         </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">         styles</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">           </span><span style="color:#676E95;font-style:italic;">// Select the border and fill it, other selections use the default style</span></span>
<span class="line"><span style="color:#F07178;">           style</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">stroke_fill</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">         </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">       </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">     </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">     </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> []</span></span>
<span class="line"><span style="color:#F07178;">   </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;">// name</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6F42C1;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;sampleCircle&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;">// Three steps are required to complete the drawing of a circle</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6F42C1;">totalStep</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;">// Create the graphic information corresponding to the point</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6F42C1;">createPointFigures</span><span style="color:#24292E;">: ({ </span><span style="color:#E36209;">scoordinates</span><span style="color:#24292E;"> }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (coordinates. </span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">xDis</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math.</span><span style="color:#6F42C1;">abs</span><span style="color:#24292E;">(coordinates[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">].x </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> coordinates[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">].x)</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">yDis</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math.</span><span style="color:#6F42C1;">abs</span><span style="color:#24292E;">(coordinates[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">].y </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> coordinates[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">].y)</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#6A737D;">// Determine the coordinates of the circle generated by the corresponding point</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">radius</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math. </span><span style="color:#6F42C1;">sqrt</span><span style="color:#24292E;">(xDis </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> xDis </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> yDis </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> yDis)</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#6A737D;">// The chart has built-in basic graphics &#39;circle&#39;, which can be used directly</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">         key: </span><span style="color:#032F62;">&#39;sampleCircle&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">         type: </span><span style="color:#032F62;">&#39;circle&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">         attrs: {</span></span>
<span class="line"><span style="color:#24292E;">           </span><span style="color:#D73A49;">...</span><span style="color:#24292E;">coordinates[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">           r: radius</span></span>
<span class="line"><span style="color:#24292E;">         },</span></span>
<span class="line"><span style="color:#24292E;">         styles: {</span></span>
<span class="line"><span style="color:#24292E;">           </span><span style="color:#6A737D;">// Select the border and fill it, other selections use the default style</span></span>
<span class="line"><span style="color:#24292E;">           style: </span><span style="color:#032F62;">&#39;stroke_fill&#39;</span></span>
<span class="line"><span style="color:#24292E;">         }</span></span>
<span class="line"><span style="color:#24292E;">       }</span></span>
<span class="line"><span style="color:#24292E;">     }</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> []</span></span>
<span class="line"><span style="color:#24292E;">   }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>So a custom overlay is complete.</p>`,12),e=[o];function t(c,r,y,i,F,D){return n(),a("div",null,e)}const C=s(p,[["render",t]]);export{A as __pageData,C as default};
