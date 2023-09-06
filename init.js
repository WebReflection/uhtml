class e extends WeakMap{set(e,t){return super.set(e,t),t}}
/*! (c) Andrea Giammarchi - ISC */const t=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,n=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/?)>/g,r=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,s=/[\x01\x02]/g;var l=({document:l})=>{const{isArray:o,prototype:a}=Array,{indexOf:i}=a,{createDocumentFragment:c,createElement:u,createElementNS:d,createTextNode:p,createTreeWalker:f,importNode:h}=new Proxy({},{get:(e,t)=>l[t].bind(l)});let g;const m=(e,t)=>t?(e=>{g||(g=d("http://www.w3.org/2000/svg","svg")),g.innerHTML=e;const t=c();return t.append(...g.childNodes),t})(e):(e=>{const t=u("template");return t.innerHTML=e,t.content})(e),y=(e,t)=>111===e.nodeType?1/t<0?t?(({firstChild:e,lastChild:t})=>{const n=l.createRange();return n.setStartAfter(e),n.setEndAfter(t),n.deleteContents(),e})(e):e.lastChild:t?e.valueOf():e.firstChild:e,b=e=>null==e?e:e.valueOf(),w=(e,t)=>{let n,r,s=t.slice(2);return!(t in e)&&(r=t.toLowerCase())in e&&(s=r.slice(2)),t=>{const r=o(t)?t:[t,!1];n!==r[0]&&(n&&e.removeEventListener(s,n,r[1]),(n=r[0])&&e.addEventListener(s,n,r[1]))}},v=({childNodes:e},t)=>e[t],x=(e,t,n)=>((e,t,n,r,s)=>{const l=n.length;let o=t.length,a=l,i=0,c=0,u=null;for(;i<o||c<a;)if(o===i){const t=a<l?c?r(n[c-1],-0).nextSibling:r(n[a-c],0):s;for(;c<a;)e.insertBefore(r(n[c++],1),t)}else if(a===c)for(;i<o;)u&&u.has(t[i])||e.removeChild(r(t[i],-1)),i++;else if(t[i]===n[c])i++,c++;else if(t[o-1]===n[a-1])o--,a--;else if(t[i]===n[a-1]&&n[c]===t[o-1]){const s=r(t[--o],-1).nextSibling;e.insertBefore(r(n[c++],1),r(t[i++],-1).nextSibling),e.insertBefore(r(n[--a],1),s),t[o]=n[a]}else{if(!u){u=new Map;let e=c;for(;e<a;)u.set(n[e],e++)}if(u.has(t[i])){const s=u.get(t[i]);if(c<s&&s<a){let l=i,d=1;for(;++l<o&&l<a&&u.get(t[l])===s+d;)d++;if(d>s-c){const l=r(t[i],0);for(;c<s;)e.insertBefore(r(n[c++],1),l)}else e.replaceChild(r(n[c++],1),r(t[i++],-1))}else i++}else e.removeChild(r(t[i++],-1))}return n})(e.parentNode,t,n,y,e),N=(e,t)=>{switch(t[0]){case"?":return((e,t,n)=>r=>{const s=!!b(r);n!==s&&((n=s)?e.setAttribute(t,""):e.removeAttribute(t))})(e,t.slice(1),!1);case".":return((e,t)=>"dataset"===t?(({dataset:e})=>t=>{for(const n in t){const r=t[n];null==r?delete e[n]:e[n]=r}})(e):n=>{e[t]=n})(e,t.slice(1));case"@":return w(e,"on"+t.slice(1));case"o":if("n"===t[1])return w(e,t)}switch(t){case"ref":return(e=>{let t;return n=>{t!==n&&(t=n,"function"==typeof n?n(e):n.current=e)}})(e);case"aria":return(e=>t=>{for(const n in t){const r="role"===n?n:`aria-${n}`,s=t[n];null==s?e.removeAttribute(r):e.setAttribute(r,s)}})(e)}return((e,t)=>{let n,r=!0;const s=l.createAttributeNS(null,t);return t=>{const l=b(t);n!==l&&(null==(n=l)?r||(e.removeAttributeNode(s),r=!0):(s.value=l,r&&(e.setAttributeNodeNS(s),r=!1)))}})(e,t)};function C(e){const{type:t,path:n}=e,r=n.reduceRight(v,this);return"node"===t?(e=>{let t,n,r=[];const s=l=>{switch(typeof l){case"string":case"number":case"boolean":t!==l&&(t=l,n||(n=p("")),n.data=l,r=x(e,r,[n]));break;case"object":case"undefined":if(null==l){t!=l&&(t=l,r=x(e,r,[]));break}if(o(l)){t=l,0===l.length?r=x(e,r,[]):"object"==typeof l[0]?r=x(e,r,l):s(String(l));break}if(t!==l)if("ELEMENT_NODE"in l)t=l,r=x(e,r,11===l.nodeType?[...l.childNodes]:[l]);else{const e=l.valueOf();e!==l&&s(e)}break;case"function":s(l(e))}};return s})(r):"attr"===t?N(r,e.name):(e=>{let t;return n=>{const r=b(n);t!=r&&(t=r,e.textContent=null==r?"":r)}})(r)}const k=e=>{const t=[];let{parentNode:n}=e;for(;n;)t.push(i.call(n.childNodes,e)),e=n,({parentNode:n}=e);return t},$="isµ",A=new e,E=/^(?:textarea|script|style|title|plaintext|xmp)$/,O=(e,l)=>{const o="svg"===e,a=((e,l,o)=>{let a=0;return e.join("").trim().replace(n,((e,n,s,l)=>{let a=n+s.replace(r,"=$2$1").trimEnd();return l.length&&(a+=o||t.test(n)?" /":"></"+n),"<"+a+">"})).replace(s,(e=>""===e?"\x3c!--"+l+a+++"--\x3e":l+a++))})(l,$,o),i=m(a,o),c=f(i,129),u=[],d=l.length-1;let p=0,h=`${$}${p}`;for(;p<d;){const e=c.nextNode();if(!e)throw`bad template: ${a}`;if(8===e.nodeType)e.data===h&&(u.push({type:"node",path:k(e)}),h=`${$}${++p}`);else{for(;e.hasAttribute(h);)u.push({type:"attr",path:k(e),name:e.getAttribute(h)}),e.removeAttribute(h),h=`${$}${++p}`;E.test(e.localName)&&e.textContent.trim()===`\x3c!--${h}--\x3e`&&(e.textContent="",u.push({type:"text",path:k(e)}),h=`${$}${++p}`)}}return{content:i,nodes:u}},T=(e,t)=>{const{content:n,nodes:r}=A.get(t)||A.set(t,O(e,t)),s=h(n,!0);return{content:s,updates:r.map(C,s)}},S=(e,{type:t,template:n,values:r})=>{const s=L(e,r);let{entry:l}=e;l&&l.template===n&&l.type===t||(e.entry=l=((e,t)=>{const{content:n,updates:r}=T(e,t);return{type:e,template:t,content:n,updates:r,wire:null}})(t,n));const{content:o,updates:a,wire:i}=l;for(let e=0;e<s;e++)a[e](r[e]);return i||(l.wire=(e=>{const{firstChild:t,lastChild:n}=e;if(t===n)return n||e;const{childNodes:r}=e,s=[...r];return{ELEMENT_NODE:1,nodeType:111,firstChild:t,lastChild:n,valueOf:()=>(r.length!==s.length&&e.append(...s),e)}})(o))},L=({stack:e},t)=>{const{length:n}=t;for(let r=0;r<n;r++){const n=t[r];n instanceof M?t[r]=S(e[r]||(e[r]={stack:[],entry:null,wire:null}),n):o(n)?L(e[r]||(e[r]={stack:[],entry:null,wire:null}),n):e[r]=null}return n<e.length&&e.splice(n),n};class M{constructor(e,t,n){this.type=e,this.template=t,this.values=n}}const j=t=>{const n=new e;return Object.assign(((e,...n)=>new M(t,e,n)),{for(e,r){const s=n.get(e)||n.set(e,new MapSet);return s.get(r)||s.set(r,(e=>(n,...r)=>S(e,{type:t,template:n,values:r}))({stack:[],entry:null,wire:null}))},node:(e,...n)=>S({stack:[],entry:null,wire:null},new M(t,e,n)).valueOf()})},B=new e,D=j("html"),H=j("svg");return{Hole:M,render:(e,t)=>{const n="function"==typeof t?t():t,r=B.get(e)||B.set(e,{stack:[],entry:null,wire:null}),s=n instanceof M?S(r,n):n;return s!==r.wire&&(r.wire=s,e.replaceChildren(s.valueOf())),e},html:D,svg:H}};export{l as default};