import {it,expect} from 'vitest';
// @ts-expect-error Node-only evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {reserve,start,through,state,labels,decode,items,key,enc,list,text,C,rec,f,uint,at,outputs,type Run} from './fixtures/assembledEmbodimentCurrent';
import {BODY_SAMPLE} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {readQ} from '../campaign2/cognitiveMath';
import {rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
const file='docs/planning/ASSEMBLED_CHARACTER_M218_EVIDENCE.json';
const fraction=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
const traceAt=(run:Run,t:bigint)=>outputs(run.snapshot().trace,160n).filter(v=>at(f(rec(f(v,4n),130n),2n))===t);
const projected=(v:CanonicalValue)=>{const p=f(rec(v,160n),13n);return typeof p!=='boolean'&&p.kind==='list'?p.items:[p];};
function capture(run:Run,t:bigint){
 const ts=traceAt(run,t),sample=outputs(run.snapshot().outputs,461n).find(v=>at(f(v,4n))===t),body=ts.find(v=>key(f(rec(f(v,4n),130n),5n))===key(BODY_SAMPLE)),produced=ts.flatMap(projected);
 const joint=produced.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(JOINT_APPRAISAL))).map(v=>items(v,'list'));
 const reasons=produced.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===408n).map(v=>rec(v,408n));
 return {t:Number(t),level:body?fraction(f(rec(items(f(body,15n),'list')[0],484n),1n)):null,sample:sample?key(sample):null,rows:joint.flatMap(j=>items(j[4],'list').map(v=>items(v,'list').map(x=>typeof x!=='boolean'&&x.kind==='rational'?fraction(x):key(x)))),net:reasons.flatMap(r=>items(f(r,3n),'list').map(v=>fraction(f(rec(f(rec(v,407n),2n),406n),3n))))};
}
it('trajectory218 fast current receiving path',async()=>{const x=await start(reserve('fast'));await through(x.run,41n);const rows=[1n,31n,41n].map(t=>capture(x.run,t));console.info('M218 FAST',JSON.stringify(rows));expect(rows.map(r=>r.level)).toEqual(['79/1','49/1','69/1']);for(const r of rows.slice(1)){expect(r.rows.length).toBeGreaterThan(0);for(const a of r.rows)expect(a).toHaveLength(5);expect(r.net.length).toBeGreaterThan(0);}const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(d.fast).toBeUndefined();d.fast={rows};writeFileSync(file,JSON.stringify(d,null,2)+'\n');},600000);
