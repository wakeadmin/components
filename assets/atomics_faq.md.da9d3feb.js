import{n as G,r as k,q as Z,s as ss,t as ns,v as as,x as ls,y as os,z as es,A as ps,B as ts,C as rs,a as cs,o as Fs,c as ys,f as w,w as $,m as L,b as H,g as K}from"./app.78ede1ef.js";const Ds=G(({item:a,group:l})=>{const n=k(0),o=()=>(n.value++,Promise.resolve([{label:"\u9009\u98791",value:1},{label:"\u9009\u98792",value:2}]));return()=>({children:[a({prop:"option1",label:"\u9009\u98791",valueType:"select",initialValue:1,valueProps:{options:o}}),a({prop:"option2",label:"\u9009\u98791",valueType:"select",initialValue:2,valueProps:{options:o}}),l({label:"\u8C03\u7528\u6B21\u6570",children:[Z("span",{children:n.value})]})]})});var O=new WeakMap,Q=0;function is(a){if(!a.length)return"";for(var l="arg",n=0;n<a.length;++n){var o=void 0;a[n]===null||typeof a[n]!="object"&&typeof a[n]!="function"?typeof a[n]=="string"?o='"'+a[n]+'"':o=String(a[n]):O.has(a[n])?o=O.get(a[n]):(o=Q,O.set(a[n],Q++)),l+="@"+o}return l}function us(a){if(typeof a=="function")try{a=a()}catch{a=""}return Array.isArray(a)?a=is(a):a=String(a||""),a}var j=function(){function a(l){l===void 0&&(l=0),this.items=new Map,this.ttl=l}return a.prototype.serializeKey=function(l){return us(l)},a.prototype.get=function(l){var n=this.serializeKey(l);return this.items.get(n)},a.prototype.set=function(l,n,o){var e=this.serializeKey(l),s=o||this.ttl,t=Date.now(),y={data:n,createdAt:t,expiresAt:s?t+s:1/0};this.dispatchExpire(s,y,e),this.items.set(e,y)},a.prototype.dispatchExpire=function(l,n,o){var e=this;l&&setTimeout(function(){var s=Date.now(),t=s>=n.expiresAt;t&&e.delete(o)},l)},a.prototype.delete=function(l){this.items.delete(l)},a}();function fs(){return typeof navigator.onLine<"u"?navigator.onLine:!0}function ds(){return typeof document<"u"&&typeof document.visibilityState<"u"?document.visibilityState!=="hidden":!0}var Cs=function(a){return fetch(a).then(function(l){return l.json()})};const P={isOnline:fs,isDocumentVisible:ds,fetcher:Cs};var C=globalThis&&globalThis.__assign||function(){return C=Object.assign||function(a){for(var l,n=1,o=arguments.length;n<o;n++){l=arguments[n];for(var e in l)Object.prototype.hasOwnProperty.call(l,e)&&(a[e]=l[e])}return a},C.apply(this,arguments)},m=globalThis&&globalThis.__awaiter||function(a,l,n,o){function e(s){return s instanceof n?s:new n(function(t){t(s)})}return new(n||(n=Promise))(function(s,t){function y(r){try{p(o.next(r))}catch(u){t(u)}}function D(r){try{p(o.throw(r))}catch(u){t(u)}}function p(r){r.done?s(r.value):e(r.value).then(y,D)}p((o=o.apply(a,l||[])).next())})},b=globalThis&&globalThis.__generator||function(a,l){var n={label:0,sent:function(){if(s[0]&1)throw s[1];return s[1]},trys:[],ops:[]},o,e,s,t;return t={next:y(0),throw:y(1),return:y(2)},typeof Symbol=="function"&&(t[Symbol.iterator]=function(){return this}),t;function y(p){return function(r){return D([p,r])}}function D(p){if(o)throw new TypeError("Generator is already executing.");for(;n;)try{if(o=1,e&&(s=p[0]&2?e.return:p[0]?e.throw||((s=e.return)&&s.call(e),0):e.next)&&!(s=s.call(e,p[1])).done)return s;switch(e=0,s&&(p=[p[0]&2,s.value]),p[0]){case 0:case 1:s=p;break;case 4:return n.label++,{value:p[1],done:!1};case 5:n.label++,e=p[1],p=[0];continue;case 7:p=n.ops.pop(),n.trys.pop();continue;default:if(s=n.trys,!(s=s.length>0&&s[s.length-1])&&(p[0]===6||p[0]===2)){n=0;continue}if(p[0]===3&&(!s||p[1]>s[0]&&p[1]<s[3])){n.label=p[1];break}if(p[0]===6&&n.label<s[1]){n.label=s[1],s=p;break}if(s&&n.label<s[2]){n.label=s[2],n.ops.push(p);break}s[2]&&n.ops.pop(),n.trys.pop();continue}p=l.call(a,n)}catch(r){p=[6,r],e=0}finally{o=s=0}if(p[0]&5)throw p[1];return{value:p[0]?p[1]:void 0,done:!0}}},As=globalThis&&globalThis.__read||function(a,l){var n=typeof Symbol=="function"&&a[Symbol.iterator];if(!n)return a;var o=n.call(a),e,s=[],t;try{for(;(l===void 0||l-- >0)&&!(e=o.next()).done;)s.push(e.value)}catch(y){t={error:y}}finally{try{e&&!e.done&&(n=o.return)&&n.call(o)}finally{if(t)throw t.error}}return s},vs=globalThis&&globalThis.__spreadArray||function(a,l,n){if(n||arguments.length===2)for(var o=0,e=l.length,s;o<e;o++)(s||!(o in l))&&(s||(s=Array.prototype.slice.call(l,0,o)),s[o]=l[o]);return a.concat(s||Array.prototype.slice.call(l))},J=new j,V=new j,B=new j,X={cache:J,refreshInterval:0,ttl:0,serverTTL:1e3,dedupingInterval:2e3,revalidateOnFocus:!0,revalidateDebounce:0,shouldRetryOnError:!0,errorRetryInterval:5e3,errorRetryCount:5,fetcher:P.fetcher,isOnline:P.isOnline,isDocumentVisible:P.isDocumentVisible};function hs(a,l,n){var o=V.get(a);if(o)o.data.push(l);else{var e=5e3;V.set(a,[l],n>0?n+e:n)}}function ms(a,l,n){if(!!n.isDocumentVisible()&&!(n.errorRetryCount!==void 0&&l>n.errorRetryCount)){var o=Math.min(l||0,n.errorRetryCount),e=o*n.errorRetryInterval;setTimeout(function(){a(null,{errorRetryCount:o+1,shouldRetryOnError:!0})},e)}}var U=function(a,l,n,o){return n===void 0&&(n=J),o===void 0&&(o=X.ttl),m(void 0,void 0,void 0,function(){var e,s,t,y,D,p,r;return b(this,function(u){switch(u.label){case 0:if(!gs(l))return[3,5];u.label=1;case 1:return u.trys.push([1,3,,4]),[4,l];case 2:return e=u.sent(),[3,4];case 3:return y=u.sent(),s=y,[3,4];case 4:return[3,6];case 5:e=l,u.label=6;case 6:return t=!1,D={data:e,error:s,isValidating:t},typeof e<"u"&&n.set(a,D,o),p=V.get(a),p&&p.data.length&&(r=p.data.filter(function(f){return f.key===a}),r.forEach(function(f,F){typeof D.data<"u"&&(f.data=D.data),f.error=D.error,f.isValidating=D.isValidating;var A=F===r.length-1;A||delete r[F]}),r=r.filter(Boolean)),[2,D]}})})};function bs(){for(var a=this,l=[],n=0;n<arguments.length;n++)l[n]=arguments[n];var o,e,s=C({},X),t=!1,y=!1,D=ps(),p=(D==null?void 0:D.proxy)||D;if(!p)return console.error("Could not get current instance, check to make sure that `useSwrv` is declared in the top level of the setup function."),null;var r=(p==null?void 0:p.$isServer)||!1;l.length>=1&&(o=l[0]),l.length>=2&&(e=l[1]),l.length>2&&(s=C(C({},s),l[2]));var u=r?s.serverTTL:s.ttl,f=typeof o=="function"?o:k(o);typeof e>"u"&&(e=s.fetcher);var F=null;F||(F=ss({data:void 0,error:void 0,isValidating:!0,key:null}));var A=function(i,c){return m(a,void 0,void 0,function(){var N,d,g,_,R,z,S,q=this;return b(this,function(x){switch(x.label){case 0:return N=F.data===void 0,d=f.value,d?(g=s.cache.get(d),_=g&&g.data,F.isValidating=!0,_&&(F.data=_.data,F.error=_.error),R=i||e,!R||!s.isDocumentVisible()&&!N||(c==null?void 0:c.forceRevalidate)!==void 0&&!(c!=null&&c.forceRevalidate)?(F.isValidating=!1,[2]):g&&(z=Boolean(Date.now()-g.createdAt>=s.dedupingInterval||(c==null?void 0:c.forceRevalidate)),!z)?(F.isValidating=!1,[2]):(S=function(){return m(q,void 0,void 0,function(){var v,M,I,W;return b(this,function(T){switch(T.label){case 0:return v=B.get(d),v?[3,2]:(M=Array.isArray(d)?d:[d],I=R.apply(void 0,vs([],As(M),!1)),B.set(d,I,s.dedupingInterval),[4,U(d,I,s.cache,u)]);case 1:return T.sent(),[3,4];case 2:return[4,U(d,v.data,s.cache,u)];case 3:T.sent(),T.label=4;case 4:return F.isValidating=!1,B.delete(d),F.error!==void 0&&(W=!t&&s.shouldRetryOnError&&(c?c.shouldRetryOnError:!0),W&&ms(A,c?c.errorRetryCount:1,s)),[2]}})})},_&&s.revalidateDebounce?(setTimeout(function(){return m(q,void 0,void 0,function(){return b(this,function(v){switch(v.label){case 0:return t?[3,2]:[4,S()];case 1:v.sent(),v.label=2;case 2:return[2]}})})},s.revalidateDebounce),[3,3]):[3,1])):[2];case 1:return[4,S()];case 2:x.sent(),x.label=3;case 3:return[2]}})})},E=function(){return m(a,void 0,void 0,function(){return b(this,function(i){return[2,A(null,{shouldRetryOnError:!1})]})})},h=null;ns(function(){var i=function(){return m(a,void 0,void 0,function(){return b(this,function(c){switch(c.label){case 0:return!F.error&&s.isOnline()?[4,A()]:[3,2];case 1:return c.sent(),[3,3];case 2:h&&clearTimeout(h),c.label=3;case 3:return s.refreshInterval&&!t&&(h=setTimeout(i,s.refreshInterval)),[2]}})})};s.refreshInterval&&(h=setTimeout(i,s.refreshInterval)),s.revalidateOnFocus&&(document.addEventListener("visibilitychange",E,!1),window.addEventListener("focus",E,!1))}),as(function(){t=!0,h&&clearTimeout(h),s.revalidateOnFocus&&(document.removeEventListener("visibilitychange",E,!1),window.removeEventListener("focus",E,!1));var i=V.get(f.value);i&&(i.data=i.data.filter(function(c){return c!==F}))});try{ls(f,function(i){os(f)||(f.value=i),F.key=i,F.isValidating=Boolean(i),hs(f.value,F,u),!r&&!y&&f.value&&A(),y=!1},{immediate:!0})}catch{}var Y=C(C({},es(F)),{mutate:function(i,c){return A(i,C(C({},c),{forceRevalidate:!0}))}});return Y}function gs(a){return a!==null&&typeof a=="object"&&typeof a.then=="function"}const _s=G(({item:a,group:l})=>{const n=k(0);let o=0;const{data:e,mutate:s}=bs("/your/api",()=>(n.value++,Promise.resolve([{label:`\u9009\u98791 ${o++}`,value:1},{label:`\u9009\u98792 ${o++}`,value:2}])));return()=>({children:[a({prop:"option1",label:"\u9009\u98791",valueType:"select",initialValue:1,valueProps:{options:e.value}}),a({prop:"option2",label:"\u9009\u98791",valueType:"select",initialValue:2,valueProps:{options:e.value}}),l({label:"\u5237\u65B0",children:[ts(rs,{onClick:()=>s(),children:["reload: ",n.value]})]})]})}),Es=L('<h1 id="faq" tabindex="-1">FAQ <a class="header-anchor" href="#faq" aria-hidden="true">#</a></h1><br><h2 id="_1-select-\u539F\u4EF6\u600E\u4E48\u652F\u6301\u5F02\u6B65\u52A0\u8F7D-options" tabindex="-1">1. select \u539F\u4EF6\u600E\u4E48\u652F\u6301\u5F02\u6B65\u52A0\u8F7D options <a class="header-anchor" href="#_1-select-\u539F\u4EF6\u600E\u4E48\u652F\u6301\u5F02\u6B65\u52A0\u8F7D-options" aria-hidden="true">#</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u5176\u4ED6\u539F\u4EF6\u7C7B\u4F3C\uFF1Atree-select, multi-select, cascader, cascader-lazy</p></div><br><p><strong>\u65B9\u5F0F 1\uFF1A \u76F4\u63A5\u4F20\u5165\u4E00\u4E2A\u5F02\u6B65\u51FD\u6570</strong></p>',6),Ts={class:"wk-demo"},ws=L(`<details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-tsx"><button class="copy"></button><span class="lang">tsx</span><pre><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">defineFatForm</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@wakeadmin/components</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ref</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">vue</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineFatForm</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">({</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">item</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">group</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">})</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">callTime</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">ref</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">getList</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">callTime</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">++;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">resolve</span><span style="color:#F07178;">([</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u9009\u98791</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        value</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u9009\u98792</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        value</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">    ])</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    children</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> [</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">item</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        prop</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">option1</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u9009\u98791</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueType</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">select</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        initialValue</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueProps</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">          options</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">getList</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">item</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        prop</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">option2</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u9009\u98791</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueType</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">select</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        initialValue</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueProps</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">          options</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">getList</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">group</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u8C03\u7528\u6B21\u6570</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        children</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> [</span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">span</span><span style="color:#89DDFF;">&gt;{</span><span style="color:#A6ACCD;">callTime</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">}&lt;/</span><span style="color:#F07178;">span</span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    ]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div></details><p>\u8981\u70B9\uFF1A</p><ul><li>\u5F02\u6B65\u51FD\u6570\u53EA\u4F1A\u5728\u539F\u4EF6\u6302\u8F7D(setup)\u65F6\u6267\u884C\u4E00\u6B21\u3002\u540E\u7EED\u539F\u4EF6\u91CD\u65B0\u6E32\u67D3\u4E0D\u4F1A\u88AB\u6267\u884C</li><li>\u91CD\u590D\u7684\u5F02\u6B65\u51FD\u6570\u4F1A\u88AB\u81EA\u52A8\u5408\u5E76\u3002\u6240\u4EE5\u53EF\u4EE5\u653E\u5FC3\u5730\u5728\u8868\u683C(FatTable)\u7B49\u573A\u666F\u4F7F\u7528\u5B83\u3002</li></ul><br><br><p><strong>\u65B9\u5F0F 2\uFF1A \u624B\u52A8\u7EF4\u62A4</strong></p><p>\u53EF\u4EE5\u81EA\u5DF1\u624B\u52A8\u8BF7\u6C42\u6570\u636E\uFF0C\u5E76\u901A\u8FC7 ref \u4FDD\u5B58\u8D77\u6765\u3002\u8FD9\u79CD\u65B9\u5F0F\u9002\u7528\u4E8E\u9700\u8981\u624B\u52A8\u63A7\u5236\u8BF7\u6C42\u65F6\u673A\u3001\u5237\u65B0\u65F6\u673A\u7684\u573A\u666F\u3002</p><p>\u793A\u4F8B\uFF1A\u914D\u5408 <a href="https://docs-swrv.netlify.app/" target="_blank" rel="noreferrer">swrv</a> \u4F7F\u7528\uFF1A</p>`,8),Vs={class:"wk-demo"},Rs=L(`<details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-tsx"><button class="copy"></button><span class="lang">tsx</span><pre><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">defineFatForm</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@wakeadmin/components</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ref</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">vue</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> useSwrv </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">swrv</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ElButton</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">element-plus</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">defineFatForm</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">({</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">item</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">group</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">})</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">callTime</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">ref</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">uuid</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> mutate</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">reload</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">useSwrv</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">/your/api</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">callTime</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">++;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">resolve</span><span style="color:#F07178;">([</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">\u9009\u98791 </span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">uuid</span><span style="color:#89DDFF;">++</span><span style="color:#89DDFF;">}\`</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        value</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">\u9009\u98792 </span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">uuid</span><span style="color:#89DDFF;">++</span><span style="color:#89DDFF;">}\`</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        value</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">    ])</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    children</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> [</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">item</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        prop</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">option1</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u9009\u98791</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueType</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">select</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        initialValue</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueProps</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">          options</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">item</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        prop</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">option2</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u9009\u98791</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueType</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">select</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        initialValue</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        valueProps</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">          options</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">group</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        label</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u5237\u65B0</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        children</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> [</span><span style="color:#89DDFF;">&lt;</span><span style="color:#FFCB6B;">ElButton</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">onClick</span><span style="color:#89DDFF;">={()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">reload</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">}&gt;</span><span style="color:#A6ACCD;">reload: </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;">callTime</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">}&lt;/</span><span style="color:#FFCB6B;">ElButton</span><span style="color:#89DDFF;">&gt;</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    ]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div></details><br><br><br><br>`,5),Is=JSON.parse('{"title":"FAQ","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. select \u539F\u4EF6\u600E\u4E48\u652F\u6301\u5F02\u6B65\u52A0\u8F7D options","slug":"_1-select-\u539F\u4EF6\u600E\u4E48\u652F\u6301\u5F02\u6B65\u52A0\u8F7D-options","link":"#_1-select-\u539F\u4EF6\u600E\u4E48\u652F\u6301\u5F02\u6B65\u52A0\u8F7D-options","children":[]}],"relativePath":"atomics/faq.md","lastUpdated":1719389638000}'),Ss={name:"atomics/faq.md"},Os=Object.assign(Ss,{setup(a){return(l,n)=>{const o=cs("ClientOnly");return Fs(),ys("div",null,[Es,w(o,null,{default:$(()=>[H("div",Ts,[w(K(Ds))])]),_:1}),ws,w(o,null,{default:$(()=>[H("div",Vs,[w(K(_s))])]),_:1}),Rs])}}});export{Is as __pageData,Os as default};
