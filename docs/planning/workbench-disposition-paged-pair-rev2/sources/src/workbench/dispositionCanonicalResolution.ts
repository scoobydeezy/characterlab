import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import type {TimelineEvent} from './contracts';
import {readable} from './canonical';
import {equalCanonicalText as equal} from './canonicalTextEquality';
import {scalar} from './nativeTimeline';
import {inspectDispositionCanonicalReasons} from './dispositionCanonicalReasons';
export type CanonicalResolutionEvent=Pick<TimelineEvent,'id'|'instant'|'phase'|'stage'|'parents'>&{output:CanonicalValue;draws:CanonicalValue};
const key=(v:CanonicalValue)=>JSON.stringify(readable(v));
/** Admitted canonical records only; no full-output formatting or synthetic decision inputs. */
export function dispositionCanonicalResolution(events:readonly CanonicalResolutionEvent[],reasonId:string,seamVersion:string){
 if(seamVersion!=='disposition-public/0.1-candidate'||events.length>180)throw Error('Unqualified resolution profile');
 const reasons=events.filter(e=>e.id===reasonId);if(reasons.length!==1)throw Error('Unique reason event required');const reason=reasons[0],diagnostic=inspectDispositionCanonicalReasons(reason,reason.output);
 const child=(parent:CanonicalResolutionEvent,stage:string,phase:string)=>{const matches=events.filter(e=>e.parents.includes(parent.id)&&e.stage===stage);if(matches.length!==1||matches[0].instant!==parent.instant||matches[0].phase!==phase)throw Error('Resolution event lineage mismatch');return matches[0];};
 const decision=child(reason,'decision','60'),intent=child(decision,'intent','70'),header={version:'disposition-resolution-inspection/0.1',reasonEvent:reason.id,decisionEvent:decision.id,intentEvent:intent.id,instant:reason.instant};
 const out=items(decision.output,'list'),io=items(intent.output,'list'),trace=items(decision.draws,'list');
 if(!diagnostic.emitted){if(out.length||io.length||trace.length)throw Error('Inactive resolution mismatch');return {...header,emitted:false as const,draws:[],scope:'No reason, decision or intent record emitted. No choice inferred.'};}
 if(out.length!==1||io.length!==1)throw Error('Resolution output envelope');
 const d=rec(out[0],1431n),r=rec(f(d,3n),409n),source=rec(items(reason.output,'list')[1],1430n);
 if(!equal(f(d,2n),source)||!equal(f(r,3n),f(source,5n))||scalar(f(r,2n))!==reason.instant)throw Error('Resolution reason join mismatch');
 const i=rec(io[0],1432n),chosenIntent=rec(f(i,3n),425n);if(!equal(f(i,2n),d)||!equal(f(chosenIntent,2n),r))throw Error('Chosen intent join mismatch');
 const result=rec(f(r,4n),419n);if(scalar(f(result,1n))!=='3')throw Error('Unsupported active resolution result');
 const data=rec(f(result,2n),420n),mode=({'1':'Auto','2':'QuietRoll','3':'PlayerFacingRoll'} as Record<string,string>)[scalar(f(data,8n))];if(!mode)throw Error('Unknown resolution mode');
 const recorded=items(f(data,9n),'list');if(recorded.length>2)throw Error('Resolution draw bound');
 const used=new Set<string>(),draws=recorded.map(value=>{
  const draw=rec(value,422n),nk=rec(f(draw,1n),404n),nkKey=key(nk),n=diagnostic.nuclei.find(n=>JSON.stringify(JSON.parse(n.key))===nkKey);
  if(!n||used.has(nkKey))throw Error('Resolution nucleus join mismatch');used.add(nkKey);
  if(scalar(f(draw,2n))!==n.baseDie||scalar(f(draw,3n))!==n.standingModifier||scalar(f(draw,4n))!==n.situationalModifier)throw Error('Resolution calibration mismatch');
  const random=rec(f(draw,5n),411n),face=BigInt(scalar(f(random,3n)))+1n,contribution=(scalar(f(nk,4n))==='1'?1n:-1n)*(face+BigInt(n.standingModifier)+BigInt(n.situationalModifier));
  if(scalar(f(random,4n))!==n.baseDie||face<1n||face>BigInt(n.baseDie)||String(face)!==scalar(f(draw,6n))||String(contribution)!==scalar(f(draw,7n))||trace.filter(v=>equal(v,random)).length!==1)throw Error('Resolution draw arithmetic/trace mismatch');
  return {nucleus:diagnostic.nuclei.indexOf(n)+1,candidate:key(f(nk,1n)),key:nkKey,die:n.baseDie,standing:n.standingModifier,situational:n.situationalModifier,face:String(face),contribution:String(contribution),random:readable(random)};
 });
 const tie=rec(f(data,10n),423n),tag=scalar(f(tie,1n)),tieDraw=tag==='2'?f(tie,3n):null;
 if(!['1','2'].includes(tag)||trace.length!==draws.length+(tieDraw?1:0)||tieDraw&&trace.filter(v=>equal(v,tieDraw)).length!==1)throw Error('Resolution trace accounting mismatch');
 if(mode==='Auto'?draws.length!==0:draws.length!==diagnostic.nuclei.length)throw Error('Resolution mode/draw mismatch');
 return {...header,emitted:true as const,mode,chosenCandidate:key(f(data,1n)),probabilities:readable(f(data,2n)),draws,tie:readable(tie),scope:'Recorded arbitration joined by parent event and exact reason/intent payloads. Each reason draw matches its nucleus and trace; face plus modifiers yields its signed contribution. Analytical probabilities and tie record remain original diagnostics. Resolution mode names do not grant player disclosure. Chosen intent is not successful execution or independent causal necessity.'};
}
