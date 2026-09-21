import fs from 'node:fs';import {createServer} from 'vite';import {createHash} from 'node:crypto';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const {longitudinalInputs,longitudinalScenario}=await server.ssrLoadModule('/src/test/longitudinalFixtures.ts'),freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-longitudinal-model-rev2/FREEZE.json')),runs=[],base='representation-2-law-1',add=(name,model,xs=longitudinalScenario(),seed=0)=>runs.push({name,model,seed,orderedInputs:Buffer.from(longitudinalInputs(xs)).toString('hex')});for(const m of freeze.models)add(m.name,m.name);
add('no-interference',base,longitudinalScenario().map(x=>x.at===16?{...x,interference:false}:x));
add('no-relearning',base,longitudinalScenario().map(x=>x.at===17?{...x,kind:0}:x));
add('denied-social',base,longitudinalScenario().map(x=>x.kind===3?{...x,access:false}:x));
add('witness-only',base,longitudinalScenario().map(x=>x.kind===3?{...x,participant:false}:x));
for(const physical of [false,true])add('fixed-display-'+physical,base,longitudinalScenario().map(x=>x.kind===3?{...x,physical,display:1}:x));
for(const law of [1,2])add('reordered-law-'+law,'representation-2-law-'+law,longitudinalScenario().map(x=>x.at===18?{...x,physical:true}:x.at===20?{...x,physical:false}:x));
// Single timestamp intervention: gap6 becomes gap3 at the retention event.
add('short-gap','rust',longitudinalScenario().map(x=>x.at===14?{...x,at:11}:x));
add('no-claim',base,longitudinalScenario().map(x=>x.at===7?{...x,access:false}:x));
add('seed-1',base,longitudinalScenario(),1);add('seed-2',base,longitudinalScenario(),2);
add('empty',base,[]);add('maximum-time',base,[{at:64,kind:2}]);
fs.writeFileSync('docs/planning/LONGITUDINAL_PUBLIC_EXPERIMENT_PLAN_REV2.json',JSON.stringify({date:'2026-09-21',status:'FROZEN BEFORE PUBLIC QUALIFICATION',contract:'longitudinal-public/0.2-candidate',freezeSha256:createHash('sha256').update(fs.readFileSync('docs/planning/campaign3-longitudinal-model-rev2/FREEZE.json')).digest('hex'),restoreCoverage:'Every committed prefix including S0 and terminal, followed by one next-instant continuation or terminal no-op; exact whole-save and current observer-view equality.',claims:['public biography plus skill plus relationship in one actor/timeline','FullHistory/Compact learned projection equality with genuinely different accessible detail','actual episode expiry, surviving learned state, episodic-only loss','isolated-family equality and destructive shared-slot failure','skill-only interference, rust and reacquisition','order-dependent rupture, false current claims without rewritten experience','fixed-display hidden truth equality and denied/witness controls','effective standing feedback and seed-dependent biography','all whole-prefix restores and continuations'],runs},null,2)+'\n',{flag:'wx'});console.log('Frozen '+runs.length+' runs');}finally{await server.close();}
