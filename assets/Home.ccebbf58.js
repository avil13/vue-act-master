import{e as a,u as e,f as t,g as s,h as l,o,c as i,a as n,i as c,t as r,_ as v,w as f,p as u,j as d,F as m,r as p,k as h,l as k}from"./app.3c5a841d.js";const x=f("data-v-3103f9e6");u("data-v-3103f9e6");const y={key:0,class:"home-hero"},g={key:0,class:"figure"},$={key:1,id:"main-title",class:"title"},_={key:2,class:"description"};d();var b=a({expose:[],setup(a){const f=e(),u=t(),d=s((()=>u.value.heroImage||m.value||h.value||b.value)),m=s((()=>null!==u.value.heroText)),p=s((()=>u.value.heroText||f.value.title)),h=s((()=>null!==u.value.tagline)),k=s((()=>u.value.tagline||f.value.description)),b=s((()=>u.value.actionLink&&u.value.actionText)),I=s((()=>u.value.altActionLink&&u.value.altActionText));return x(((a,e)=>l(d)?(o(),i("header",y,[a.$frontmatter.heroImage?(o(),i("figure",g,[n("img",{class:"image",src:a.$withBase(a.$frontmatter.heroImage),alt:a.$frontmatter.heroAlt},null,8,["src","alt"])])):c("v-if",!0),l(m)?(o(),i("h1",$,r(l(p)),1)):c("v-if",!0),l(h)?(o(),i("p",_,r(l(k)),1)):c("v-if",!0),l(b)?(o(),i(v,{key:3,item:{link:l(u).actionLink,text:l(u).actionText},class:"action"},null,8,["item"])):c("v-if",!0),l(I)?(o(),i(v,{key:4,item:{link:l(u).altActionLink,text:l(u).altActionText},class:"action alt"},null,8,["item"])):c("v-if",!0)])):c("v-if",!0)))}});b.__scopeId="data-v-3103f9e6";const I=f("data-v-11ba5bf9");u("data-v-11ba5bf9");const T={key:0,class:"home-features"},A={class:"wrapper"},L={class:"container"},w={class:"features"},j={key:0,class:"title"},B={key:1,class:"details"};d();var C=a({expose:[],setup(a){const e=t(),v=s((()=>e.value.features&&e.value.features.length>0)),f=s((()=>e.value.features?e.value.features:[]));return I(((a,e)=>l(v)?(o(),i("div",T,[n("div",A,[n("div",L,[n("div",w,[(o(!0),i(m,null,p(l(f),((a,e)=>(o(),i("section",{key:e,class:"feature"},[a.title?(o(),i("h2",j,r(a.title),1)):c("v-if",!0),a.details?(o(),i("p",B,r(a.details),1)):c("v-if",!0)])))),128))])])])])):c("v-if",!0)))}});C.__scopeId="data-v-11ba5bf9";const F={},q=f("data-v-832ca742");u("data-v-832ca742");const z={key:0,class:"footer"},D={class:"container"},E={class:"text"};d();const G=q(((a,e)=>a.$frontmatter.footer?(o(),i("footer",z,[n("div",D,[n("p",E,r(a.$frontmatter.footer),1)])])):c("v-if",!0)));F.render=G,F.__scopeId="data-v-832ca742";const H=f("data-v-6f08a73a");u("data-v-6f08a73a");const J={class:"home","aria-labelledby":"main-title"},K={class:"home-content"};d();var M=a({expose:[],setup:a=>H(((a,e)=>{const t=h("Content");return o(),i("main",J,[n(b),k(a.$slots,"hero"),n(C),n("div",K,[n(t)]),k(a.$slots,"features"),n(F),k(a.$slots,"footer")])}))});M.__scopeId="data-v-6f08a73a";export default M;
