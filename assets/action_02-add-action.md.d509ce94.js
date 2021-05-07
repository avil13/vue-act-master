import{o as n,c as a,d as s}from"./app.ed9140d0.js";const t='{"title":"Add Actions to Vue-act-master","description":"","frontmatter":{},"relativePath":"action/02-add-action.md","lastUpdated":1620406997475}',p={},o=s('<h1 id="add-actions-to-vue-act-master"><a class="header-anchor" href="#add-actions-to-vue-act-master" aria-hidden="true">#</a> Add Actions to Vue-act-master</h1><p><div class="table-of-contents"><ul></ul></div></p><p>You can add actions in different ways.</p><p>Suppose you have a variable with an array of actions:</p><div class="language-ts"><pre><code><span class="token comment">// actions: ActMasterAction[]</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>\n</code></pre></div><p>You can pass it to the constructor options:</p><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> VueActMaster <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>\n\nVue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VueActMaster<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  actions<span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p>Or add it already in the component.</p><div class="language-vue"><pre><code>// App.vue\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">addActions</span><span class="token punctuation">(</span>actions<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// OR one action</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">addAction</span><span class="token punctuation">(</span>actions<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div>',9);p.render=function(s,t,p,c,e,u){return n(),a("div",null,[o])};export default p;export{t as __pageData};
