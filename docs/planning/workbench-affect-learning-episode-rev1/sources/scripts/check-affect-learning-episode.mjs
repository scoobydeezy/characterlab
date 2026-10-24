import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const root='docs/planning/workbench-affect-learning-episode-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');fs.mkdirSync(root);const write=(p,v)=>fs.writeFileSync(root+'/'+p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const paths=['src/workbench/affectLearningEpisodeSources.ts','src/workbench/AffectLearningEpisodePanel.tsx','src/workbench/AffectTimelineView.tsx','scripts/check-affect-learning-episode.mjs'];
write('freeze.json',{sources:paths.map(path=>{const b=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return{path,copy,sha256:sha(b)};})});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {affectLearningEpisodeSources:project}=await server.ssrLoadModule('/src/workbench/affectLearningEpisodeSources.ts'),{AffectLearningEpisodePanel:Panel}=await server.ssrLoadModule('/src/workbench/AffectLearningEpisodePanel.tsx');
 const prior='docs/planning/workbench-affect-appraisal-reads-rev1',results=[];let roles=0,historyChecks=0;
 for(const entry of read(prior+'/receipt.json').results){const bytes=fs.readFileSync(prior+'/'+entry.file);assert.equal(sha(bytes),entry.sha256);const {snapshot:s}=JSON.parse(bytes),before=sha(JSON.stringify(s));const reports=[];
  for(const event of s.timeline.filter(e=>e.stage==='apply')){
   const report=project(s,event.id);assert.equal(report.evidence.length,1);const input=JSON.parse(event.input);assert.deepEqual(report.current.frozen,input['Current [2]']);assert.deepEqual(report.episodeBasis.map(r=>r.frozen),input['EpisodeBasis [3]']);
   for(const row of [report.current,...report.episodeBasis]){assert.equal(row.freezes.length,1);const f=row.freezes[0];assert.equal(f.tracks.length,1);assert.equal(f.tracks[0].observations.length,1);roles++;}
   const prefix={...s,timeline:s.timeline.slice(0,s.timeline.indexOf(event)+1)};assert.deepEqual(project(prefix,event.id),report);historyChecks++;
   const html=renderToStaticMarkup(React.createElement(Panel,{snapshot:s,eventId:event.id,onSelect:()=>{}}));assert(html.includes('data-affect-learning-episode'));assert(!html.includes('role="alert"'));reports.push(report);
  }
  assert.equal(sha(JSON.stringify(s)),before);results.push({program:s.program,reports});
 }
 const s=read(prior+'/baseline.json').snapshot,r=project(s,'60');assert.deepEqual(r.evidence.map(e=>e.eventId),['59']);assert.deepEqual(r.episodeBasis.map(row=>[row.freezes[0].eventId,row.freezes[0].tracks[0].eventId,row.freezes[0].tracks[0].observations[0].eventId]),[['32','31','30'],['45','44','43'],['58','57','56']]);assert.deepEqual(r.current.frozen,r.episodeBasis[2].frozen);
 const missing=structuredClone(s);missing.timeline=missing.timeline.filter(e=>e.id!=='30');assert.equal(project(missing,'60').episodeBasis[0].freezes[0].tracks[0].observationStatus,'unavailable in selected history');
 const parent=structuredClone(s);parent.timeline.find(e=>e.id==='31').parents=[];assert.equal(project(parent,'60').episodeBasis[0].freezes[0].tracks[0].observations.length,0);
 const poison=structuredClone(s);poison.timeline.find(e=>e.id==='30').output='[]';assert.equal(project(poison,'60').episodeBasis[0].freezes[0].tracks[0].observations.length,0);
 const changed=structuredClone(s);changed.timeline.find(e=>e.id==='32').input='{}';assert.throws(()=>project(changed,'60'),/freeze input/);
 const physical=structuredClone(s);for(const e of physical.timeline.filter(e=>e.stage==='observe'))e.input='not parsed';assert.deepEqual(project(physical,'60'),r);
 const duplicate=structuredClone(s);duplicate.timeline.push(duplicate.timeline[0]);assert.throws(()=>project(duplicate,'60'),/Duplicate/);assert.throws(()=>project(s,'59'),/application/);
 const multiple=structuredClone(s),original=multiple.timeline.find(e=>e.id==='30'),copy={...original,id:'synthetic-observation'};multiple.timeline.splice(multiple.timeline.indexOf(original),0,copy);multiple.timeline.find(e=>e.id==='31').parents.push(copy.id);assert.equal(project(multiple,'60').episodeBasis[0].freezes[0].tracks[0].observationStatus,'multiple recorded matches');
 write('reports.json',{results});write('receipt.json',{status:'PASS BOUNDED CONDITIONAL EPISODE SOURCES',programs:results.length,applications:results.reduce((n,r)=>n+r.reports.length,0),roles,historyChecks,negativeAndBoundaryChecks:8,reportsHash:sha(fs.readFileSync(root+'/reports.json')),scope:'Four authenticated original terminal snapshots. Every apply inspected; exact ordered Current/EpisodeBasis, one freeze/track/observe source per role, prefix truncation stability, no physical input read. Not full corpus, browser integration or complete experience ancestry.'});console.log({programs:results.length,roles,historyChecks});
}catch(error){write('failure.json',{error:String(error),stack:error.stack});throw error;}finally{await server.close();}
