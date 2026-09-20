/** Bounded concrete instances of the accepted GA calibration/content carriers.
 * Recipe construction is separate from cohort identity and runtime qualification. */
import recipes from '../../docs/planning/GA_COHORT_SOURCE_RECONCILIATION_REV1.json';
import {canonicalEncode as enc,list,set,text,unsigned as u,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {generalRecord as r,generalId as id,generalDefinitionId as d,generalContentId as c,generalSubject,generalBindingContext,generalPurposeDefinitions,generalSchemaRef} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {buildGeneralSourceEntries} from './generalSourceDeclarations';
import {buildGeneralProtocolEntries} from './generalProtocolDeclarations';
import {buildGeneralCreditSourceEntries} from './generalCreditSourceDeclarations';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';

export const generalCreditRecipes=['credit-age-only','credit-use-only','credit-shared-protection','credit-significance-first'] as const;
export const generalFootprintRecipes=['Independent','HistoricalShared','HistoricalHybrid','RetiredFlat'].flatMap(law=>['sparse','dense'].map(size=>'footprint-'+law+'-'+size));
export const isGeneralCreditRecipe=(name:string)=>(generalCreditRecipes as readonly string[]).includes(name);
export function generalRecipeNames(){return [...recipes.recipes.filter(r=>r.scope==='PUBLIC PACKAGING TARGET; NOT YET A MODEL').map(r=>r.name),...generalCreditRecipes,'source-consequence-lane',...generalFootprintRecipes];}
export function generalRecipe(name:string){const credit=isGeneralCreditRecipe(name),footprint=generalFootprintRecipes.includes(name),found=recipes.recipes.find(r=>r.name===(footprint?'allocation-spatial':credit||name==='source-consequence-lane'?'baseline':name)&&r.scope==='PUBLIC PACKAGING TARGET; NOT YET A MODEL');if(!found)throw Error('GA_UNADMITTED_RECIPE');const value=structuredClone(found.parameters);if(credit)value.access.capacity=8;if(footprint){value.encoding.law=name.split('-')[1];value.selection.algorithm='Priority';value.selection.capacity=2;}return value;}
const fraction=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return q(n,d);};
export function buildGeneralDefinitionEntries(recipeName='baseline'){
 const p=generalRecipe(recipeName),credit=isGeneralCreditRecipe(recipeName),who=generalSubject(),entries:CanonicalValue[]=[];
 const add=(name:string,value:CanonicalValue,version='general-attention-carrier/0.1-candidate',kind='registry/general-attention-definition')=>entries.push(r(171,[d(name),id(1023,kind),text(version),value]));
 for(const [name,version] of [['character','content-kind'],['task-commitment','task-content-kind'],['bodily-maintenance-goal','general-attention-carrier'],['attention-scene-object','attention-content-kind']])entries.push(r(171,[id(1004,'semantic-kind/'+name),id(1023,'registry/semantic-kind'),text(version+'/0.1-candidate'),r(329,[generalSchemaRef(170)])]));
 for(const [name,kind,version] of [['character','character','governed-domain-validator'],['task','task-commitment','task-domain-validator'],['maintenance-goal','bodily-maintenance-goal','general-attention-carrier']])entries.push(r(171,[id(1021,'validator/'+name+'-qualification'),id(1023,'registry/domain-validator'),text(version+'/0.1-candidate'),r(330,[id(1004,'semantic-kind/'+kind)])]));
 add('body-selection',r(696,[u(3),u(3),u(65536),u(2)]));
 add('visual-selection',r(519,[u(['Priority','EqualPriority','Unlimited'].indexOf(p.selection.algorithm)+1),u(p.selection.capacity),text('attention-selection-component/0.1-candidate')]));
 add('spatial',r(687,[u(p.spatial.minX),u(p.spatial.maxX),u(p.spatial.minY),u(p.spatial.maxY),fraction(p.spatial.focal),fraction(p.spatial.pool)]));
 add('encoding',r(688,[u(['Independent','HistoricalShared','HistoricalHybrid','RetiredFlat'].indexOf(p.encoding.law)+1),fraction(p.encoding.floor),fraction(p.encoding.threshold)]));
 add('association',r(689,[u(p.association.scale),fraction(p.association.eta),fraction(p.association.decay)]));
 add('event-recall',r(690,[fraction(p.access.beta),u(p.access.scale),fraction(p.access.decay),u(p.access.exponent),fraction(p.access.omegaBase),fraction(p.access.omegaPull),u(p.access.capacity)]));
 add('body-recall',r(691,[u(credit?8:2)]));add('goal-baseline-recall',r(691,[u(1)]));
 add('retention',r(692,[u(8),u(8),u(credit?generalCreditRecipes.indexOf(recipeName as typeof generalCreditRecipes[number])+1:4)]));add('graph-retention',r(693,[u(30),u(870)]));
 add('feedback',r(694,[p.feedback.encoding!=='Disabled',p.feedback.retrieval!=='Disabled']));
 add('goal-qualification',r(697,[u(1)]));add('run-bounds',r(695,[u(32),signed(100)]));
 add('prediction',r(359,[id(1005,'channel/regulatory-probe'),who.character,id(1039,'unit/fixture-pulse'),u(16)]),'measurement-prediction/0.2-candidate','registry/measurement-prediction');
 add('workspace',r(378,[d('prediction'),u(p.source.capacity),p.source.taskAccess,p.source.predictionAccess]),'task-cognitive-path/0.1-candidate');
 add('concern',r(385,[fraction(p.source.concernGain),true]),'task-cognitive-path/0.1-candidate');
 add('task',r(370,[c('subject'),d('prediction'),fraction(p.source.taskInterval[0]),fraction(p.source.taskInterval[1]),signed(2),signed(21)]),'task-commitment/0.2-candidate','registry/task-commitment-spec');
 for(const n of ['A','B','C']){
  add('reserve-'+n,r(453,[id(1039,'unit/general-reserve'),q(100,1),q(n==='A'?1:0,1)]),'embodied-reserve/0.1-candidate');
  add('signal-domain-'+n,r(556,[q(0,1),q(100,1)]));
 }
 add('body',r(646,[set(['A','B','C'].map(n=>r(645,[r(644,[who.character,id(1044,'local-reserve/'+n)]),d('reserve-'+n)])))]));
 add('channels',r(648,[set(['A','B','C'].map(n=>r(647,[id(1005,'channel/'+n),who.observer,r(644,[who.character,id(1044,'local-reserve/'+n)]),id(1045,'interoceptive-signal/'+n),q(1,1),true,true])))]));
 const goalKey=r(557,[who.character,semanticReferentFromAuthoredContent(c('goal'))]);
 add('goal',r(558,[d('goal'),goalKey,id(1045,'interoceptive-signal/A'),r(556,[q(30,1),q(40,1)]),signed(1),signed(100)]));
 add('retention-control',r(699,[d('retention'),d('graph-retention'),d('association')]));
 // All8 purpose slots are concrete and distinct where the contracts distinguish
 // them. Individual originals must choose the exact requested subset at ingress.
 add('execution-policy',r(698,['BodySelection','VisualSelection','Spatial','Encoding','BodyRecall','GoalBaselineRecall','EventRecall','GoalQualification'].map(p=>d(generalPurposeDefinitions[p as keyof typeof generalPurposeDefinitions][1]))));
 let sourceEntries=buildGeneralSourceEntries(p);
 if(generalFootprintRecipes.includes(recipeName))sourceEntries=sourceEntries.map(value=>{
  const row=rec(value,171n);if(key(f(row,1n))!==key(d('scene')))return value;const scene=rec(f(row,4n),660n),fields=new Map(row.fields);
  const frames=items(f(scene,2n),'list').map(value=>{const frame=rec(value,659n),objects=items(f(frame,2n),'list'),selected=recipeName.endsWith('-sparse')?objects.slice(0,1):objects;
   return r(659,[f(frame,1n),list(selected.map((object,index)=>{if(index===0)return object;const fields=new Map(rec(object,658n).fields);fields.set(2n,id(1003,'event-role/participant'));return r(658,fields);}))]);});
  fields.set(4n,r(660,[f(scene,1n),list(frames)]));return r(171,fields);
 });
 if(recipeName==='source-consequence-lane')sourceEntries=sourceEntries.map(value=>{const row=rec(value,171n);if(key(f(row,1n))!==key(d('observation-originals')))return value;const fields=new Map(row.fields);fields.set(4n,list(items(f(row,4n),'list').map(original=>{const fields=new Map(rec(original,665n).fields);fields.set(5n,u(2));return r(665,fields);})));return r(171,fields);});
 entries.push(...(credit?buildGeneralCreditSourceEntries(sourceEntries):sourceEntries),...buildGeneralProtocolEntries());
 return decode(enc(set(entries)),generalBindingContext());
}
export function buildGeneralContent(){
 const plain=(name:string,kind:string)=>r(170,[c(name),id(1004,kind),...Array.from({length:14},()=>list([]))]);
 const delegated=(name:string,kind:string)=>{
  const fields=new Map<bigint,CanonicalValue>([[1n,c(name)],[2n,id(1004,kind)]]);
  for(let n=3;n<=16;n++)fields.set(BigInt(n),list([3,7,8,10,11,13,16].includes(n)?[d(name)]:n===12?[c('subject')]:[]));
  return r(170,fields);
 };
 return set([plain('subject','semantic-kind/character'),delegated('task','semantic-kind/task-commitment'),delegated('goal','semantic-kind/bodily-maintenance-goal'),...['a','b','c'].map(n=>plain('scene-'+n,'semantic-kind/attention-scene-object'))]);
}

