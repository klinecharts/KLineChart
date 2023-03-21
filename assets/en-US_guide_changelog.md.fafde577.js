import{_ as e,c as o,o as c,Q as t}from"./chunks/framework.7935546f.js";const m=JSON.parse('{"title":"📠 Change Log","description":"","frontmatter":{},"headers":[],"relativePath":"en-US/guide/changelog.md"}'),d={name:"en-US/guide/changelog.md"},i=t('<h1 id="📠-change-log" tabindex="-1">📠 Change Log <a class="header-anchor" href="#📠-change-log" aria-label="Permalink to &quot;📠 Change Log&quot;">​</a></h1><h2 id="_9-1-1" tabindex="-1">9.1.1 <a class="header-anchor" href="#_9-1-1" aria-label="Permalink to &quot;9.1.1&quot;">​</a></h2><p><code>2023-03-14</code></p><ul><li>🐞 Fix the invalidity of the built-in figure <code>arc</code>.</li><li>💄 Optimize rendering updates.</li></ul><h2 id="_9-1-0" tabindex="-1">9.1.0 <a class="header-anchor" href="#_9-1-0" aria-label="Permalink to &quot;9.1.0&quot;">​</a></h2><p><code>2023-02-23</code></p><ul><li>🆕 The chart instance method <code>subscribeAction</code> and <code>unsubscribeAction</code> types add <code>onCandleBarClick</code>.</li><li>🆕 The overlay supports double-clicking to force the end of drawing.</li><li>💄 Optimize event handling.</li></ul><h2 id="_9-0-1" tabindex="-1">9.0.1 <a class="header-anchor" href="#_9-0-1" aria-label="Permalink to &quot;9.0.1&quot;">​</a></h2><p><code>2023-02-17</code> 🐞 Fix the introduction of typescript.</p><h2 id="_9-0-0" tabindex="-1">9.0.0 <a class="header-anchor" href="#_9-0-0" aria-label="Permalink to &quot;9.0.0&quot;">​</a></h2><p><code>2023-02-16</code></p><ul><li>🛠 Typescript refactoring.</li><li>🆕 New features <ul><li>Add Y axis direction zoom and scroll.</li><li>API <ul><li>New chart methods <code>registerFigure</code>, <code>getSupportFigures</code>, <code>getFigureClass</code>, <code>rigiderOverlay</code>, <code>getSupportOverlays</code>, <code>registerLocale</code>, <code>getSupportLocales</code>, <code>registerStyles</code> are added.</li><li>New instance methods, <code>getSize</code>, <code>setLocale</code>, <code>getLocal</code>, <code>setCustomApi</code>, <code>getVisibleRange</code>, <code>createOverlay</code>, <code>getOverlayById</code>, <code>overrideOverlay</code>, <code>removeOverlay</code>.</li></ul></li><li>Style Configuration <ul><li>Add <code>candle.priceMark.last.text.borderStyle</code>, <code>candle.tooltip.icons</code>, <code>indicator.lastValueMark.text.borderStyle</code>, <code>indicator.tooltip.icons</code>, <code>crosshair.horizontal. text.borderStyle</code>, <code>crosshair.vertical.text.borderStyle</code>.</li></ul></li></ul></li><li>👉 Change <ul><li>API <ul><li>Chart method <code>extension.addTechnicalIndicatorTemplate</code> is changed to <code>registerIndicator</code>.</li><li>Chart method <code>extension.addShapeTemplate</code> is changed to <code>registerOverlay</code>.</li><li>Instance method <code>setStyleOptions</code> is changed to <code>setStyles</code>.</li><li>Instance method <code>getStyleOptions</code> is changed to <code>getStyles</code>.</li><li>Instance method <code>setPaneOptions(options)</code>, <code>options</code> add new attribute <code>gap</code>.</li><li>Instance method <code>setOffsetRightSpace</code> is changed to <code>setOffsetRightDistance</code>.</li><li>Instance method <code>createTechnicalIndicator</code> is changed to <code>createIndicator</code></li><li>Instance method <code>overlayTechnicalIndicator</code> is changed to <code>overrideIndicator</code>.</li><li>Instance method <code>getTechnicalIndicatorByPaneId</code> is changed to <code>getIndicatorByPaneId</code>.</li><li>Instance method <code>removeTechnicalIndicator</code> is changed to <code>removeIndicator</code>.</li></ul></li><li>Style Configuration <ul><li>All <code>line.style</code> options are changed to <code>solid</code> and <code>dashed</code>.</li><li>All <code>dashValue</code> is changed to <code>dashedValue</code>.</li><li><code>xAxis.height</code> is changed to <code>xAxis.size</code>, <code>xAxis.tickeText.paddingTop</code> is changed to <code>xAxis.tickeText.marinStart</code>, and <code>xAxis.tickeText.paddingBottom</code> is changed to <code>xAxis.tickeText.marinEnd</code>.</li><li><code>yAxis.height</code> is changed to <code>yAxis.size</code>, <code>yAxis.tickeText.paddingTop</code> is changed to <code>yAxis.tickeText.marinStart</code>, and <code>yAxis.tickeText.paddingBottom</code> is changed to <code>yAxis.tickeText.marinEnd</code>.</li><li><code>technicalIndicator.bar</code> is changed to <code>indicator.bars</code>, <code>technicalIndicator.line</code> is changed to <code>indicator.lines</code>，<code>technicalIndicator.circle</code> is changed to <code>indicator.circles</code></li></ul></li><li>Custom Extension <ul><li>The technical indicator attribute <code>calcParams</code> has been changed to support any type.</li><li>The technical indicator attribute <code>plots</code> is changed to <code>figures</code>.</li><li>The technical indicator attribute <code>regeneratePlots</code> is changed to&#39; regeneratefigures&#39;.</li><li>The technical indicator attribute <code>calcTechnicalIndicator</code> is changed to <code>calc</code>.</li><li>The technical indicator attribute <code>render</code> is changed to &#39;draw&#39;.</li></ul></li></ul></li><li>🗑 Abandonment <ul><li>API <ul><li>Delete instance methods <code>getWidth</code>, <code>getHeight</code>, and use <code>getSize</code> instead.</li><li>Delete instance methods <code>createShape</code>, <code>createAnnotation</code>, <code>createTag</code>, and use <code>createOverlay</code> instead.</li><li>Delete instance methods <code>removeShape</code>, <code>removeAnnotation</code>, <code>removeTag</code>. Use <code>removeOverlay</code> instead.</li><li>Delete the instance method <code>setShapeOptions</code> and use <code>overrideOverlay</code> instead.</li><li>Delete instance methods <code>createHtml</code>, <code>removeHtml</code>, <code>addTechnicalIndicatorTemplate</code>, <code>getTechnicalIndicatorTemplate</code>, <code>addShapeTemplate</code>.</li></ul></li><li>Style Configuration <ul><li>Delete <code>shape</code>, <code>annotation</code>, <code>tag</code> and use <code>overlay</code> instead.</li><li>Delete <code>candle.margin</code>，<code>technicalIndicator.margin</code>。</li></ul></li><li>Custom Extension <ul><li>The related attributes are no longer saved in the technical indicator template.</li><li>Delete <code>Shape</code> and use <code>Overlay</code> instead.</li></ul></li></ul></li></ul><h2 id="_8-x" tabindex="-1">8.x <a class="header-anchor" href="#_8-x" aria-label="Permalink to &quot;8.x&quot;">​</a></h2><p>Go to <a href="https://github.com/liihuu/KLineChart/blob/v8.6.3/docs/en/changelog.md" target="_blank" rel="noreferrer">Github</a> to check the change log for 8.x.</p><h2 id="_7-x" tabindex="-1">7.x <a class="header-anchor" href="#_7-x" aria-label="Permalink to &quot;7.x&quot;">​</a></h2><p>Go to <a href="https://github.com/liihuu/KLineChart/blob/v7.5.0/docs/en/changelog.md" target="_blank" rel="noreferrer">Github</a> to check the change log for 7.x.</p><h2 id="_6-x" tabindex="-1">6.x <a class="header-anchor" href="#_6-x" aria-label="Permalink to &quot;6.x&quot;">​</a></h2><p>Go to <a href="https://github.com/liihuu/KLineChart/blob/v6.1.0/docs/en/CHANGELOG.md" target="_blank" rel="noreferrer">Github</a> to check the change log for 6.x.</p><h2 id="_5-x" tabindex="-1">5.x <a class="header-anchor" href="#_5-x" aria-label="Permalink to &quot;5.x&quot;">​</a></h2><p>Go to <a href="https://github.com/liihuu/KLineChart/releases/tag/v5.0.0" target="_blank" rel="noreferrer">Github</a> to view the 5.x release notes.</p><h2 id="_4-x" tabindex="-1">4.x <a class="header-anchor" href="#_4-x" aria-label="Permalink to &quot;4.x&quot;">​</a></h2><p>Go to <a href="https://github.com/liihuu/KLineChart/releases/tag/v4.0.0" target="_blank" rel="noreferrer">Github</a> to view the 4.x release notes.</p>',22),a=[i];function l(n,r,h,s,g,u){return c(),o("div",null,a)}const x=e(d,[["render",l]]);export{m as __pageData,x as default};