import {it,expect} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {inflateSync,deflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import {canonicalEncode as enc,list,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {receivingRecord as rec,cognitiveRecord as r,decodeCognitive as decode} from '../assembled/codecs';
import {compileDescribedReasons} from '../assembled/reasons';
import {analyzeOptions} from '../assembled/configurationMath';
import {ONE,ZERO,absolute,convolve,expectation,readDistribution,readQ} from '../campaign2/cognitiveMath';
const root='docs/planning/',file=root+'ASSEMBLED_CHARACTER_M266_RECEIVING.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0)))),zip=(v:CanonicalValue)=>{const b=enc(v);return {hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')};};
const put=(k:string,v:unknown)=>{v=JSON.parse(JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x));const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(e[k])expect(e[k]).toEqual(v);else{e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}};
function probability(raw:CanonicalValue,ns:readonly CanonicalValue[],arb:CanonicalValue){const opts=items(f(rec(f(rec(raw,403n),2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));if(!opts.length)return {kind:'NoCandidates'};if(!ns.length)return {kind:'NoReasons'};const d=rec(arb,440n),a=analyzeOptions(opts.map(candidate=>{let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;for(const n of ns.filter(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidate))){const x=readDistribution(f(rec(n,407n),7n));distribution=convolve(distribution,x);reasonMass=reasonMass.add(absolute(expectation(x)));}return {key:candidate,distribution,reasonMass};}),readQ(f(d,1n)),readQ(f(d,2n)),4);return {kind:'Resolved',mode:a.mode,probabilities:a.probabilities.map(v=>({action:key(v.key),p:v.probability.numerator+'/'+v.probability.denominator}))};}
function settings(){const e=JSON.parse(readFileSync(root+'ASSEMBLED_CHARACTER_M266_EVIDENCE.json','utf8'))['candidate-configuration'];expect(e,'actually admitted candidate').toBeDefined();const next=decode(unzip(e.dice.deflate)),old=r(437,[f(rec(next,437n),1n),q(37,100),f(rec(next,437n),3n),f(rec(next,437n),4n)]);return {old,next,arb:decode(unzip(e.arbitration.deflate))};}
it('activation266 replay captured receiving and list changed family obligations',()=>{
 const {old,next,arb}=settings(),sources=['M220_BODY','M220_SLEEP','M220_INTOXICATION','M245','M246','M248','M256','M261','M263','M235'];
 let total=0,changed=0,probabilityChanges=0;
 for(const name of sources){
  const path=root+'ASSEMBLED_CHARACTER_'+name+'_EVIDENCE.json',bytes=readFileSync(path),data=JSON.parse(bytes.toString()),packets=new Map<string,{path:string;raw:CanonicalValue;nuclei:readonly CanonicalValue[]}>(),seen=new Set<string>();let blocks=0,oldSchema=0;
  function canonical(v:CanonicalValue,path:string){if(typeof v==='boolean')return;if(v.kind==='record'){if(v.schema.typeId===408n){const raw=f(v,2n);if(typeof raw==='boolean'||raw.kind!=='record'||raw.schema.schemaVersion<3n){oldSchema++;return;}const h=hash(enc(raw)),nuclei=items(f(v,3n),'list');if(packets.has(h))expect(packets.get(h)!.nuclei).toEqual(nuclei);else packets.set(h,{path,raw,nuclei});return;}for(const [n,x]of v.fields)canonical(x,path+'/'+n);}else if(v.kind==='list'||v.kind==='set')v.items.forEach((x,i)=>canonical(x,path+'/'+i));else if(v.kind==='map')v.entries.forEach(([k,x],i)=>{canonical(k,path+'/'+i+'k');canonical(x,path+'/'+i+'v');});}
  function block(compressed:string,path:string,expectedHash?:string,length?:number){const b=unzip(compressed),h=hash(b);if(expectedHash)expect(h).toBe(expectedHash);if(length!==undefined)expect(b.length).toBe(length);if(seen.has(h))return;seen.add(h);blocks++;canonical(decode(b),path);}
  function visit(v:unknown,path=''){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((a,i)=>visit(a,path+'/'+i));return;}const o=v as Record<string,any>;if(typeof o.deflate==='string'){if(/outputs|observer|fixedMask|fixedLearning/.test(path))block(o.deflate,path,o.hash??o.sha256,o.bytes);return;}if(typeof o.safeCompressed==='string')block(o.safeCompressed,path+'/safeCompressed',o.safe,o.safeBytes);for(const [k,a]of Object.entries(o))if(k!=='safeCompressed')visit(a,path+'/'+k);}
  visit(data);expect(packets.size,'actual packets in '+name).toBeGreaterThan(0);const rows=[];
  for(const [rawHash,p]of packets){const before=compileDescribedReasons(p.raw,old,5,'SourceCoverage',true,true),after=compileDescribedReasons(p.raw,next,5,'SourceCoverage',true,true);expect(before.nuclei,'original compiler correspondence '+name+p.path).toEqual(p.nuclei);
   const oldKeys=new Map(before.nuclei.map(n=>[key(f(rec(n,407n),1n)),n]));for(const [k,n]of oldKeys)expect(after.nuclei.find(n=>key(f(rec(n,407n),1n))===k),'retained reason unchanged').toEqual(n);
   const added=after.nuclei.filter(n=>!oldKeys.has(key(f(rec(n,407n),1n))));for(const n of added)expect(readQ(f(rec(f(rec(n,407n),2n),406n),1n)).numerator!==0n).toBe(true);
   const statuses=(report:CanonicalValue)=>new Map(items(items(report,'list')[1],'list').map(v=>{const a=items(v,'list');return [key(a[0]),key(a[1])];}));const bs=statuses(before.report),as=statuses(after.report);for(const [k,s]of bs)if(s===key({kind:'text',value:'ZeroBase'}))expect(as.get(k)).toBe(s);
   const bp=probability(p.raw,before.nuclei,arb),ap=probability(p.raw,after.nuclei,arb),pc=JSON.stringify(bp)!==JSON.stringify(ap);total++;if(added.length)changed++;if(pc)probabilityChanges++;
   rows.push({path:p.path,rawHash,oldNuclei:before.nuclei.length,candidateNuclei:after.nuclei.length,added:added.length,before:bp,after:ap,probabilityChanged:pc,classification:added.length?'Activation-policy difference':'Equivalent receiving',...(added.length?{candidate:zip(list([after.report,list(after.nuclei)]))}:{})});
  }
  put(name,{source:path,sourceHash:hash(bytes),blocks,oldSchemaControlsSkipped:oldSchema,packets:packets.size,rows});console.info('M266 receiving '+name+' packets'+packets.size+' changed'+rows.filter(v=>v.added).length);
 }
 expect(changed).toBeGreaterThan(0);expect(probabilityChanges).toBeGreaterThan(0);put('summary',{total,changed,probabilityChanges,nativeFamilyAcceptance:false,scope:'Captured downstream receiving only; full native affected-family replay still required before reference adoption'});
},590000);
it('activation266 admitted global dice replay original delayed packets',()=>{
 const {next}=settings(),data=JSON.parse(readFileSync(root+'ASSEMBLED_CHARACTER_M265_EVIDENCE.json','utf8')),rows=[];
 for(const original of data.comparisons){const packet=items(decode(unzip(original.receiving.deflate)),'list')[0],c=compileDescribedReasons(packet,next,3,'SourceCoverage',true,true);expect(c.nuclei).toHaveLength(original.originalNuclei);rows.push({name:original.name,law:original.law,packetHash:hash(enc(packet)),count:c.nuclei.length,candidate:zip(list([c.report,list(c.nuclei)]))});}
 put('delayed',{sourceHash:hash(readFileSync(root+'ASSEMBLED_CHARACTER_M265_EVIDENCE.json')),rows,nativeProducer:false,admittedCalibration:true});console.info('M266 actual admitted candidate dice preserve11 delayed positive-ground counts');
});
