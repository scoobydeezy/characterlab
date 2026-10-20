import {SemWorkbenchRun} from './semAdapter';
import catalog from './semCatalog.json';
export async function verifySemReplay(run:SemWorkbenchRun){
 const before=run.snapshot(),checkpoint=run.checkpoint(),restored=await SemWorkbenchRun.restore(checkpoint),after=restored.snapshot();
 const fields=(['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash'] as const).map(name=>({name,before:before[name],after:after[name],equal:before[name]===after[name]}));
 if(JSON.stringify(run.checkpoint())!==JSON.stringify(checkpoint))throw Error('SEM replay inspection changed active run');
 return {version:'sem-replay-inspection/0.1',prefix:before.prefix,clock:before.clock,fixture:structuredClone(catalog),checkpoint,fields,projectionEqual:JSON.stringify(before)===JSON.stringify(after),scope:'Exact accepted integrated-harness prefix replay. Original incremental scheduling and empty input commitment preserved. This checks native state/output/trace/save, not general recognition or causal necessity.'};
}
