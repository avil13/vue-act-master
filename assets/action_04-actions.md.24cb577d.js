import{_ as n,c as s,o as a,a as t}from"./app.6da51a5e.js";const h='{"title":"ActMasterAction","description":"","frontmatter":{},"headers":[{"level":2,"title":"Simple action","slug":"simple-action"},{"level":2,"title":"Class Styled Action","slug":"class-styled-action"},{"level":2,"title":"Cancel Action","slug":"cancel-action"},{"level":2,"title":"Validate arguments","slug":"validate-arguments"},{"level":2,"title":"With transformation","slug":"with-transformation"},{"level":2,"title":"Wait","slug":"wait"},{"level":2,"title":"inProgress","slug":"inprogress"},{"level":2,"title":"DI in Actions","slug":"di-in-actions"},{"level":3,"title":"Adding an entity","slug":"adding-an-entity"},{"level":3,"title":"Using entities","slug":"using-entities"},{"level":2,"title":"Emit another Action in Action","slug":"emit-another-action-in-action"}],"relativePath":"action/04-actions.md","lastUpdated":1634596289405}',p={},o=t(`<h1 id="actmasteraction" tabindex="-1">ActMasterAction <a class="header-anchor" href="#actmasteraction" aria-hidden="true">#</a></h1><p><div class="table-of-contents"><ul><li><a href="#simple-action">Simple action</a></li><li><a href="#class-styled-action">Class Styled Action</a></li><li><a href="#cancel-action">Cancel Action</a></li><li><a href="#validate-arguments">Validate arguments</a></li><li><a href="#with-transformation">With transformation</a></li><li><a href="#wait">Wait</a></li><li><a href="#inprogress">inProgress</a></li><li><a href="#di-in-actions">DI in Actions</a><ul><li><a href="#adding-an-entity">Adding an entity</a></li><li><a href="#using-entities">Using entities</a></li></ul></li><li><a href="#emit-another-action-in-action">Emit another Action in Action</a></li></ul></div></p><p>Action is the place to store your business logic.</p><p>This is essentially an implementation of the Commander pattern.</p><p>Action is an object with the required <code>name</code> property and the <code>exec</code> method.</p><h2 id="simple-action" tabindex="-1">Simple action <a class="header-anchor" href="#simple-action" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code><span class="token comment">// simplest-action.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> dataAction<span class="token operator">:</span> ActMasterAction <span class="token operator">=</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span>

  <span class="token keyword">async</span> <span class="token function">exec</span><span class="token punctuation">(</span>id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">https://jsonplaceholder.typicode.com/todos/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span> id <span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// =&gt; {</span>
    <span class="token comment">//       userId: 1,</span>
    <span class="token comment">//       id: 1,</span>
    <span class="token comment">//       title: &quot;delectus aut autem&quot;,</span>
    <span class="token comment">//       completed: false</span>
    <span class="token comment">//    }</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>Having <a href="./02-add-action.html">added this action</a>, we can now call it and <a href="./03-subscribtion.html">get the result</a>.</p><p>Now we can call <code>exec</code> using the action name.</p><div class="language-ts"><pre><code><span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>You can also pass arguments to the <code>exec</code> method.</p><div class="language-ts"><pre><code><span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span> <span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><h2 id="class-styled-action" tabindex="-1">Class Styled Action <a class="header-anchor" href="#class-styled-action" aria-hidden="true">#</a></h2><p>You can use classes to create actions.</p><p>Along with classes, it will be possible to use decorators helper.</p><blockquote><p>We recommend using classes. They are more desirable, especially if you are using TypeScript.</p></blockquote><div class="language-ts"><pre><code><span class="token comment">// class-action.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ClassAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;get.data&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">async</span> <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token string">&#39;https://jsonplaceholder.typicode.com/todos/1&#39;</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><div class="language-ts"><pre><code><span class="token comment">// ../you/actions/path</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> actions<span class="token operator">:</span> ActMasterAction<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token keyword">new</span> <span class="token class-name">ClassAction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>
</code></pre></div><h2 id="cancel-action" tabindex="-1">Cancel Action <a class="header-anchor" href="#cancel-action" aria-hidden="true">#</a></h2><p>Action can be interrupted by returning a special object &quot;CancelledAct&quot;. This will stop the chain of events if you build it using <code>wait</code> or <code>emit</code>.</p><div class="language-ts"><pre><code><span class="token comment">// cancel-action.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> CancelledAct <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DataAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span>

  <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CancelledAct</span><span class="token punctuation">(</span><span class="token string">&#39;Some reason to stop action...&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><h2 id="validate-arguments" tabindex="-1">Validate arguments <a class="header-anchor" href="#validate-arguments" aria-hidden="true">#</a></h2><p>Before calling the <code>exec</code> method, you can validate the arguments that are sent to it.</p><p>We add a method <code>validateInput</code> to which all arguments intended for <code>exec</code> get.</p><p>If they are valid we return <code>true</code>.</p><p>Otherwise an error message of your choice.</p><div class="language-ts"><pre><code><span class="token comment">// validate-action.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> CancelledAct <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DataAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span>

  <span class="token function">validateInput</span><span class="token punctuation">(</span>arg<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token operator">|</span> CancelledAct <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> arg <span class="token operator">!==</span> <span class="token string">&#39;number&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> errorData <span class="token operator">=</span> <span class="token punctuation">{</span>
        id<span class="token operator">:</span> <span class="token string">&#39;Must be a number&#39;</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CancelledAct</span><span class="token punctuation">(</span><span class="token string">&#39;Validation error&#39;</span><span class="token punctuation">,</span> errorData<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// If everything is correct</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">async</span> <span class="token function">exec</span><span class="token punctuation">(</span>id<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">https://jsonplaceholder.typicode.com/todos/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>And try to exec</p><div class="language-ts"><pre><code><span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;get.data&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;101&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span>result instaceof CancelledAct<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ... Handling the error</span>
  <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="with-transformation" tabindex="-1">With transformation <a class="header-anchor" href="#with-transformation" aria-hidden="true">#</a></h2><p>It often happens that the result of a call needs to be changed.</p><p>This can easily be done through the <code>transform</code> method.</p><p>The argument will be the result of the <code>exec</code> method.</p><div class="language-ts"><pre><code><span class="token comment">// transformed-action.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TransformedAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>

  name <span class="token operator">=</span> <span class="token string">&#39;get.data.transformed&#39;</span><span class="token punctuation">,</span>

  <span class="token keyword">async</span> <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token string">&#39;https://jsonplaceholder.typicode.com/todos/1&#39;</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Output</span>
    <span class="token comment">// {</span>
    <span class="token comment">//  userId: 1,</span>
    <span class="token comment">//  id: 1,</span>
    <span class="token comment">//  title: &quot;delectus aut autem&quot;,</span>
    <span class="token comment">//  completed: false</span>
    <span class="token comment">// }</span>
  <span class="token punctuation">}</span>

  <span class="token function">transform</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Modifies the data after receiving</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      todoItem<span class="token operator">:</span> data<span class="token punctuation">.</span>title<span class="token punctuation">,</span>
      done<span class="token operator">:</span> data<span class="token punctuation">.</span>completed<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>And try to exec</p><div class="language-ts"><pre><code><span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;get.data.transformed&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// =&gt; { todoItem: &quot;delectus aut autem&quot;, done: false }</span>
</code></pre></div><h2 id="wait" tabindex="-1">Wait <a class="header-anchor" href="#wait" aria-hidden="true">#</a></h2><p>You can launch the action after another one through the &quot;wait&quot; property.</p><p>Any of the actions in <code>wait</code>, after execution, will call the current action.</p><div class="language-ts"><pre><code><span class="token comment">// Action queue</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">FirstAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;FirstAction&#39;</span><span class="token punctuation">;</span>
  <span class="token function">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      name <span class="token operator">=</span> <span class="token string">&#39;Leo&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SecondAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  <span class="token comment">// Names of events, after any and which action automatically starts.</span>
  wait<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;FirstAction&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  name <span class="token operator">=</span> <span class="token string">&#39;SecondAction&#39;</span><span class="token punctuation">;</span>
  <span class="token function">exec</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// { &quot;Name&quot;: &quot;Leo&quot; }</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      name <span class="token operator">=</span> <span class="token string">&#39;Mike&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><h2 id="inprogress" tabindex="-1">inProgress <a class="header-anchor" href="#inprogress" aria-hidden="true">#</a></h2><p>If you need to show the progress bar on the desired command, you can use the inProgress method.</p><p>It takes a function which will be called when the state of the action changes.</p><div class="language-ts"><pre><code><span class="token comment">// App.vue</span>

<span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token comment">// status of process</span>
      isLoading<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token comment">// There will be an unsubscribe function to avoid memory leaks</span>
      <span class="token function-variable function">off</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>off <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">inProgress</span><span class="token punctuation">(</span><span class="token string">&#39;GetData&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>status<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>isLoading <span class="token operator">=</span> status<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// Call action</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;GetData&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token function">beforeDestroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">off</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// unsubscribe</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
</code></pre></div><p>If you use classes and decorators, you can write it down shorter.</p><div class="language-ts"><pre><code><span class="token comment">// App.vue - with decorators</span>

<span class="token operator">&lt;</span>script lang<span class="token operator">=</span><span class="token string">&quot;ts&quot;</span><span class="token operator">&gt;</span>
  <span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> Vue <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-property-decorator&#39;</span><span class="token punctuation">;</span>
  <span class="token keyword">import</span> <span class="token punctuation">{</span> ActInProgress <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span>
  <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">MyVueComponent</span> <span class="token keyword">extends</span> <span class="token class-name">Vue</span> <span class="token punctuation">{</span>
    <span class="token decorator"><span class="token at operator">@</span><span class="token function">ActInProgress</span></span><span class="token punctuation">(</span><span class="token string">&#39;GetData&#39;</span><span class="token punctuation">)</span>
    isLoading <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

    <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&#39;GetData&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">&gt;</span>
</code></pre></div><h2 id="di-in-actions" tabindex="-1">DI in Actions <a class="header-anchor" href="#di-in-actions" aria-hidden="true">#</a></h2><p>To make the actions more independent, a simple Dependency injection (DI) implementation has been added.</p><p>It consists of storing entities that we access from actions into an internal container.</p><p>For example, we have an API. And no matter what we use (REST,GraphQL,gRPC), this interface will not change.</p><p>And we just use the implementation of this entity through an interface.</p><p>In the code it looks like this:</p><h3 id="adding-an-entity" tabindex="-1">Adding an entity <a class="header-anchor" href="#adding-an-entity" aria-hidden="true">#</a></h3><div class="language-ts"><pre><code><span class="token comment">// main.ts</span>
<span class="token comment">// ...</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> VueActMaster <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> actions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/actions/path&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SuperAPI <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/api&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> di <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// key, value</span>
  <span class="token string">&#39;api&#39;</span><span class="token operator">:</span> SuperAPI
<span class="token punctuation">}</span><span class="token punctuation">;</span>

Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VueActMaster<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  actions<span class="token punctuation">,</span>
  di<span class="token punctuation">,</span> <span class="token comment">// map of entities</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>or in vue component</p><div class="language-html"><pre><code>// App.vue

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> SuperAPI <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/api&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Adding DI scope</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$act<span class="token punctuation">.</span><span class="token function">setDI</span><span class="token punctuation">(</span><span class="token string">&#39;api&#39;</span><span class="token punctuation">,</span> SuperAPI<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><h3 id="using-entities" tabindex="-1">Using entities <a class="header-anchor" href="#using-entities" aria-hidden="true">#</a></h3><p>There are two ways to get DI entities:</p><ul><li>Through decorators, if you use them in typescript.</li><li>Through the <code>useDI</code> method.</li></ul><div class="language-ts"><pre><code><span class="token comment">// with-di-action.ts</span>
<span class="token comment">// with decorator</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> UseDI<span class="token punctuation">,</span> ActMasterAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> SuperAPI <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/api&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WithDiAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;login&#39;</span><span class="token punctuation">;</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">UseDI</span></span><span class="token punctuation">(</span><span class="token string">&#39;api&#39;</span><span class="token punctuation">)</span>
  <span class="token keyword">private</span> api<span class="token operator">!</span><span class="token operator">:</span> SuperAPI<span class="token punctuation">;</span> <span class="token comment">// SuperAPI as interface</span>

  <span class="token class-name">exec</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>api<span class="token punctuation">.</span><span class="token function">login</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>OR</p><div class="language-ts"><pre><code><span class="token comment">// with-di-action.ts</span>
<span class="token comment">// without decorator</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SuperAPI <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../you/api&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WithDiAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;login&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">private</span> api<span class="token operator">:</span> SuperAPI<span class="token punctuation">;</span> <span class="token comment">// SuperAPI as interface</span>

  <span class="token class-name">exec</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>api<span class="token punctuation">.</span><span class="token function">login</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// get DI scope</span>
  <span class="token function">useDI</span><span class="token punctuation">(</span><span class="token punctuation">{</span> api <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>api <span class="token operator">=</span> api<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="emit-another-action-in-action" tabindex="-1">Emit another Action in Action <a class="header-anchor" href="#emit-another-action-in-action" aria-hidden="true">#</a></h2><p>If you need to call another action inside the current one, you can do it using the <code>emit</code> handler.</p><p>It can be connected via the decorator or via the helper.</p><p>This way you can build chains of actions that can be stopped by <code>CancelledAct</code>.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Be careful. The action should not call itself. Otherwise it will start an endless loop.</p></div><div class="language-ts"><pre><code><span class="token comment">// with-emit-action.ts</span>
<span class="token comment">// with decorator</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> Emit<span class="token punctuation">,</span> emitAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WithEmitAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;login&#39;</span><span class="token punctuation">;</span>

  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Emit</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">private</span> emit<span class="token operator">!</span><span class="token operator">:</span> emitAction<span class="token punctuation">;</span>

  <span class="token function">exec</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> result <span class="token operator">=</span> api<span class="token punctuation">.</span><span class="token function">login</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// use another action</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">&#39;set.authorized&#39;</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>OR</p><div class="language-ts"><pre><code><span class="token comment">// with-emit-action.ts</span>
<span class="token comment">// without decorator</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> ActMasterAction<span class="token punctuation">,</span> emitAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-act-master&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">WithEmitAction</span> <span class="token keyword">implements</span> <span class="token class-name">ActMasterAction</span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string">&#39;login&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">private</span> emit<span class="token operator">:</span> emitAction<span class="token punctuation">;</span>

  <span class="token function">exec</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> result <span class="token operator">=</span> api<span class="token punctuation">.</span><span class="token function">login</span><span class="token punctuation">(</span>loginData<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// use another action</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">&#39;set.authorized&#39;</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// set Emitter</span>
  <span class="token function">useEmit</span><span class="token punctuation">(</span>emit<span class="token operator">:</span> emitAction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>emit <span class="token operator">=</span> emit<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div>`,70),e=[o];function c(l,i,u,k,r,d){return a(),s("div",null,e)}var g=n(p,[["render",c]]);export{h as __pageData,g as default};
