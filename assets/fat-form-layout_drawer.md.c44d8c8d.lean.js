import{d as f,S as g,s as v,T as w,a as m,o as c,c as F,f as o,g as d,b as t,K as b,L as h,w as y,e as D,E as B,G as C,U as x,V as q,m as E}from"./app.78ede1ef.js";const k="/components/assets/fat-form-drawer.bfc11dc1.png",T=f({__name:"Drawer",setup(_){const e=g(),p=v([]),r=()=>{var s;(s=e.value)==null||s.open({title:"\u65B0\u5EFA",initialValue:{name:"",sex:0}})},A=s=>{var n;(n=e.value)==null||n.open({title:"\u7F16\u8F91",initialValue:s})},i=w(({item:s})=>()=>({async submit(n){if(n.id){const a=p.findIndex(l=>l.id===n.id);p[a]=n}else p.push({id:Date.now(),...n})},onFinish(n){B.success("\u4FDD\u5B58\u6210\u529F")},children:[s({label:"\u540D\u79F0",prop:"name"}),s({prop:"sex",label:"\u6027\u522B",valueType:"select",valueProps:{options:[{label:"\u7537",value:0},{label:"\u5973",value:1}]}})]}));return(s,n)=>{const a=m("el-button");return c(),F("div",null,[o(d(i),{ref_key:"drawerRef",ref:e},null,512),t("div",null,[t("ul",null,[(c(!0),F(b,null,h(p,l=>(c(),F("li",{key:l.id},[D(C(l.name)+": "+C(l.sex===0?"\u7537":"\u5973")+" ",1),o(a,{onClick:u=>A(l)},{default:y(()=>[D("\u7F16\u8F91")]),_:2},1032,["onClick"])]))),128))])]),t("div",null,[o(a,{onClick:r},{default:y(()=>[D("\u65B0\u5EFA")]),_:1})])])}}}),S=f({__name:"DrawerWithSteps",setup(_){const e=g(),p=v([]),r=()=>{var s;(s=e.value)==null||s.open({title:"\u65B0\u5EFA",initialValue:{name:"",sex:0}})},A=s=>{var n;(n=e.value)==null||n.open({title:"\u7F16\u8F91",initialValue:s})},i=x(({item:s,step:n})=>()=>({async submit(a){if(a.id){const l=p.findIndex(u=>u.id===a.id);p[l]=a}else p.push({id:Date.now(),...a})},onFinish(a){B.success("\u4FDD\u5B58\u6210\u529F")},children:[n({title:"\u7B2C\u4E00\u6B65",children:[s({label:"\u540D\u79F0",prop:"name",required:!0})]}),n({title:"\u7B2C\u4E8C\u6B65",children:[s({prop:"sex",label:"\u6027\u522B",valueType:"select",valueProps:{options:[{label:"\u7537",value:0},{label:"\u5973",value:1}]}})]})]}));return(s,n)=>{const a=m("el-button");return c(),F("div",null,[o(d(q),{ref_key:"drawerRef",ref:e,form:d(i)},null,8,["form"]),t("div",null,[t("ul",null,[(c(!0),F(b,null,h(p,l=>(c(),F("li",{key:l.id},[D(C(l.name)+": "+C(l.sex===0?"\u7537":"\u5973")+" ",1),o(a,{onClick:u=>A(l)},{default:y(()=>[D("\u7F16\u8F91")]),_:2},1032,["onClick"])]))),128))])]),t("div",null,[o(a,{onClick:r},{default:y(()=>[D("\u65B0\u5EFA")]),_:1})])])}}}),R=E("",6),V={class:"wk-demo"},P=E("",6),I={class:"wk-demo"},M=E("",10),$=JSON.parse('{"title":"FatFormDrawer \u8868\u5355\u62BD\u5C49","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u793A\u4F8B","slug":"\u793A\u4F8B","link":"#\u793A\u4F8B","children":[]},{"level":2,"title":"API","slug":"api","link":"#api","children":[]}],"relativePath":"fat-form-layout/drawer.md","lastUpdated":1719389638000}'),N={name:"fat-form-layout/drawer.md"},L=Object.assign(N,{setup(_){return(e,p)=>{const r=m("ClientOnly");return c(),F("div",null,[R,o(r,null,{default:y(()=>[t("div",V,[o(T)])]),_:1}),P,o(r,null,{default:y(()=>[t("div",I,[o(S)])]),_:1}),M])}}});export{$ as __pageData,L as default};
