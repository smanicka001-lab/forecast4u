import{u as b,c,_ as N,P as a,d as $}from"./deprecate-BO7XuO-A.js";import{R as r}from"./index-B1ozKwQc.js";function v({active:t=!0,className:h,withOverlay:y=!0,small:n=!1,description:l="loading",...w}){const e=b(),x=c(h,{[`${e}--loading`]:!0,[`${e}--loading--small`]:n,[`${e}--loading--stop`]:!t}),_=c({[`${e}--loading-overlay`]:!0,[`${e}--loading-overlay--stop`]:!t}),i=r.createElement("div",N({},w,{"aria-atomic":"true","aria-live":t?"assertive":"off",className:x}),r.createElement("svg",{className:`${e}--loading__svg`,viewBox:"0 0 100 100",role:"img","aria-label":l},r.createElement("title",null,l),n?r.createElement("circle",{className:`${e}--loading__background`,cx:"50%",cy:"50%",r:"42"}):null,r.createElement("circle",{className:`${e}--loading__stroke`,cx:"50%",cy:"50%",r:n?"42":"44"})));return y?r.createElement("div",{className:_},i):i}v.propTypes={active:a.bool,className:a.string,description:a.string,id:$(a.string,"\nThe prop `id` is no longer needed."),small:a.bool,withOverlay:a.bool};const L={title:"Carbon/Loading",component:v,tags:["autodocs"],parameters:{docs:{description:{component:"Carbon Loading spinner is used to indicate an ongoing process. Used in Forecast4U while fetching weather data."}}},argTypes:{description:{control:"text"},withOverlay:{control:"boolean"},small:{control:"boolean"}}},o={args:{description:"Fetching weather data...",withOverlay:!1}},s={args:{description:"Loading...",withOverlay:!1,small:!0}};var d,m,g;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    description: "Fetching weather data...",
    withOverlay: false
  }
}`,...(g=(m=o.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var p,u,f;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    description: "Loading...",
    withOverlay: false,
    small: true
  }
}`,...(f=(u=s.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};const C=["Default","Small"];export{o as Default,s as Small,C as __namedExportsOrder,L as default};
