import{_ as n,c as s,o as a,a as t}from"./app.645c1079.js";const h='{"title":"Advanced single execution","description":"","frontmatter":{},"headers":[{"level":2,"title":"One result with multiple calls","slug":"one-result-with-multiple-calls"}],"relativePath":"advanced/07-single-execution.md","lastUpdated":1634714760928}',p={},o=t(`__VP_STATIC_START__<h1 id="advanced-single-execution" tabindex="-1">Advanced single execution <a class="header-anchor" href="#advanced-single-execution" aria-hidden="true">#</a></h1><h2 id="one-result-with-multiple-calls" tabindex="-1">One result with multiple calls <a class="header-anchor" href="#one-result-with-multiple-calls" aria-hidden="true">#</a></h2><p>In case several places in your application will call the same request, you could call it once.</p><p>For example, you want to check authorization and if successful, display the result in several places (NavBar, Avatar, etc.).</p><p>Then, you can make the same call, in several places at once, but the request will be made only once.</p><p>To do this, you need to specify the <code>isSingleExec</code> property in the action.</p><div class="language-ts"><pre><code><span class="token comment">// with-di-action.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> api <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/api&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WithDiAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;checkAuth&#39;</span><span class="token punctuation">;</span>

  isSingleExec <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// At runtime, the result will be one</span>

  <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> api<span class="token punctuation">.</span><span class="token function">isAuth</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>Now, until the query is executed, no matter how many times you call the action, only one, the first query will be made and its result will be returned.</p><p>Example of a test</p><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> ActTest <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;act-master&#39;</span><span class="token punctuation">;</span>

<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">&#39;SinglePromise&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;one call&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// test action</span>
    <span class="token keyword">const</span> action<span class="token operator">:</span> ActMasterAction <span class="token operator">=</span> <span class="token punctuation">{</span>
      isSingleExec<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// prop for single exec</span>
      name<span class="token operator">:</span> <span class="token string">&#39;ACT_NAME&#39;</span><span class="token punctuation">,</span>
      <span class="token keyword">async</span> <span class="token function">exec</span><span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">await</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Promise</span></span><span class="token punctuation">(</span><span class="token punctuation">(</span>ok<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">ok</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> $act <span class="token operator">=</span> ActTest<span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    $act<span class="token punctuation">.</span><span class="token function">addAction</span><span class="token punctuation">(</span>action<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> mockFn <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    $act<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token string">&#39;ACT_NAME&#39;</span><span class="token punctuation">,</span> mockFn<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">await</span> <span class="token builtin">Promise</span><span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span><span class="token punctuation">[</span>
      $act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;ACT_NAME&#39;</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      $act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;ACT_NAME&#39;</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      $act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;ACT_NAME&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token function">expect</span><span class="token punctuation">(</span>mockFn<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeCalledTimes</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">expect</span><span class="token punctuation">(</span>mockFn<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeCalledWith</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre></div>__VP_STATIC_END__`,10),e=[o];function c(u,l,i,k,r,d){return a(),s("div",null,e)}var f=n(p,[["render",c]]);export{h as __pageData,f as default};
