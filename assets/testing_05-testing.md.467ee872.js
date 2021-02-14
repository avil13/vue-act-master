import{o as n,c as s,d as a}from"./app.3c5a841d.js";const t='{"title":"ActMaster test-utils","description":"","frontmatter":{},"headers":[{"level":2,"title":"ActTest","slug":"acttest"},{"level":2,"title":"Example:","slug":"example"},{"level":2,"title":"List of available methods","slug":"list-of-available-methods"}],"relativePath":"testing/05-testing.md","lastUpdated":1613322548087}',p={},e=a('<h1 id="actmaster-test-utils"><a class="header-anchor" href="#actmaster-test-utils" aria-hidden="true">#</a> ActMaster test-utils</h1><h2 id="acttest"><a class="header-anchor" href="#acttest" aria-hidden="true">#</a> ActTest</h2><p><code>ActTest</code> - is a class that helps write tests for <code>act-master</code>.</p><p>ActTest - is a singleton class with static methods.</p><p>To write tests, use the method <code>ActTest.getInstance(options?: ActMasterOptions)</code>.</p><p>It creates an instance of the <code>act-master</code> class, which can be easily used afterwards.</p><p>Below, instead of an example action, you will be testing your action.</p><h2 id="example"><a class="header-anchor" href="#example" aria-hidden="true">#</a> Example:</h2><div class="language-ts"><pre><code><span class="token comment">// ... base settings</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> ActTest <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span> <span class="token comment">// OR &#39;act-master&#39;;</span>\n\n<span class="token keyword">const</span> $act <span class="token operator">=</span> ActTest<span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  ActTest<span class="token punctuation">.</span><span class="token function">resetAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// test</span>\n\n<span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;Example result&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> action<span class="token operator">:</span> ActMasterAction <span class="token operator">=</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">&#39;SomeName&#39;</span><span class="token punctuation">,</span>\n    <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token number">42</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  $act<span class="token punctuation">.</span><span class="token function">addActions</span><span class="token punctuation">(</span><span class="token punctuation">[</span>action<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">await</span> $act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;SomeName&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token function">expect</span><span class="token punctuation">(</span>ActTest<span class="token punctuation">.</span><span class="token function">getLastResult</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token number">42</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><hr><p>You can also call some event and check your subscription.</p><div class="language-ts"><pre><code><span class="token comment">// ... base settings</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> ActTest <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span> <span class="token comment">// OR &#39;act-master&#39;;</span>\n\n<span class="token keyword">const</span> $act <span class="token operator">=</span> ActTest<span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  ActTest<span class="token punctuation">.</span><span class="token function">resetAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// test</span>\n\n<span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;Example check subscription&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> action<span class="token operator">:</span> ActMasterAction <span class="token operator">=</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">&#39;SomeName&#39;</span><span class="token punctuation">,</span>\n    <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token number">42</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  $act<span class="token punctuation">.</span><span class="token function">addActions</span><span class="token punctuation">(</span><span class="token punctuation">[</span>action<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">const</span> mockFn <span class="token operator">=</span> jest<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  $act<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token string">&#39;SomeName&#39;</span><span class="token punctuation">,</span> mockFn<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">await</span> ActTest<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;SomeName&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token function">expect</span><span class="token punctuation">(</span>mockFn<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBeCalledTimes</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><h2 id="list-of-available-methods"><a class="header-anchor" href="#list-of-available-methods" aria-hidden="true">#</a> List of available methods</h2><table><thead><tr><th>Method Name</th><th>Description</th></tr></thead><tbody><tr><td>getInstance</td><td>Returns the ActMaster instance</td></tr><tr><td>resetAll</td><td>Resets the ActMaster settings</td></tr><tr><td>getLastResult</td><td>Returns the last value</td></tr><tr><td>addActions</td><td>Adds actions</td></tr><tr><td>exec</td><td>Execute action</td></tr><tr><td>subscribe</td><td>Subscribes to action</td></tr><tr><td>entityCount</td><td>Returns the number of entities (&#39;actions&#39; | &#39;waiters&#39; | &#39;listeners&#39; | &#39;di&#39;) *</td></tr><tr><td>removeSingleton</td><td>Removes singleton ActMaster *</td></tr></tbody></table><blockquote><p><code>*</code> -Use if you know what it&#39;s for</p></blockquote>',15);p.render=function(a,t,p,o,c,u){return n(),s("div",null,[e])};export default p;export{t as __pageData};
