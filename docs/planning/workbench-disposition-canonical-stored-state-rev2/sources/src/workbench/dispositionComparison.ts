import plan from '../../docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json';
import type {DispositionSnapshot} from './dispositionAdapter';
import {dispositionCase,type DispositionCase} from '../test/dispositionAdaptationFixtures';
import {dispositionOrdered,VERSION} from '../campaign3/dispositionPublicModel';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {digest,exactText,fromHex} from './canonical';
export interface DispositionContrast{id:string;a:string;b:string;kind:'model'|'input';changed:string;}
const key=(r:{law:string;name:string})=>r.law+'/'+r.name;
const row=(id:string)=>{const found=plan.runs.find(r=>key(r)===id);if(!found)throw Error('Unknown DISPOSITION original');return found;};
const settings=(a:ReturnType<typeof row>,b:ReturnType<typeof row>)=>(['law','constitution'] as const).filter(k=>a[k]!==b[k]);
const contrasts:DispositionContrast[]=[];
for(let i=0;i<plan.runs.length;i++)for(let j=i+1;j<plan.runs.length;j++){
 const a=plan.runs[i],b=plan.runs[j],changed=settings(a,b);
 if(a.inputsSha256===b.inputsSha256&&changed.length===1)contrasts.push({id:`model/${a.index}/${b.index}`,a:key(a),b:key(b),kind:'model',changed:changed[0]});
}
for(const r of plan.runs.filter(r=>r.law==='Plastic'&&r.constitution===0&&r.name!=='Main'))contrasts.push({id:`input/${r.name}`,a:'Plastic/Main',b:key(r),kind:'input',changed:'Original input calendar; exact changes are listed. Seed0 changes routed instant seeds, not the fixed run seed.'});
export const DISPOSITION_CONTRASTS:readonly DispositionContrast[]=Object.freeze(contrasts.map(c=>Object.freeze(c)));
function differences(a:unknown,b:unknown,path='$'):Array<{path:string;a:unknown;b:unknown}>{
 if(JSON.stringify(a)===JSON.stringify(b))return [];
 if(a!==null&&b!==null&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){
  const x=a as Record<string,unknown>,y=b as Record<string,unknown>;
  return [...new Set([...Object.keys(x),...Object.keys(y)])].flatMap(k=>differences(x[k],y[k],`${path}/${k.replace(/~/g,'~0').replace(/\//g,'~1')}`));
 }
 return [{path,a:a===undefined?{missing:true}:a,b:b===undefined?{missing:true}:b}];
}
async function original(id:string){const r=row(id),c=dispositionCase(r as DispositionCase),inputs=dispositionOrdered(c.profile,c.frames);if(await digest(inputs)!==r.inputsSha256)throw Error('DISPOSITION original input mismatch');return {row:r,inputs:JSON.parse(exactText(decodeDispositionPublic(inputs))),modelHash:await digest(fromHex(r.modelIdentity)),runHash:await digest(fromHex(r.runIdentity))};}
export async function compareDisposition(id:string,a:DispositionSnapshot,b:DispositionSnapshot){
 const contrast=DISPOSITION_CONTRASTS.find(c=>c.id===id);if(!contrast||contrast.a!==a.program||contrast.b!==b.program)throw Error('DISPOSITION requires its declared ordered pair');
 const originals=await Promise.all([original(a.program),original(b.program)]),changedSettings=settings(originals[0].row,originals[1].row);
 for(const [i,s] of [a,b].entries()){
  const o=originals[i],constitution=o.row.constitution===0?'0/1':o.row.constitution+'/8';
  if(s.seamVersion!==VERSION||s.modelHash!==o.modelHash||s.runHash!==o.runHash||s.law!==o.row.law||s.constitution!==constitution)throw Error('DISPOSITION original identity mismatch');
  if(!Number.isInteger(s.prefix)||s.prefix<0||s.prefix>18||s.clock!==String(s.prefix)||s.complete!==(s.prefix===18)||s.timeline.length!==s.prefix*10)throw Error('DISPOSITION committed prefix mismatch');
  if(new Set(s.fields.map(f=>f.path)).size!==s.fields.length)throw Error('DISPOSITION duplicate diagnostic path');
 }
 if(contrast.kind==='model'&&(changedSettings.length!==1||originals[0].row.inputsSha256!==originals[1].row.inputsSha256))throw Error('DISPOSITION model contrast mismatch');
 if(contrast.kind==='input'&&(changedSettings.length!==0||originals[0].row.modelIdentity!==originals[1].row.modelIdentity))throw Error('DISPOSITION input contrast mismatch');
 const aligned=a.prefix===b.prefix,paths=[...new Set([...a.fields,...b.fields].map(f=>f.path))];
 const summary=(s:DispositionSnapshot)=>({program:s.program,prefix:s.prefix,clock:s.clock,constitution:s.constitution,law:s.law,modelHash:s.modelHash,runHash:s.runHash,stateHash:s.stateHash,saveHash:s.saveHash,projectionHash:s.projectionHash});
 return {version:'disposition-contrast-inspection/0.1',contrast:{...contrast},changedSettings,aligned,inputHashes:originals.map(o=>o.row.inputsSha256),inputDifferences:differences(originals[0].inputs,originals[1].inputs),runSeed:'00'.repeat(32),
  mechanismProjectionEqual:aligned?a.projectionHash===b.projectionHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,saveEqual:aligned?a.saveHash===b.saveHash:null,
  fields:aligned?paths.map(path=>{const x=a.fields.find(f=>f.path===path),y=b.fields.find(f=>f.path===path);return {path,root:x?.root??y!.root,a:x?.exact??null,b:y?.exact??null,equal:x?.exact===y?.exact};}):[],a:summary(a),b:summary(b),
  scope:'Derived diagnostics from trusted committed adapter snapshots; not a standalone save authenticator. Mechanism projection equality is not observer knowledge equality. Constitution, plastic adaptation, effective disposition, identity standing and execution remain distinct. No general personality, qualified character narration or independent causal necessity claim.',
  alignment:'Equal committed native prefixes only. Unequal prefixes withhold equality and field comparison.',randomPolicy:'Original run seed is fixed; input calendars retain their routed instant seeds. Equal seeds do not establish equal addressed draws or action causes.'};
}
