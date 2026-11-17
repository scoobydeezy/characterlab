import {it,expect,vi} from 'vitest';
import {deriveEncodingRoles,type EncodingSettings} from '../assembled/encoding';
import {attentionFixture} from './attentionFixtures';
import {EventRoleId as R} from '../semanticBinding/eventBindings';
const settings:EncodingSettings={capacity:1,attention:'role-calibrated',multiUnit:true,sharedBindings:true,wideRoles:true,wideUnits:true,multiEvents:true,budgetLaw:'historical-shared',budgetCalibration:'UnitBudget'};
it('permission143: incoming binding cannot nominate its consumer permission',()=>{
 const full=attentionFixture([[R.Actor],[R.Target]]).experience;
 expect(deriveEncodingRoles(full,settings,[100n,101n]).claims).toHaveLength(2);
 const wrong={...full,perceivedBindings:full.perceivedBindings.map(b=>({...b,transformationVersion:'semantic-binding/0.1-candidate#SEM-001A'}))};
 expect(()=>deriveEncodingRoles(wrong,settings,[100n,101n])).toThrow('not admitted');
 console.info('M143 PERMISSION PASS fixed consumer SEM-001C rejects codec-admitted foreign producing seam');
});
