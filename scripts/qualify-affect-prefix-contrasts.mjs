import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/AFFECT_PREFIX_CONTRASTS_REV1.json',planPath='docs/planning/AFFECT_PREFIX_CONTRAST_PLAN_REV1.json';assert(!fs.existsSync(output)&&!fs.existsSync(planPath));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),hash=b=>createHash('sha256').update(b).digest('hex'),unhex=s=>new Uint8Array(Buffer.from(s.trim(),'hex'));
try{
 const {createAffectRun,prepareAffectModel}=await server.ssrLoadModule('/src/campaign3/affectFactory.ts'),{decodeAffect:decode}=await server.ssrLoadModule('/src/campaign3/affectCodecs.ts'),{canonicalEncode:enc,list,rational:q}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const main=JSON.parse(fs.readFileSync('docs/planning/AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json')),freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-affect-model-rev1/FREEZE.json')),get=name=>main.runs.find(r=>r.name===name),pairs=[];
 pairs.push({name:'likelihood',a:get('factor-2-0.5-1-1-0'),b:get('factor-2-1-1-1-0'),prefix:3,field:8,firstDifferentAt:7});
 pairs.push({name:'control',a:get('factor-2-1-1-1-0'),b:get('factor-2-1-1-1-1'),prefix:9,field:10,firstDifferentAt:13});
 pairs.push({name:'feedback',a:get('baseline'),b:get('feedback-2'),prefix:10,field:6,firstDifferentAt:11});
 const relief=get('relief'),values=decode(unhex(relief.orderedInputs)).items,original=values[9],frame=original.fields.get(2n),fields=new Map(frame.fields);fields.set(14n,q(0,1));const unchanged={...original,fields:new Map([[1n,original.fields.get(1n)],[2n,{...frame,fields}]])};
 pairs.push({name:'vulnerability-relief',a:{...relief,name:'relief-context-held',orderedInputs:Buffer.from(enc(list([...values.slice(0,9),unchanged,...values.slice(10)]))).toString('hex')},b:relief,prefix:9,field:9,firstDifferentAt:11});
 fs.writeFileSync(planPath,JSON.stringify({status:'FROZEN BEFORE SUPPLEMENTARY EXECUTION',date:'2026-09-21',pairs},null,2)+'\n',{flag:'wx'});
 async function create(spec){const image=freeze.models.find(m=>m.name===spec.model),source={};let initialState;for(const file of image.files){const name=file.path.split('/').at(-1).split('.')[0],bytes=fs.readFileSync(file.path);assert.equal(hash(bytes),file.sha256);if(['parameters','content','registry'].includes(name))source[name]=unhex(bytes.toString());if(name==='initial-state')initialState=unhex(bytes.toString());}return createAffectRun(await prepareAffectModel(source),{initialState,orderedInputs:unhex(spec.orderedInputs),runSeed:new Uint8Array(32).fill(spec.seed)});}
 const results=[];
 for(const p of pairs){const a=await create(p.a),b=await create(p.b);for(let i=0;i<p.prefix;i++){assert(await a.settleNextInstant());assert(await b.settleNextInstant());}const beforeA=a.snapshot(),beforeB=b.snapshot();assert(Buffer.from(beforeA.state).equals(Buffer.from(beforeB.state)));assert(Buffer.from(beforeA.outputs).equals(Buffer.from(beforeB.outputs)));
  while(await a.settleNextInstant()){}while(await b.settleNextInstant()){}const aa=decode(a.snapshot().outputs).items.filter(v=>v.schema?.typeId===754n),bb=decode(b.snapshot().outputs).items.filter(v=>v.schema?.typeId===754n);assert.equal(aa.length,bb.length);
  const first=aa.findIndex((x,i)=>!Buffer.from(enc(x.fields.get(BigInt(p.field))??false)).equals(Buffer.from(enc(bb[i].fields.get(BigInt(p.field))??false))));assert(first>=0);assert.equal(Number(aa[first].fields.get(2n).value),p.firstDifferentAt);
  if(['feedback','vulnerability-relief'].includes(p.name))assert(Buffer.from(a.snapshot().state).equals(Buffer.from(b.snapshot().state)));
  results.push({name:p.name,exactEqualPrefixInstants:p.prefix,sharedStateSha256:hash(beforeA.state),sharedOutputSha256:hash(beforeA.outputs),firstDifferentFactorAt:p.firstDifferentAt,field:p.field});console.log('PASS',p.name);
 }
 fs.writeFileSync(output,JSON.stringify({date:'2026-09-21',status:'PASS',runs:8,planSha256:hash(fs.readFileSync(planPath)),results,scope:'Supplementary exact pre-intervention and causal-timing contrasts. Main91-run receipt owns complete-prefix restore counts.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
