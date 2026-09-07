import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {compileProbeModel} from '../campaign2/probeModel';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {probeRecord,decodeProbeReview} from '../campaign2/probeCodecs';
import {campaign2Record as r} from '../campaign2/codecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
it('PROBE-M matched observation/support allocation: scalar difference cannot enter X/E/L',async()=>{
 const source={...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES},model=await prepareCampaign2Model(source),{probe}=await compileProbeModel(source),pair=[];
 const orderedInputs=enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])]));
 for(const d of [0n,1n]){
  const state=new AuthoritativeState(d===0n?[]:[{path:probe.path,value:r('RegulatoryAdaptationValue',{Magnitude:signed(d)})}]),bytes=enc(state.canonicalValue());
  const run=await createCampaign2Run(model,{initialState:bytes,orderedInputs,runSeed:new Uint8Array(32)});await run.settleNextInstant();expect(run.snapshot().state).toEqual(bytes);
  const outputs=items(decodeProbeReview(run.snapshot().outputs),'list');expect(outputs).toHaveLength(5);
  const [truth,observation,x,e,l]=outputs;expect(f(rec(truth,334n),4n)).toEqual(signed(50n+d));
  pair.push({observation:enc(observation),id:enc(f(rec(observation,203n),1n)),learning:enc(list([rec(x,227n),rec(e,269n),rec(l,270n)]))});
 }
 expect(pair[0].id).toEqual(pair[1].id);expect(pair[0].observation).not.toEqual(pair[1].observation);expect(pair[0].learning).toEqual(pair[1].learning);
});
