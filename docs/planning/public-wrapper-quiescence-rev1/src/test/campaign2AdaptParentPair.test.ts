import {it,expect} from 'vitest';
import {proveAdaptParentPair} from './helpers/adaptParentPair';

it('ADAPT-9b: same-S0 authored count intervention joins adaptation, observation, episode and restored recall',async()=>{
 const result=await proveAdaptParentPair();
 expect(result.status).toBe('PASS');
},30000);
