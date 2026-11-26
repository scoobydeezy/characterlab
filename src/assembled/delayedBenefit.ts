/** One goal's promised benefit, shared candidate/reason grammar and owned state. */
import {list,set,map,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataItems as items,dataField as f,dataKey as key,dataText as txt,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue,ZERO,ONE,bounded} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r,receivingRecord as rec,decodeCognitive} from './codecs';
import {sid,pattern} from './skill';
import {KNOWLEDGE_OWNER,PLAN_OWNER,type Strategy} from './strategy';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const BENEFIT='assembled-delayed-benefit/0.1',BENEFIT_VERSION='assembled-delayed-benefit/0.1-candidate';
export const BENEFIT_SOURCE=sid(1001,'event/assembled-delayed-source'),BENEFIT_TICK=sid(1001,'event/assembled-delayed-tick'),BENEFIT_OBSERVE=sid(1001,'event/assembled-delayed-observe'),BENEFIT_LEARN=sid(1001,'event/assembled-delayed-learn');
export const BENEFIT_OWNER=sid(1025,'authority/physical-benefit');
export const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const require=(b:boolean,s:string)=>{if(!b)invalidModel('delayed benefit '+s);};
export function compileBenefit(v:CanonicalValue,routes:Strategy){
 const a=items(v,'list');require(a.length===2&&txt(a[0])===BENEFIT,'declaration');const b=items(a[1],'list');require(b.length<=1,'binding capacity');if(!b.length)return undefined;
 const x=items(b[0],'list');require(x.length===6,'binding');const route=routes.find(r=>eq(r.task,x[0]));require(!!route,'task');const now=route!.plans.find(p=>eq(p.instructionId,x[2])),later=route!.plans.find(p=>eq(p.instructionId,x[3]));
 require(!!now&&!!later&&!eq(now!.actionId,later!.actionId),'distinct governed options');require(id(x[1]).namespaceId===1027n,'benefit identity');
 const curve=uint(x[4]),mode=uint(x[5]);require(curve>=1n&&curve<=3n&&mode<=2n,'curve/mode');
 return Object.freeze({task:x[0],benefit:x[1],now:now!,later:later!,curve,mode});
}
export type Benefit=NonNullable<ReturnType<typeof compileBenefit>>;
export function offer(v:CanonicalValue){const a=items(v,'list');require(a.length===5,'offer shape');const now=readQ(a[0]),later=readQ(a[1]),delay=uint(a[2]),future=uint(a[3]),cost=readQ(a[4]);require(now.compare(ZERO)>0&&now.compare(ONE)<=0&&later.compare(ZERO)>0&&later.compare(ONE)<=0&&delay>=1n&&delay<=4n&&future<=3n&&cost.compare(ZERO)>=0&&cost.compare(ONE)<=0,'offer domain');return {now,later,delay,future,cost};}
export function benefitSource(v:CanonicalValue,at:bigint,s:Benefit){const a=items(v,'list');require(a.length===10&&txt(a[0])===BENEFIT&&at>=1n&&at<=8n,'source shape/time');const offers=items(a[1],'list');require(offers.length<=(at===1n?1:0),'offer window');offers.forEach(offer);for(const i of [2,3,4,7,8])require(typeof a[i]==='boolean','source flag');for(const i of [5,6]){const x=readQ(a[i]);require(x.compare(ZERO)>=0&&x.compare(ONE)<=0,'physical amount');}require(uint(a[9])===s.mode,'fixed receipt mode');return a;}
export const benefitPath=(s:Benefit,kind:'knowledge'|'plan'|'world'):StatePath=>({rootStateTypeId:kind==='knowledge'?1000n:kind==='plan'?996n:1610n,fieldId:kind==='world'?1n:30n,selectors:[{kind:'mapKey',key:s.task}]});
export function benefitKnowledge(v?:CanonicalValue){if(!v)return {offer:[] as CanonicalValue[],receipt:[] as CanonicalValue[]};const a=items(v,'list');require(a.length===3&&txt(a[0])===BENEFIT,'knowledge');const o=items(a[1],'list'),receipt=items(a[2],'list');require(!o.length||o.length===3,'offer evidence');if(o.length){offer(o[0]);require(id(o[1]).namespaceId===1164n&&uint(o[2])===1n,'offer support/time');}require(!receipt.length||receipt.length===4,'receipt evidence');if(receipt.length){require(id(receipt[0]).namespaceId===1164n&&uint(receipt[1])>=2n&&uint(receipt[1])<=8n&&uint(receipt[2])>=1n&&uint(receipt[2])<=2n,'receipt support/time/option');const n=readQ(receipt[3]);require(n.compare(ZERO)>=0&&n.compare(ONE)<=0,'receipt amount');}return {offer:o,receipt};}
export function benefitPlan(v:CanonicalValue,s:Benefit){const a=items(v,'list');require(a.length===7&&txt(a[0])===BENEFIT,'plan');const selected=uint(a[1]),at=uint(a[2]),due=uint(a[3]);require(selected>=1n&&selected<=2n&&at===2n&&due>=at&&due<=6n&&(selected===2n||due===at),'plan time/option');const terms=offer(a[5]);require(due===at+(selected===2n?terms.delay:0n),'exact due');require(id(a[4]).namespaceId===1139n,'plan occurrence');uint(id(a[4]).payload);const intent=rec(a[6],425n);require(eq(f(rec(f(rec(f(intent,2n),409n),4n),419n),1n),u(3)),'chosen intent');const chosen=rec(f(rec(f(rec(f(intent,2n),409n),4n),419n),2n),420n),candidate=rec(f(chosen,1n),395n);require(eq(f(candidate,2n),selected===1n?s.now.actionId:s.later.actionId),'plan selected action');return {a,selected,at,due,promise:selected===1n?offer(a[5]).now:offer(a[5]).later};}
export function benefitWorld(v:CanonicalValue){const a=items(v,'list');require(a.length===5&&txt(a[0])===BENEFIT&&id(a[1]).namespaceId===1141n&&typeof a[2]==='boolean','world');uint(id(a[1]).payload);const at=uint(a[3]),amount=readQ(a[4]);require(at>=2n&&at<=6n&&amount.compare(ZERO)>=0&&amount.compare(ONE)<=0&&(!a[2]?amount.equals(ZERO):true),'world settlement');return {a,settled:a[2]===true,at,amount};}
export function withBenefitState(base:ReturnType<typeof compileCampaign2StateModel>,s:Benefit){
 const kinds=['knowledge','plan','world'] as const,paths=kinds.map(k=>benefitPath(s,k)),fresh=(p:StatePath)=>p.rootStateTypeId===1610n||[1000n,996n].includes(p.rootStateTypeId)&&p.fieldId===30n;
 const check=(p:StatePath,v?:CanonicalValue)=>{const i=paths.findIndex(x=>eq(statePathValue(x),statePathValue(p)));require(i>=0,'foreign state path');if(v!==undefined){if(i===0)benefitKnowledge(v);else if(i===1)benefitPlan(v,s);else benefitWorld(v);}return i;};
 const authority=new StateAuthorityRegistry(paths.map(p=>({pattern:pattern(p),validateValue:(v:CanonicalValue)=>check(p,v),removalAllowed:false})),[KNOWLEDGE_OWNER,PLAN_OWNER,BENEFIT_OWNER].map((mutationAuthorityId,i)=>({mutationAuthorityId,patterns:[pattern(paths[i])]})));
 const without=(state:AuthoritativeState)=>new AuthoritativeState(state.entries().filter(e=>!fresh(e.path))),local=(state:AuthoritativeState)=>{for(const e of state.entries().filter(e=>fresh(e.path)))check(e.path,e.value);const pv=state.read(paths[1]).value,wv=state.read(paths[2]).value,k=benefitKnowledge(state.read(paths[0]).value),p=pv?benefitPlan(pv,s):undefined;if(p)require(!!k.offer.length&&eq(p.a[5],k.offer[0]),'plan received offer');if(wv){const w=benefitWorld(wv);require(!!p&&w.at===(w.settled?p.due:p.at),'world plan association');}if(k.receipt.length)require(!!p&&uint(k.receipt[2])===p.selected&&uint(k.receipt[1])>=p.due,'receipt plan association');};
 const validateState=(state:AuthoritativeState)=>{base.validateState(without(state));local(state);};
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))check(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const state=restoreAuthoritativeStateLocal(bytes);validateState(state);return state;},
 read(state:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(state,p);check(p);const v=state.read(p);if(v.presence)check(p,v.value!);return v;},
 applyPatch(state:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
 const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed patch');if(added.length){for(const o of added){const i=check(o.path);require(o.kind==='set','set only');require(!scope||scope.writableRoots.includes(o.path.rootStateTypeId)&&scope.targetPaths.some(x=>eq(statePathValue(x),statePathValue(o.path))),'scope');const before=state.read(o.path);if(i===1)require(!before.presence,'immutable plan');if(i===2&&before.presence)require(!benefitWorld(before.value!).settled&&o.kind==='set'&&benefitWorld(o.newValue).settled,'once-only physical settlement');if(i===0&&before.presence&&o.kind==='set'){const b=benefitKnowledge(before.value!),n=benefitKnowledge(o.newValue);require(!b.offer.length||eq(list(b.offer),list(n.offer)),'immutable received offer');require(!b.receipt.length||eq(list(b.receipt),list(n.receipt)),'immutable received outcome');}}
 const result=applyStatePatch(state,p,owner,authority);local(result.state);return result;}
 const result=base.applyPatch(without(state),p,owner,scope),next=new AuthoritativeState([...result.state.entries(),...state.entries().filter(e=>fresh(e.path))]);local(next);return {...result,state:next};
 }});
}
import {restoreAuthoritativeState} from '../substrate/state';
const restoreAuthoritativeStateLocal=(bytes:Uint8Array)=>restoreAuthoritativeState(decodeCognitive(bytes));
export function benefitValues(s:Benefit,v:CanonicalValue){const o=offer(v),discount=s.curve===1n?Q.of(1n,1n+o.delay):s.curve===2n?ONE:Q.of(1n,2n**o.delay),p=o.future===3n?ONE:o.future===2n?Q.of(1n,2n):ZERO,net=p.multiply(o.later).multiply(discount).subtract(o.cost.multiply(Q.of(o.delay)));return [o.now,net.compare(ZERO)>0?net:ZERO] as const;}
export function benefitCandidates(input:CanonicalValue,s:Benefit,k:ReturnType<typeof benefitKnowledge>,planned:boolean,at:bigint){
 const c=rec(input,398n),m=rec(f(c,2n),394n),w=rec(f(rec(f(rec(f(m,2n),388n),2n),384n),2n),381n),selected=items(f(w,4n),'list').some(v=>eq(f(rec(v,379n),1n),s.task)),o=k.offer.length?offer(k.offer[0]):undefined;
 const options=new Map<string,{candidate:CanonicalValue;origins:CanonicalValue[]}>();
 for(const v of items(f(c,3n),'list')){const x=rec(v,397n),origins=items(f(x,2n),'set').filter(v=>!eq(f(rec(v,396n),1n),s.task));if(origins.length)options.set(key(f(x,1n)),{candidate:f(x,1n),origins});}
 if(selected&&o&&!planned&&at===2n)for(const [i,p]of [s.now,s.later].entries()){if(i===1&&o.future<2n)continue;const candidate=r(395,[f(w,2n),p.actionId]),row=options.get(key(candidate))??{candidate,origins:[]};row.origins.push(r(396,[s.task,p.instructionId]));options.set(key(candidate),row);}
 return r(398,[f(c,1n),m,list([...options].sort(([a],[b])=>a<b?-1:1).map(([,x])=>r(397,[x.candidate,set(x.origins)])))]);
}
export function benefitRaw(input:CanonicalValue,s:Benefit,k:ReturnType<typeof benefitKnowledge>,values:readonly [Q,Q]){
 const raw=rec(input,403n);require(raw.schema.schemaVersion===4n,'current described raw');if(!k.offer.length)return input;
 const basis=r(400,[map([[r(399,[u(1),r(237,[u(1),k.offer[1]])]),qValue(ONE)]])]);
 const replace=(v:CanonicalValue)=>{const signal=rec(v,402n),source=rec(f(signal,1n),401n);if(source.schema.schemaVersion===3n||!eq(f(source,2n),s.task)||uint(f(source,3n))!==1n)return v;const action=f(rec(f(source,1n),395n),2n),i=eq(action,s.now.actionId)?0:eq(action,s.later.actionId)?1:-1;require(i>=0,'bound option source');return r(402,[source,qValue(values[i as 0|1]),basis]);};
 const signals=items(f(raw,3n),'set').map(replace),descriptions=items(f(raw,6n),'list').map(v=>{const a=items(v,'list');return list([a[0],a[1],replace(a[2])]);});
 // Zero inherited pressure still needs an actual prospective base, once per option.
 for(const opt of items(f(rec(f(raw,2n),398n),3n),'list')){const x=rec(opt,397n);if(!items(f(x,2n),'set').some(v=>eq(f(rec(v,396n),1n),s.task)))continue;const candidate=f(x,1n),action=f(rec(candidate,395n),2n),i=eq(action,s.now.actionId)?0:1;
 if(!signals.some(v=>{const z=rec(f(rec(v,402n),1n),401n);return eq(f(z,1n),candidate)&&eq(f(z,2n),s.task)&&uint(f(z,3n))===1n;})){const signal=r(402,[r(401,[candidate,s.task,u(1)]),qValue(values[i as 0|1]),basis]);signals.push(signal);descriptions.push(list([text('primary'),sid(1040,'Commitment'),signal]));}}
 const meaning=map(items(f(rec(f(raw,2n),398n),3n),'list').map(v=>{const candidate=f(rec(v,397n),1n),sum=signals.filter(v=>{const z=rec(f(rec(v,402n),1n),401n);return eq(f(z,1n),candidate)&&uint(f(z,3n))!==3n;}).reduce((n,v)=>n.add(readQ(f(rec(v,402n),2n))),ZERO);return [candidate,qValue(bounded(sum))] as const;}));
 return r(403,[f(raw,1n),f(raw,2n),set(signals),meaning,f(raw,5n),list(descriptions),f(raw,7n)],4);
}
