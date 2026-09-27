/** FCT-6 / VAL-Q oracle. Shares cenc transport, not production semantic validators.
 * Character content-kind/0.1: exact 170/1, all fields, kind and reference closure.
 * Reachability matrix closure is independent of the production DFS cycle detector.
 */
import {canonicalEncode,list,record,set,text,typedIdentifier,type CanonicalValue,type RecordSchema} from '../../substrate/canonicalEncoding';
type R=Extract<CanonicalValue,{kind:'record'}>;
const key=(v:CanonicalValue)=>Array.from(canonicalEncode(v),b=>b.toString(16).padStart(2,'0')).join('');
const atom=(v:CanonicalValue|undefined):v is Extract<CanonicalValue,{kind:'typedIdentifier'}>=>typeof v==='object'&&v.kind==='typedIdentifier';
export function independentCharacterContent(definitions:CanonicalValue,registryIds:readonly CanonicalValue[]):Uint8Array|undefined{
 try{
  canonicalEncode(definitions); // Shared wire grammar is explicitly outside this independent claim.
  if(typeof definitions==='boolean'||definitions.kind!=='set')return;
  const rows:R[]=[],ids:string[]=[],known=new Set(registryIds.map(key));
  for(const d of definitions.items){
   if(typeof d==='boolean'||d.kind!=='record'||d.schema.typeId!==170n||d.schema.schemaVersion!==1n||d.fields.size!==16)return;
   for(let i=1n;i<=16n;i++)if(!d.fields.has(i))return;
   const stable=d.fields.get(1n),kind=d.fields.get(2n);
   if(!atom(stable)||!atom(kind)||kind.namespaceId!==1004n||typeof kind.payload==='boolean'||kind.payload.kind!=='text'||kind.payload.value!=='semantic-kind/character'||!known.has(key(kind)))return;
   const id=key(stable);if(ids.includes(id))return;ids.push(id);rows.push(d);
  }
  const edges=rows.map(()=>rows.map(()=>false)),normalized:R[]=[];
  for(let i=0;i<rows.length;i++){
   const fields=new Map(rows[i].fields);
   for(const field of [11n,12n]){
    const refs=fields.get(field)!;if(typeof refs==='boolean'||refs.kind!=='list'||refs.items.some(v=>!atom(v)))return;
    const names=refs.items.map(key);if(new Set(names).size!==names.length)return;
    for(const name of names){if(field===11n){if(!known.has(name))return;}else{const target=ids.indexOf(name);if(target<0)return;edges[i][target]=true;}}
    fields.set(field,list([...refs.items].sort((a,b)=>key(a)<key(b)?-1:1)));
   }
   normalized.push(record(rows[i].schema,fields) as R);
  }
  for(let k=0;k<rows.length;k++)for(let i=0;i<rows.length;i++)for(let j=0;j<rows.length;j++)edges[i][j] ||= edges[i][k]&&edges[k][j];
  if(edges.some((row,i)=>row[i]))return;
  return canonicalEncode(set(normalized));
 }catch{return;}
}
export interface ContentComparisonCase {name:string;value:CanonicalValue;}
export function finiteContentCorpus(schema:RecordSchema):ContentComparisonCase[]{
 const id=(n:number)=>typedIdentifier(1038n,text('character/oracle-'+n)),kind=typedIdentifier(1004n,text('semantic-kind/character'));
 const make=(n:number,refs:CanonicalValue[]=[])=>record(schema,new Map(Array.from({length:16},(_,i)=>[BigInt(i+1),i===0?id(n):i===1?kind:i===11?list(refs):list([])])));
 const edit=(r:CanonicalValue,field:bigint,v:CanonicalValue)=>record(schema,new Map([...(r as R).fields,[field,v]]));
 const cases:ContentComparisonCase[]=[];
 for(let n=0;n<=3;n++)for(let graph=0;graph<2**(n*n);graph++){
  const nodes=Array.from({length:n},(_,i)=>make(i,Array.from({length:n},(_,j)=>j).filter(j=>graph&(1<<(i*n+j))).map(id)));
  cases.push({name:`graph/${n}/${graph}`,value:set(nodes)});
 }
 const single=make(0);
 for(let field=1n;field<=16n;field++){
  const fields=new Map((single as R).fields);fields.delete(field);
  cases.push({name:`missing-field/${field}`,value:set([record({...schema,fields:schema.fields.map(f=>f.id===field?{...f,required:false}:f)},fields)])});
 }
 cases.push(
  {name:'duplicate-stable-id',value:set([single,edit(single,15n,text('different history'))])},
  {name:'unknown-kind',value:set([edit(single,2n,typedIdentifier(1004n,text('semantic-kind/object')))])},
  {name:'wrong-kind-namespace',value:set([edit(single,2n,typedIdentifier(20n,text('semantic-kind/character')))])},
  {name:'unknown-content-reference',value:set([make(0,[id(9)])])},
  {name:'duplicate-content-reference',value:set([make(0,[id(1),id(1)]),make(1)])},
  {name:'unknown-registry-reference',value:set([edit(single,11n,list([id(9)]))])},
  {name:'duplicate-registry-reference',value:set([edit(single,11n,list([kind,kind]))])},
  {name:'known-registry-reference',value:set([edit(single,11n,list([kind]))])},
  {name:'unordered-content-references',value:set([make(0,[id(2),id(1)]),make(1),make(2)])},
  {name:'wrong-reference-container',value:set([edit(single,12n,set([]))])},
  {name:'wrong-reference-atom',value:set([edit(single,12n,list([text('not an id')]))])},
  {name:'wrong-stable-id-shape',value:set([edit(single,1n,text('not an id'))])},
  {name:'wrong-top-level',value:list([single])},
 );
 // Arbitrary canonical authoritative data is allowed; it is not executed as a predicate.
 for(const field of [3n,4n,5n,6n,7n,8n,9n,10n,13n,14n,15n,16n])cases.push({name:`opaque-authoritative-data/${field}`,value:set([edit(single,field,text('not executable: require body, roster, belief'))])});
 return cases;
}
