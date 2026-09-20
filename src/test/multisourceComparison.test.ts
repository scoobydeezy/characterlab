import {expect,it} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareMultisourceCoverage as run,type ComparisonSignal,type CoverageLaw} from '../campaign3/multisourceComparison';
const q=(n:number,d=1)=>Q.of(BigInt(n),BigInt(d));
const signal=(source:string,ground:string,family:'Task'|'Body',basis:string[],strength=q(1,2),role:'Base'|'Situation'='Base'):ComparisonSignal=>({source,ground,family,role,strength,basis:basis.map(k=>[k,q(1)] as const)});
const laws:CoverageLaw[]=['GroundAggregate','GroundPairwise','GroundUncovered','FamilyNormalized'];
it('suppresses duplicate descriptions within one ground while retaining independent support',()=>{
 const a=signal('a','body','Body',['fact-a']),b=signal('b','body','Body',['fact-a']);
 expect(run([a,b],'GroundAggregate').totals[0].base).toEqual(q(1,3));
 expect(run([a,{...b,basis:[['fact-b',q(1)]]}],'GroundAggregate').totals[0].base).toEqual(q(1,2));
 expect(run([a,b],'GroundUncovered').totals[0].base).toEqual(q(1,2));
});
it('collective {a},{b},{a,b} exposes the pairwise comparator',()=>{
 const rows=[signal('a','body','Body',['a'],q(3,4)),signal('b','body','Body',['b'],q(1,2)),signal('c','body','Body',['a','b'],q(1,4))];
 const collective=run(rows,'GroundAggregate'),pairwise=run(rows,'GroundPairwise');
 expect(collective.witnesses[2].effective).toEqual(q(0));expect(pairwise.witnesses[2].effective).toEqual(q(1,8));
 expect(collective.totals[0].base).toEqual(q(5,9));expect(pairwise.totals[0].base).toEqual(q(11,19));
});
it('preserves independent grounds even when two families cite the same evidence',()=>{
 const rows=[signal('a','task','Task',['fact']),signal('b','body','Body',['fact'])];
 expect(run(rows,'GroundAggregate').totals.map(r=>r.base)).toEqual([q(1,3),q(1,3)]);
 expect(run(rows,'FamilyNormalized').totals.map(r=>r.base)).toEqual([q(1,5),q(1,5)]);
 const independent=[rows[0],{...rows[1],basis:[['other',q(1)]] as const}];
 expect(run(independent,'FamilyNormalized').totals).toEqual(run(independent,'GroundAggregate').totals);
});
it('counts distinct families, not repeated descriptions, in the normalization comparator',()=>{
 const rows=[signal('a','task','Task',['fact']),signal('b','body','Body',['fact']),signal('c','body','Body',['fact'])];
 expect(run(rows,'FamilyNormalized').witnesses.every(w=>w.normalization.equals(q(1,2)))).toBe(true);
});
it('normalizes weighted partial overlap exactly and leaves unrelated evidence intact',()=>{
 const task={...signal('a','task','Task',['a']),basis:[['a',q(1)],['b',q(1,2)]] as const};
 const body=signal('b','body','Body',['a']);
 const result=run([task,body],'FamilyNormalized');
 expect(result.witnesses.find(w=>w.source==='a')!.normalization).toEqual(q(2,3));
 expect(result.witnesses.find(w=>w.source==='b')!.normalization).toEqual(q(1,2));
 expect(result.witnesses.find(w=>w.source==='a')!.basis).toEqual(task.basis);
});
it('preserves role/sign partitions and exposes role-blind normalization of orphan modifiers',()=>{
 const body=signal('b','body','Body',['fact']),modifier=signal('a','task','Task',['fact'],q(1,2),'Situation');
 expect(run([body,modifier],'GroundAggregate').totals.find(r=>r.ground==='task')!.base).toEqual(q(0));
 expect(run([body,modifier],'FamilyNormalized').totals.find(r=>r.ground==='body')!.base).toEqual(q(1,5));
 expect(run([body],'FamilyNormalized').totals[0].base).toEqual(q(1,3));
 const signed=[body,signal('c','body','Body',['fact'],q(-1,4))];
 expect(run(signed,'GroundAggregate').totals[0].base).toEqual(q(1,5));
 expect(run(signed,'GroundAggregate').witnesses.every(w=>w.overlap.equals(q(0)))).toBe(true);
});
it.each(laws)('is permutation-invariant and detached under %s',law=>{
 const rows=[signal('b','body','Body',['b'],q(1,2)),signal('a','body','Body',['a'],q(3,4)),signal('c','task','Task',['a','b'],q(1,4))];
 const before=run(rows,law);expect(run([...rows].reverse(),law)).toEqual(before);
 (before.witnesses[0].basis as unknown[]).length=0;expect(run(rows,law)).toEqual(run([...rows].reverse(),law));expect(rows[1].basis).toHaveLength(1);
});
it('rejects duplicate sources, conflicting ground families and invalid weights',()=>{
 const a=signal('a','body','Body',['fact']);
 expect(()=>run([a,a],'GroundAggregate')).toThrow('signal');
 expect(()=>run([a,{...a,source:'b',family:'Task'}],'GroundAggregate')).toThrow('family');
 expect(()=>run([{...a,basis:[['fact',q(0)]]}],'GroundAggregate')).toThrow('basis');
 expect(()=>run([{...a,strength:q(2)}],'GroundAggregate')).toThrow('signal');
});
