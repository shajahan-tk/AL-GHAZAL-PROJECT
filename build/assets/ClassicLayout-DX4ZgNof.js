import{r as o,u as h,a as j,j as e,c as v,S as b,d as L,b as N,i as S,s as w}from"./index-CA7vLNFI.js";import{H as A,M as H,U as C}from"./navigation-icon.config-CI-_MDd9.js";import{S as E,a as y}from"./SideNav-eITurgFQ.js";import{A as i}from"./index-BggIXgst.js";import{D as n}from"./index-CN623WjC.js";import{w as z,S as D}from"./SidePanel-BMEYWjDx.js";import{H as k}from"./toString-C_n6VLVY.js";import{V as F}from"./Views-DLdkzVCz.js";import"./Select-x-0aCyUg.js";import"./Badge-BVlo33er.js";import"./get-BX0NKbV_.js";import"./Button-BWlffnBS.js";import"./ScrollBar-AdrsP0HV.js";import"./Logo-B2d7wmVo.js";import"./VerticalMenuContent-MDSuGY18.js";import"./useUniqueId-CHCEdNH2.js";import"./_getPrototype-CyHMCE_m.js";import"./floating-ui.react-3izAV1IH.js";import"./index-B5bUWmwT.js";import"./isNil-C6Hksnuv.js";import"./useControllableState-CUoXx6vD.js";import"./index-CTinFxyH.js";import"./useThemeClass-CVmzq6xu.js";import"./DoubleSidedImage-CITnSUak.js";import"./toast-DD4ocoaX.js";import"./StatusIcon-B6CLEAZ-.js";const c=[{label:"English",value:"en",flag:"us"},{label:"Chinese",value:"zhCn",flag:"cn"},{label:"Espanol",value:"es",flag:"sp"},{label:"Arabic",value:"ar",flag:"ar"}],M=({className:m})=>{const[p,r]=o.useState(!1),t=h(s=>s.locale.currentLang),d=j(),x=o.useMemo(()=>{var s;return(s=c.find(a=>a.value===t))==null?void 0:s.flag},[t]),u=e.jsx("div",{className:v(m,"flex items-center"),children:p?e.jsx(b,{size:20}):e.jsx(i,{size:24,shape:"circle",src:`/img/countries/${x}.png`})}),f=s=>{const a=s.replace(/-([a-z])/g,function(g){return g[1].toUpperCase()});r(!0);const l=()=>{S.changeLanguage(a),d(w(s)),r(!1)};L[a]().then(()=>{N.locale(a),l()}).catch(()=>{l()})};return e.jsx(n,{renderTitle:u,placement:"bottom-end",children:c.map(s=>e.jsxs(n.Item,{className:"mb-1 justify-between",eventKey:s.label,onClick:()=>f(s.value),children:[e.jsxs("span",{className:"flex items-center",children:[e.jsx(i,{size:18,shape:"circle",src:`/img/countries/${s.flag}.png`}),e.jsx("span",{className:"ltr:ml-2 rtl:mr-2",children:s.label})]}),t===s.value&&e.jsx(k,{className:"text-emerald-500 text-lg"})]},s.label))})},U=z(M),I=()=>e.jsxs(e.Fragment,{children:[e.jsx(H,{}),e.jsx(y,{})]}),T=()=>e.jsxs(e.Fragment,{children:[e.jsx(U,{}),e.jsx(D,{}),e.jsx(C,{hoverable:!1})]}),me=()=>e.jsx("div",{className:"app-layout-classic flex flex-auto flex-col",children:e.jsxs("div",{className:"flex flex-auto min-w-0",children:[e.jsx(E,{}),e.jsxs("div",{className:"flex flex-col flex-auto min-h-screen min-w-0 relative w-full",children:[e.jsx(A,{className:"shadow dark:shadow-2xl",headerStart:e.jsx(I,{}),headerEnd:e.jsx(T,{})}),e.jsx("div",{className:"h-full flex flex-auto flex-col",children:e.jsx(F,{})})]})]})});export{me as default};
