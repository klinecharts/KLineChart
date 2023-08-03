import{_ as s,v as n,b as a,R as l}from"./chunks/framework.3ac7bdc3.js";const E=JSON.parse('{"title":"覆盖物","description":"","frontmatter":{},"headers":[],"relativePath":"guide/overlay.md","filePath":"guide/overlay.md","lastUpdated":1691074246000}'),p={name:"guide/overlay.md"},o=l(`<h1 id="覆盖物" tabindex="-1">覆盖物 <a class="header-anchor" href="#覆盖物" aria-label="Permalink to &quot;覆盖物&quot;">​</a></h1><p>本文档介绍了图表内置的覆盖物和如何自定义一个覆盖物。</p><h2 id="内置覆盖物类型" tabindex="-1">内置覆盖物类型 <a class="header-anchor" href="#内置覆盖物类型" aria-label="Permalink to &quot;内置覆盖物类型&quot;">​</a></h2><p><code>horizontalRayLine</code>, <code>horizontalSegment</code>, <code>horizontalStraightLine</code>, <code>verticalRayLine</code>, <code>verticalSegment</code>, <code>verticalStraightLine</code>, <code>rayLine</code>, <code>segment</code>, <code>straightLine</code>, <code>priceLine</code>, <code>priceChannelLine</code>, <code>parallelStraightLine</code>, <code>fibonacciLine</code>, <code>simpleAnnotation</code>, <code>simpleTag</code></p><h2 id="自定义覆盖物" tabindex="-1">自定义覆盖物 <a class="header-anchor" href="#自定义覆盖物" aria-label="Permalink to &quot;自定义覆盖物&quot;">​</a></h2><p>自定义一个覆盖物，然后通过<code>klinecharts.registerOverlay</code> 全局添加，添加到图表即可和内置覆盖物一样去使用。</p><h3 id="属性说明" tabindex="-1">属性说明 <a class="header-anchor" href="#属性说明" aria-label="Permalink to &quot;属性说明&quot;">​</a></h3><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-theme-palenight vp-code-dark"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 名称，必须字段，作为覆盖物创建的唯一标识</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">name</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 总共需要多少步操作才行绘制完成，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">totalStep</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 是否锁定，不触发事件，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">lock</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 是否可见</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">visible</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 绘制层级，值越大越靠前显示</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">zLevel</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 是否需要默认的点对应的图形，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">needDefaultPointFigure</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 是否需要默认的X轴上的图形，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">needDefaultXAxisFigure</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 是否需要默认的Y轴上的图形，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">needDefaultYAxisFigure</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 模式，可选项为\`normal\`，\`weak_magnet\`，\`strong_magnet\`，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">mode</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">normal</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">weak_magnet</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">strong_magnet</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 模式灵敏度，仅 mode 是 weak_magnet 时有效</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">modeSensitivity</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 点信息，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">points</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 时间戳</span></span>
<span class="line"><span style="color:#F07178;">    timestamp</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 数据索引</span></span>
<span class="line"><span style="color:#F07178;">    dataIndex</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 对应y轴的值</span></span>
<span class="line"><span style="color:#F07178;">    value</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}&gt;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 扩展数据，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">extendData</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">any</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 样式，非必须，类型参与[样式]中的overlay</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">styles</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayStyle</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 创建点对应的图形，非必须</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">createPointFigures</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 覆盖物实例</span></span>
<span class="line"><span style="color:#F07178;">    overlay</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Overlay</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// points对应的坐标信息</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">: </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#F07178;">      x</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">      y</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 窗口尺寸信息</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">bounding</span><span style="color:#F07178;">: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 宽</span></span>
<span class="line"><span style="color:#F07178;">      width</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 高</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">height</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 距离左边距离</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">left</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 距离右边距离</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">right</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 距离顶部距离</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">top</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 距离底部距离</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">bottom</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 蜡烛柱的尺寸信息</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">barSpace</span><span style="color:#F07178;">: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 蜡烛柱尺寸</span></span>
<span class="line"><span style="color:#F07178;">      bar</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">halfBar</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 蜡烛柱不包含蜡烛柱之间间隙的尺寸</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">gapBar</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">halfGapBar</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 精度</span></span>
<span class="line"><span style="color:#F07178;">    precision</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 价格精度</span></span>
<span class="line"><span style="color:#F07178;">      price</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 数量精度</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">volume</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 千分符</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">thousandsSeparator</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">string</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 格式化日期和时间的对象的构造器，详情参阅 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">dateTimeFormat</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">Intl</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">DateTimeFormat</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 默认样式，即全局样式配置中的overlay，类型参与[样式]中的overlay</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">defaultStyles</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">OverlayStyle</span></span>
<span class="line"><span style="color:#89DDFF;">     </span><span style="color:#676E95;font-style:italic;">// x轴组件，内置一些转换方法</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">xAxis</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">XAxis</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// y轴组件，内置一些转换方法</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">yAxis</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">YAxis</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">) </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 无特殊含义，可用于扩展字段</span></span>
<span class="line"><span style="color:#F07178;">    key?</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">string</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 图形类型，类型为klinecharts.getSupportFigures返回值中的一种</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">type</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">string</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// type对应的图形的属性</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">attrs</span><span style="color:#F07178;">: </span><span style="color:#A6ACCD;">any</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">any</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// type对应的图形的样式</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">styles</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">any</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 是否忽略事件</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ignoreEvent</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayFigureIgnoreEventType</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#F07178;">    key</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#F07178;">    type</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">string</span></span>
<span class="line"><span style="color:#F07178;">    attrs</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">any</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#F07178;">    styles</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">any</span></span>
<span class="line"><span style="color:#F07178;">    ignoreEvent</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">boolean</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayFigureIgnoreEventType</span><span style="color:#F07178;">[]</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 创建X轴上的图形，非必须，参数和返回值和\`createPointFigures\`一致</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">createXAxisFigures</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 创建Y轴上的图形，非必须，参数和返回值和\`createPointFigures\`一致</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">createYAxisFigures</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 处理在绘制过程中移动操作，可缺省，移动绘制过程中触发</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">performEventMoveForDrawing</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 当前步骤</span></span>
<span class="line"><span style="color:#F07178;">    currentStep</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">number</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 模式</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">mode</span><span style="color:#F07178;">: </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">normal</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">weak_magnet</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">|</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">strong_magnet</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 点信息</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">points</span><span style="color:#F07178;">: </span><span style="color:#82AAFF;">Array</span><span style="color:#89DDFF;">&lt;{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 时间戳</span></span>
<span class="line"><span style="color:#F07178;">      timestamp</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 数据索引</span></span>
<span class="line"><span style="color:#F07178;">      dataIndex</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 对应y轴的值</span></span>
<span class="line"><span style="color:#F07178;">      value</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 事件所在点的索引</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">performPointIndex</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// 事件所在点的信息</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">performPoint</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">) </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">void</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 处理按住移动操作，可缺省，按住某个操作点移动过程中触发</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 回调参数和\`performEventMoveForDrawing\`一致</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">performEventPressedMove</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayPerformEventParams</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">void</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 绘制开始回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDrawStart</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 绘制过程中回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDrawing</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 绘制结束回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDrawEnd</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 点击回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onClick</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 双击回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDoubleClick</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 右击回调事件，可缺省，需要返回一个boolean类型的值，如果返回true，内置的右击删除将无效</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onRightClick</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 按住拖动开始回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onPressedMoveStart</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 按住拖动回调事件，可缺省  </span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onPressedMoving</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 按住拖动结束回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">onPressedMoveEnd</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 鼠标移入事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onMouseEnter</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 鼠标移出事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onMouseLeave</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 删除回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onRemoved</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 选中回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onSelected</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 取消回调事件，可缺省</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">onDeselected</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">event</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">OverlayEvent</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">boolean</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 名称，必须字段，作为覆盖物创建的唯一标识</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">name</span><span style="color:#24292E;">: string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 总共需要多少步操作才行绘制完成，非必须</span></span>
<span class="line"><span style="color:#24292E;">  totalStep</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否锁定，不触发事件，非必须</span></span>
<span class="line"><span style="color:#24292E;">  lock</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否可见</span></span>
<span class="line"><span style="color:#24292E;">  visible</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 绘制层级，值越大越靠前显示</span></span>
<span class="line"><span style="color:#24292E;">  zLevel</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否需要默认的点对应的图形，非必须</span></span>
<span class="line"><span style="color:#24292E;">  needDefaultPointFigure</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否需要默认的X轴上的图形，非必须</span></span>
<span class="line"><span style="color:#24292E;">  needDefaultXAxisFigure</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否需要默认的Y轴上的图形，非必须</span></span>
<span class="line"><span style="color:#24292E;">  needDefaultYAxisFigure</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 模式，可选项为\`normal\`，\`weak_magnet\`，\`strong_magnet\`，非必须</span></span>
<span class="line"><span style="color:#24292E;">  mode</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;normal&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;weak_magnet&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;strong_magnet&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 模式灵敏度，仅 mode 是 weak_magnet 时有效</span></span>
<span class="line"><span style="color:#24292E;">  modeSensitivity</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 点信息，非必须</span></span>
<span class="line"><span style="color:#24292E;">  points</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 时间戳</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">timestamp</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 数据索引</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">dataIndex</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 对应y轴的值</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">value</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">  }&gt;,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 扩展数据，非必须</span></span>
<span class="line"><span style="color:#24292E;">  extendData</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> any</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 样式，非必须，类型参与[样式]中的overlay</span></span>
<span class="line"><span style="color:#24292E;">  styles</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> OverlayStyle</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 创建点对应的图形，非必须</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">createPointFigures</span><span style="color:#24292E;">: ({</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 覆盖物实例</span></span>
<span class="line"><span style="color:#24292E;">    overlay: Overlay</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// points对应的坐标信息</span></span>
<span class="line"><span style="color:#24292E;">    coordinates: </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">x</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">y</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    }&gt;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 窗口尺寸信息</span></span>
<span class="line"><span style="color:#24292E;">    bounding: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 宽</span></span>
<span class="line"><span style="color:#24292E;">      width: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 高</span></span>
<span class="line"><span style="color:#24292E;">      height: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 距离左边距离</span></span>
<span class="line"><span style="color:#24292E;">      left: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 距离右边距离</span></span>
<span class="line"><span style="color:#24292E;">      right: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 距离顶部距离</span></span>
<span class="line"><span style="color:#24292E;">      top: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 距离底部距离</span></span>
<span class="line"><span style="color:#24292E;">      bottom: number</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 蜡烛柱的尺寸信息</span></span>
<span class="line"><span style="color:#24292E;">    barSpace: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 蜡烛柱尺寸</span></span>
<span class="line"><span style="color:#24292E;">      bar: number</span></span>
<span class="line"><span style="color:#24292E;">      halfBar: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 蜡烛柱不包含蜡烛柱之间间隙的尺寸</span></span>
<span class="line"><span style="color:#24292E;">      gapBar: number</span></span>
<span class="line"><span style="color:#24292E;">      halfGapBar: number</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 精度</span></span>
<span class="line"><span style="color:#24292E;">    precision: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 价格精度</span></span>
<span class="line"><span style="color:#24292E;">      price: number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 数量精度</span></span>
<span class="line"><span style="color:#24292E;">      volume: number</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 千分符</span></span>
<span class="line"><span style="color:#24292E;">    thousandsSeparator: string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 格式化日期和时间的对象的构造器，详情参阅 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat</span></span>
<span class="line"><span style="color:#24292E;">    dateTimeFormat: Intl.DateTimeFormat</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 默认样式，即全局样式配置中的overlay，类型参与[样式]中的overlay</span></span>
<span class="line"><span style="color:#24292E;">    defaultStyles: OverlayStyle</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#6A737D;">// x轴组件，内置一些转换方法</span></span>
<span class="line"><span style="color:#24292E;">    xAxis: XAxis</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// y轴组件，内置一些转换方法</span></span>
<span class="line"><span style="color:#24292E;">    yAxis: YAxis</span></span>
<span class="line"><span style="color:#24292E;">  }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> ({</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 无特殊含义，可用于扩展字段</span></span>
<span class="line"><span style="color:#24292E;">    key?: string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 图形类型，类型为klinecharts.getSupportFigures返回值中的一种</span></span>
<span class="line"><span style="color:#24292E;">    type: string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// type对应的图形的属性</span></span>
<span class="line"><span style="color:#24292E;">    attrs: any </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> any[]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// type对应的图形的样式</span></span>
<span class="line"><span style="color:#24292E;">    styles</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> any</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 是否忽略事件</span></span>
<span class="line"><span style="color:#24292E;">    ignoreEvent</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> OverlayFigureIgnoreEventType[]</span></span>
<span class="line"><span style="color:#24292E;">  }) </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">key</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">type</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">attrs</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">styles</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">ignoreEvent</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayFigureIgnoreEventType</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">  }&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 创建X轴上的图形，非必须，参数和返回值和\`createPointFigures\`一致</span></span>
<span class="line"><span style="color:#24292E;">  createXAxisFigures</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 创建Y轴上的图形，非必须，参数和返回值和\`createPointFigures\`一致</span></span>
<span class="line"><span style="color:#24292E;">  createYAxisFigures</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> OverlayCreateFiguresCallback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 处理在绘制过程中移动操作，可缺省，移动绘制过程中触发</span></span>
<span class="line"><span style="color:#24292E;">  performEventMoveForDrawing</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> ({</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 当前步骤</span></span>
<span class="line"><span style="color:#24292E;">    currentStep: number</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 模式</span></span>
<span class="line"><span style="color:#24292E;">    mode: </span><span style="color:#032F62;">&#39;normal&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;weak_magnet&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;strong_magnet&#39;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 点信息</span></span>
<span class="line"><span style="color:#24292E;">    points: </span><span style="color:#6F42C1;">Array</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 时间戳</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">timestamp</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 数据索引</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">dataIndex</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 对应y轴的值</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#E36209;">value</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">    }&gt;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 事件所在点的索引</span></span>
<span class="line"><span style="color:#24292E;">    performPointIndex</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 事件所在点的信息</span></span>
<span class="line"><span style="color:#24292E;">    performPoint</span></span>
<span class="line"><span style="color:#24292E;">  }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 处理按住移动操作，可缺省，按住某个操作点移动过程中触发</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 回调参数和\`performEventMoveForDrawing\`一致</span></span>
<span class="line"><span style="color:#24292E;">  performEventPressedMove</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">params</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayPerformEventParams</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">void</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 绘制开始回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onDrawStart</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 绘制过程中回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onDrawing</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 绘制结束回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onDrawEnd</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 点击回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onClick</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 双击回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onDoubleClick</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 右击回调事件，可缺省，需要返回一个boolean类型的值，如果返回true，内置的右击删除将无效</span></span>
<span class="line"><span style="color:#24292E;">  onRightClick</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 按住拖动开始回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onPressedMoveStart</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 按住拖动回调事件，可缺省  </span></span>
<span class="line"><span style="color:#24292E;">  onPressedMoving</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 按住拖动结束回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">onPressedMoveEnd</span><span style="color:#24292E;">: (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 鼠标移入事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onMouseEnter</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 鼠标移出事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onMouseLeave</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 删除回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onRemoved</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 选中回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onSelected</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 取消回调事件，可缺省</span></span>
<span class="line"><span style="color:#24292E;">  onDeselected</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">event</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">OverlayEvent</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h3><p>以一个填充带边框的圆来具体说明如何配置。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight vp-code-dark"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 名称</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">name</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sampleCircle</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 完成一个圆的绘制需要三个步骤</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">totalStep</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// 创建点对应的图形信息</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#FFCB6B;">createPointFigures</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">({</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;font-style:italic;">coordinates</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">})</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">length</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">xDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Math</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">abs</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">x</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">yDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Math</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">abs</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">y</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 确定对应点生成的圆的坐标</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">radius</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Math</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">sqrt</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">xDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">xDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">yDis</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">yDis</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;font-style:italic;">// 图表内置了基础图形&#39;circle&#39;，可以直接使用</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        key</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sampleCircle</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        type</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">circle</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        attrs</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">coordinates</span><span style="color:#F07178;">[</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">          r</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">radius</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">        styles</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;font-style:italic;">// 选择边框且填充，其它选择使用默认样式</span></span>
<span class="line"><span style="color:#F07178;">          style</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">stroke_fill</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> []</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 名称</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;sampleCircle&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 完成一个圆的绘制需要三个步骤</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">totalStep</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">3</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 创建点对应的图形信息</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">createPointFigures</span><span style="color:#24292E;">: ({ </span><span style="color:#E36209;">coordinates</span><span style="color:#24292E;"> }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (coordinates.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">xDis</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math.</span><span style="color:#6F42C1;">abs</span><span style="color:#24292E;">(coordinates[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">].x </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> coordinates[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">].x)</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">yDis</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math.</span><span style="color:#6F42C1;">abs</span><span style="color:#24292E;">(coordinates[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">].y </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> coordinates[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">].y)</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 确定对应点生成的圆的坐标</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">radius</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Math.</span><span style="color:#6F42C1;">sqrt</span><span style="color:#24292E;">(xDis </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> xDis </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> yDis </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> yDis)</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 图表内置了基础图形&#39;circle&#39;，可以直接使用</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        key: </span><span style="color:#032F62;">&#39;sampleCircle&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        type: </span><span style="color:#032F62;">&#39;circle&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        attrs: {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">...</span><span style="color:#24292E;">coordinates[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">          r: radius</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">        styles: {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// 选择边框且填充，其它选择使用默认样式</span></span>
<span class="line"><span style="color:#24292E;">          style: </span><span style="color:#032F62;">&#39;stroke_fill&#39;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> []</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>这样一个自定义覆盖物就完成了。</p>`,12),e=[o];function t(c,r,y,F,D,i){return n(),a("div",null,e)}const C=s(p,[["render",t]]);export{E as __pageData,C as default};
