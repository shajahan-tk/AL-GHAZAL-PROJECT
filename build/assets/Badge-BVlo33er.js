import{r as P,c as o,j as u}from"./index-CA7vLNFI.js";var y={exports:{}},m,T;function S(){if(T)return m;T=1;var a="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return m=a,m}var d,g;function x(){if(g)return d;g=1;var a=S();function n(){}function s(){}return s.resetWarningCache=n,d=function(){function e(h,p,c,b,i,l){if(l!==a){var f=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw f.name="Invariant Violation",f}}e.isRequired=e;function r(){return e}var t={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:r,element:e,elementType:e,instanceOf:r,node:e,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r,checkPropTypes:s,resetWarningCache:n};return t.PropTypes=t,t},d}var R;function _(){return R||(R=1,y.exports=x()()),y.exports}const v=P.forwardRef((a,n)=>{const{badgeStyle:s,children:e,className:r,content:t,innerClass:h,maxCount:p=99,...c}=a,i=o(typeof t!="number"&&typeof t!="string"?"badge-dot":"badge",h);return e?u.jsxs("span",{ref:n,className:o("badge-wrapper",r),...c,children:[u.jsx("span",{className:o(i,"badge-inner"),style:s,children:typeof t=="number"&&t>p?`${p}+`:t}),e]}):u.jsx("span",{ref:n,className:o(i,r),style:s,...c,children:t})});v.displayName="Badge";export{v as B,_ as r};
