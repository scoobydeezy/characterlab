/** M179 current one-character source, no authored stress/affect stimulus. */
import {fixture as prior,type Mode} from './assembledAffectMemoryFinal';
import {decode,items,key,enc,list,text,signed,u,C} from './assembledFamiliarity';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {REGULATORY_STRESS_RULES,REGULATORY_STRESS_REGISTRY} from '../../assembled/model';
import {STRESS,stressPath,stressValue} from '../../assembled/regulatoryStress';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
export function fixture(mode:Mode='risk',enabled=true){
 const b=prior(mode),slots=[...items(decode(b.s.registry),'list'),list([text(STRESS),enabled,u(0),u(500)])];
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];if(mode!=='safe'||key(a[0])!==key(signed(9))||key(a[2])!==key(POSITION_SOURCE))return v;
  const p=[...items(a[3],'list')],annex=[...items(p[3],'list')];annex[1]=true;p[3]=list(annex);a[3]=list(p);return list(a);
 });
 const initial=restoreAuthoritativeState(decode(b.d.initialState));
 return {s:{...b.s,rulesVersion:REGULATORY_STRESS_RULES,registrySchemaVersion:REGULATORY_STRESS_REGISTRY,registry:enc(list(slots))},d:{...b.d,initialState:enc(new AuthoritativeState([...initial.entries(),{path:stressPath(C),value:stressValue(0n,0)}]).canonicalValue()),orderedInputs:enc(list(rows))}};
}
