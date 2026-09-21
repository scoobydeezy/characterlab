import fs from 'node:fs';import {createServer} from 'vite';import {createHash} from 'node:crypto';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const {relationshipInputs,relationshipScenario}=await server.ssrLoadModule('/src/test/relationshipFixtures.ts'),freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-relationship-model-rev2/FREEZE.json')),runs=[],base='candidate-1-law-1-reverse-0',add=(name,model,xs=relationshipScenario())=>runs.push({name,model,orderedInputs:Buffer.from(relationshipInputs(xs)).toString('hex')});for(const m of freeze.models)add(m.name,m.name);
add('no-shared-acquisition',base,relationshipScenario().map(x=>x.at<=2?{...x,participants:0}:x));
add('denied-acquisition',base,relationshipScenario().map(x=>x.at<=2?{...x,a:false}:x));
add('no-explanation',base,relationshipScenario().map(x=>x.at===6?{...x,a:false}:x));
add('no-rupture',base,relationshipScenario().map(x=>x.at===5?{...x,kind:0}:x));
add('contact-present',base,relationshipScenario().map(x=>x.at===8?{...x,contactA:true}:x));
add('fixed-display-cooperation',base,relationshipScenario().map(x=>x.at<=2?{...x,display:1}:x));
add('fixed-display-breach',base,relationshipScenario().map(x=>x.at<=2?{...x,kind:2,display:1}:x));
for(const kind of [0,2])for(const model of [base,'candidate-5'])add('hidden-'+kind+'-'+model,model,relationshipScenario().map(x=>x.at===4?{...x,kind,display:3,a:false}:x));
add('empty',base,[]);add('maximum',base,Array.from({length:12},(_,i)=>({at:i+1,kind:1,participants:1,claim:i===11?1:0})));
fs.writeFileSync('docs/planning/RELATIONSHIP_PUBLIC_EXPERIMENT_PLAN_REV2.json',JSON.stringify({date:'2026-09-21',status:'FROZEN BEFORE PUBLIC QUALIFICATION',contract:'relationship-public/0.2-candidate',freezeSha256:createHash('sha256').update(fs.readFileSync('docs/planning/campaign3-relationship-model-rev2/FREEZE.json')).digest('hex'),claims:['equal current person estimate/different own history and contact responses','prospective response only: analytical score-win probabilities distinguished from effective Auto/roll choice probabilities','rupture then positive explanation without erased history','absence feasibility versus retained history','nonparticipant and nonrecipient isolation','fixed-display hidden truth noninterference','derived/cache equality and alternative rupture laws','reverse-order semantic equality with stable authored RNG roots','all complete-prefix saves/views/continuations'],runs},null,2)+'\n',{flag:'wx'});console.log('Frozen '+runs.length+' runs');}finally{await server.close();}

