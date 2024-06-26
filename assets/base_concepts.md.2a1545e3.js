import{d as A,r as u,a as c,o as r,c as F,f as s,w as e,g as a,h as p,D as d,b as t,G as m,j as _,m as D}from"./app.78ede1ef.js";const E="/components/assets/yida.7b9b084f.png",g={class:"wk-demo"},v=A({__name:"Atomics",setup(y){const n=u(!1);return(C,l)=>{const i=c("el-switch");return r(),F("div",g,[s(i,{modelValue:n.value,"onUpdate:modelValue":l[0]||(l[0]=o=>n.value=o),"active-text":"\u9884\u89C8","inactive-text":"\u7F16\u8F91"},null,8,["modelValue"]),s(a(_),{mode:n.value?"preview":"editable"},{default:e(()=>[s(a(p),{prop:"input",label:"\u6587\u672C\u8F93\u5165","initial-value":"123"}),s(a(p),{prop:"integer","value-type":"integer",label:"\u6574\u6570\u8F93\u5165","initial-value":456}),s(a(p),{prop:"date","value-type":"date",label:"\u65E5\u671F\u8F93\u5165"}),s(a(d),null,{default:e(o=>[t("pre",null,[t("code",null,m(JSON.stringify(o.values,void 0,2)),1)])]),_:1})]),_:1},8,["mode"])])}}}),q=D('<h1 id="\u57FA\u672C\u6982\u5FF5" tabindex="-1">\u57FA\u672C\u6982\u5FF5 <a class="header-anchor" href="#\u57FA\u672C\u6982\u5FF5" aria-hidden="true">#</a></h1><h2 id="\u4F55\u4E3A-fat" tabindex="-1">\u4F55\u4E3A &#39;fat&#39; <a class="header-anchor" href="#\u4F55\u4E3A-fat" aria-hidden="true">#</a></h2><p>Fat \u662F\u80A5\u80D6\u7684\u610F\u601D\u3002<code>@wakeadmin/components</code> \u7684\u5B9A\u4F4D\u662F\u4E00\u4E2A\u9AD8\u7EA7\u7EC4\u4EF6\u5E93\uFF0C\u800C\u4E0D\u662F element-ui \u8FD9\u7C7B\u57FA\u7840\u7EC4\u4EF6\u5E93\u3002\u5B83\u7684\u76EE\u6807\u662F\u8986\u76D6\u7BA1\u7406\u540E\u53F0\u7684 80% \u7684\u5F00\u53D1\u573A\u666F\uFF0C\u56E0\u6B64\uFF0C\u5B83\u6709\u4EE5\u4E0B\u7279\u5F81\uFF1A</p><ul><li>\u7EC4\u4EF6\u7684\u7C92\u5EA6\u66F4\u52A0\u5927\u3002\u5927\u5230\u4E00\u4E2A\u9875\u9762\uFF0C\u5C0F\u5230\u4E00\u4E2A\u9875\u9762\u533A\u57DF\u3002</li><li>\u9075\u5FAA\u201C\u7EA6\u5B9A\u5927\u4E8E\u914D\u7F6E\u201D\u3002 \u6211\u4EEC\u671F\u671B\u5F00\u53D1\u4E00\u4E2A\u9875\u9762\uFF0C\u53EA\u9700\u8981\u5C11\u91CF\u7684\u914D\u7F6E\u4EE3\u7801\uFF0C\u6309\u7167 UI/\u4EA7\u54C1 \u89C4\u8303\uFF0C\u5C06\u5927\u90E8\u5206\u4EA4\u4E92\u3001\u6570\u636E\u5904\u7406\u7684\u7EC6\u8282\u56FA\u5B9A\u4E0B\u6765\uFF0C\u505A\u5230\u5F00\u7BB1\u5373\u7528\u3002</li></ul><br><br><br><h2 id="\u4F55\u4E3A-\u539F\u4EF6-atomic" tabindex="-1">\u4F55\u4E3A&#39;\u539F\u4EF6(Atomic)&#39; <a class="header-anchor" href="#\u4F55\u4E3A-\u539F\u4EF6-atomic" aria-hidden="true">#</a></h2><p><img src="'+E+'" alt="\u5B9C\u642D"></p><p>\u539F\u4EF6\u7C7B\u4F3C\u4E8E\u4F4E\u4EE3\u7801\u5E73\u53F0\u7684\u2019\u7EC4\u4EF6\u2018\uFF0C\u5728 <code>@wakeadmin/components</code> \u4E2D\uFF0C<code>\u539F\u4EF6</code> \u662F\u7EC4\u6210<code>\u8868\u683C</code> \u548C<code>\u8868\u5355</code>\u7684\u57FA\u672C\u5355\u4F4D\u3002</p><p>\u539F\u4EF6\u6709\u4E24\u79CD\u5F62\u6001\uFF1A</p><ul><li><code>\u7F16\u8F91\u5F62\u6001(editable)</code>: \u7528\u4E8E\u8868\u5355\u3001\u8868\u683C\u67E5\u8BE2\u7B49\u573A\u666F</li><li><code>\u9884\u89C8\u5F62\u6001(preview)</code>: \u7528\u4E8E\u8BE6\u60C5\u9875\uFF0C\u8868\u683C\u7B49\u573A\u666F</li></ul><br><br><p>\u4EE3\u7801\u793A\u4F8B\uFF1A</p>',15),f=D(`<details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-vue"><button class="copy"></button><span class="lang">vue</span><pre><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">wk-demo</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">el-switch</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">v-model</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">previewMode</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">active-text</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u9884\u89C8</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">inactive-text</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u7F16\u8F91</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">el-switch</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">FatForm</span><span style="color:#89DDFF;"> :</span><span style="color:#C792EA;">mode</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">previewMode</span><span style="color:#89DDFF;"> ? </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">preview</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;"> : </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">editable</span><span style="color:#89DDFF;">&#39;&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">FatFormItem</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">prop</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">input</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u6587\u672C\u8F93\u5165</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">initial-value</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">123</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">FatFormItem</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">prop</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">integer</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">value-type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">integer</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u6574\u6570\u8F93\u5165</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> :</span><span style="color:#C792EA;">initial-value</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F78C6C;">456</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">FatFormItem</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">prop</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">date</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">value-type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">date</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">label</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u65E5\u671F\u8F93\u5165</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> /&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">FatFormConsumer</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;"> #</span><span style="color:#C792EA;">default</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">scope</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">          </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">pre</span><span style="color:#89DDFF;">&gt;&lt;</span><span style="color:#F07178;">code</span><span style="color:#89DDFF;">&gt;{{</span><span style="color:#A6ACCD;"> JSON</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">stringify</span><span style="color:#A6ACCD;">(scope</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">values</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">undefined,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;">) </span><span style="color:#89DDFF;">}}&lt;/</span><span style="color:#F07178;">code</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">pre</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#FFCB6B;">FatFormConsumer</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#FFCB6B;">FatForm</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">setup</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">lang</span><span style="color:#A6ACCD;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">tsx</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">FatForm</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">FatFormItem</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">FatFormConsumer</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@wakeadmin/components</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ref</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">vue</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> previewMode </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ref</span><span style="color:#A6ACCD;">(</span><span style="color:#FF9CAC;">false</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span></code></pre></div></details>`,1),w=JSON.parse(`{"title":"\u57FA\u672C\u6982\u5FF5","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F55\u4E3A 'fat'","slug":"\u4F55\u4E3A-fat","link":"#\u4F55\u4E3A-fat","children":[]},{"level":2,"title":"\u4F55\u4E3A'\u539F\u4EF6(Atomic)'","slug":"\u4F55\u4E3A-\u539F\u4EF6-atomic","link":"#\u4F55\u4E3A-\u539F\u4EF6-atomic","children":[]}],"relativePath":"base/concepts.md","lastUpdated":1719389638000}`),h={name:"base/concepts.md"},B=Object.assign(h,{setup(y){return(n,C)=>{const l=c("ClientOnly");return r(),F("div",null,[q,s(l,null,{default:e(()=>[s(v)]),_:1}),f])}}});export{w as __pageData,B as default};
