import{_ as n,c as s,o as a,a as t}from"./app.f3d8cd10.js";const w='{"title":"Act-Master with WebSocket","description":"","frontmatter":{},"headers":[{"level":2,"title":"Actions for working with WebSocket","slug":"actions-for-working-with-websocket"},{"level":3,"title":"Message processing","slug":"message-processing"},{"level":3,"title":"Working with WebSocket","slug":"working-with-websocket"},{"level":3,"title":"Getting events to display them in the view.","slug":"getting-events-to-display-them-in-the-view"}],"relativePath":"tips/web-socket.md","lastUpdated":1634771494369}',e={},o=t(`__VP_STATIC_START__<h1 id="act-master-with-websocket" tabindex="-1">Act-Master with WebSocket <a class="header-anchor" href="#act-master-with-websocket" aria-hidden="true">#</a></h1><p>The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.</p><p>We&#39;ll take a look at the simplest way to work through Act-Master.</p><p>Examples taken from <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noopener noreferrer">MDN</a></p><br><p>To work with WebSocket you will need to create two actions.</p><ul><li><p>The <a href="#message-processing">first</a> is for message processing.</p></li><li><p>The <a href="#working-with-websocket">second</a>, will handle connecting and catching events when working with WebSocket.</p></li></ul><blockquote><p>In the example below, we won&#39;t describe all the cases of WebSocket in great detail. You will also need to handle closing the connection.</p></blockquote><h2 id="actions-for-working-with-websocket" tabindex="-1">Actions for working with WebSocket <a class="header-anchor" href="#actions-for-working-with-websocket" aria-hidden="true">#</a></h2><h3 id="message-processing" tabindex="-1">Message processing <a class="header-anchor" href="#message-processing" aria-hidden="true">#</a></h3><div class="language-ts"><pre><code><span class="token comment">// ws-message-action.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> Emit<span class="token punctuation">,</span> emitAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WsMessageAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;ws.onMessage&#39;</span><span class="token punctuation">;</span> <span class="token comment">// we will subscribe to this event</span>

  <span class="token function">exec</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> msg<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre></div><h3 id="working-with-websocket" tabindex="-1">Working with WebSocket <a class="header-anchor" href="#working-with-websocket" aria-hidden="true">#</a></h3><div class="language-ts"><pre><code><span class="token comment">// ws-action.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> Emit<span class="token punctuation">,</span> emitAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WsAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;ws.make&#39;</span><span class="token punctuation">;</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Emit</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> emit<span class="token operator">!</span><span class="token operator">:</span> emitAction<span class="token punctuation">;</span>

  <span class="token comment">// Property is static, so as not to create multiple copies</span>
  <span class="token keyword">static</span> socket<span class="token operator">:</span> WebSocket<span class="token punctuation">;</span>

  <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>WsAction<span class="token punctuation">.</span>socket<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// Connection already exists</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// Create WebSocket connection.</span>
    WsAction<span class="token punctuation">.</span>socket <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebSocket</span><span class="token punctuation">(</span><span class="token string">&#39;ws://localhost:8080&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// Connection opened</span>
    WsAction<span class="token punctuation">.</span>socket<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;open&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        WsAction<span class="token punctuation">.</span>socket<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">&#39;Hello Server!&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// Listen for messages</span>
    WsAction<span class="token punctuation">.</span>socket<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;message&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token comment">// Call Action</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">&#39;ws.onMessage&#39;</span><span class="token punctuation">,</span> event<span class="token punctuation">.</span>data<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h3 id="getting-events-to-display-them-in-the-view" tabindex="-1">Getting events to display them in the view. <a class="header-anchor" href="#getting-events-to-display-them-in-the-view" aria-hidden="true">#</a></h3><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Subscription first</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>
      <span class="token string">&#39;ws.onMessage&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// ... Working with and displaying data</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// Enabling WebSocket</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;ws.make&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div>__VP_STATIC_END__`,15),p=[o];function c(i,l,k,u,r,d){return a(),s("div",null,p)}var h=n(e,[["render",c]]);export{w as __pageData,h as default};