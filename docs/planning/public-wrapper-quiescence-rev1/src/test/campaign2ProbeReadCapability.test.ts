import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import * as readout from '../campaign2/probeReadout';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {probeRecord} from '../campaign2/probeCodecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';

it.each(['state','root','otherCharacter','otherVariable','roster','reg','entries','read','constructor','__proto__'])('PROBE-B production arithmetic rejects capability substitution %s',async(property)=>{
 const model=await prepareCampaign2Model({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES});
 const original=readout.executeProbeReadout;let reached=false;
 const substitute=vi.spyOn(readout,'executeProbeReadout').mockImplementation(input=>{
  reached=true;expect(Object.getPrototypeOf(input)).toBe(null);expect(Object.keys(input).sort()).toEqual(['displacement','reference']);
  Reflect.get(input,property);return original(input);
 });
 try{
  const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])])),runSeed:new Uint8Array(32)}),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrow();expect(reached).toBe(true);
  const after=run.snapshot();for(const k of ['clock','state','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);
 }finally{substitute.mockRestore();}
});
