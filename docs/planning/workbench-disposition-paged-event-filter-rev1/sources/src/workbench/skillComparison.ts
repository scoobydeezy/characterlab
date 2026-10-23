import catalog from './skillCatalog.json';
import type {SkillSnapshot} from './skillAdapter';
type Setting=keyof (typeof catalog.models)[number]['settings'];
export interface SkillContrast {id:string;label:string;kind:'input'|'model';changed:string;a:string;b:string;}
export const SKILL_CONTRASTS:SkillContrast[]=[];
const model=(name:string)=>{const m=catalog.models.find(m=>m.name===name);if(!m)throw Error('Unknown SKILL model');return m;};
const program=(name:string)=>{const r=catalog.programs.find(r=>r.name===name);if(!r)throw Error('Unknown SKILL program');return r;};
const difference=(a:string,b:string)=>(Object.keys(model(a).settings) as Setting[]).filter(k=>model(a).settings[k]!==model(b).settings[k]);
for(let i=0;i<catalog.models.length;i++)for(let j=i+1;j<catalog.models.length;j++){
 const a=catalog.models[i],b=catalog.models[j],diff=difference(a.name,b.name);if(diff.length!==1)continue;
 SKILL_CONTRASTS.push({id:'model/'+a.name+'/'+b.name,label:a.name+' / '+b.name,kind:'model',changed:diff[0]+' only. Initial competence changes include their exact initial state; all calendars and seeds fixed. Execution3/4 and permanent impairment remain violating controls.',a:a.name,b:b.name});
}
const add=(id:string,a:string,b:string,kind:'input'|'model',changed:string)=>SKILL_CONTRASTS.push({id,label:id,kind,changed,a,b});
add('hidden-competence','physical-0','physical-1','model','Initial competence0/1, including native initial state; hidden-feedback calendar fixed.');
add('temporary-impairment','impair-0','impair-0.5','input','First opportunity impairment0/0.5 only; later recovery input fixed.');
add('displayed-performance','belief-1','belief-2','input','First displayed result success/failure only; physical competence and later hidden feedback fixed.');
for(const law of [2,3])add('practice-law-'+law,'practice-1','practice-'+law,'model','Practice law only; two hidden practice attempts then fixed difficulty5/8 probe.');
add('impairment-law','impair-law-1','impair-law-2','model','Multiplicative/additive impairment law only; identical difficulty5/16 and impairment1/4.');
add('permanent-impairment-control','impair-0.5','permanent-recovery','model','Permanent impairment parameter only; violating unlearning control versus temporary impairment and recovery.');
add('belief-as-skill-control','incompetent-confident','confidence-as-skill','model','Execution law only; violating belief-as-skill control under identical displayed success.');
add('intent-as-success-control','physical-0','intent-as-success','model','Execution law only; violating intent-as-success control with hidden feedback.');
add('blocked-engagement','k0.5-p1-e1','blocked','input','Compound declared fixture: permission disabled and displayed success configured; not a single-factor contrast.');
add('hidden-feedback','k0.5-p1-e1','no-feedback','input','Monitor visibility removed throughout the same physical/practice calendar.');
for(const name of ['last-observation','no-learning'])add('contradiction-'+name,'contradiction-k0.5-p1-e1','contradiction-'+name,'model','Belief learning law only on identical contradictory displays.');
for(const [a,b] of [['0.4375','0.5'],['0.5','0.5625']])add('threshold/'+a+'/'+b,'threshold-'+a,'threshold-'+b,'input','Physical difficulty only, spanning inclusive execution threshold; feedback hidden.');
export function compareSkill(id:string,a:SkillSnapshot,b:SkillSnapshot){
 const contrast=SKILL_CONTRASTS.find(c=>c.id===id);if(!contrast||a.program!==contrast.a||b.program!==contrast.b)throw Error('SKILL requires its declared ordered pair');
 if(a.seamVersion!=='skill-public/0.1-candidate'||b.seamVersion!==a.seamVersion)throw Error('SKILL seam mismatch');
 const originals=[program(a.program),program(b.program)],models=originals.map(r=>model(r.model));if(originals.some(r=>r.seed!==0))throw Error('SKILL requires original zero seed');
 if(contrast.kind==='input'&&(a.modelHash!==b.modelHash||models[0].name!==models[1].name))throw Error('Input contrast requires one model');
 const changedSettings=difference(models[0].name,models[1].name);
 if(contrast.kind==='model'&&(a.modelHash===b.modelHash||originals[0].orderedInputs!==originals[1].orderedInputs||changedSettings.length!==1))throw Error('Model contrast requires one changed setting and identical inputs');
 if(!changedSettings.includes('initial')&&models[0].initialState!==models[1].initialState)throw Error('SKILL unexpected initial-state difference');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock;
 const summary=(s:SkillSnapshot)=>({program:s.program,prefix:s.prefix,clock:s.clock,complete:s.complete,modelHash:s.modelHash,runHash:s.runHash,stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash});
 return {version:'skill-contrast-inspection/0.1',contrast:structuredClone(contrast),aligned,changedSettings,originals:structuredClone(originals),models:structuredClone(models),runSeed:'00'.repeat(32),alignment:'Same committed prefix and instant only; actual competence and evidence-derived belief remain distinct state leaves.',randomPolicy:'Original zero seed; single admitted option is Auto. Seed equality alone does not establish general stochastic coupling.',outputsEqual:aligned?a.outputsHash===b.outputsHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,saveEqual:aligned?a.saveHash===b.saveHash:null,a:summary(a),b:summary(b),scope:'Exact researcher records only. Whole-output inequality is not evidence of cognitive inequality: truth-side execution and practice are included. No character-safe projection or narrative claim.'};
}
