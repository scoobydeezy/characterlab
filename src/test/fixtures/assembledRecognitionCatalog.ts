import {list,text,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {semanticStateAuthorityRegistryValue} from '../../semanticBinding/semanticStateAuthority';
import {CATALOG_RULES,CATALOG_REGISTRY} from '../../assembled/model';
import {RECOGNITION_CATALOG,catalogEntries,compileRecognition} from '../../assembled/recognition';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {sid} from '../../assembled/skill';
import {encounterModelSource,encounterData,target,other,decode,items,key,enc,type EncounterFrame} from './assembledEncounter';
export type Entry={candidate:CanonicalValue;templates:string[]};
export type Frame=Omit<EncounterFrame,'signals'>&{signals?:[string,boolean][]};
export const candidate=(n:number)=>semanticReferentFromAuthoredContent(sid(1038,'content/catalog/person-'+n));
export const entriesFor=(shared=false):Entry[]=>[{candidate:target,templates:['appearance/coat','appearance/voice']},{candidate:other,templates:[shared?'appearance/coat':'appearance/plain']},{candidate:candidate(2),templates:['appearance/stripe']},{candidate:candidate(3),templates:['appearance/hat']}];
export const declaration=(entries:Entry[])=>list([text(RECOGNITION_CATALOG),list(entries.map(e=>list([e.candidate,list(e.templates.map(text))]))),semanticStateAuthorityRegistryValue()]);
export function catalogSource(entries=entriesFor()){const s=encounterModelSource();return {...s,rulesVersion:CATALOG_RULES,registrySchemaVersion:CATALOG_REGISTRY,registry:enc(list([...items(decode(s.registry),'list').slice(0,21),declaration(entries)]))};}
export function catalogData(shared=false,seed=0,frames:Frame[]=[{at:1,signals:[['appearance/coat',true]]},{at:2,signals:[['appearance/coat',true]],continuity:true}],entries=entriesFor(shared)){
 const d=encounterData(true,seed,frames.map(x=>({...x,signals:[]}))),initial=restoreAuthoritativeState(decode(d.initialState));
 const state=new AuthoritativeState([...initial.entries().filter(e=>e.path.rootStateTypeId!==243n),...catalogEntries(compileRecognition(declaration(entries),target,true))]);
 const rows=items(decode(d.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[2])===key(SOCIAL_SOURCE)){const at=row[0];if(typeof at==='boolean'||at.kind!=='signed')throw Error('time');const frame=frames.find(f=>BigInt(f.at)===at.value)!,payload=[...items(row[3],'list')];payload[5]=list((frame.signals??[]).map(([template,support])=>list([text(template),support])));row[3]=list(payload);}return list(row);});
 return {...d,initialState:enc(state.canonicalValue()),orderedInputs:enc(list(rows))};
}
export {target,other,decode,items,key,enc};
