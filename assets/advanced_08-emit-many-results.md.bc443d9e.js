import{_ as n,c as s,o as a,a as t}from"./app.f3d8cd10.js";const h='{"title":"Pass many results from one action","description":"","frontmatter":{},"relativePath":"advanced/08-emit-many-results.md","lastUpdated":1634771919436}',p={},e=t(`<h1 id="pass-many-results-from-one-action" tabindex="-1">Pass many results from one action <a class="header-anchor" href="#pass-many-results-from-one-action" aria-hidden="true">#</a></h1><p>When running queries, there are situations where you need to change the value of the result several times.</p><p>For example, we subscribe to the result of a query. And we expect an array of values. But during the query process, we have to clear the previous state.</p><div class="language-html"><pre><code>// App.vue

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      listItems<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">&#39;First string&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;Second string&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token string">&#39;GetItems&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">items</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token comment">// keep track of changes</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>listItems <span class="token operator">=</span> items<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// Send a request</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;GetItems&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><p>Before retrieving the values, we can clear them from the action.</p><p>To do this we need to use the function <code>emit</code>. It was discussed <a href="./../action/04-actions.html#emit-another-action-in-action">here</a>.</p><div class="language-ts"><pre><code><span class="token comment">// with-emit-action.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> emitAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> api <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/api&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WithEmitAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;GetItems&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">private</span> emit<span class="token operator">:</span> emitAction<span class="token punctuation">;</span>

  <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Show empty array</span>

    <span class="token keyword">return</span> api<span class="token punctuation">.</span><span class="token function">getItems</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Return an array of values</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// set Emitter</span>
  <span class="token function">useEmit</span><span class="token punctuation">(</span>emit<span class="token operator">:</span> emitAction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>emit <span class="token operator">=</span> emit<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div>`,7),o=[e];function c(u,i,l,k,r,m){return a(),s("div",null,o)}var f=n(p,[["render",c]]);export{h as __pageData,f as default};
