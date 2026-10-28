import {list,text,signed,unsigned,canonicalEncode as enc,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {semanticStateAuthorityRegistryValue} from '../../semanticBinding/semanticStateAuthority';
import {RECOGNITION,catalogEntries,compileRecognition} from '../../assembled/recognition';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {RECOGNITION_RULES,RECOGNITION_REGISTRY} from '../../assembled/model';
import {sid} from '../../assembled/skill';
import {configurationSource,configurationData,items,key,decode} from './assembledConfiguration';
import {target} from './assembledSocial';
export const other=semanticReferentFromAuthoredContent(sid(1038,'content/recognition/other'));
export const templates=['template/known-coat','template/other-coat'];
export const declaration=()=>list([text(RECOGNITION),other,list(templates.map(text)),semanticStateAuthorityRegistryValue()]);
export const recognitionModelSource=()=>{const s=configurationSource();return {...s,rulesVersion:RECOGNITION_RULES,registrySchemaVersion:RECOGNITION_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),declaration()]))};};
export type CueFrame={at:number;signals?:[number,boolean][];continuity?:boolean;form?:boolean|null;access?:boolean;hidden?:CanonicalValue};
export function recognitionData(targetCue=true,seed=0,frames:CueFrame[]=[{at:1,signals:[[targetCue?0:1,true]]},{at:2,signals:[[targetCue?0:1,true]],continuity:true}]){
 const d=configurationData(true,seed),state=restoreAuthoritativeState(decode(d.initialState));
 const initial=new AuthoritativeState([...state.entries(),...catalogEntries(compileRecognition(declaration(),target))]);
 const original=items(decode(d.orderedInputs),'list'),social=items(original.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list')[3];
 const rows=original.filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE));
 for(const frame of frames){const base=[...items(social,'list')];base[4]=unsigned(frame.at);base[5]=frame.access??true;rows.push(list([signed(frame.at),unsigned(110),SOCIAL_SOURCE,list([text(RECOGNITION),list(base),frame.hidden??target,frame.continuity??false,list(frame.form===null?[]:[frame.form??true]),list((frame.signals??[]).map(([i,v])=>list([text(templates[i]),v])))]),list([])]));}
 return {...d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))};
}
export {target,decode,items,key,enc};
