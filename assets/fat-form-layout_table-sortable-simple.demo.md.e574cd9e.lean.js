import{n as u,q as o,a as i,o as d,c,f as s,w as p,b as m,g as _}from"./app.78ede1ef.js";const f=u(({item:a,table:l,tableColumn:r,consumer:e,group:n})=>()=>({children:[a({label:"\u6807\u9898",prop:"title",width:"small"}),l({prop:"list",label:"\u8BE6\u60C5",width:700,columns:[r({prop:"name",label:"\u59D3\u540D",required:!0})],sortable:!0,sortableProps:{rowSortable(t){return t.index%2===0}}}),e(t=>n({label:"\u5F53\u524D\u503C",children:o("pre",{children:o("code",{children:JSON.stringify(t.values,null,2)})})}))]})),b={class:"wk-demo full-height"},w=JSON.parse('{"title":"","description":"","frontmatter":{"layout":false},"headers":[],"relativePath":"fat-form-layout/table-sortable-simple.demo.md","lastUpdated":1719389638000}'),h={name:"fat-form-layout/table-sortable-simple.demo.md"},y=Object.assign(h,{setup(a){return(l,r)=>{const e=i("ClientOnly");return d(),c("div",null,[s(e,null,{default:p(()=>[m("div",b,[s(_(f))])]),_:1})])}}});export{w as __pageData,y as default};
