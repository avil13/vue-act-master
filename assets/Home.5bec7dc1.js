import{_ as h,d as m,u as y,b as i,e,o,c as a,f as c,w as F,g as r,t as l,h as g,N as x,F as I,r as L,i as A,j as d,k}from"./app.2a3f081e.js";const B={key:0,class:"home-hero"},C={key:0,class:"figure"},N=["src","alt"],b={key:1,id:"main-title",class:"title"},w={key:2,class:"tagline"},V=m({setup(v){const{site:s,frontmatter:t}=y(),_=i(()=>{const{heroImage:n,heroText:u,tagline:$,actionLink:H,actionText:T}=t.value;return n||u||$||H&&T}),p=i(()=>t.value.heroText||s.value.title),f=i(()=>t.value.tagline||s.value.description);return(n,u)=>e(_)?(o(),a("header",B,[e(t).heroImage?(o(),a("figure",C,[c("img",{class:"image",src:e(F)(e(t).heroImage),alt:e(t).heroAlt},null,8,N)])):r("",!0),e(p)?(o(),a("h1",b,l(e(p)),1)):r("",!0),e(f)?(o(),a("p",w,l(e(f)),1)):r("",!0),e(t).actionLink&&e(t).actionText?(o(),g(x,{key:3,item:{link:e(t).actionLink,text:e(t).actionText},class:"action"},null,8,["item"])):r("",!0),e(t).altActionLink&&e(t).altActionText?(o(),g(x,{key:4,item:{link:e(t).altActionLink,text:e(t).altActionText},class:"action alt"},null,8,["item"])):r("",!0)])):r("",!0)}});var D=h(V,[["__scopeId","data-v-60b8f7a0"]]);const S={key:0,class:"home-features"},j={class:"wrapper"},E={class:"container"},q={class:"features"},z={key:0,class:"title"},G={key:1,class:"details"},J=m({setup(v){const{frontmatter:s}=y(),t=i(()=>s.value.features&&s.value.features.length>0),_=i(()=>s.value.features?s.value.features:[]);return(p,f)=>e(t)?(o(),a("div",S,[c("div",j,[c("div",E,[c("div",q,[(o(!0),a(I,null,L(e(_),(n,u)=>(o(),a("section",{key:u,class:"feature"},[n.title?(o(),a("h2",z,l(n.title),1)):r("",!0),n.details?(o(),a("p",G,l(n.details),1)):r("",!0)]))),128))])])])])):r("",!0)}});var K=h(J,[["__scopeId","data-v-23e7e620"]]);const M={key:0,class:"footer"},O={class:"container"},P={class:"text"},Q=m({setup(v){const{frontmatter:s}=y();return(t,_)=>e(s).footer?(o(),a("footer",M,[c("div",O,[c("p",P,l(e(s).footer),1)])])):r("",!0)}});var R=h(Q,[["__scopeId","data-v-7525add0"]]);const U={class:"home","aria-labelledby":"main-title"},W={class:"home-content"},X=m({setup(v){return(s,t)=>{const _=A("Content");return o(),a("main",U,[d(D),k(s.$slots,"hero",{},void 0,!0),d(K),c("div",W,[d(_)]),k(s.$slots,"features",{},void 0,!0),d(R),k(s.$slots,"footer",{},void 0,!0)])}}});var Z=h(X,[["__scopeId","data-v-4c04d097"]]);export{Z as default};
