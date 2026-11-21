/** M204 plan6d362ce0: M202 nonsocial taskB/route1, actual failures10/12/14.
 * Body30/cap100/rate10/delivery90@9, seed0; only visible context/goal differ. */
import {fixture as prior,decode,items,key,enc,list,text,signed,u,taskB,type CanonicalValue} from './assembledInterferenceBoundaries';
import {interferenceSources} from '../interferenceExpectationFixtures';
import {INTERFERENCE_ACQUISITION_RULES,INTERFERENCE_ACQUISITION_REGISTRY} from '../../assembled/model';
import {INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
export * from './assembledInterferenceBoundaries';
export type ScopeCase='main'|'otherContext'|'noContext'|'recovery'|'hidden'|'goalZero'|'witness';
export function fixture(name:ScopeCase='main'){
 const b=prior(name==='hidden'?'hidden':'main'),spec=interferenceSources()[name==='recovery'||name==='hidden'?'noContext':name==='witness'?'main':name];
 const scope=(at:number)=>name==='recovery'&&at>=16?1:spec.contexts[at-10]==='A'?1:spec.contexts[at-10]==='B'?0:null;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],at=Number((a[0] as {value:bigint}).value);
  if(key(a[2])===key(INTERFERENCE_CONTEXT)){const p=[...items(a[3],'list')],c=scope(at);p[2]=c===null?list([]):u(c);p[3]=u(spec.goal);a[3]=list(p);}
  if(name==='witness'&&at===10&&key(a[2])===key(OBSTRUCTION_SOURCE)){const p=[...items(a[3],'list')];p[3]=list([taskB]);a[3]=list(p);}
  return list(a);
 });
 return {...b,name,s:{...b.s,rulesVersion:INTERFERENCE_ACQUISITION_RULES,registrySchemaVersion:INTERFERENCE_ACQUISITION_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))},scope,goal:spec.goal};
}
