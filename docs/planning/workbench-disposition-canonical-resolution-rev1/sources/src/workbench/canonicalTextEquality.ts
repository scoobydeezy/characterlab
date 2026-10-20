import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {canonicalTextChunks} from './canonicalTextStream';
/** Exact readable-text equality without joining complete strings. Canonical byte equality differs for signed/unsigned values. */
export function equalCanonicalText(a:CanonicalValue,b:CanonicalValue){
 const left=canonicalTextChunks(a),right=canonicalTextChunks(b);let x=left.next(),y=right.next(),i=0,j=0;
 while(true){while(!x.done&&i===x.value.length){x=left.next();i=0;}while(!y.done&&j===y.value.length){y=right.next();j=0;}if(x.done||y.done)return !!x.done&&!!y.done;const n=Math.min(x.value.length-i,y.value.length-j);for(let k=0;k<n;k++)if(x.value.charCodeAt(i+k)!==y.value.charCodeAt(j+k))return false;i+=n;j+=n;}
}
