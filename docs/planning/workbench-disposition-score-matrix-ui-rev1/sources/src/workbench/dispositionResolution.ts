import type {TimelineEvent} from './contracts';
import {inspectDispositionReasons} from './dispositionReasonDiagnostics';
const key=(v:unknown)=>JSON.stringify(v);
const rec=(v:any,name:string)=>{if(!v||v.record!==name)throw Error('Resolution record mismatch');return v;};
export function dispositionResolution(events:readonly TimelineEvent[],reasonId:string,seamVersion:string){
 if(seamVersion!=='disposition-public/0.1-candidate'||events.length>180)throw Error('Unqualified resolution profile');
 const reasons=events.filter(e=>e.id===reasonId);if(reasons.length!==1)throw Error('Unique reason event required');
 const reason=reasons[0],diagnostic=inspectDispositionReasons(reason);
 const child=(parent:TimelineEvent,stage:string,phase:string)=>{
  const matches=events.filter(e=>e.parents.includes(parent.id)&&e.stage===stage);
  if(matches.length!==1||matches[0].instant!==parent.instant||matches[0].phase!==phase)throw Error('Resolution event lineage mismatch');
  return matches[0];
 };
 const decision=child(reason,'decision','60'),intent=child(decision,'intent','70');
 const header={version:'disposition-resolution-inspection/0.1',reasonEvent:reason.id,decisionEvent:decision.id,intentEvent:intent.id,instant:reason.instant};
 const out=JSON.parse(decision.output),io=JSON.parse(intent.output);
 if(!diagnostic.emitted){if(out.length||io.length||JSON.parse(decision.draws).length)throw Error('Inactive resolution mismatch');return {...header,emitted:false as const,draws:[],scope:'No reason, decision or intent record emitted. No choice inferred.'};}
 if(out.length!==1||io.length!==1)throw Error('Resolution output envelope');
 const d=rec(out[0],'IdentityTaskDecision#1431/1'),r=rec(d['Resolution [3]'],'DecisionResolution#409/1'),source=JSON.parse(reason.output)[1];
 if(key(d['Reasons [2]'])!==key(source)||key(r['ReasonContext [3]'])!==key(source['Reasons [5]'])||r['OccurredAt [2]']!==reason.instant)throw Error('Resolution reason join mismatch');
 const i=rec(io[0],'IdentityTaskIntent#1432/1'),chosenIntent=rec(i['Intent [3]'],'ChosenIntent#425/1');
 if(key(i['Decision [2]'])!==key(d)||key(chosenIntent['DecisionResolution [2]'])!==key(r))throw Error('Chosen intent join mismatch');
 const result=rec(r['Result [4]'],'DecisionResult#419/1');
 if(result['VariantTag [1]']!=='3')throw Error('Unsupported active resolution result');
 const data=rec(result['ChosenData [2]'],'ChosenDecisionData#420/1'),mode=({'1':'Auto','2':'QuietRoll','3':'PlayerFacingRoll'} as Record<string,string>)[data['ResolutionMode [8]']];
 if(!mode)throw Error('Unknown resolution mode');
 const trace=JSON.parse(decision.draws),recorded=data['ReasonDraws [9]'];if(!Array.isArray(trace)||!Array.isArray(recorded)||recorded.length>2)throw Error('Resolution draw bound');
 const used=new Set<string>(),draws=recorded.map((value:any)=>{
  const draw=rec(value,'ReasonDraw#422/1'),nk=draw['NucleusKey [1]'],n=diagnostic.nuclei.find(n=>key(JSON.parse(n.key))===key(nk));
  if(!n||used.has(key(nk)))throw Error('Resolution nucleus join mismatch');used.add(key(nk));
  if(draw['BaseDie [2]']!==n.baseDie||draw['StandingModifier [3]']!==n.standingModifier||draw['SituationalModifier [4]']!==n.situationalModifier)throw Error('Resolution calibration mismatch');
  const random=rec(draw['Draw [5]'],'CognitiveRandomDraw#411/1'),face=BigInt(random['Result [3]'])+1n,contribution=(nk['Direction [4]']==='1'?1n:-1n)*(face+BigInt(n.standingModifier)+BigInt(n.situationalModifier));
  if(random['Span [4]']!==n.baseDie||face<1n||face>BigInt(n.baseDie)||String(face)!==draw['Face [6]']||String(contribution)!==draw['SignedContribution [7]']||trace.filter((v:any)=>key(v)===key(random)).length!==1)throw Error('Resolution draw arithmetic/trace mismatch');
  return {nucleus:diagnostic.nuclei.indexOf(n)+1,candidate:key(nk['CandidateKey [1]']),key:key(nk),die:n.baseDie,standing:n.standingModifier,situational:n.situationalModifier,face:String(face),contribution:String(contribution),random};
 });
 const tie=rec(data['TieBreak [10]'],'DecisionTieBreak#423/1'),tieDraw=tie['VariantTag [1]']==='2'?tie['Draw [3]']:null;
 if(!['1','2'].includes(tie['VariantTag [1]'])||trace.length!==draws.length+(tieDraw?1:0)||tieDraw&&trace.filter((v:any)=>key(v)===key(tieDraw)).length!==1)throw Error('Resolution trace accounting mismatch');
 if(mode==='Auto'?draws.length!==0:draws.length!==diagnostic.nuclei.length)throw Error('Resolution mode/draw mismatch');
 return {...header,emitted:true as const,mode,chosenCandidate:key(data['CandidateKey [1]']),probabilities:data['Probabilities [2]'],draws,tie,
  scope:'Recorded arbitration joined by parent event and exact reason/intent payloads. Each reason draw matches its nucleus and trace; face plus modifiers yields its signed contribution. Analytical probabilities and tie record remain original diagnostics. Resolution mode names do not grant player disclosure. Chosen intent is not successful execution or independent causal necessity.'};
}
