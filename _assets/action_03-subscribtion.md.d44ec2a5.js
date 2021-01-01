import{o as n,e as s,G as a}from"./framework.5fb8d9f1.js";const t='{"title":"Subscribe / Unsubscribe (on/off), once","description":"","frontmatter":{},"headers":[{"level":2,"title":"exec","slug":"exec"},{"level":2,"title":"subscribe","slug":"subscribe"},{"level":2,"title":"on / off","slug":"on-off"},{"level":2,"title":"once","slug":"once"},{"level":2,"title":"Vue2 class component and subscribe decorator","slug":"vue2-class-component-and-subscribe-decorator"}],"relativePath":"action/03-subscribtion.md","lastUpdated":1609530834903.5718}';var p={};const o=a('<h1 id="subscribe-unsubscribe-on-off-once"><a class="header-anchor" href="#subscribe-unsubscribe-on-off-once" aria-hidden="true">#</a> Subscribe / Unsubscribe (on/off), once</h1><p>To explain how it works, let&#39;s create a simple example of a component in Vue-2.</p><div class="language-html"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>\n    {{ value }} === {{ result }}\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>action<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Run ACTION!!!<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n    <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      value<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n      result<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n    methods<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token keyword">async</span> <span class="token function">action</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// run action</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n    <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>\n        <span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span>\n        <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span>result <span class="token operator">=</span> data<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token keyword">this</span> <span class="token comment">// for auto unsubscribe (not working in Vue 3, send hook &quot;onUnmounted&quot;)</span>\n      <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><hr><h2 id="exec"><a class="header-anchor" href="#exec" aria-hidden="true">#</a> exec</h2><p>Here&#39;s an example of how to get the result of an action in the simplest way.</p><div class="language-ts"><pre><code><span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p><code>this.$act.exec</code> is always a promise.</p><h2 id="subscribe"><a class="header-anchor" href="#subscribe" aria-hidden="true">#</a> subscribe</h2><p>Also, you can subscribe to the action. And the result of the <code>exec</code> method call will go into the callback:</p><div class="language-ts"><pre><code><span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>\n  <span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span>\n  <span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>result <span class="token operator">=</span> data<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><p><code>Subscribe</code> method - returns the function to <code>unsubscribe</code> from events.</p><p>If you pass the instance <code>Vue</code> to the <strong>third argument</strong>, the unsubscription will be done automatically at hooks <code>beforeDestroy</code>. (Works only in Vue-2)</p><h2 id="on-off"><a class="header-anchor" href="#on-off" aria-hidden="true">#</a> on / off</h2><p>For <code>subscribe</code> / <code>unsubscribe</code> methods there are also <code>on</code> / <code>off</code> aliases.</p><div class="language-ts"><pre><code><span class="token keyword">const</span> <span class="token function-variable function">handler</span> <span class="token operator">=</span> <span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> unsubscribe <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span> handler<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">// Same thing.</span>\n<span class="token keyword">const</span> off <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span> handler<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><h2 id="once"><a class="header-anchor" href="#once" aria-hidden="true">#</a> once</h2><p>If you need to subscribe to only one event, use the <code>once</code> method.</p><p>Unsubscribe will be called automatically after the first triggering.</p><div class="language-ts"><pre><code><span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">once</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span> handler<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre></div><h1 id="advanced"><a class="header-anchor" href="#advanced" aria-hidden="true">#</a> Advanced</h1><h2 id="vue2-class-component-and-subscribe-decorator"><a class="header-anchor" href="#vue2-class-component-and-subscribe-decorator" aria-hidden="true">#</a> Vue2 class component and subscribe decorator</h2><p>If you use vue2 and classes, you can use the decorator to subscribe.</p><div class="language-html"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> Vue <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-property-decorator&#39;</span><span class="token punctuation">;</span>\n  <span class="token keyword">import</span> <span class="token punctuation">{</span> ActSubscribe <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>\n\n  @<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">MyVueComponent</span> <span class="token keyword">extends</span> <span class="token class-name">Vue</span> <span class="token punctuation">{</span>\n    @<span class="token function">ActSubscribe</span><span class="token punctuation">(</span><span class="token string">&#39;get.userData&#39;</span><span class="token punctuation">)</span>\n    user<span class="token operator">:</span> User <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">async</span> <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// Making a request.</span>\n      <span class="token comment">// The data in the `this.user` variable will be updated automatically.</span>\n      <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;get.userData&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>user<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// =&gt; User {}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><div class="language-ts"><pre><code>user<span class="token operator">:</span> User <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n</code></pre></div><p>Don&#39;t use <code>undefined</code> in init - the property will not be reactive.</p></div>',25);p.render=function(a,t,p,e,c,u){return n(),s("div",null,[o])};export default p;export{t as __pageData};
