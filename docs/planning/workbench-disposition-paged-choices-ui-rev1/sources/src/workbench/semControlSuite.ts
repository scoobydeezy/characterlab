import {SEM_CONTROL_IDS,SEM_CONTROL_PAIRS,runSemControl,compareSemControl} from './semControls';
export async function runSemControlSuite(){
 const cases=[];for(const id of SEM_CONTROL_IDS)cases.push(await runSemControl(id));
 const pairs=[];for(const pair of SEM_CONTROL_PAIRS)pairs.push(await compareSemControl(pair.id));
 return {version:'sem-component-suite/0.1',cases,pairs,scope:'Original component experiments, separate from the active integrated run. No scheduler checkpoint or native RunIdentity is created. Uninvoked causal consumers are reported as unavailable, not equal.'};
}
