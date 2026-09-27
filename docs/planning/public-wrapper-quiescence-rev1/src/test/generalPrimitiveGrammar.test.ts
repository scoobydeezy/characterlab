import {it,expect} from 'vitest';
import {unsigned,signed,rational,text} from '../substrate/canonicalEncoding';
import {INT64_MAX} from '../substrate/time';
import {validateGeneralPrimitive as validate,type GeneralPrimitive} from '../campaign3/generalPrimitiveGrammar';
import carrier from '../../docs/formal/GENERAL_ATTENTION_CARRIER_CANDIDATE.json';
it('GPG-A: bounded unsigned domains accept exact endpoints and reject adjacent values',()=>{
 const rows:[GeneralPrimitive,number,number][]=[['Glyph',0,7],['Cell',0,7],['ViewOrdinal',0,2],['ViewCount',0,3],['SourceBound',32,32],['GraphScale',1,1000],['DecayExponent',1,16],['RecallCount',0,32],['MemorySlotCount',0,1024],['GraphNodeCount',0,30],['GraphEdgeCount',0,870],['SignalLimit',1,3],['SignalViewLimit',1,3],['SignalByteLimit',1,65536],['SignalCount',0,3],['OutputCount',0,32]];
 for(const [name,lo,hi] of rows){validate(name,unsigned(lo));validate(name,unsigned(hi));expect(()=>validate(name,unsigned(hi+1))).toThrow();if(lo)expect(()=>validate(name,unsigned(lo-1))).toThrow();expect(()=>validate(name,signed(lo))).toThrow();}
});
it('GPG-B: rational constraints stay exact and field-specific goal bounds do not leak globally',()=>{
 validate('Rational',rational(-101,1));validate('NonnegativeRational',rational(0,1));validate('PositiveRational',rational(1000000000000000001n,1000000000000000000n));
 validate('UnitRational',rational(0,1));validate('UnitRational',rational(1,1));validate('PositiveUnitRational',rational(1,1000000000000000000n));validate('OneToTwoRational',rational(1,1));validate('OneToTwoRational',rational(2,1));
 for(const name of ['PositiveRational','PositiveUnitRational'] as const)expect(()=>validate(name,rational(0,1))).toThrow();
 expect(()=>validate('UnitRational',rational(1000000000000000001n,1000000000000000000n))).toThrow();expect(()=>validate('OneToTwoRational',rational(2000000000000000001n,1000000000000000000n))).toThrow();expect(()=>validate('NonnegativeRational',rational(-1,1000000000000000000n))).toThrow();
 expect(()=>validate('Rational',{kind:'rational',numerator:2n,denominator:4n})).toThrow();
});
it('GPG-C: versions and lattice masses need external compiled context; values cannot bless themselves',()=>{
 validate('VersionText',text('seam/1'),{admittedVersions:['seam/1']});expect(()=>validate('VersionText',text('seam/1'))).toThrow();expect(()=>validate('VersionText',text('seam/2'),{admittedVersions:['seam/1']})).toThrow();
 validate('LatticeMass',unsigned(1000),{graphScale:1000n});expect(()=>validate('LatticeMass',unsigned(1))).toThrow();expect(()=>validate('LatticeMass',unsigned(101),{graphScale:100n})).toThrow();expect(()=>validate('LatticeMass',unsigned(0),{graphScale:0n})).toThrow();
});
it('GPG-D: time, phase and primitive kinds preserve substrate boundaries',()=>{
 validate('Instant',signed(0));validate('Instant',signed(INT64_MAX));expect(()=>validate('Instant',signed(INT64_MAX+1n))).toThrow();expect(()=>validate('Instant',signed(-1))).toThrow();expect(()=>validate('Instant',unsigned(0))).toThrow();
 validate('PhaseOrdinal',unsigned(110));for(const n of [51,119,150])expect(()=>validate('PhaseOrdinal',unsigned(n))).toThrow();
 validate('OriginalAddress',unsigned(0));validate('FieldOrdinal',unsigned(1));expect(()=>validate('FieldOrdinal',unsigned(0))).toThrow();validate('Boolean',true);validate('False',false);expect(()=>validate('False',true)).toThrow();expect(()=>validate('Boolean',unsigned(0))).toThrow();expect(()=>validate('Unknown' as never,unsigned(0))).toThrow();
});
it('GPG-E: every primitive leaf in the current symbolic carrier inventory has executable admission',()=>{
 const records=carrier.records;
 const known=new Set([...records.map(r=>r.name),...carrier.roles.map(r=>r.identity),...carrier.recordBoundaries.map(r=>r.record)]),leaves=new Set<string>();
 function visit(v:unknown){if(!v||typeof v!=='object')return;const x=v as {kind?:string;name?:string};if(x.kind==='ref'&&x.name&&!known.has(x.name))leaves.add(x.name);for(const child of Object.values(v))if(Array.isArray(child))child.forEach(visit);else visit(child);}
 records.forEach(visit);
 const positive=new Set(['GraphScale','DecayExponent','SignalLimit','SignalViewLimit','SignalByteLimit','FieldOrdinal']);
 expect(leaves.size).toBeGreaterThan(20);
 for(const name of leaves){
  const value=name==='Boolean'?true:name==='False'?false:name==='VersionText'?text('seam/test'):name==='Instant'?signed(0):name.endsWith('Rational')?rational(1,1):unsigned(name==='SourceBound'?32:positive.has(name)?1:0);
  expect(()=>validate(name as GeneralPrimitive,value,{graphScale:100n,admittedVersions:['seam/test']}),name).not.toThrow();
 }
});
