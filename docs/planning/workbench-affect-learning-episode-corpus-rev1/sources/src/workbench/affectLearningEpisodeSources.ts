import type {AffectSnapshot} from './affectSession';
type RecordValue=Record<string,unknown>;
const object=(v:unknown):RecordValue=>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid episode record');return v as RecordValue;};
const exact=(a:unknown,b:unknown):boolean=>{
 if(a===b)return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object')return false;
 if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>exact(v,b[i]));
 const x=a as RecordValue,y=b as RecordValue,keys=Object.keys(x);return keys.length===Object.keys(y).length&&keys.every(k=>Object.hasOwn(y,k)&&exact(x[k],y[k]));
};
const status=(n:number)=>n===1?'unique recorded source':n===0?'unavailable in selected history':'multiple recorded matches';
/** Original top-level outputs only. Episode membership is not a causal necessity claim. */
export function affectLearningEpisodeSources(snapshot:AffectSnapshot,eventId:string){
 const end=snapshot.timeline.findIndex(e=>e.id===eventId),apply=snapshot.timeline[end];
 if(!apply||apply.stage!=='apply')throw Error('Unknown learning application event');
 const history=snapshot.timeline.slice(0,end);
 if(new Set(snapshot.timeline.map(e=>e.id)).size!==snapshot.timeline.length)throw Error('Duplicate timeline event identity');
 const parsed:unknown=JSON.parse(apply.input),empty=Array.isArray(parsed)&&parsed.length===0;
 const input=empty?{}:object(parsed);
 if(!empty&&(input.record!=='AffectConditionalEvidence#752/1'||!Array.isArray(input['EpisodeBasis [3]'])))throw Error('Unknown conditional episode schema');
 const outputs=(event:typeof apply):unknown[]=>{const values:unknown=JSON.parse(event.output);if(!Array.isArray(values))throw Error('Invalid episode source output');return values;};
 const matches=(value:unknown,stage:string,before:typeof apply,parent:boolean)=>history.filter(e=>e.stage===stage&&snapshot.timeline.indexOf(e)<snapshot.timeline.indexOf(before)&&(!parent||before.parents.includes(e.id))&&outputs(e).some(v=>exact(v,value)));
 const link=(e:typeof apply)=>({eventId:e.id,at:e.instant});
 const evidence=empty?[]:matches(input,'evidence',apply,true);
 const describe=(value:unknown,role:string)=>{
  const frozen=object(value);if(frozen.record!=='AffectFrozenObservation#751/1')throw Error('Unknown frozen episode schema');
  const freezes=matches(frozen,'freeze',apply,false).map(f=>{
   const tracked=object(frozen['Observation [2]']);
   if(!exact(JSON.parse(f.input),tracked))throw Error('Frozen observation differs from freeze input');
   const tracks=matches(tracked,'track',f,true).map(t=>{
    const admitted=object(JSON.parse(t.input));
    const observations=matches(admitted,'observe',t,true).map(link);
    return{...link(t),observationStatus:status(observations.length),observations};
   });
   return{...link(f),trackStatus:status(tracks.length),tracks};
  });
  return{role,frozen,freezeStatus:status(freezes.length),freezes};
 };
 return{version:'affect-learning-episode/0.1',identity:{runHash:snapshot.runHash,saveHash:snapshot.saveHash},eventId,at:apply.instant,
  conditionalEvidencePresent:!empty,evidenceStatus:empty?'no conditional evidence supplied':status(evidence.length),evidence:evidence.map(link),samplePresent:Object.hasOwn(input,'Sample [4]'),
  current:empty?null:describe(input['Current [2]'],'Current'),episodeBasis:((input['EpisodeBasis [3]']??[]) as unknown[]).map((v,i)=>describe(v,`Episode basis ${i+1}`)),
  scope:'Researcher-only recorded conditional evidence and ordered episode membership. Exact top-level output joins; evidence, track and observation joins also require recorded parent edges. Current remains separate from EpisodeBasis. Missing and multiple sources stay explicit. No physical-frame input is read; these links do not establish causal necessity, complete experience ancestry or player disclosure.'};
}
