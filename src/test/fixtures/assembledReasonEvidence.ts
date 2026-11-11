/** M86 fixed original collective sources in the unchanged M85 quiet scenario. */
import {expect} from 'vitest';
import {list,set,text,unsigned as u,signed,rational as q,canonicalEncode as enc,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {REASON_EVIDENCE_RULES,REASON_EVIDENCE_REGISTRY,SOURCE_COVERAGE_RULES,SOURCE_COVERAGE_REGISTRY} from '../../assembled/model';
import {REASON_EVIDENCE,REASON_READING,REASON_SAMPLE,REASON_PRODUCED,REASON_EVIDENCE_VERSION} from '../../assembled/reasonEvidence';
import {REASON_SOURCE_REPORT,descriptionIdentity} from '../../assembled/reasons';
import {fixture as prior} from './assembledReasonSources';
import {taskA} from './assembledDecisionRegimes';
import {snap,through} from './assembledAffectReceiving';
import {outputs,signedValue,type Run} from './assembledComparison';
import {receivingRecord as rec,decodeCognitive as decode,cognitiveRecord as r} from '../../assembled/codecs';
import {dataItems as items,dataField as f,dataKey as key,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {readQ,ZERO} from '../../campaign2/cognitiveMath';
import {sid} from '../../assembled/skill';
import {reasonRecord as rr} from '../../campaign3/reasonCodecs';
import {reasonRaw,compileJoinedReasons} from '../../campaign3/reasonMath';
import {reasonRecipe} from '../../campaign3/reasonModel';
import {decodeReason} from '../../campaign3/reasonCodecs';
import {definition,originalNuclei,nativeProjection,originalProjection,compile} from './assembledReasonCorrespondence';
export function fixture(count=3,permissions=[true,true],hidden=false,zero=false,coverage=true){
 const b=prior(),action=sid(1027,'definition/protocol-contact-one');
 const descriptions=[list([text('reading1'),action,taskA,q(3,4),set([u(1)])]),list([text('reading2'),action,taskA,q(2,3),set([u(2)])]),list([text('combined'),action,taskA,q(1,4),set([u(1),u(2)])])].slice(0,count);
 const s={...b.s,rulesVersion:coverage?SOURCE_COVERAGE_RULES:REASON_EVIDENCE_RULES,registrySchemaVersion:coverage?SOURCE_COVERAGE_REGISTRY:REASON_EVIDENCE_REGISTRY,registry:enc(list([...items(decode(b.s.registry),'list'),list([text(REASON_EVIDENCE),list(descriptions)])]))};
 const rows=items(decode(b.d.orderedInputs),'list'),event=list([signed(10),u(10),REASON_READING,list([q(zero?0:1,1),q(zero?0:1,1),permissions[0],permissions[1],q(hidden?1:0,1)]),list([])]);
 return {s,d:{...b.d,orderedInputs:enc(list([...rows,event]))},old:b,descriptions,event};
}
export async function create(count=3,permissions=[true,true],hidden=false,zero=false,at=10n,coverage=true){
 const b=fixture(count,permissions,hidden,zero,coverage),run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};
}
export function capture(run:Run){
 const all=items(decode(snap(run).outputs),'list'),d=outputs(snap(run).outputs,409n).find(v=>signedValue(f(v,2n))===10n)!;expect(d).toBeDefined();
 const status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'live decision').toBe(3n);
 const data=rec(f(status,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list');
 expect(items(f(rec(f(raw,2n),398n),3n),'list')).toHaveLength(2);expect(ns.length).toBeGreaterThanOrEqual(2);
 expect(outputs(snap(run).outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d)),'actual execution').toBe(true);
 const report=all.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(REASON_PRODUCED))&&key(v.items[1])===key(signed(10)))!;
 expect(report).toBeDefined();const p=items(report,'list'),produced=items(p[3],'list'),rejected=items(p[4],'list'),frozen=items(p[2],'list'),samples=items(frozen[2],'list');
 for(const v of produced){const x=items(v,'list');expect(items(f(raw,6n),'list').some(d=>key(d)===key(x[1]))).toBe(true);for(const sample of items(x[2],'list'))expect(samples.some(s=>key(s)===key(sample))).toBe(true);}
 const compilation=all.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(REASON_SOURCE_REPORT))).find(v=>items(items(v,'list')[1],'list').some(group=>items(items(group,'list')[3],'list').some(row=>produced.some(p=>key(items(row,'list')[0])===key(descriptionIdentity(items(p,'list')[1]))))));
 const traces=outputs(snap(run).trace,160n);
 expect(traces.some(t=>key(f(t,6n))===key(text(REASON_EVIDENCE_VERSION))&&key(f(t,13n))===key(raw)&&typeof f(t,12n)!=='boolean'&&(f(t,12n) as {kind:string}).kind==='list'&&items(f(t,12n),'list').some(v=>key(v)===key(report))),'raw source report trace').toBe(true);
 expect(traces.some(t=>key(f(t,12n))===key(raw)&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as {kind:string}).kind==='list'),'compiler consumes raw').toBe(true);
 return {d,data,context,raw,ns,report,produced,rejected,frozen,samples,compilation};
}
export function correspondence(p:ReturnType<typeof capture>,source:ReturnType<typeof fixture>['s']){
 const samples=p.samples.map(v=>{const s=items(v,'list');return rr(917,[s[1],s[2],s[3],s[4],s[5]]);});
 const descriptors=p.produced.map(v=>{const d=items(items(v,'list')[0],'list'),candidate=r(395,[f(rec(d[2],371n),1n),d[1]]);return rr(916,[sid(1027,'M86/'+(d[0] as {value:string}).value),candidate,sid(1040,'Commitment'),f(rec(d[2],371n),2n),u(1),d[3],d[4]]);});
 const occurrence=typedIdentifier(1160,u(0)),raw=reasonRaw(occurrence,descriptors,samples,r(414,[list([])])).output;
 const panel=items(f(rec(raw,920n),2n),'list');expect(panel).toHaveLength(3);
 panel.forEach((v,i)=>{const a=items(p.produced[i],'list'),s=rec(items(a[1],'list')[2],402n);expect(f(rec(v,919n),2n)).toEqual(f(s,2n));expect(f(rec(v,919n),3n)).toEqual(f(s,3n));expect(items(f(rec(v,919n),4n),'list')).toEqual(items(a[2],'list').map(x=>{const a=items(x,'list');return rr(917,[a[1],a[2],a[3],a[4],a[5]]);}));});
 const recipe=rec(decodeReason(reasonRecipe().content),914n),dice=f(recipe,4n);
 const aggregate=originalNuclei(compileJoinedReasons(occurrence,raw,dice,1))[0],pairwise=originalNuclei(compileJoinedReasons(occurrence,raw,dice,3))[0];
 expect(f(aggregate,2n)).toEqual(q(17,29));expect(f(pairwise,2n)).toEqual(q(37,61));expect(uint(f(aggregate,7n))).toBe(6n);expect(uint(f(pairwise,7n))).toBe(8n);
 const actual=items(f(p.raw,6n),'list').filter(v=>!readQ(f(rec(items(v,'list')[2],402n),2n)).equals(ZERO)).map(v=>{const d=items(v,'list'),s=rec(d[2],402n),k=rec(f(s,1n),401n),task=rec(f(k,2n),371n);return rr(919,[rr(916,[sid(1027,'M86/'+key(descriptionIdentity(v))),f(k,1n),d[1],f(task,2n),f(k,3n),q(1,1),set([])]),f(s,2n),f(s,3n),list([])]);});
 expect(key(set(originalNuclei(compile(actual,definition(source))).map(originalProjection)))).toBe(key(set(p.ns.map(nativeProjection))));
 console.info('M86 ORIGINAL PASS actual producer strengths/bases/support; all-source Aggregate matches native; panel-only Aggregate17/29,d6 vs Pairwise37/61,d8 under original dice');
}
export {snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid,nativeProjection};
