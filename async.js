self.uhtml=function(e){"use strict";const{isArray:t}=Array,n=(e,r)=>{const s=[];for(const{length:l}=e;r<l;r++)s.push(t(e[r])?n(e[r],0):e[r]);return Promise.all(s)};var r=e=>{function t(t,n){return e.apply(this,[t].concat(n))}return function(e){return n(arguments,1).then(t.bind(this,e))}},s=e=>({get:t=>e.get(t),set:(t,n)=>(e.set(t,n),n)});const l=/([^\s\\>"'=]+)\s*=\s*(['"]?)$/,o=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,i=/<[a-z][^>]+$/i,a=/>[^<>]*$/,c=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/gi,u=/\s+$/,d=(e,t)=>0<t--&&(i.test(e[t])||!a.test(e[t])&&d(e,t)),p=(e,t,n)=>o.test(t)?e:`<${t}${n.replace(u,"")}></${t}>`;const{isArray:f}=Array,{indexOf:h,slice:m}=[],g=(e,t)=>111===e.nodeType?1/t<0?t?(({firstChild:e,lastChild:t})=>{const n=document.createRange();return n.setStartAfter(e),n.setEndAfter(t),n.deleteContents(),e})(e):e.lastChild:t?e.valueOf():e.firstChild:e;const v=(e,t)=>{let n,r,s=t.slice(2);return!(t in e)&&(r=t.toLowerCase())in e&&(s=r.slice(2)),t=>{const r=f(t)?t:[t,!1];n!==r[0]&&(n&&e.removeEventListener(s,n,r[1]),(n=r[0])&&e.addEventListener(s,n,r[1]))}},y=({childNodes:e},t)=>e[t],b=(e,t,n)=>((e,t,n,r,s)=>{const l=n.length;let o=t.length,i=l,a=0,c=0,u=null;for(;a<o||c<i;)if(o===a){const t=i<l?c?r(n[c-1],-0).nextSibling:r(n[i-c],0):s;for(;c<i;)e.insertBefore(r(n[c++],1),t)}else if(i===c)for(;a<o;)u&&u.has(t[a])||e.removeChild(r(t[a],-1)),a++;else if(t[a]===n[c])a++,c++;else if(t[o-1]===n[i-1])o--,i--;else if(t[a]===n[i-1]&&n[c]===t[o-1]){const s=r(t[--o],-1).nextSibling;e.insertBefore(r(n[c++],1),r(t[a++],-1).nextSibling),e.insertBefore(r(n[--i],1),s),t[o]=n[i]}else{if(!u){u=new Map;let e=c;for(;e<i;)u.set(n[e],e++)}if(u.has(t[a])){const s=u.get(t[a]);if(c<s&&s<i){let l=a,d=1;for(;++l<o&&l<i&&u.get(t[l])===s+d;)d++;if(d>s-c){const l=r(t[a],0);for(;c<s;)e.insertBefore(r(n[c++],1),l)}else e.replaceChild(r(n[c++],1),r(t[a++],-1))}else a++}else e.removeChild(r(t[a++],-1))}return n})(e.parentNode,t,n,g,e),w=(e,t)=>{switch(t[0]){case"?":return((e,t,n)=>r=>{n!==!!r&&((n=!!r)?e.setAttribute(t,""):e.removeAttribute(t))})(e,t.slice(1),!1);case".":return((e,t)=>"dataset"===t?(({dataset:e})=>t=>{for(const n in t){const r=t[n];null==r?delete e[n]:e[n]=r}})(e):n=>{e[t]=n})(e,t.slice(1));case"@":return v(e,"on"+t.slice(1));case"o":if("n"===t[1])return v(e,t)}switch(t){case"ref":return(e=>{let t;return n=>{t!==n&&(t=n,"function"==typeof n?n(e):n.current=e)}})(e);case"aria":return(e=>t=>{for(const n in t){const r="role"===n?n:`aria-${n}`,s=t[n];null==s?e.removeAttribute(r):e.setAttribute(r,s)}})(e)}return((e,t)=>{let n,r=!0;const s=document.createAttributeNS(null,t);return t=>{if(n!==t)if(n=t,null==n)r||(e.removeAttributeNode(s),r=!0);else{const n=t;null==n?(r||e.removeAttributeNode(s),r=!0):(s.value=n,r&&(e.setAttributeNodeNS(s),r=!1))}}})(e,t)};function N(e){const{type:t,path:n}=e,r=n.reduceRight(y,this);return"node"===t?(e=>{let t,n,r=[];const s=l=>{switch(typeof l){case"string":case"number":case"boolean":t!==l&&(t=l,n||(n=document.createTextNode("")),n.data=l,r=b(e,r,[n]));break;case"object":case"undefined":if(null==l){t!=l&&(t=l,r=b(e,r,[]));break}if(f(l)){t=l,0===l.length?r=b(e,r,[]):"object"==typeof l[0]?r=b(e,r,l):s(String(l));break}t!==l&&"ELEMENT_NODE"in l&&(t=l,r=b(e,r,11===l.nodeType?m.call(l.childNodes):[l]));break;case"function":s(l(e))}};return s})(r):"attr"===t?w(r,e.name):(e=>{let t;return n=>{t!=n&&(t=n,e.textContent=null==n?"":n)}})(r)}const $="http://www.w3.org/",x=e=>document.createElementNS($+"1999/xhtml",e),k=(e,t)=>("svg"===t?A:C)(e),C=e=>{const t=x("template");return t.innerHTML=e,t.content},A=e=>{const{content:t}=x("template"),n=x("div");n.innerHTML='<svg xmlns="'+$+'2000/svg">'+e+"</svg>";const{childNodes:r}=n.firstChild;let{length:s}=r;for(;s--;)t.appendChild(r[0]);return t},E=1!=document.importNode.length,T=E?(e,t,n)=>document.importNode(k(e,t),!0):k,M=E?e=>document.createTreeWalker(e,129,null,!1):e=>document.createTreeWalker(e,129),O=e=>{const t=[];let{parentNode:n}=e;for(;n;)t.push(h.call(n.childNodes,e)),n=(e=n).parentNode;return t},S="isµ",L=s(new WeakMap),W=/^(?:plaintext|script|style|textarea|title|xmp)$/i,j=(e,t)=>{const n=((e,t,n)=>{const r=[],{length:s}=e;for(let n=1;n<s;n++){const s=e[n-1];r.push(l.test(s)&&d(e,n)?s.replace(l,((e,r,s)=>`${t}${n-1}=${s||'"'}${r}${s?"":'"'}`)):`${s}\x3c!--${t}${n-1}--\x3e`)}r.push(e[s-1]);const o=r.join("").trim();return n?o:o.replace(c,p)})(t,S,"svg"===e),r=T(n,e),s=M(r),o=[],i=t.length-1;let a=0,u=`isµ${a}`;for(;a<i;){const e=s.nextNode();if(!e)throw`bad template: ${n}`;if(8===e.nodeType)e.data===u&&(o.push({type:"node",path:O(e)}),u="isµ"+ ++a);else{for(;e.hasAttribute(u);)o.push({type:"attr",path:O(e),name:e.getAttribute(u)}),e.removeAttribute(u),u="isµ"+ ++a;W.test(e.tagName)&&e.textContent.trim()===`\x3c!--${u}--\x3e`&&(e.textContent="",o.push({type:"text",path:O(e)}),u="isµ"+ ++a)}}return{content:r,nodes:o}},B=(e,t)=>{const{content:n,nodes:r}=L.get(t)||L.set(t,j(e,t)),s=document.importNode(n,!0);return{content:s,updates:r.map(N,s)}},P=(e,{type:t,template:n,values:r})=>{const{length:s}=r;z(e,r,s);let{entry:l}=e;l&&l.template===n&&l.type===t||(e.entry=l=((e,t)=>{const{content:n,updates:r}=B(e,t);return{type:e,template:t,content:n,updates:r,wire:null}})(t,n));const{content:o,updates:i,wire:a}=l;for(let e=0;e<s;e++)i[e](r[e]);return a||(l.wire=(e=>{const{childNodes:t}=e,{length:n}=t;if(n<2)return n?t[0]:e;const r=m.call(t,0);return{ELEMENT_NODE:1,nodeType:111,firstChild:r[0],lastChild:r[n-1],valueOf(){if(t.length!==n){let t=0;for(;t<n;)e.appendChild(r[t++])}return e}}})(o))},z=({stack:e},t,n)=>{for(let r=0;r<n;r++){const n=t[r];n instanceof H?t[r]=P(e[r]||(e[r]={stack:[],entry:null,wire:null}),n):f(n)?z(e[r]||(e[r]={stack:[],entry:null,wire:null}),n,n.length):e[r]=null}n<e.length&&e.splice(n)};function H(e,t,n){this.type=e,this.template=t,this.values=n}const{create:_,defineProperties:D}=Object,R=e=>{const t=s(new WeakMap);return D(((t,...n)=>new H(e,t,n)),{for:{value(n,r){const s=t.get(n)||t.set(n,_(null));return s[r]||(s[r]=(t=>(n,...r)=>P(t,{type:e,template:n,values:r}))({stack:[],entry:null,wire:null}))}},node:{value:(t,...n)=>P({stack:[],entry:null,wire:null},{type:e,template:t,values:n}).valueOf()}})},q=s(new WeakMap),F=R("html"),G=R("svg"),{defineProperties:I}=Object,J=e=>{const t=s(new WeakMap);return I(r(e),{for:{value(n,s){const l=e.for(n,s);return t.get(l)||t.set(l,r(l))}},node:{value:r(e.node)}})},K=J(F),Q=J(G);return e.Hole=H,e.html=K,e.render=(e,t)=>{const n="function"==typeof t?t():t;return Promise.resolve(n).then((t=>((e,t)=>{const n="function"==typeof t?t():t,r=q.get(e)||q.set(e,{stack:[],entry:null,wire:null}),s=n instanceof H?P(r,n):n;return s!==r.wire&&(r.wire=s,e.textContent="",e.appendChild(s.valueOf())),e})(e,t)))},e.svg=Q,e}({});
