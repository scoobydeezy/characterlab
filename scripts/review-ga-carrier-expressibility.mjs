import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const crosswalkPath='docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV17.json',out='docs/planning/GA_CARRIER_EXPRESSIBILITY_REVIEW_REV1.json';assert(!fs.existsSync(out));
const crosswalk=JSON.parse(fs.readFileSync(crosswalkPath)),sources=crosswalk.sources.filter(s=>s.path.endsWith('.json'));
const records=sources.flatMap(s=>JSON.parse(fs.readFileSync(s.path)).records??[]);
const inherited=new Set(crosswalk.boundaries.filter(b=>b.mode==='InheritedRecordRoles').map(b=>b.record));
const identities=new Set(crosswalk.positions.map(p=>p.identity));
const primitives=new Set(['OutputCount','PhaseOrdinal','PositiveRational','Instant','Glyph','VersionText','Boolean','False','Rational','NonnegativeRational','OriginalAddress','ViewOrdinal','FieldOrdinal','SourceBound','ViewCount','Cell','UnitRational','PositiveUnitRational','OneToTwoRational','LatticeMass','GraphScale','DecayExponent','RecallCount','MemorySlotCount','GraphNodeCount','GraphEdgeCount','SignalLimit','SignalViewLimit','SignalByteLimit','SignalCount']);
function validate(rs){
 assert.equal(rs.length,163);const byName=new Map(rs.map(r=>[r.name,r]));assert.equal(byName.size,rs.length);const edges=new Map(rs.map(r=>[r.name,new Set()]));let unions=0;
 function type(t,owner,field=false){
  assert(t&&typeof t==='object');
  if(t.kind==='ref'){assert(byName.has(t.name)||inherited.has(t.name)||identities.has(t.name)||primitives.has(t.name),'unknown reference '+t.name);if(byName.has(t.name))edges.get(owner).add(t.name);return;}
  if(t.kind==='optional'){assert(field,'canonical absence requires an optional record field');type(t.value,owner,false);return;}
  if(t.kind==='enum'){assert(Array.isArray(t.values)&&t.values.length&&t.values.every(v=>typeof v==='string'&&v.length));assert.equal(new Set(t.values).size,t.values.length);return;}
  if(t.kind==='union'){assert(t.alternatives.length>=2);assert(t.alternatives.every(t=>t.kind==='ref'&&(byName.has(t.name)||inherited.has(t.name))),'union alternatives must have distinct record schema discriminators');assert.equal(new Set(t.alternatives.map(t=>t.name)).size,t.alternatives.length);unions++;t.alternatives.forEach(t=>type(t,owner,false));return;}
  assert(['list','set','map'].includes(t.kind),'unsupported grammar '+t.kind);assert(Number.isSafeInteger(t.min)&&Number.isSafeInteger(t.max)&&t.min>=0&&t.max>=t.min&&t.max<=1024);
  if(t.kind==='map'){type(t.key,owner,false);type(t.value,owner,false);}else type(t.element,owner,false);
 }
 for(const r of rs){assert(r.name&&r.fields.length>0);assert.equal(new Set(r.fields.map(f=>f.name)).size,r.fields.length);for(const f of r.fields){assert(typeof f.name==='string'&&f.name);type(f.type,r.name,true);}}
 const visiting=new Set(),done=new Set();function visit(n){assert(!visiting.has(n),'recursive carrier '+n);if(done.has(n))return;visiting.add(n);for(const next of edges.get(n))visit(next);visiting.delete(n);done.add(n);}for(const n of byName.keys())visit(n);return {records:rs.length,unionFields:unions,primitiveNames:primitives.size};
}
const counts=validate(records),field=(rs,n)=>rs.find(r=>r.name===n).fields[0];
const faults=[
 ['duplicate-record',rs=>rs[1].name=rs[0].name],
 ['duplicate-field',rs=>rs[0].fields.push(structuredClone(rs[0].fields[0]))],
 ['unknown-reference',rs=>field(rs,'GeneralDefinitionBinding').type={kind:'ref',name:'Unknown'}],
 ['optional-list-element',rs=>field(rs,'SurvivingEpisodeLedger').type.element={kind:'optional',value:field(rs,'SurvivingEpisodeLedger').type.element}],
 ['ambiguous-union',rs=>{const t=rs.find(r=>r.name==='Recollection').fields.find(f=>f.name==='Content').type;t.alternatives[1]=structuredClone(t.alternatives[0]);}],
 ['unbounded-collection',rs=>field(rs,'SurvivingEpisodeLedger').type.max=Infinity],
 ['recursive-record',rs=>field(rs,'GeneralDefinitionBinding').type={kind:'ref',name:'GeneralDefinitionBinding'}],
 ['callable-field',rs=>field(rs,'GeneralDefinitionBinding').type={kind:'function'}],
 ['enum-collision',rs=>field(rs,'GeneralDefinitionBinding').type.values.push(field(rs,'GeneralDefinitionBinding').type.values[0])]
].map(([name,change])=>{const rs=structuredClone(records);change(rs);assert.throws(()=>validate(rs),name);return {name,rejected:true};});
for(const s of sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(out,JSON.stringify({status:'CARRIER STRUCTURAL EXPRESSIBILITY PASS; NUMERIC AND PUBLIC GATES OPEN',...counts,faults,sources:[crosswalkPath,'scripts/review-ga-carrier-expressibility.mjs'].map(fp),limits:['Exact record layout expressibility only; not semantic relational invariants or public model admission.','Each union member still needs its distinct reviewed numeric record identity.']},null,2)+'\n');
