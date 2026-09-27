import {describe,it,expect} from 'vitest';
import {validateFormationProtocolTransition as validate,type FormationProtocolValue} from '../campaign3/formationProtocolTransition';
import {reconcileFormationGovernance,type FormationSource} from '../campaign3/formationGovernance';
const source:FormationSource={source:'source/a',character:'character/a',kind:'Interoceptive'};
const formed={...source,acquisition:1n,formedAt:1n};
const prior:FormationProtocolValue={domain:[source],successes:reconcileFormationGovernance([source],[],[formed],[1n],1n)};
describe('protocol transition exact candidate validation',()=>{
 it('PT-A: unchanged state and owner-reported complete loss are accepted',()=>{expect(()=>validate(prior,[],[],[1n],2n,2,prior)).not.toThrow();expect(()=>validate(prior,[],[],[],2n,2,{domain:prior.domain,successes:[{...prior.successes[0],completeLoss:true}]})).not.toThrow();});
 it('PT-B: replacing a nonremoved root with empty maps or dropping successful history rejects',()=>{for(const candidate of [{domain:[],successes:[]},{domain:prior.domain,successes:[]}])expect(()=>validate(prior,[],[],[1n],2n,2,candidate)).toThrow('FORMATION_PROTOCOL_TRANSITION_MISMATCH');});
 it('PT-C: arbitrary changed immutable metadata cannot pass generic record validity',()=>{for(const row of [{...prior.successes[0],formedAt:2n},{...prior.successes[0],acquisition:2n}])expect(()=>validate(prior,[],[],[1n],2n,2,{domain:prior.domain,successes:[row]})).toThrow('FORMATION_PROTOCOL_TRANSITION_MISMATCH');});
 it('PT-D: governance cannot claim survival or loss contrary to supplied owner result',()=>{expect(()=>validate(prior,[],[],[],2n,2,prior)).toThrow('FORMATION_PROTOCOL_TRANSITION_MISMATCH');expect(()=>validate(prior,[],[],[1n],2n,2,{domain:prior.domain,successes:[{...prior.successes[0],completeLoss:true}]})).toThrow('FORMATION_PROTOCOL_TRANSITION_MISMATCH');});
 it('PT-E: enrollment without formation is required and cannot be silently skipped',()=>{const incoming={...source,source:'source/b'};expect(()=>validate(prior,[incoming],[],[1n],2n,2,prior)).toThrow();expect(()=>validate(prior,[incoming],[],[1n],2n,2,{domain:[incoming,source],successes:prior.successes})).not.toThrow();});
 it('PT-F: extra private state fields reject and prior state stays unchanged',()=>{const before=structuredClone(prior),candidate={...prior,archive:'forbidden'};expect(()=>validate(prior,[],[],[1n],2n,2,candidate)).toThrow('FORMATION_PROTOCOL_SHAPE');expect(prior).toEqual(before);});
 it('PT-G: current enrollment cannot repair an invalid prior history/domain relationship',()=>{expect(()=>validate({domain:[],successes:prior.successes},[source],[],[1n],2n,2,prior)).toThrow('FORMATION_GOVERNANCE_DOMAIN');});
});
