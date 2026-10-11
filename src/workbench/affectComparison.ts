import plan from '../../docs/planning/AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import timing from '../../docs/planning/AFFECT_PREFIX_CONTRAST_PLAN_REV1.json';
import supplements from './affectSupplementFixtures.json';
import fixtures from './affectFixtures.json';
import type {AffectSnapshot} from './affectAdapter';
export const AFFECT_OPTIONS=[...plan.runs.map(r=>r.name),...supplements.runs.map(r=>r.id)];
export interface AffectContrast {id:string;label:string;a:string;b:string;kind:'input'|'model';equalThrough:number|null;firstFactorDifference:number|null;changed:string;}
export const AFFECT_CONTRASTS:AffectContrast[]=[{id:'hidden-world',label:'Hidden physical world',a:'baseline',b:'hidden',kind:'input',equalThrough:null,firstFactorDifference:null,changed:'Physical truth changes while admitted evidence is fixed.'},
 ...timing.pairs.map(p=>({id:`timing/${p.name}`,label:`Timing · ${p.name}`,a:`timing/${p.name}/a`,b:`timing/${p.name}/b`,kind:(p.a.model===p.b.model?'input':'model') as 'input'|'model',equalThrough:p.prefix,firstFactorDifference:p.firstDifferentAt,changed:`Frozen ${p.name} contrast; exact outputs/state agree through prefix ${p.prefix}; the named appraisal factor first differs at instant ${p.firstDifferentAt}.`})),
 ...[1,2,3].map(c=>({id:`interior/${c}`,label:`Interior feedback · candidate ${c}`,a:`interior/candidate-${c}-feedback-false`,b:`interior/candidate-${c}-feedback-true`,kind:'model' as const,equalThrough:13,firstFactorDifference:14,changed:'Feedback setting only; identical original inputs and seed. Prior completed appraisal13 influences appraisal14; no universal feedback law is inferred.'}))];
export function affectPair(program:string){const c=AFFECT_CONTRASTS.find(c=>c.a===program||c.b===program);return c?(c.a===program?c.b:c.a):null;}
export function affectContrast(program:string){return AFFECT_CONTRASTS.find(c=>c.a===program||c.b===program);}
export function compareAffect(a:AffectSnapshot,b:AffectSnapshot){
 const contrast=affectContrast(a.program);
 if(!contrast||affectPair(a.program)!==b.program||a.seamVersion!=='affect-public/0.1-candidate'||b.seamVersion!==a.seamVersion)throw Error('AFFECT comparison requires a declared pair');
 const originals=[a,b].map(s=>plan.runs.find(r=>r.name===s.program)??supplements.runs.find(r=>r.id===s.program)!);
 if(originals[0].seed!==originals[1].seed)throw Error('AFFECT declared seeds must match');
 if(contrast.kind==='input'&&a.modelHash!==b.modelHash)throw Error('AFFECT declared input pair requires one model');
 if(contrast.kind==='model'&&(a.modelHash===b.modelHash||originals[0].orderedInputs!==originals[1].orderedInputs))throw Error('AFFECT declared model pair requires distinct models and identical original inputs');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock;
 return {version:'affect-pair-inspection/0.2',aligned,contrast:structuredClone(contrast),policy:'Declared frozen original programs and seeds. Native addressed draws are retained; shared seed alone does not establish general stochastic coupling. Equal-prefix and first-factor-difference claims refer to the named retained contrast, not arbitrary event ancestry.',
  programs:[a.program,b.program],originals:structuredClone(originals),models:originals.map(r=>structuredClone(fixtures.models.find(m=>m.name===r.model)!)),
  outputsEqual:aligned?a.outputsHash===b.outputsHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,exactSaveEqual:aligned?a.saveHash===b.saveHash:null,
  scope:'Bounded AFFECT programs only. Researcher traces are not character knowledge. Candidate coordinates are derived outputs, not stored emotion state or a universal affect law.',a:structuredClone(a),b:structuredClone(b)};
}
export function summarizeAffectComparison(report:ReturnType<typeof compareAffect>){
 const summarize=(s:AffectSnapshot)=>({program:s.program,seamVersion:s.seamVersion,prefix:s.prefix,clock:s.clock,complete:s.complete,modelHash:s.modelHash,runHash:s.runHash,stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash,events:s.timeline.length,fields:s.fields.length});
 const {a,b,...rest}=report;
 return {...structuredClone(rest),format:'affect-comparison-summary/0.1',detail:'Summary omits native output and trace bodies. Original inputs, model identities and exact result hashes remain; full comparison export retains the bodies.',a:summarize(a),b:summarize(b)};
}
