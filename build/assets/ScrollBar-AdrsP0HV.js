import{q as Ae,t as Ve,r as Ne,j as fe}from"./index-CA7vLNFI.js";import{r as Ie}from"./Badge-BVlo33er.js";var ee={},te={},U={exports:{}},q={exports:{}},Ue=q.exports,ve;function Be(){return ve||(ve=1,(function(){var a,u,s,v,o,b;typeof performance<"u"&&performance!==null&&performance.now?q.exports=function(){return performance.now()}:typeof process<"u"&&process!==null&&process.hrtime?(q.exports=function(){return(a()-o)/1e6},u=process.hrtime,a=function(){var d;return d=u(),d[0]*1e9+d[1]},v=a(),b=process.uptime()*1e9,o=v-b):Date.now?(q.exports=function(){return Date.now()-s},s=Date.now()):(q.exports=function(){return new Date().getTime()-s},s=new Date().getTime())}).call(Ue)),q.exports}var ge;function $e(){if(ge)return U.exports;ge=1;for(var a=Be(),u=typeof window>"u"?Ae:window,s=["moz","webkit"],v="AnimationFrame",o=u["request"+v],b=u["cancel"+v]||u["cancelRequest"+v],d=0;!o&&d<s.length;d++)o=u[s[d]+"Request"+v],b=u[s[d]+"Cancel"+v]||u[s[d]+"CancelRequest"+v];if(!o||!b){var S=0,m=0,l=[],c=1e3/60;o=function(h){if(l.length===0){var w=a(),y=Math.max(0,c-(w-S));S=y+w,setTimeout(function(){var A=l.slice(0);l.length=0;for(var F=0;F<A.length;F++)if(!A[F].cancelled)try{A[F].callback(S)}catch(j){setTimeout(function(){throw j},0)}},Math.round(y))}return l.push({handle:++m,callback:h,cancelled:!1}),m},b=function(h){for(var w=0;w<l.length;w++)l[w].handle===h&&(l[w].cancelled=!0)}}return U.exports=function(h){return o.call(u,h)},U.exports.cancel=function(){b.apply(u,arguments)},U.exports.polyfill=function(h){h||(h=u),h.requestAnimationFrame=o,h.cancelAnimationFrame=b},U.exports}var B={exports:{}},re,me;function je(){if(me)return re;me=1;var a=null,u=["Webkit","Moz","O","ms"];return re=function(v){a||(a=document.createElement("div"));var o=a.style;if(v in o)return v;for(var b=v.charAt(0).toUpperCase()+v.slice(1),d=u.length;d>=0;d--){var S=u[d]+b;if(S in o)return S}return!1},re}var ne,pe;function Ge(){if(pe)return ne;pe=1,ne=v;var a=/\s/,u=/(_|-|\.|:)/,s=/([a-z][A-Z]|[A-Z][a-z])/;function v(m){return a.test(m)?m.toLowerCase():u.test(m)?(b(m)||m).toLowerCase():s.test(m)?S(m).toLowerCase():m.toLowerCase()}var o=/[\W_]+(.|$)/g;function b(m){return m.replace(o,function(l,c){return c?" "+c:""})}var d=/(.)([A-Z]+)/g;function S(m){return m.replace(d,function(l,c,h){return c+" "+h.toLowerCase().split("").join(" ")})}return ne}var ie,Se;function Xe(){if(Se)return ie;Se=1;var a=Ge();ie=u;function u(s){return a(s).replace(/[\W_]+(.|$)/g,function(v,o){return o?" "+o:""}).trim()}return ie}var ae,Te;function Ye(){if(Te)return ae;Te=1;var a=Xe();ae=u;function u(s){return a(s).replace(/\s(\w)/g,function(v,o){return o.toUpperCase()})}return ae}var oe,ye;function Ze(){if(ye)return oe;ye=1;var a={animationIterationCount:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridColumn:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,stopOpacity:!0,strokeDashoffset:!0,strokeOpacity:!0,strokeWidth:!0};return oe=function(u,s){return typeof s=="number"&&!a[u]?s+"px":s},oe}var be;function Ee(){if(be)return B.exports;be=1;var a=je(),u=Ye(),s={float:"cssFloat"},v=Ze();function o(m,l,c){var h=s[l];if(typeof h>"u"&&(h=d(l)),h){if(c===void 0)return m.style[h];m.style[h]=v(h,c)}}function b(m,l){for(var c in l)l.hasOwnProperty(c)&&o(m,c,l[c])}function d(m){var l=u(m),c=a(l);return s[l]=s[m]=s[c]=c,c}function S(){arguments.length===2?typeof arguments[1]=="string"?arguments[0].style.cssText=arguments[1]:b(arguments[0],arguments[1]):o(arguments[0],arguments[1],arguments[2])}return B.exports=S,B.exports.set=S,B.exports.get=function(m,l){return Array.isArray(l)?l.reduce(function(c,h){return c[h]=o(m,h||""),c},{}):o(m,l||"")},B.exports}var le={},we;function Je(){return we||(we=1,function(a){Object.defineProperty(a,"__esModule",{value:!0}),a.default=u;function u(s){return typeof s=="string"}}(le)),le}var ue={},He;function Ke(){return He||(He=1,function(a){Object.defineProperty(a,"__esModule",{value:!0}),a.default=b;var u=Ee(),s=v(u);function v(d){return d&&d.__esModule?d:{default:d}}var o=!1;function b(){var d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!0;if(d&&o!==!1)return o;if(typeof document<"u"){var S=document.createElement("div");(0,s.default)(S,{width:100,height:100,position:"absolute",top:-9999,overflow:"scroll",MsOverflowStyle:"scrollbar"}),document.body.appendChild(S),o=S.offsetWidth-S.clientWidth,document.body.removeChild(S)}else o=0;return o||0}}(ue)),ue}var se={},ke;function Qe(){return ke||(ke=1,function(a){Object.defineProperty(a,"__esModule",{value:!0}),a.default=u;function u(){return!1}}(se)),se}var ce={},De;function et(){return De||(De=1,function(a){Object.defineProperty(a,"__esModule",{value:!0}),a.default=u;function u(s){var v=s.clientWidth,o=getComputedStyle(s),b=o.paddingLeft,d=o.paddingRight;return v-parseFloat(b)-parseFloat(d)}}(ce)),ce}var de={},_e;function tt(){return _e||(_e=1,function(a){Object.defineProperty(a,"__esModule",{value:!0}),a.default=u;function u(s){var v=s.clientHeight,o=getComputedStyle(s),b=o.paddingTop,d=o.paddingBottom;return v-parseFloat(b)-parseFloat(d)}}(de)),de}var D={},Me;function rt(){return Me||(Me=1,Object.defineProperty(D,"__esModule",{value:!0}),D.containerStyleDefault={position:"relative",overflow:"hidden",width:"100%",height:"100%"},D.containerStyleAutoHeight={height:"auto"},D.viewStyleDefault={position:"absolute",top:0,left:0,right:0,bottom:0,overflow:"scroll",WebkitOverflowScrolling:"touch"},D.viewStyleAutoHeight={position:"relative",top:void 0,left:void 0,right:void 0,bottom:void 0},D.viewStyleUniversalInitial={overflow:"hidden",marginRight:0,marginBottom:0},D.trackHorizontalStyleDefault={position:"absolute",height:6},D.trackVerticalStyleDefault={position:"absolute",width:6},D.thumbHorizontalStyleDefault={position:"relative",display:"block",height:"100%"},D.thumbVerticalStyleDefault={position:"relative",display:"block",width:"100%"},D.disableSelectStyle={userSelect:"none"},D.disableSelectStyleReset={userSelect:""}),D}var O={},Le;function nt(){if(Le)return O;Le=1,Object.defineProperty(O,"__esModule",{value:!0});var a=Object.assign||function(c){for(var h=1;h<arguments.length;h++){var w=arguments[h];for(var y in w)Object.prototype.hasOwnProperty.call(w,y)&&(c[y]=w[y])}return c};O.renderViewDefault=b,O.renderTrackHorizontalDefault=d,O.renderTrackVerticalDefault=S,O.renderThumbHorizontalDefault=m,O.renderThumbVerticalDefault=l;var u=Ve(),s=v(u);function v(c){return c&&c.__esModule?c:{default:c}}function o(c,h){var w={};for(var y in c)h.indexOf(y)>=0||Object.prototype.hasOwnProperty.call(c,y)&&(w[y]=c[y]);return w}function b(c){return s.default.createElement("div",c)}function d(c){var h=c.style,w=o(c,["style"]),y=a({},h,{right:2,bottom:2,left:2,borderRadius:3});return s.default.createElement("div",a({style:y},w))}function S(c){var h=c.style,w=o(c,["style"]),y=a({},h,{right:2,bottom:2,top:2,borderRadius:3});return s.default.createElement("div",a({style:y},w))}function m(c){var h=c.style,w=o(c,["style"]),y=a({},h,{cursor:"pointer",borderRadius:"inherit",backgroundColor:"rgba(0,0,0,.2)"});return s.default.createElement("div",a({style:y},w))}function l(c){var h=c.style,w=o(c,["style"]),y=a({},h,{cursor:"pointer",borderRadius:"inherit",backgroundColor:"rgba(0,0,0,.2)"});return s.default.createElement("div",a({style:y},w))}return O}var ze;function it(){return ze||(ze=1,function(a){Object.defineProperty(a,"__esModule",{value:!0});var u=Object.assign||function(T){for(var g=1;g<arguments.length;g++){var n=arguments[g];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(T[t]=n[t])}return T},s=function(){function T(g,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(g,r.key,r)}}return function(g,n,t){return n&&T(g.prototype,n),t&&T(g,t),g}}(),v=$e(),o=V(v),b=Ee(),d=V(b),S=Ve(),m=Ie(),l=V(m),c=Je(),h=V(c),w=Ke(),y=V(w),A=Qe(),F=V(A),j=et(),G=V(j),Re=tt(),X=V(Re),_=rt(),N=nt();function V(T){return T&&T.__esModule?T:{default:T}}function xe(T,g){var n={};for(var t in T)g.indexOf(t)>=0||Object.prototype.hasOwnProperty.call(T,t)&&(n[t]=T[t]);return n}function Ce(T,g){if(!(T instanceof g))throw new TypeError("Cannot call a class as a function")}function Oe(T,g){if(!T)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return g&&(typeof g=="object"||typeof g=="function")?g:T}function qe(T,g){if(typeof g!="function"&&g!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof g);T.prototype=Object.create(g&&g.prototype,{constructor:{value:T,enumerable:!1,writable:!0,configurable:!0}}),g&&(Object.setPrototypeOf?Object.setPrototypeOf(T,g):T.__proto__=g)}var Y=function(T){qe(g,T);function g(n){var t;Ce(this,g);for(var r=arguments.length,i=Array(r>1?r-1:0),f=1;f<r;f++)i[f-1]=arguments[f];var e=Oe(this,(t=g.__proto__||Object.getPrototypeOf(g)).call.apply(t,[this,n].concat(i)));return e.getScrollLeft=e.getScrollLeft.bind(e),e.getScrollTop=e.getScrollTop.bind(e),e.getScrollWidth=e.getScrollWidth.bind(e),e.getScrollHeight=e.getScrollHeight.bind(e),e.getClientWidth=e.getClientWidth.bind(e),e.getClientHeight=e.getClientHeight.bind(e),e.getValues=e.getValues.bind(e),e.getThumbHorizontalWidth=e.getThumbHorizontalWidth.bind(e),e.getThumbVerticalHeight=e.getThumbVerticalHeight.bind(e),e.getScrollLeftForOffset=e.getScrollLeftForOffset.bind(e),e.getScrollTopForOffset=e.getScrollTopForOffset.bind(e),e.scrollLeft=e.scrollLeft.bind(e),e.scrollTop=e.scrollTop.bind(e),e.scrollToLeft=e.scrollToLeft.bind(e),e.scrollToTop=e.scrollToTop.bind(e),e.scrollToRight=e.scrollToRight.bind(e),e.scrollToBottom=e.scrollToBottom.bind(e),e.handleTrackMouseEnter=e.handleTrackMouseEnter.bind(e),e.handleTrackMouseLeave=e.handleTrackMouseLeave.bind(e),e.handleHorizontalTrackMouseDown=e.handleHorizontalTrackMouseDown.bind(e),e.handleVerticalTrackMouseDown=e.handleVerticalTrackMouseDown.bind(e),e.handleHorizontalThumbMouseDown=e.handleHorizontalThumbMouseDown.bind(e),e.handleVerticalThumbMouseDown=e.handleVerticalThumbMouseDown.bind(e),e.handleWindowResize=e.handleWindowResize.bind(e),e.handleScroll=e.handleScroll.bind(e),e.handleDrag=e.handleDrag.bind(e),e.handleDragEnd=e.handleDragEnd.bind(e),e.state={didMountUniversal:!1},e}return s(g,[{key:"componentDidMount",value:function(){this.addListeners(),this.update(),this.componentDidMountUniversal()}},{key:"componentDidMountUniversal",value:function(){var t=this.props.universal;t&&this.setState({didMountUniversal:!0})}},{key:"componentDidUpdate",value:function(){this.update()}},{key:"componentWillUnmount",value:function(){this.removeListeners(),(0,v.cancel)(this.requestFrame),clearTimeout(this.hideTracksTimeout),clearInterval(this.detectScrollingInterval)}},{key:"getScrollLeft",value:function(){return this.view?this.view.scrollLeft:0}},{key:"getScrollTop",value:function(){return this.view?this.view.scrollTop:0}},{key:"getScrollWidth",value:function(){return this.view?this.view.scrollWidth:0}},{key:"getScrollHeight",value:function(){return this.view?this.view.scrollHeight:0}},{key:"getClientWidth",value:function(){return this.view?this.view.clientWidth:0}},{key:"getClientHeight",value:function(){return this.view?this.view.clientHeight:0}},{key:"getValues",value:function(){var t=this.view||{},r=t.scrollLeft,i=r===void 0?0:r,f=t.scrollTop,e=f===void 0?0:f,p=t.scrollWidth,H=p===void 0?0:p,k=t.scrollHeight,E=k===void 0?0:k,z=t.clientWidth,R=z===void 0?0:z,M=t.clientHeight,W=M===void 0?0:M;return{left:i/(H-R)||0,top:e/(E-W)||0,scrollLeft:i,scrollTop:e,scrollWidth:H,scrollHeight:E,clientWidth:R,clientHeight:W}}},{key:"getThumbHorizontalWidth",value:function(){var t=this.props,r=t.thumbSize,i=t.thumbMinSize,f=this.view,e=f.scrollWidth,p=f.clientWidth,H=(0,G.default)(this.trackHorizontal),k=Math.ceil(p/e*H);return H<=k?0:r||Math.max(k,i)}},{key:"getThumbVerticalHeight",value:function(){var t=this.props,r=t.thumbSize,i=t.thumbMinSize,f=this.view,e=f.scrollHeight,p=f.clientHeight,H=(0,X.default)(this.trackVertical),k=Math.ceil(p/e*H);return H<=k?0:r||Math.max(k,i)}},{key:"getScrollLeftForOffset",value:function(t){var r=this.view,i=r.scrollWidth,f=r.clientWidth,e=(0,G.default)(this.trackHorizontal),p=this.getThumbHorizontalWidth();return t/(e-p)*(i-f)}},{key:"getScrollTopForOffset",value:function(t){var r=this.view,i=r.scrollHeight,f=r.clientHeight,e=(0,X.default)(this.trackVertical),p=this.getThumbVerticalHeight();return t/(e-p)*(i-f)}},{key:"scrollLeft",value:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;this.view&&(this.view.scrollLeft=t)}},{key:"scrollTop",value:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;this.view&&(this.view.scrollTop=t)}},{key:"scrollToLeft",value:function(){this.view&&(this.view.scrollLeft=0)}},{key:"scrollToTop",value:function(){this.view&&(this.view.scrollTop=0)}},{key:"scrollToRight",value:function(){this.view&&(this.view.scrollLeft=this.view.scrollWidth)}},{key:"scrollToBottom",value:function(){this.view&&(this.view.scrollTop=this.view.scrollHeight)}},{key:"addListeners",value:function(){if(!(typeof document>"u"||!this.view)){var t=this.view,r=this.trackHorizontal,i=this.trackVertical,f=this.thumbHorizontal,e=this.thumbVertical;t.addEventListener("scroll",this.handleScroll),(0,y.default)()&&(r.addEventListener("mouseenter",this.handleTrackMouseEnter),r.addEventListener("mouseleave",this.handleTrackMouseLeave),r.addEventListener("mousedown",this.handleHorizontalTrackMouseDown),i.addEventListener("mouseenter",this.handleTrackMouseEnter),i.addEventListener("mouseleave",this.handleTrackMouseLeave),i.addEventListener("mousedown",this.handleVerticalTrackMouseDown),f.addEventListener("mousedown",this.handleHorizontalThumbMouseDown),e.addEventListener("mousedown",this.handleVerticalThumbMouseDown),window.addEventListener("resize",this.handleWindowResize))}}},{key:"removeListeners",value:function(){if(!(typeof document>"u"||!this.view)){var t=this.view,r=this.trackHorizontal,i=this.trackVertical,f=this.thumbHorizontal,e=this.thumbVertical;t.removeEventListener("scroll",this.handleScroll),(0,y.default)()&&(r.removeEventListener("mouseenter",this.handleTrackMouseEnter),r.removeEventListener("mouseleave",this.handleTrackMouseLeave),r.removeEventListener("mousedown",this.handleHorizontalTrackMouseDown),i.removeEventListener("mouseenter",this.handleTrackMouseEnter),i.removeEventListener("mouseleave",this.handleTrackMouseLeave),i.removeEventListener("mousedown",this.handleVerticalTrackMouseDown),f.removeEventListener("mousedown",this.handleHorizontalThumbMouseDown),e.removeEventListener("mousedown",this.handleVerticalThumbMouseDown),window.removeEventListener("resize",this.handleWindowResize),this.teardownDragging())}}},{key:"handleScroll",value:function(t){var r=this,i=this.props,f=i.onScroll,e=i.onScrollFrame;f&&f(t),this.update(function(p){var H=p.scrollLeft,k=p.scrollTop;r.viewScrollLeft=H,r.viewScrollTop=k,e&&e(p)}),this.detectScrolling()}},{key:"handleScrollStart",value:function(){var t=this.props.onScrollStart;t&&t(),this.handleScrollStartAutoHide()}},{key:"handleScrollStartAutoHide",value:function(){var t=this.props.autoHide;t&&this.showTracks()}},{key:"handleScrollStop",value:function(){var t=this.props.onScrollStop;t&&t(),this.handleScrollStopAutoHide()}},{key:"handleScrollStopAutoHide",value:function(){var t=this.props.autoHide;t&&this.hideTracks()}},{key:"handleWindowResize",value:function(){(0,y.default)(!1),this.forceUpdate()}},{key:"handleHorizontalTrackMouseDown",value:function(t){t.preventDefault();var r=t.target,i=t.clientX,f=r.getBoundingClientRect(),e=f.left,p=this.getThumbHorizontalWidth(),H=Math.abs(e-i)-p/2;this.view.scrollLeft=this.getScrollLeftForOffset(H)}},{key:"handleVerticalTrackMouseDown",value:function(t){t.preventDefault();var r=t.target,i=t.clientY,f=r.getBoundingClientRect(),e=f.top,p=this.getThumbVerticalHeight(),H=Math.abs(e-i)-p/2;this.view.scrollTop=this.getScrollTopForOffset(H)}},{key:"handleHorizontalThumbMouseDown",value:function(t){t.preventDefault(),this.handleDragStart(t);var r=t.target,i=t.clientX,f=r.offsetWidth,e=r.getBoundingClientRect(),p=e.left;this.prevPageX=f-(i-p)}},{key:"handleVerticalThumbMouseDown",value:function(t){t.preventDefault(),this.handleDragStart(t);var r=t.target,i=t.clientY,f=r.offsetHeight,e=r.getBoundingClientRect(),p=e.top;this.prevPageY=f-(i-p)}},{key:"setupDragging",value:function(){(0,d.default)(document.body,_.disableSelectStyle),document.addEventListener("mousemove",this.handleDrag),document.addEventListener("mouseup",this.handleDragEnd),document.onselectstart=F.default}},{key:"teardownDragging",value:function(){(0,d.default)(document.body,_.disableSelectStyleReset),document.removeEventListener("mousemove",this.handleDrag),document.removeEventListener("mouseup",this.handleDragEnd),document.onselectstart=void 0}},{key:"handleDragStart",value:function(t){this.dragging=!0,t.stopImmediatePropagation(),this.setupDragging()}},{key:"handleDrag",value:function(t){if(this.prevPageX){var r=t.clientX,i=this.trackHorizontal.getBoundingClientRect(),f=i.left,e=this.getThumbHorizontalWidth(),p=e-this.prevPageX,H=-f+r-p;this.view.scrollLeft=this.getScrollLeftForOffset(H)}if(this.prevPageY){var k=t.clientY,E=this.trackVertical.getBoundingClientRect(),z=E.top,R=this.getThumbVerticalHeight(),M=R-this.prevPageY,W=-z+k-M;this.view.scrollTop=this.getScrollTopForOffset(W)}return!1}},{key:"handleDragEnd",value:function(){this.dragging=!1,this.prevPageX=this.prevPageY=0,this.teardownDragging(),this.handleDragEndAutoHide()}},{key:"handleDragEndAutoHide",value:function(){var t=this.props.autoHide;t&&this.hideTracks()}},{key:"handleTrackMouseEnter",value:function(){this.trackMouseOver=!0,this.handleTrackMouseEnterAutoHide()}},{key:"handleTrackMouseEnterAutoHide",value:function(){var t=this.props.autoHide;t&&this.showTracks()}},{key:"handleTrackMouseLeave",value:function(){this.trackMouseOver=!1,this.handleTrackMouseLeaveAutoHide()}},{key:"handleTrackMouseLeaveAutoHide",value:function(){var t=this.props.autoHide;t&&this.hideTracks()}},{key:"showTracks",value:function(){clearTimeout(this.hideTracksTimeout),(0,d.default)(this.trackHorizontal,{opacity:1}),(0,d.default)(this.trackVertical,{opacity:1})}},{key:"hideTracks",value:function(){var t=this;if(!this.dragging&&!this.scrolling&&!this.trackMouseOver){var r=this.props.autoHideTimeout;clearTimeout(this.hideTracksTimeout),this.hideTracksTimeout=setTimeout(function(){(0,d.default)(t.trackHorizontal,{opacity:0}),(0,d.default)(t.trackVertical,{opacity:0})},r)}}},{key:"detectScrolling",value:function(){var t=this;this.scrolling||(this.scrolling=!0,this.handleScrollStart(),this.detectScrollingInterval=setInterval(function(){t.lastViewScrollLeft===t.viewScrollLeft&&t.lastViewScrollTop===t.viewScrollTop&&(clearInterval(t.detectScrollingInterval),t.scrolling=!1,t.handleScrollStop()),t.lastViewScrollLeft=t.viewScrollLeft,t.lastViewScrollTop=t.viewScrollTop},100))}},{key:"raf",value:function(t){var r=this;this.requestFrame&&o.default.cancel(this.requestFrame),this.requestFrame=(0,o.default)(function(){r.requestFrame=void 0,t()})}},{key:"update",value:function(t){var r=this;this.raf(function(){return r._update(t)})}},{key:"_update",value:function(t){var r=this.props,i=r.onUpdate,f=r.hideTracksWhenNotNeeded,e=this.getValues();if((0,y.default)()){var p=e.scrollLeft,H=e.clientWidth,k=e.scrollWidth,E=(0,G.default)(this.trackHorizontal),z=this.getThumbHorizontalWidth(),R=p/(k-H)*(E-z),M={width:z,transform:"translateX("+R+"px)"},W=e.scrollTop,x=e.clientHeight,C=e.scrollHeight,Z=(0,X.default)(this.trackVertical),$=this.getThumbVerticalHeight(),J=W/(C-x)*(Z-$),P={height:$,transform:"translateY("+J+"px)"};if(f){var K={visibility:k>H?"visible":"hidden"},Q={visibility:C>x?"visible":"hidden"};(0,d.default)(this.trackHorizontal,K),(0,d.default)(this.trackVertical,Q)}(0,d.default)(this.thumbHorizontal,M),(0,d.default)(this.thumbVertical,P)}i&&i(e),typeof t=="function"&&t(e)}},{key:"render",value:function(){var t=this,r=(0,y.default)(),i=this.props;i.onScroll,i.onScrollFrame,i.onScrollStart,i.onScrollStop,i.onUpdate;var f=i.renderView,e=i.renderTrackHorizontal,p=i.renderTrackVertical,H=i.renderThumbHorizontal,k=i.renderThumbVertical,E=i.tagName;i.hideTracksWhenNotNeeded;var z=i.autoHide;i.autoHideTimeout;var R=i.autoHideDuration;i.thumbSize,i.thumbMinSize;var M=i.universal,W=i.autoHeight,x=i.autoHeightMin,C=i.autoHeightMax,Z=i.style,$=i.children,J=xe(i,["onScroll","onScrollFrame","onScrollStart","onScrollStop","onUpdate","renderView","renderTrackHorizontal","renderTrackVertical","renderThumbHorizontal","renderThumbVertical","tagName","hideTracksWhenNotNeeded","autoHide","autoHideTimeout","autoHideDuration","thumbSize","thumbMinSize","universal","autoHeight","autoHeightMin","autoHeightMax","style","children"]),P=this.state.didMountUniversal,K=u({},_.containerStyleDefault,W&&u({},_.containerStyleAutoHeight,{minHeight:x,maxHeight:C}),Z),Q=u({},_.viewStyleDefault,{marginRight:r?-r:0,marginBottom:r?-r:0},W&&u({},_.viewStyleAutoHeight,{minHeight:(0,h.default)(x)?"calc("+x+" + "+r+"px)":x+r,maxHeight:(0,h.default)(C)?"calc("+C+" + "+r+"px)":C+r}),W&&M&&!P&&{minHeight:x,maxHeight:C},M&&!P&&_.viewStyleUniversalInitial),he={transition:"opacity "+R+"ms",opacity:0},Fe=u({},_.trackHorizontalStyleDefault,z&&he,(!r||M&&!P)&&{display:"none"}),Pe=u({},_.trackVerticalStyleDefault,z&&he,(!r||M&&!P)&&{display:"none"});return(0,S.createElement)(E,u({},J,{style:K,ref:function(L){t.container=L}}),[(0,S.cloneElement)(f({style:Q}),{key:"view",ref:function(L){t.view=L}},$),(0,S.cloneElement)(e({style:Fe}),{key:"trackHorizontal",ref:function(L){t.trackHorizontal=L}},(0,S.cloneElement)(H({style:_.thumbHorizontalStyleDefault}),{ref:function(L){t.thumbHorizontal=L}})),(0,S.cloneElement)(p({style:Pe}),{key:"trackVertical",ref:function(L){t.trackVertical=L}},(0,S.cloneElement)(k({style:_.thumbVerticalStyleDefault}),{ref:function(L){t.thumbVertical=L}}))])}}]),g}(S.Component);a.default=Y,Y.propTypes={onScroll:l.default.func,onScrollFrame:l.default.func,onScrollStart:l.default.func,onScrollStop:l.default.func,onUpdate:l.default.func,renderView:l.default.func,renderTrackHorizontal:l.default.func,renderTrackVertical:l.default.func,renderThumbHorizontal:l.default.func,renderThumbVertical:l.default.func,tagName:l.default.string,thumbSize:l.default.number,thumbMinSize:l.default.number,hideTracksWhenNotNeeded:l.default.bool,autoHide:l.default.bool,autoHideTimeout:l.default.number,autoHideDuration:l.default.number,autoHeight:l.default.bool,autoHeightMin:l.default.oneOfType([l.default.number,l.default.string]),autoHeightMax:l.default.oneOfType([l.default.number,l.default.string]),universal:l.default.bool,style:l.default.object,children:l.default.node},Y.defaultProps={renderView:N.renderViewDefault,renderTrackHorizontal:N.renderTrackHorizontalDefault,renderTrackVertical:N.renderTrackVerticalDefault,renderThumbHorizontal:N.renderThumbHorizontalDefault,renderThumbVertical:N.renderThumbVerticalDefault,tagName:"div",thumbMinSize:30,hideTracksWhenNotNeeded:!1,autoHide:!1,autoHideTimeout:1e3,autoHideDuration:200,autoHeight:!1,autoHeightMin:0,autoHeightMax:200,universal:!1}}(te)),te}var We;function at(){return We||(We=1,function(a){Object.defineProperty(a,"__esModule",{value:!0}),a.Scrollbars=void 0;var u=it(),s=v(u);function v(o){return o&&o.__esModule?o:{default:o}}a.default=s.default,a.Scrollbars=s.default}(ee)),ee}var ot=at();const lt=Ne.forwardRef((a,u)=>{const{direction:s="ltr",...v}=a;return fe.jsx(ot.Scrollbars,{ref:u,renderView:o=>fe.jsx("div",{...o,style:{...o.style,...s==="rtl"&&{marginLeft:o.style.marginRight,marginRight:0}}}),...v})});lt.displayName="ScrollBar";export{lt as S};
