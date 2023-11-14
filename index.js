const{isArray:e}=Array,t=[],n=()=>document.createRange(),r=(e,t,n)=>(e.set(t,n),n),s=(e,t,n,r="")=>({t:e,p:t,u:n,n:r}),l=e=>({s:e,t:null,n:null,d:t}),{setPrototypeOf:o}=Object;let i;var c=(e,t,r)=>(i||(i=n()),r?i.setStartAfter(e):i.setStartBefore(e),i.setEndAfter(t),i.deleteContents(),e);const a=({firstChild:e,lastChild:t})=>c(e,t,!0);let u=!1;const h=(e,t)=>u&&11===e.nodeType?1/t<0?t?a(e):e.lastChild:t?e.valueOf():e.firstChild:e;class d extends((e=>{function t(e){return o(e,new.target.prototype)}return t.prototype=e.prototype,t})(DocumentFragment)){#e;#t;constructor(e){super(e),this.#e=[...e.childNodes],this.#t=this.#e.length,u=!0}get firstChild(){return this.#e[0]}get lastChild(){return this.#e.at(-1)}get parentNode(){return this.#e[0].parentNode}replaceWith(e){a(this).replaceWith(e)}valueOf(){return this.childNodes.length!==this.#t&&this.append(...this.#e),this}}const f=(e,t)=>t.reduceRight(p,e),p=(e,t)=>e.childNodes[t];var g=e=>(n,r)=>{const{c:s,e:l,l:o}=e(n,r),i=s.cloneNode(!0);let c,a,u=l.length,h=u?l.slice(0):t;for(;u--;){const{t:e,p:n,u:s,n:o}=l[u],d=n===a?c:c=f(i,a=n),p=8===e?s():s;h[u]={v:p(d,r[u],o,t),u:p,t:d,n:o}}return((e,t)=>({n:e,d:t}))(1===o?i.firstChild:new d(i),h)};const m=/^(?:plaintext|script|style|textarea|title|xmp)$/i,v=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,x=/<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g,b=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,$=/[\x01\x02]/g;let N;const w=(t,n,s)=>{s=s.slice(1),N||(N=new WeakMap);const l=N.get(t)||r(N,t,{});let o=l[s];return o&&o[0]&&t.removeEventListener(s,...o),o=e(n)?n:[n,!1],l[s]=o,o[0]&&t.addEventListener(s,...o),n},y=(e,t,n)=>e[n]=t,C=(e,t,n)=>y(e,t,n.slice(1)),A=(e,t)=>("function"==typeof t?t(e):t.current=e,t),W=(e,t,n)=>(null==t?e.removeAttribute(n):e.setAttribute(n,t),t),k=(e,t,n)=>(e.toggleAttribute(n.slice(1),t),t),E=(e,n,r,s)=>n.length?((e,t,n,r,s)=>{const l=n.length;let o=t.length,i=l,c=0,a=0,u=null;for(;c<o||a<i;)if(o===c){const t=i<l?a?r(n[a-1],-0).nextSibling:r(n[i-a],0):s;for(;a<i;)e.insertBefore(r(n[a++],1),t)}else if(i===a)for(;c<o;)u&&u.has(t[c])||e.removeChild(r(t[c],-1)),c++;else if(t[c]===n[a])c++,a++;else if(t[o-1]===n[i-1])o--,i--;else if(t[c]===n[i-1]&&n[a]===t[o-1]){const s=r(t[--o],-1).nextSibling;e.insertBefore(r(n[a++],1),r(t[c++],-1).nextSibling),e.insertBefore(r(n[--i],1),s),t[o]=n[i]}else{if(!u){u=new Map;let e=a;for(;e<i;)u.set(n[e],e++)}if(u.has(t[c])){const s=u.get(t[c]);if(a<s&&s<i){let l=c,h=1;for(;++l<o&&l<i&&u.get(t[l])===s+h;)h++;if(h>s-a){const l=r(t[c],0);for(;a<s;)e.insertBefore(r(n[a++],1),l)}else e.replaceChild(r(n[a++],1),r(t[c++],-1))}else c++}else e.removeChild(r(t[c++],-1))}return n})(e.parentNode,s,n,h,e):(s.length&&c(s[0],s.at(-1),!1),t),S=new Map([["aria",(e,t)=>{for(const n in t){const r=t[n],s="role"===n?n:`aria-${n}`;null==r?e.removeAttribute(s):e.setAttribute(s,r)}return t}],["class",(e,t)=>y(e,t,"className")],["data",(e,t)=>{const{dataset:n}=e;for(const e in t)null==t[e]?delete n[e]:n[e]=t[e];return t}],["ref",A],["style",(e,t)=>y(e.style,t,"cssText")]]),T=(e,t,n)=>{switch(t[0]){case".":return C;case"?":return k;case"@":return w;default:return n||"ownerSVGElement"in e?"ref"===t?A:W:S.get(t)||(t in e?y:W)}},M=(e,t)=>(e.textContent=null==t?"":t,t);function O(e,t){const n=this.n||(this.n=e);switch(typeof t){case"string":case"number":case"boolean":n!==e&&n.replaceWith(this.n=e),this.n.data=t;break;case"object":case"undefined":null==t?(this.n=e).data="":this.n=t.valueOf(),n.replaceWith(this.n)}return t}let B,j,L=document.createElement("template");var z=(e,t)=>{if(t)return B||(B=document.createElementNS("http://www.w3.org/2000/svg","svg"),j=n(),j.selectNodeContents(B)),j.createContextualFragment(e);L.innerHTML=e;const{content:r}=L;return L=L.cloneNode(!1),r};const F=e=>{const t=[];let n;for(;n=e.parentNode;)t.push(t.indexOf.call(n.childNodes,e)),e=n;return t},R=()=>O.bind({n:null}),Z=()=>E,D=(n,l,o)=>{const i=z(((e,t,n)=>{let r=0;return e.join("").trim().replace(x,((e,t,r,s)=>`<${t}${r.replace(b,"=$2$1").trimEnd()}${s?n||v.test(t)?" /":`></${t}`:""}>`)).replace($,(e=>""===e?`\x3c!--${t+r++}--\x3e`:t+r++))})(n,H,o),o);let c=t;const{length:a}=n;if(a>1){const t=document.createTreeWalker(i,129),n=[];let r=0,u=`${H}${r++}`;for(c=[];r<a;){const i=t.nextNode();if(8===i.nodeType){if(i.data===u){let t=e(l[r-1])?Z:R;t===R&&n.push(i),c.push(s(8,F(i),t)),u=`${H}${r++}`}}else{let e;for(;i.hasAttribute(u);){e||(e=F(i));const t=i.getAttribute(u);c.push(s(2,e,T(i,t,o),t)),i.removeAttribute(u),u=`${H}${r++}`}m.test(i.localName)&&i.textContent.trim()===`\x3c!--${u}--\x3e`&&(c.push(s(3,e||F(i),M)),u=`${H}${r++}`)}}for(r=0;r<n.length;r++)n[r].replaceWith(document.createTextNode(""))}const{childNodes:u}=i,h=u.length;return r(G,n,((e,t,n)=>({c:e,e:t,l:n}))(i,c,1===h&&8===u[0].nodeType?0:h))},G=new WeakMap,H="isµ";var P=e=>(t,n)=>G.get(t)||D(t,n,e);const V=g(P(!1)),_=g(P(!0)),q=(e,{s:n,t:r,v:s})=>{s.length&&e.s===t&&(e.s=[]);const l=I(e,s);if(e.t!==r){const{n:t,d:l}=(n?_:V)(r,s);e.t=r,e.n=t,e.d=l}else{const{d:t}=e;for(let e=0;e<l;e++){const n=s[e],r=t[e],{v:l}=r;if(n!==l){const{u:e,t:t,n:s}=r;r.v=e(t,n,s,l)}}}return e.n},I=({s:n},r)=>{const{length:s}=r;for(let o=0;o<s;o++){const s=r[o];s instanceof J?r[o]=q(n[o]||(n[o]=l(t)),s):e(s)?I(n[o]||(n[o]=l([])),s):n[o]=null}return s<n.length&&n.splice(s),s};class J{constructor(e,t,n){this.s=e,this.t=t,this.v=n}}const K=new WeakMap;var Q=(e,n)=>{const s=K.get(e)||r(K,e,l(t));return s.n!==q(s,"function"==typeof n?n():n)&&e.replaceChildren(s.n),e};
/*! (c) Andrea Giammarchi - MIT */const U=e=>(t,...n)=>new J(e,t,n),X=U(!1),Y=U(!0);export{J as Hole,S as attr,X as html,Q as render,Y as svg};
