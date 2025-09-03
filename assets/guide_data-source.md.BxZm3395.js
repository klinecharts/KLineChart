import{_ as a,c as i,o as n,ad as e}from"./chunks/framework.C2hRbcpH.js";const o=JSON.parse('{"title":"📚 数据","description":"","frontmatter":{},"headers":[],"relativePath":"guide/data-source.md","filePath":"guide/data-source.md","lastUpdated":1749668900000}'),t={name:"guide/data-source.md"};function l(p,s,h,k,r,d){return n(),i("div",null,s[0]||(s[0]=[e(`<h1 id="📚-数据" tabindex="-1">📚 数据 <a class="header-anchor" href="#📚-数据" aria-label="Permalink to “📚 数据”">​</a></h1><p>图表所需要的数据必须是固定格式。通过图表实例 API <a href="/api/instance/setDataLoader">setDataLoader(loader)</a> 来和图表进行数据交互。</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 时间戳，毫秒级别，必要字段</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  timestamp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: number</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 开盘价，必要字段</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  open</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: number</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 收盘价，必要字段</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  close</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: number</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 最高价，必要字段</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  high</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: number</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 最低价，必要字段</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  low</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: number</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 成交量，非必须字段</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  volume</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: number</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 成交额，非必须字段，如果需要展示技术指标&#39;EMV&#39;和&#39;AVP&#39;，则需要为该字段填充数据。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  turnover</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: number</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div>`,3)]))}const E=a(t,[["render",l]]);export{o as __pageData,E as default};
