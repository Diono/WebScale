/**
 * WebScale v0.1.18
 *
 * @author Diono CORBEL  http://www.diono.fr/
 * DEMO : http://www.dionoportfolio.com/WebScale/
 */
"use strict";(function(e,t){var n=e.document,r=typeof function(){},i=typeof "a",s=typeof {},o=typeof 1,u=["","-khtml-","-moz-","-ms-","-o-","-webkit-"],a=u.length,f=null,l=null,c=function(){f=h("transform");l=h("transform-origin");if(e.console&&typeof e.console.log===r)e.console.log('[WebScale] available css3 properties : "'+f+'" and "'+l+'"')},h=function(e,r,i){i=i?i:0;var s=u[i]+e,o=t;if(n.body.style)o=n.body.style[s];if(o===t){s=null;if(!r){var s=u[i].replace("-","")+"-"+e,f=s.split("-"),l=f.length;if(l>0){s="";for(var c=0;c<l;c++){s+=f[c].charAt(0).toUpperCase();s+=f[c].slice(1)}s=s.replace(/^-/,"");var p=h(s,true,i);if(!p)p=h(s.charAt(0).toLowerCase()+s.slice(1),true,i);s=p}else s=null;i++;if(!s&&i<a)s=h(e,false,i)}}return s},p=function(e,i,s){if(e&&typeof s===r){(function(e,r,i,s){var o=function(t){s.call(e,t)};if(r.addEventListener)r.addEventListener(i,o,false);else if(r.attachEvent)r.attachEvent("on"+i,o);else{var u=i.toLowerCase(),a=i.charAt(0).toUpperCase()+i.slice(1).toLowerCase();switch(u){case"keydown":r.setAttribute("onKeydown","return "+s.toString());if(n.all)r.onkeydown=o;else r.onKeydown=o;break;case"keypress":r.setAttribute("onKeypress","return "+s.toString());if(n.all)r.onkeypress=o;else r.onKeypress=o;break;case"keyup":r.setAttribute("onKeyup","return "+s.toString());if(n.all)r.onkeyup=o;else r.onKeyup=o;break;case"unload":r.setAttribute("unload","return "+s.toString());r.unload=o;break;default:if(r["on"+u]!==t)r["on"+u]=o;else if(r["on"+i]!==t)r["on"+i]=o;else if(r["on"+a]!==t)r["on"+a]=o;break}}})(this,v(e),i,s)}return this},d=function(e,t){var n=0;if(typeof e===o)n=e;else if(typeof e===i){if(/^[0-9]+([\.,][0-9]+)?%$/.test(e)&&typeof t===o)n=(t*parseFloat(e.replace(",","."))/100<<0)+1;else if(/^[0-9]+(px)?$/.test(e))n=(parseFloat(e)<<0)+1}return n},v=function(e){var t=null;switch(typeof e){case i:t=n.getElementById(e);break;case s:var r=e.nodeName;if(r&&(!r.match(/#/gi)||r.match(/#document/gi))||e.document)t=e;break}return t},m=["reduce","enlarge","unlockWidth","unlockHeight","unlockTop","unlockLeft","bodyOffsetWidth","bodyOffsetHeight","minWidth","minHeight","maxWidth","maxHeight","top","offsetTop","left","offsetLeft"],g=m.length,y=function(r,i){i=i?i:{};this.$content=v(r);this.$body=i.body?v(i.body):n.body;for(var s=0;s<g;s++){this[m[s]]=i[m[s]]!==t?i[m[s]]:this[m[s]]}if(i.auto){p.call(this,e,"resize",this.responsive);p.call(this,e.document,"resize",this.responsive);p.call(this,e.document.body,"resize",this.responsive)}this.available=this.responsive();return this},b=function(e,t){return new y(e,t)};y.prototype={available:false,$body:null,bodyWidth:0,bodyHeight:0,bodyOffsetWidth:0,bodyOffsetHeight:0,$content:null,minWidth:0,minHeight:0,maxWidth:0,maxHeight:0,top:0,left:0,offsetTop:0,offsetLeft:0,unlockWidth:false,unlockHeight:false,unlockTop:true,unlockLeft:true,reduce:true,enlarge:true,responsive:function(){if(this.$content){var e=0,t=0,n=false;if(this.$body){e=this.$body.offsetWidth||this.$body.clientWidth;t=this.$body.offsetHeight||this.$body.offsetHeight;e-=this.bodyOffsetWidth;t-=this.bodyOffsetHeight}if(e!==this.bodyWidth||t!==this.bodyHeight){this.bodyWidth=e;this.bodyHeight=t;var r=d(this.minWidth,e),i=d(this.minHeight,t),s=d(this.maxWidth,e),o=d(this.maxHeight,t);r=r>0?r:s>0?s:e;i=i>0?i:o>0?o:t;s=s>0?s:r>0?r:e;o=o>0?o:i>0?i:t;var u=e<r?e/r:e>s?e/s:1,a=t<i?t/i:t>o?t/o:1,c=Math.min(u,a);c=c<1&&this.reduce||c>1&&this.enlarge?c:1;var h=Math.max(Math.min(e,s),r),p=Math.max(Math.min(t,o),i);if(f){this.$content.style[f]="scale("+c+")";if(l)this.$content.style[l]="0 0";n=true}if(this.unlockWidth)this.$content.style.width=(e<r?Math.ceil(e/c):Math.ceil(h/c))+"px";if(this.unlockHeight)this.$content.style.height=(t<i?Math.ceil(t/c):Math.ceil(p/c))+"px";if(this.unlockTop){var v=0;if(/^(top|center|bottom)$/.test(this.top)){v=this.top=="top"?0:this.top=="center"?(t-p*c)/2:t-p*c}else{v=d(this.top)}this.$content.style.top=(v-this.offsetTop*c<<0)+1+"px"}if(this.unlockLeft){var m=0;if(/^(left|center|right)$/.test(this.left)){m=this.left=="left"?0:this.left=="center"?(e-h*c)/2:e-h*c}else{m=d(this.left)}this.$content.style.left=(m-this.offsetLeft*c<<0)+1+"px"}}}return n}};c();e.WebScale=b})(window)
