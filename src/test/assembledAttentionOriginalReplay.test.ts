import {it,expect} from 'vitest';
import {sha256} from '../substrate/crypto';
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
import results from '../../docs/planning/general-attention-public-comparisons-rev1/RESULTS.json';
import {generalAttentionModelSource as source,prepareGeneralAttentionModel as prepare,generalAttentionInitialState as initial,generalAttentionOrderedInputs as originals,createGeneralAttentionRun as create} from '../campaign3/generalFactory';
const digest=async(b:Uint8Array)=>Array.from(await sha256(b),x=>x.toString(16).padStart(2,'0')).join('');
const files=import.meta.glob('../../docs/planning/general-attention-public-comparisons-rev1/*.json',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
it('original124: all frozen GA histories and their36 comparisons preserve exact original bytes',async()=>{
 expect(results.runs).toHaveLength(43);expect(results.comparisons).toHaveLength(36);
 for(const entry of results.runs){
  const raw=files['../../'+entry.file.path];expect(await digest(new TextEncoder().encode(raw))).toBe(entry.file.sha256);const expected=JSON.parse(raw);
  const model=await prepare(source(entry.name)),initialState=initial(model),orderedInputs=originals(model),r=await create(model,{initialState,orderedInputs,runSeed:Uint8Array.from(freeze.seed.match(/../g)!,s=>parseInt(s,16))});
  let n=0;while(await r.settleNextInstant()){expect(++n).toBeLessThan(96);}
  const s=r.snapshot();expect(n).toBe(expected.instants);expect(String(s.clock)).toBe(expected.finalClock);
  expect({initial:await digest(initialState),originals:await digest(orderedInputs),state:await digest(s.state),outputs:await digest(s.outputs),trace:await digest(s.trace),save:await digest(r.save())}).toEqual(expected.hashes);
  console.info('M124 FROZEN',entry.name,n,'all six original hashes exact');
 }
},290000);
