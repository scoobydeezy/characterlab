import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/OBSERVED_MARKER_TRACKING_REVIEW_REV2.json';assert(!fs.existsSync(output));
const changes=[
 ['current-collision','&&detections.filter(x=>x.glyph===d.glyph).length===1','','current'],
 ['previous-collision','old.length===1','old.length>=1','previous'],
 ['observation-replay',"if(used.has(input.observationId))fail('replayed observation');",'','replay'],
 ['horizon','f.sweeps>=8','f.sweeps>8','horizon'],
 ['early-private-mutation','const f=get(token);own(input','const f=get(token);f.sweeps++;own(input','atomic'],
 ['sparse-admission',"if(Object.keys(properties).length!==input.detections.length+1)fail('dense detection array');",'','denseBoundary'],
];
async function probe(change){let substitutions=0;const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',plugins:change?[{name:'marker-fault',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').endsWith('/src/campaign3/observedMarkerTracking.ts')){assert.equal(code.split(change[1]).length-1,1);substitutions++;return code.replace(change[1],change[2]);}}}]:[]});try{
 const m=await server.ssrLoadModule('/src/campaign3/observedMarkerTracking.ts'),make=()=>m.createMarkerTracker('observer/a'),sweep=(n,g)=>({observerId:'observer/a',observationId:BigInt(n*10),occurredAt:BigInt(n),detections:g.map((glyph,i)=>({detectionId:BigInt(n*10+i+1),glyph:BigInt(glyph)}))});
 const a=make();m.applyMarkerSweep(a,sweep(1,[1]));const current=new Set(m.applyMarkerSweep(a,sweep(2,[1,1])).map(x=>x.perceptualReferentId.observerTrackSequence)).size;
 const b=make();m.applyMarkerSweep(b,sweep(1,[1,1]));const previous=m.applyMarkerSweep(b,sweep(2,[1]))[0].continuityKind;
 const c=make();m.applyMarkerSweep(c,sweep(1,[1]));let replay=false;try{m.applyMarkerSweep(c,{...sweep(2,[2]),observationId:10n});}catch{replay=true;}
 const d=make();let horizon=0;for(let i=0;i<9;i++)try{m.applyMarkerSweep(d,sweep(i,[]));horizon++;}catch{}
 const e=make(),before=m.markerTrackingSnapshot(e).sweeps;try{m.applyMarkerSweep(e,sweep(1,[9]));}catch{}const atomic=m.markerTrackingSnapshot(e).sweeps===before;
 const f=make(),sparse=sweep(1,[]);sparse.detections=new Array(2);sparse.detections[1]={detectionId:12n,glyph:1n};let denseBoundary=false;try{m.applyMarkerSweep(f,sparse);}catch(error){denseBoundary=String(error).includes('dense detection array');}
 return {current,previous,replay,horizon,atomic,denseBoundary,substitutions};
 }finally{await server.close();}}
const baseline=await probe();assert.deepEqual(baseline,{current:2,previous:'NewTrack',replay:true,horizon:8,atomic:true,denseBoundary:true,substitutions:0});const faults=[];
for(const change of changes){const actual=await probe(change);assert.equal(actual.substitutions,1);assert.notDeepEqual(actual[change[3]],baseline[change[3]]);faults.push({name:change[0],removed:change[1],inserted:change[2],baseline:baseline[change[3]],actual:actual[change[3]],detected:true});}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),tests=JSON.parse(fs.readFileSync('docs/planning/OBSERVED_MARKER_TRACKING_TESTS_REV2.json'));assert(tests.success&&tests.numPassedTests===9);
fs.writeFileSync(output,JSON.stringify({status:'OMT-A..H QUALIFIED AT COMPONENT SCOPE; DENSE-LIST CORRECTION',tests:9,faults,baseline,sources:['src/campaign3/observedMarkerTracking.ts','src/test/observedMarkerTracking.test.ts','src/test/observedMarkerTrackingShape.test.ts','src/semanticBinding/perceptualContinuantFiles.ts','docs/formal/OBSERVED_MARKER_TRACKING_COMPONENT.md','scripts/review-observed-marker-tracking-forward.mjs'].map(fp),evidence:fp('docs/planning/OBSERVED_MARKER_TRACKING_TESTS_REV2.json'),history:fp('docs/planning/OBSERVED_MARKER_TRACKING_REVIEW_REV1.json'),limits:['Component qualification only. No authenticated public source, persistent layout or corpus verdict. Sparse-list fault tests structural-stage rejection; original implementation also rejected later without publishing state.']},null,2)+'\n');console.log({tests:9,faults:faults.length});
