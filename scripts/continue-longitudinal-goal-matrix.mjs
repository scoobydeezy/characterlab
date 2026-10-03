// Sequential continuation of the already-running trajectory computation, not a schedule.
import fs from 'node:fs';import {spawn} from 'node:child_process';
const dir='docs/planning/longitudinal-goal-execution-rev1/',log='docs/planning/LONGITUDINAL_GOAL_EXECUTION_PROGRESS.log';
const note=s=>{const line=new Date().toISOString()+' '+s+'\n';fs.appendFileSync(log,line);console.log(s);};
async function command(args){note('START '+args.join(' '));await new Promise((resolve,reject)=>{const c=spawn(process.execPath,args,{stdio:['ignore','pipe','pipe'],windowsHide:true});for(const stream of [c.stdout,c.stderr])stream.on('data',b=>{fs.appendFileSync(log,b);process.stdout.write(b);});c.on('error',reject);c.on('exit',code=>code===0?resolve():reject(Error('exit '+code+': '+args.join(' '))));});}
try{
 note('Waiting for the active frozen trajectory pass; no duplicate trajectory worker launched.');
 const deadline=Date.now()+12*60*60*1000;
 while(true){
  let ready=true;for(let i=0;i<120;i++){const file=dir+String(i).padStart(3,'0')+'.json';try{JSON.parse(fs.readFileSync(file));}catch{ready=false;break;}}
  if(ready)break;if(Date.now()>deadline)throw Error('Trajectory wait exceeded12h; existing receipts retained.');await new Promise(resolve=>setTimeout(resolve,30000));
 }
 await command(['scripts/check-longitudinal-goal-matrix.mjs','--trajectories','--write']);
 await command(['scripts/qualify-longitudinal-goal.mjs','--replay']);
 await command(['scripts/check-longitudinal-goal-matrix.mjs','--write']);
 note('COMPLETE: frozen matrix and all joined-prefix successors verified; scientific verdict/bookkeeping still requires review.');
}catch(e){note('FAILED: '+(e?.stack??e));process.exitCode=1;}
