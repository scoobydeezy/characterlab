import {it,expect} from 'vitest';
// @ts-expect-error Evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
import plan from '../../docs/planning/SKILL_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import freeze from '../../docs/planning/campaign3-skill-model-rev1/FREEZE.json';
import prior from '../../docs/planning/SKILL_PUBLIC_EXPERIMENT_REV1.json';
import {skillRecipe,compileSkillModel,type SkillSettings} from '../campaign3/skillModel';
import {prepareSkillModel,createSkillRun} from '../campaign3/skillFactory';
import {decodeSkill} from '../campaign3/skillCodecs';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),hex=(s:string)=>Uint8Array.from(s.match(/../g)??[],x=>parseInt(x,16));
it('original286: all52 frozen skill sources retain every279 complete-prefix hash',async()=>{
 const results=[];let prefixes=0;
 for(const p of plan.runs){const frozen=freeze.models.find(m=>m.name===p.model)!,s=skillRecipe(frozen.settings as SkillSettings),m=await compileSkillModel(s);expect(key(m.modelIdentity.value)).toBe(frozen.modelIdentity);
  for(const file of frozen.files)expect(hash(new TextEncoder().encode(readFileSync(file.path,'utf8').replace(/\r\n/g,'\n')))).toBe(file.sha256);
  const r=await createSkillRun(await prepareSkillModel(s),{initialState:enc(m.initial.canonicalValue()),orderedInputs:hex(p.orderedInputs),runSeed:new Uint8Array(32)}),before=prior.results.find(r=>r.name===p.name)!;
  const hashes=[hash(r.save())];for(let n=0;n<16;n++){if(!await r.settleNextInstant())break;hashes.push(hash(r.save()));if(n===15)throw Error('original cap');}
  expect(hashes).toEqual(before.prefixSaveSha256);expect(hash(r.save())).toBe(before.finalSaveSha256);expect(r.diagnostic()).toBeUndefined();prefixes+=hashes.length;
  const rows=items(decodeSkill(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===796n).map(v=>{const x=rec(v,796n);return {K:key(f(rec(f(x,3n),784n),1n)),engaged:f(x,6n),success:f(x,7n),practice:f(x,8n)};});
  results.push({name:p.name,model:p.model,settings:frozen.settings,source:hash(hex(p.orderedInputs)),prefixes:hashes,rows});
 }
 expect(results).toHaveLength(52);expect(prefixes).toBe(279);
 const path='docs/planning/ASSEMBLED_CHARACTER_M286_EVIDENCE.json',e=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};e.original={runs:52,prefixes,results};writeFileSync(path,JSON.stringify(e,null,2)+'\n');console.info('M286 original52/prefix279 PASS');
},560000);
