import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('../',import.meta.url));
const planning='docs/planning/';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const registry=JSON.parse(read(planning+'RESEARCH_OBLIGATIONS.json'));
const verdicts=[...read(planning+'VERDICT_LEDGER.md').matchAll(/^## `?(VER-C3-[A-Z0-9-]+)/gm)].map(m=>m[1]);
const reports=fs.readdirSync(path.join(root,planning)).filter(n=>/^(CAMPAIGN3_|GENERAL_ATTENTION_|GA_).*QUALIFICATION.*\.md$/.test(n)).map(n=>planning+n);

function check(data,requiredVerdicts=verdicts,requiredReports=reports){
 const need=(ok,message)=>{if(!ok)throw Error(message);};
 const nonempty=x=>typeof x==='string'&&x.trim().length>0;
 const evidence=p=>{
  need(nonempty(p),'missing evidence path');
  const resolved=path.resolve(root,p),relative=path.relative(root,resolved);
  need(!path.isAbsolute(relative)&&!relative.startsWith('..')&&fs.existsSync(resolved)&&fs.statSync(resolved).isFile(),`invalid evidence: ${p}`);
 };
 need(data.version===1,'unsupported registry version');
 const ids=new Set();
 for(const o of data.obligations){
  need(/^RO-C3-\d{3}$/.test(o.id)&&!ids.has(o.id),`duplicate/invalid obligation: ${o.id}`);ids.add(o.id);
  need(['ACTIVE','CONDITIONAL','CLOSED'].includes(o.status),`invalid status: ${o.id}`);
  for(const key of ['title','distinction','established','unresolved','owner','reopenTrigger','doesNotBlock','closureRequirement'])need(nonempty(o[key]),`missing ${key}: ${o.id}`);
  need(Array.isArray(o.blocks)&&o.blocks.length>0&&o.blocks.every(nonempty),`missing blocked claims: ${o.id}`);
  need(o.evidence?.length>0,`missing evidence: ${o.id}`);o.evidence.forEach(evidence);
  need(o.verdicts?.length>0&&o.verdicts.every(v=>requiredVerdicts.includes(v)),`unknown verdict: ${o.id}`);
  if(o.status==='CLOSED'){
   need(o.closure&&['RESOLVED_BY_EXPERIMENT','RETAINED_DISTINCTION','RETIRED_BY_EVIDENCE'].includes(o.closure.disposition),`invalid closure disposition: ${o.id}`);
   need(nonempty(o.closure.rationale)&&o.closure.evidence?.length>0,`missing closure evidence: ${o.id}`);
   o.closure.evidence.forEach(evidence);
  }else need(o.closure===null,`open obligation has closure: ${o.id}`);
 }
 function reviews(rows,key,required){
  const seen=new Set();
  for(const row of rows){
   need(!seen.has(row[key]),`duplicate review: ${row[key]}`);seen.add(row[key]);
   if(key==='path')evidence(row.path);else need(required.includes(row.verdict),`unknown reviewed verdict: ${row.verdict}`);
   need(Array.isArray(row.obligations),`missing disposition: ${row[key]}`);
   need(new Set(row.obligations).size===row.obligations.length,'duplicate obligation reference');
   need(row.obligations.length>0||nonempty(row.noneRemainingReason),`no obligations or explicit none-remaining reason: ${row[key]}`);
   for(const id of row.obligations){
    need(ids.has(id),`unknown obligation: ${id}`);
    if(key==='verdict')need(data.obligations.find(o=>o.id===id).verdicts.includes(row.verdict),`asymmetric verdict reference: ${id}`);
   }
  }
  for(const id of required)need(seen.has(id),`missing review: ${id}`);
 }
 reviews(data.verdictReviews,'verdict',requiredVerdicts);
 reviews(data.reportReviews,'path',requiredReports);
 for(const o of data.obligations)for(const v of o.verdicts)need(data.verdictReviews.find(r=>r.verdict===v)?.obligations.includes(o.id),`unindexed obligation: ${o.id}`);
 return {active:data.obligations.filter(o=>o.status==='ACTIVE').length,conditional:data.obligations.filter(o=>o.status==='CONDITIONAL').length,closed:data.obligations.filter(o=>o.status==='CLOSED').length,unowned:0,verdicts:requiredVerdicts.length,reports:data.reportReviews.length};
}

const result=check(registry);
if(process.argv.includes('--self-test')){
 const corruptions=[
  d=>{d.obligations[0].owner='';},
  d=>{d.obligations.push(structuredClone(d.obligations[0]));},
  d=>{d.verdictReviews.pop();},
  d=>{d.reportReviews=[];},
  d=>{d.verdictReviews[0].obligations=['RO-C3-999'];},
  d=>{d.obligations[0].evidence=['missing-research-evidence.json'];},
  d=>{d.obligations[0].status='CLOSED';},
  d=>{d.obligations[0].status='CLOSED';d.obligations[0].closure={disposition:'DEFERRED',rationale:'later',evidence:d.obligations[0].evidence};}
 ];
 for(const corrupt of corruptions){const copy=structuredClone(registry);corrupt(copy);assert.throws(()=>check(copy));}
 assert.throws(()=>check(registry,[...verdicts,'VER-C3-NEW-001']));
 assert.throws(()=>check(registry,verdicts,[...reports,planning+'CAMPAIGN3_NEW_QUALIFICATION.md']));
 console.log('PASS: 10 bookkeeping fault checks (in-memory; no files changed)');
}
const expected=`| Research obligations | **${result.active} active / ${result.conditional} conditional / ${result.unowned} unowned** |`;
assert(read(planning+'CURRENT.md').includes(expected),'CURRENT obligation counts are stale');
console.log('PASS: research obligation references and dispositions '+JSON.stringify(result));
