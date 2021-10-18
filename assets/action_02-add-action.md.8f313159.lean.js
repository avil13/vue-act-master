import{_ as n,c as a,o as s,a as t}from"./app.85518a07.js";const m='{"title":"Add Actions to Vue-act-master","description":"","frontmatter":{},"relativePath":"action/02-add-action.md","lastUpdated":1634596531737}',p={},o=t(`__VP_STATIC_START__<h1 id="add-actions-to-vue-act-master" tabindex="-1">Add Actions to Vue-act-master <a class="header-anchor" href="#add-actions-to-vue-act-master" aria-hidden="true">#</a></h1><p><div class="table-of-contents"><ul></ul></div></p><p>You can add actions in different ways.</p><p>Suppose you have a variable with an array of actions:</p><div class="language-ts"><pre><code><span class="token comment">// actions: ActMasterAction[]</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>
</code></pre></div><p>You can pass it to the constructor options:</p><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> VueActMaster <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>

Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VueActMaster<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  actions<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>Or add it already in the component.</p><div class="language-vue"><pre><code>// App.vue

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">addActions</span><span class="token punctuation">(</span>actions<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// OR one action</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">addAction</span><span class="token punctuation">(</span>actions<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div>__VP_STATIC_END__`,9),c=[o];function e(u,i,l,k,r,d){return s(),a("div",null,c)}var f=n(p,[["render",e]]);export{m as __pageData,f as default};
