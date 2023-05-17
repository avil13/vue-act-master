import{_ as a,o as s,c as n,R as e}from"./chunks/framework.00f1d326.js";const l="/vue-act-master/img/act-master-cli-run.avif",u=JSON.parse('{"title":"Act-Master-Cli","description":"","frontmatter":{},"headers":[],"relativePath":"guide/cli.md","filePath":"guide/cli.md","lastUpdated":1684294561000}'),t={name:"guide/cli.md"},o=e(`<h1 id="act-master-cli" tabindex="-1">Act-Master-Cli <a class="header-anchor" href="#act-master-cli" aria-label="Permalink to &quot;Act-Master-Cli&quot;">​</a></h1><p>Act&#39;s can be spread out in different folders. And it is not always convenient to keep track of them.</p><p>To simplify this task, the package <code>act-master-cli</code> was created.</p><p>With it, you can:</p><ul><li>Collect all the act&#39;s in one file.</li><li>Add strict typing and type substitution when you call them.</li><li>Check act&#39;s for type correctness.</li></ul><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h2><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">act-master-cli</span></span></code></pre></div><h2 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-label="Permalink to &quot;Configuration&quot;">​</a></h2><p>Now you need to create a configuration file to search for acts.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">act-master-cli</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">init</span></span></code></pre></div><p>This command will create a file \`.act-master.yaml</p><p>It contains the recommended default parameters</p><div class="language-yaml"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F07178;">config</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;"># the path to the folder with the source files relative to this file</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">src</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">./src</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">alias</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">actionsPatterns</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># a patterns for finding action files</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">act/**/*.act.ts</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">generate</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">actionsIndexFile</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">act/generated/actions.ts</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">prefixText</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/* This is generated file */</span><span style="color:#89DDFF;">&#39;</span></span></code></pre></div><h2 id="launch" tabindex="-1">Launch <a class="header-anchor" href="#launch" aria-label="Permalink to &quot;Launch&quot;">​</a></h2><p>To make it easier to run the command, we recommend adding a call command to <code>package.json</code> in the <code>scripts</code> section:</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">act:gen</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">act-master-cli g</span><span style="color:#89DDFF;">&quot;</span></span></code></pre></div><p>Now you can run the command that will generate the file</p><div class="vp-code-group"><div class="tabs"><input type="radio" name="group-BBLDX" id="tab-sKLf1NW" checked="checked"><label for="tab-sKLf1NW">npm</label><input type="radio" name="group-BBLDX" id="tab-DFWxBXG"><label for="tab-DFWxBXG">yarn</label><input type="radio" name="group-BBLDX" id="tab-TidINsp"><label for="tab-TidINsp">npx</label></div><div class="blocks"><div class="language-bash active"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npm</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">run</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">act:gen</span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">yarn</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">act:gen</span></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">act-master-cli</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">g</span></span></code></pre></div></div></div><p><img src="`+l+'" alt="act-master-cli demo"></p><p>Usually projects use their own code style, and for the created file <code>act/generated/actions.ts</code> to match it, you can add formatting.</p><p>If you are using <code>eslint</code>, you can add the following command to <code>package.json</code> in the <code>scripts</code> section</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">postact:gen</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">eslint ./src/generated/actions.ts --fix</span><span style="color:#89DDFF;">&quot;</span></span></code></pre></div><p>Now, after each run of the <code>act:gen</code> command, the created file will be formatted.</p>',23),p=[o];function c(i,r,d,y,D,h){return s(),n("div",null,p)}const m=a(t,[["render",c]]);export{u as __pageData,m as default};
