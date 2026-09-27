/** Internal compilation of the finite multisource-public/0.1-candidate recipes.
 * Matching a construction recipe does not itself grant public frozen admission. */
import {canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue,StateAuthorityRegistry} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {snapshotMemorySource} from '../campaign2/memoryModel';
import {compileReceivingTaskContentDeclarations} from '../campaign2/taskDeclarations';
import type {Campaign2ModelSource} from '../campaign2/factory';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,invalidModel as fail} from '../campaign2/canonicalData';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import {decodeMultisource as decode} from './multisourcePublicCodecs';
import {multisourceRecipe,MS_CASES,MS_LAWS,msPath,msPattern,msId} from './multisourceModelRecipe';

let inventory:ReturnType<typeof multisourceRecipe>[]|undefined;
function recipes(){return inventory??=MS_CASES.flatMap(c=>MS_LAWS.filter(l=>l!=='DescriptionDice'||['duplicate','aggregate','orphan-removed'].includes(c)).map(l=>multisourceRecipe(c,l)));}
const equalBytes=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((n,i)=>n===b[i]);
export async function compileMultisourceModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input),approved=recipes().find(r=>equalBytes(source.parameters,r.source.parameters)&&equalBytes(source.registry,r.source.registry)&&equalBytes(source.content,r.source.content));
 if(!approved)fail('multisource source outside declared finite recipes');
 for(const [name,value] of Object.entries(approved.source))if(typeof value==='string'&&source[name as keyof Campaign2ModelSource]!==value)fail('multisource version bundle');
 const slots=items(decode(source.registry),'list'),profile=rec(decode(source.parameters),710n),base=slots[0];
 const content=await compileReceivingTaskContentDeclarations(source.content,enc(base));content.validateRecordRoles(enc(base));
 const holder=f(profile,2n),observer=f(profile,1n);content.qualifyCharacter(holder);
 const rows=items(items(base,'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const definition=(stable:CanonicalValue)=>decode(enc(f(rows.find(v=>key(f(v,1n))===key(stable))??fail('missing multisource definition'),4n)));
 const tasks=items(f(profile,3n),'list').map(v=>rec(v,708n)),reserves=items(f(profile,5n),'list').map(v=>rec(v,707n));
 for(const t of tasks){content.qualifyTask(f(rec(f(t,1n),371n),2n));if(key(f(rec(f(t,1n),371n),1n))!==key(holder))fail('task holder');rec(definition(f(t,2n)),370n);rec(definition(f(t,3n)),389n);}
 for(const value of items(f(profile,4n),'list')){const d=rec(value,709n),ground=rec(f(d,2n),494n),body=uint(f(ground,1n))===2n;
  if(body){const instruction=rec(definition(f(d,4n)),485n),criterion=rec(definition(f(profile,13n)),460n);
   if(key(f(instruction,1n))!==key(f(profile,13n))||key(f(instruction,2n))!==key(f(d,3n)))fail('body instruction/criterion/action binding');
   if(!readQ(f(criterion,2n)).equals(readQ(f(d,7n))))fail('body threshold binding');
  }else if(key(f(rec(definition(f(d,4n)),389n),1n))!==key(f(d,3n)))fail('task instruction/action binding');
 }
 const ownership=compileMutationAuthorityRegistry([{authorityName:'authority/general-attention-local-reserve',ownedLeaves:reserves.map(v=>({pattern:msPattern(msPath(649n,f(v,1n))),valueGrammar:{kind:'canonical-record' as const,recordTypeId:454n},removalAllowed:false}))},{authorityName:'authority/prospective-commitments',ownedLeaves:tasks.map(v=>({pattern:msPattern(msPath(373n,f(v,1n))),valueGrammar:{kind:'canonical-record' as const,recordTypeId:372n},removalAllowed:false}))}]);
 if(key(ownership.definitionValue)!==key(slots[3]))fail('multisource ownership declaration');
 const authority=new StateAuthorityRegistry(ownership.writableLeaves,ownership.authorities);
 const allowed=new Set([msPath(268n,observer),msPath(487n,holder),...reserves.map(v=>msPath(649n,f(v,1n))),...tasks.flatMap(v=>[msPath(373n,f(v,1n)),msPath(373n,f(v,1n),2n)])].map(p=>key(statePathValue(p))));
 function validateState(state:AuthoritativeState,at:bigint,initial=false){
  decode(enc(state.canonicalValue()));
  if(state.entries().some(e=>!allowed.has(key(statePathValue(e.path)))))fail('multisource state outside exact paths');
  const self=state.read(msPath(268n,observer)).value;if(!self||key(f(rec(self,267n),1n))!==key(holder))fail('multisource observer mapping');
  const adoption=state.read(msPath(487n,holder)).value;if(!adoption)fail('missing body adoption state');
  if(items(f(rec(adoption,486n),1n),'set').some(v=>key(v)!==key(msId(1027,'definition/embodied-response-a'))))fail('unadmitted body adoption');
  for(const reserve of reserves){const value=state.read(msPath(649n,f(reserve,1n))).value;if(!value)fail('missing local anchor');const anchor=rec(value,454n),amount=readQ(f(anchor,1n)),time=f(anchor,2n);
   if(amount.compare(ZERO)<0||amount.compare(readQ(f(reserve,2n)))>0||typeof time==='boolean'||time.kind!=='signed'||time.value<0n||time.value>at||initial&&time.value!==0n)fail('local anchor domain');
  }
  for(const task of tasks){const status=state.read(msPath(373n,f(task,1n))),plan=state.read(msPath(373n,f(task,1n),2n));if(status.presence!==plan.presence)fail('task adoption co-presence');
   if(status.presence){const tag=uint(f(rec(status.value!,372n),1n));if(initial?tag!==1n:tag!==1n&&tag!==3n)fail('unreachable task status');if(key(f(rec(plan.value!,390n),1n))!==key(f(task,3n)))fail('task instruction binding');}
  }
 }
 const modelIdentity=await createModelIdentity({...source,registryManifest:await commitManifest(decode(source.registry)),contentManifest:await commitManifest(decode(source.content)),parameterSet:await commitManifest(profile)});
 return Object.freeze({name:approved.name,caseName:approved.caseName,law:approved.law,modelIdentity,authority,content,definition,
  source:()=>snapshotMemorySource(source),profile:()=>rec(decode(enc(profile)),710n),stages:()=>items(decode(enc(slots[2])),'list'),work:uint(f(rec(f(profile,12n),133n),1n)),
  validateState,initialState(bytes:Uint8Array){const state=restoreAuthoritativeState(decode(bytes));validateState(state,0n,true);return state;},
  restoreState(value:CanonicalValue,at:bigint){const state=restoreAuthoritativeState(decode(enc(value)));validateState(state,at);return state;}});
}
