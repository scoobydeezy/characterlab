import {it,expect} from 'vitest';
import {affectAppraisalEvent} from '../workbench/affectAppraisalEvent';
import {AffectSupplementRun} from '../workbench/affectSupplementAdapter';
const load=(name:string)=>import(/* @vite-ignore */ name);const {default:fs}=await load('node:fs');
const retained=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-browser-rev1/comparison.json','utf8'));
it('joins only the unique top-level emitter and preserves exact original event values',()=>{
 let count=0;for(const s of [retained.a,retained.b])for(const e of s.timeline.filter((e:any)=>e.stage==='appraise')){const output=JSON.parse(e.output).find((r:any)=>r.record==='AffectAppraisal#754/1'),source=JSON.stringify(output);expect(affectAppraisalEvent(s.timeline,source)).toEqual(e);count++;}
 expect(count).toBe(22);
 const events=retained.a.timeline,event=events.find((e:any)=>e.stage==='appraise'),source=JSON.stringify(JSON.parse(event.output)[0]);
 expect(()=>affectAppraisalEvent([...events,event],source)).toThrow('Ambiguous');
 expect(()=>affectAppraisalEvent([{...event,output:JSON.stringify([{record:'Wrapper',nested:JSON.parse(source)}])}],source)).toThrow('not present');
 const altered=JSON.parse(source);altered['Severity [4]']='0/1';expect(()=>affectAppraisalEvent(events,JSON.stringify(altered))).toThrow('not present');
 expect(()=>affectAppraisalEvent([{...event,phase:'60'}],source)).toThrow('not present');
});
it('joins both native interior branches through14 with stable historical source records',async()=>{
 const parity=JSON.parse(fs.readFileSync('docs/planning/workbench-affect-supplements-rev1/receipt.json','utf8'));
 for(const enabled of [false,true]){const program=`interior/candidate-2-feedback-${enabled}`,run=await AffectSupplementRun.create(program),history=new Map<string,string>();
  for(let prefix=1;prefix<=14;prefix++){await run.advance();const s=run.snapshot();for(const card of s.explanations.filter(c=>c.kind==='Appraisal')){const e=affectAppraisalEvent(s.timeline,card.provenance),body=JSON.stringify(e);expect(e.instant).toBe(card.at);if(history.has(card.id))expect(body).toBe(history.get(card.id));else history.set(card.id,body);}}
  const s=run.snapshot(),end=parity.results.find((r:any)=>r.id===program).prefixes.at(-1);expect(s.stateHash).toBe(end.stateHash);expect(s.saveHash).toBe(end.saveHash);expect(history.size).toBe(14);
 }
},600000);
