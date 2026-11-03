import {it,expect} from 'vitest';
import {list,text,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {ENCODING,validateEncoding,encodeExperience} from '../assembled/encoding';
import {source,data,decode,items,key,type Mode} from './fixtures/assembledEncoding';
import {through,type Run} from './fixtures/assembledComparison';
import {attentionFixture} from './attentionFixtures';
import {EventRoleId as R} from '../semanticBinding/eventBindings';
const reports=(r:Run)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(ENCODING))).map(v=>items(v,'list'));
async function run(mode:Mode='main',capacity=1,at=4n,attention='role-calibrated'){const r=await createCharacterRun(await prepareCharacterModel(source(capacity,attention)),data(mode));await through(r,at);return r;}
it('calibration: original selected encoder factors before behavioral comparison',()=>{for(const [role,attention,raw]of [[R.Actor,'role-calibrated',q(3,10)],[R.Target,'role-calibrated',q(243,1000)],[R.Target,'disabled-attention',q(27,100)]] as const){const original=attentionFixture([[role]]),result=encodeExperience(original.experience,{capacity:1,attention},30n),a=items(result.value,'list'),row=items(items(a[8],'list')[0],'list');expect(result.positive).toBe(true);expect(row.slice(5)).toEqual([raw,raw]);expect(validateEncoding(result.value,a[4])).toBe(true);}console.info('M44 CALIBRATION Actor3/10 Target243/1000 disabled27/100; fixed historical-shared/UnitBudget; seed0 unchanged.');});
it('producer: actual observed role binding selects evidence and hidden physical role does not',async()=>{const a=await run('main',1,1n),b=await run('hidden',1,1n),c=await run('unknown',1,1n);expect(reports(a)).toHaveLength(1);expect(reports(b)).toEqual(reports(a));const first=reports(a)[0];expect(items(first[8],'list')).toHaveLength(1);expect(validateEncoding(list(first),first[4])).toBe(true);expect(items(reports(c)[0][8],'list')).toHaveLength(0);expect(items(items(reports(c)[0][6],'list')[0],'list')[2]).toEqual(text('MissingRole'));console.info('M44 PRODUCER actual SEM242/224/240 selected, hidden invariant, unresolved MissingRole');},600000);
