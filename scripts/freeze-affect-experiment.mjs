import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const path='docs/planning/AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json';assert(!fs.existsSync(path),'immutable destination exists');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'}),hash=b=>createHash('sha256').update(b).digest('hex');
try{
 const {affectOriginals,trained}=await server.ssrLoadModule('/src/test/affectFixtures.ts');
 const {affectRecord:r,decodeAffect:decode}=await server.ssrLoadModule('/src/campaign3/affectCodecs.ts');
 const {canonicalEncode:enc,list,signed}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {DEFAULT_SETTINGS}=await server.ssrLoadModule('/src/campaign3/affectModel.ts');
 const freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-affect-model-rev1/FREEZE.json')),runs=[];
 function add(name,trials=trained(),settings={},probes=2,seed=0,bytes){const full={...DEFAULT_SETTINGS,...settings},model=freeze.models.find(m=>Object.keys(full).every(k=>m.settings[k]===full[k]));assert(model,name+' model unavailable');runs.push({name,model:model.name,seed,orderedInputs:Buffer.from(bytes??affectOriginals(trials,probes)).toString('hex')});}
 for(const candidate of [1,2,3])for(const p of [.5,1])for(const severity of [.5,1])for(const vulnerability of [.5,1])for(const control of [0,1]){
  const trials=[{glyph:0,outcome:true},{glyph:0,outcome:p===1},{glyph:1,action:1,outcome:true},{glyph:1,action:2,outcome:control===0}].map(t=>({...t,reserve:1-vulnerability}));
  add(`factor-${candidate}-${p}-${severity}-${vulnerability}-${control}`,trials,{candidate,severity});
 }
 add('baseline');add('hidden',trained({hidden:true}));add('false-current',trained().map((t,i)=>i===0?{...t,outcome:false}:t));
 for(const [name,change] of [['missing-motion',{missingMotion:true}],['missing-action',{actionVisible:false}],['censored',{monitor:false}],['no-opportunity',{opportunity:false}],['denied',{permitted:false}],['outcome-hidden',{outcomeVisible:false}]])add(name,trained().map((t,i)=>i===2?{...t,...change}:t));
 add('ineffective',trained().map((t,i)=>i===2?{...t,outcome:true}:t));add('zero-baseline',trained().map((t,i)=>i===1?{...t,outcome:false}:t));
 add('unknown-catalogue',trained({catalogue:0}));add('empty-catalogue',trained({catalogue:1}));add('unknown-reserve',trained({reserveVisible:false}));
 for(const candidate of [1,2,3])add('feedback-'+candidate,trained(),{candidate,feedback:true});
 for(const learningLaw of [2,3])add('learning-'+learningLaw,[...trained(),{glyph:0,outcome:false}],{learningLaw});add('learning-mean',[...trained(),{glyph:0,outcome:false}]);
 const contrast=[{glyph:0,outcome:true},{glyph:1,action:1,outcome:false},{glyph:1,action:1,outcome:true},{glyph:1,action:2,outcome:false}];add('relative',contrast);add('absolute',contrast,{controlLaw:2});
 add('no-safety',trained().map((t,i)=>i===2?{...t,outcome:true}:t),{safety:0});add('blocked-execution',trained(),{execution:false});add('no-obligation',trained(),{obligation:0});add('neutral-goal',trained(),{severity:0});
 // Preregister a finite seed grid; report all responses, never just a chosen witness.
 for(let seed=0;seed<8;seed++)for(const obligation of [.1,10])add(`choice-${seed}-${obligation}`,trained().map((t,i)=>i===2?{...t,outcome:true}:t),{obligation},1,seed);
 // Same learned danger, later reserve context improves; the new Before observation
 // cannot itself complete a trial or supply danger evidence.
 const base=decode(affectOriginals(trained().map((t,i)=>i===2?{...t,outcome:true}:t),0)).items;
 const context=decode(affectOriginals([{glyph:0,outcome:false,reserve:1}],0)).items[0].fields.get(2n);
 add('relief',[],{},0,0,enc(list([...base,r(749,[signed(10),context]),r(749,[signed(11)]),r(749,[signed(12)])])));
 const plan={date:'2026-09-21',status:'FROZEN BEFORE PUBLIC QUALIFICATION',contract:'affect-public/0.1-candidate',modelFreezeSha256:hash(fs.readFileSync('docs/planning/campaign3-affect-model-rev1/FREEZE.json')),claims:['3 candidates x16 factorial cells','fixed truth/different belief','same safe observations/hidden truth variation','missing cue/action versus observed inaction','unknown/zero efficacy and availability','matched affect/competing motive seed grid','strict later feedback/NoFeedback','relief without learning','inherited reasons and execution','every complete prefix and next-step restore'],runs};
 fs.writeFileSync(path,JSON.stringify(plan,null,2)+'\n',{flag:'wx'});console.log(`Frozen ${runs.length} public runs.`);
}finally{await server.close();}
