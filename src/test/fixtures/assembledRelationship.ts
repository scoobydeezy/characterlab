import {canonicalEncode as enc,list,text,signed,unsigned,type CanonicalValue,rational as q} from '../../substrate/canonicalEncoding';
import {cognitiveRecord as r} from '../../campaign2/cognitiveCodecs';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items} from '../../campaign2/canonicalData';
import {RELATIONSHIP_RULES,RELATIONSHIP_REGISTRY} from '../../assembled/model';
import {REL,REL_SOURCE} from '../../assembled/relationship';
import {sid} from '../../assembled/skill';
import {socialSource,socialData,type Frame as SocialFrame} from './assembledSocial';
import {changeDefinition} from './assembledCharacter';
export const contact=sid(1027,'definition/protocol-contact-one');
export const relationshipSource=()=>{const s=changeDefinition(socialSource(),'definition/task-reason-dice',3n,r(439,[q(1,4),unsigned(3)]));return {...s,rulesVersion:RELATIONSHIP_RULES,registrySchemaVersion:RELATIONSHIP_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(REL),contact])]))};};
export type Interaction={at:number;kind?:number;participant?:boolean;access?:boolean;display?:number};
export const relationshipFrame=(x:Interaction)=>list([signed(x.at),unsigned(110),REL_SOURCE,list([text(REL),unsigned(x.kind??1),x.participant??true,x.access??true,unsigned(x.display??0)]),list([])]);
export function relationshipData(cooperation=true,seed=0,xs:Interaction[]=[{at:1,kind:cooperation?1:2},{at:2,kind:cooperation?1:2}],social?:SocialFrame[]){const d=socialData(true,seed,social);return {...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...xs.map(relationshipFrame)]))};}
