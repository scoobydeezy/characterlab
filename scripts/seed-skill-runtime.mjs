import fs from 'node:fs';
// Port scheduler transaction/provenance plumbing, preserving the predecessor file.
let code=fs.readFileSync('src/campaign3/workRuntime.ts','utf8').replaceAll('Work','Skill').replaceAll('WORK_VERSION','SKILL_VERSION').replaceAll('workRuntime','skillRuntime').replaceAll('./work','./skill').replaceAll('workspace','skill').replaceAll('workRecord','skillRecord').replaceAll('wid','sid').replaceAll('work/','skill/').replaceAll('1152','1153').replaceAll('maxSettlementWorkPerSimulationInstant:10n','maxSettlementWorkPerSimulationInstant:12n');
code=code.replace("canonicalEncode as enc,list,unsigned as u,typedIdentifier","canonicalEncode as enc,list,unsigned as u,signed,rational as q,typedIdentifier");
code=code.replace('TASKS,sid,eventId,journalPath,cachePath,taskPath','TASK,sid,eventId,skillPath,beliefPath,taskPath');
code=code.replace("import {observeSkill,skillOutput} from './skillSelection';\n",'');
// Names in the copied source originally start with lowercase work.
code=code.replace("import {observeWork,skillOutput} from './skillSelection';\n",'');
code=code.replace("import {workRaw,workReasons,workDecision} from './skillMath';","import {skillRaw,skillReasons,skillDecision,skillExecute,skillObserve,adaptSkill,learnSkill} from './skillMath';");
code=code.replace("let active=false,expected=new Map<bigint,string>();","const physical=new Map(input.events.map(e=>[e.dueAt,e.payload]));\n let active=false,expected=new Map<bigint,string>();");
code=code.replace("['skill','world','deadline'].includes(name)","name==='appraise'");
const from=code.indexOf("  if(name==='skill'){"),to=code.indexOf('  if(output)outputs.push(output);',from);
if(from<0||to<0)throw Error('template drift');
code=code.slice(0,from)+`  if(name==='appraise'){const prior=read(beliefPath);output=r(788,[occurrence(),signed(event.dueAt),...(prior?[prior]:[])]);}
  else if(name==='raw'){const task=read(taskPath);output=skillRaw(event.payload,!!task&&uint(f(rec(task,372n),1n))===1n,occurrence());}
  else if(name==='reasons')output=skillReasons(model,event.payload,occurrence());
  else if(name==='decision')output=skillDecision(event.payload,occurrence());
  else if(name==='intent')output=r(792,[occurrence(),event.payload]);
  else if(name==='expression'){const decision=rec(f(rec(event.payload,792n),2n),791n);output=r(793,[occurrence(),event.payload,list(decision.fields.has(4n)?[q(1,1)]:[])]);}
  else if(name==='plan'){const intent=rec(f(rec(event.payload,793n),2n),792n),decision=rec(f(intent,2n),791n),option=decision.fields.get(4n);output=r(794,[occurrence(),event.payload,...(option?[f(rec(option,395n),2n)]:[])]);}
  else if(name==='attempt')output=r(795,[occurrence(),event.payload]);
  else if(name==='execute'){
   const skill=read(skillPath)??fail('missing skill'),belief=model.settings.executionLaw===3?read(beliefPath):undefined,original=physical.get(event.dueAt)??fail('missing physical opportunity');
   output=skillExecute(model.settings,event.payload,original,skill,belief,occurrence());
   const outcome=rec(output,796n),practice=r(798,[occurrence(),f(rec(event.payload,795n),1n),f(outcome,6n),f(outcome,8n),f(outcome,4n)]);outputs.push(practice);emit('observe',output);emit('adapt',practice);
  }else if(name==='observe'){output=skillObserve(event.payload,physical.get(event.dueAt)??fail('missing observer apparatus'),occurrence());emit('learn',output);}
  else if(name==='adapt'){const prior=read(skillPath)??fail('missing skill'),result=adaptSkill(model.settings,prior,event.payload);output=r(799,[occurrence(),event.payload,prior,result.next,result.applied]);if(result.applied)write(skillPath,prior,result.next);}
  else if(name==='learn'){const prior=read(beliefPath),result=learnSkill(model.settings,prior,event.payload),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,event.payload],[3n,result.applied]]);if(prior)fields.set(4n,prior);if(result.next)fields.set(5n,result.next);output=r(800,fields);if(result.applied)write(beliefPath,prior,result.next!);}
`+code.slice(to);
code=code.replace('maxSettlementSkillPerSimulationInstant:10n','maxSettlementWorkPerSimulationInstant:12n').replace('if(index<4)','if(index<8)').replace("!['skill','world','observe','deadline'].includes(name)","name!=='appraise'").replace('inputProjection:event.payload','inputProjection:name===\'appraise\'?list([]):event.payload');
fs.writeFileSync('src/campaign3/skillRuntime.ts',code,{flag:'wx'});
