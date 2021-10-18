import{_ as n,c as s,o as a,a as t}from"./app.d48831e1.js";const h='{"title":"Instalation","description":"","frontmatter":{},"headers":[{"level":2,"title":"Instalation","slug":"instalation"},{"level":2,"title":"Constructor properties (ActMasterOptions)","slug":"constructor-properties-actmasteroptions"},{"level":2,"title":"Nuxt.JS","slug":"nuxt-js"}],"relativePath":"action/01-installation.md","lastUpdated":1634596839877}',o={},e=t(`<h2 id="instalation" tabindex="-1">Instalation <a class="header-anchor" href="#instalation" aria-hidden="true">#</a></h2><p><div class="table-of-contents"><ul><li><a href="#instalation">Instalation</a></li><li><a href="#constructor-properties-actmasteroptions">Constructor properties (ActMasterOptions)</a></li><li><a href="#nuxt-js">Nuxt.JS</a></li></ul></div></p><p>Start by creating a project.</p><p>Then add a vue-act-master.</p><div class="language-bash"><pre><code><span class="token function">yarn</span> <span class="token function">add</span> vue-act-master
</code></pre></div><div class="language-ts"><pre><code><span class="token comment">// main.ts</span>

<span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> App <span class="token keyword">from</span> <span class="token string">&#39;./App.vue&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> VueActMaster <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token comment">// Actions</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>

Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VueActMaster<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  actions<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  el<span class="token operator">:</span> <span class="token string">&#39;#app&#39;</span><span class="token punctuation">,</span>
  <span class="token function-variable function">render</span><span class="token operator">:</span> <span class="token punctuation">(</span>h<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">h</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><div class="language-json"><pre><code><span class="token comment">// tsconfig.json</span>
<span class="token punctuation">{</span>
  <span class="token property">&quot;compilerOptions&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    ...
    <span class="token property">&quot;types&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token comment">// Add the types in typescript</span>
      <span class="token string">&quot;vue-act-master&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>It is also possible to transfer other options. You can use the <code>ActMasterOptions</code> type.</p><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> VueActMaster<span class="token punctuation">,</span> ActMasterOptions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>
<span class="token comment">//...</span>
</code></pre></div><h2 id="constructor-properties-actmasteroptions" tabindex="-1">Constructor properties (ActMasterOptions) <a class="header-anchor" href="#constructor-properties-actmasteroptions" aria-hidden="true">#</a></h2><table><thead><tr><th>Property</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td>actions?: ActMasterAction[];</td><td>[]</td><td>An array of action items</td></tr><tr><td>di?: DIMap;</td><td>{}</td><td>DI entities</td></tr><tr><td>errorOnReplaceAction?: boolean;</td><td>true</td><td>Error on action change</td></tr><tr><td>errorOnReplaceDI?: boolean;</td><td>false</td><td>Error on entity DI replacement</td></tr><tr><td>errorOnEmptyAction?: boolean;</td><td>true</td><td>Error on empty action.</td></tr><tr><td>errorHandlerEventName?: ActEventName;</td><td>undefined</td><td>Action call on error (can be used in actions too)</td></tr></tbody></table><h2 id="nuxt-js" tabindex="-1">Nuxt.JS <a class="header-anchor" href="#nuxt-js" aria-hidden="true">#</a></h2><p>Install dependencies:</p><div class="language-bash"><pre><code><span class="token function">yarn</span> <span class="token function">add</span> vue-act-master
</code></pre></div><p>Add <code>vue-act-master/nuxt</code> to modules section of <code>nuxt.config.js</code></p><div class="language-js"><pre><code><span class="token comment">// nuxt.config.js</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  modules<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;vue-act-master/nuxt&#39;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>Parameters can be passed to the &quot;actMaster&quot; property.</p><div class="language-js"><pre><code><span class="token comment">// nuxt.config.js</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
  modules<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;vue-act-master/nuxt&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  actMaster<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">// config for Vue-Act-Master</span>
    actions<span class="token operator">:</span> require<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;./act/index.ts&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">//    resolve path to the actions file</span>
    di<span class="token operator">:</span> require<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;./act/di.ts&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// [optional] resolve path to the DI file</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre></div><p>You can use the file with the default export of the array of actions. Or with exporting the <code>actions</code> variable</p><p>Same with file &quot;di&quot;, you can export the default variable with the object, or the variable <code>di</code></p>`,20),p=[e];function c(r,i,l,u,d,k){return a(),s("div",null,p)}var f=n(o,[["render",c]]);export{h as __pageData,f as default};
