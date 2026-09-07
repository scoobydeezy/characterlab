import {it,expect} from 'vitest';
import {canonicalEncode,set} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {decodeCampaign2,campaign2SchemaByType} from '../campaign2/codecs';
import {compileValDeclarations} from '../campaign2/valDeclarations';
import {dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {finiteContentCorpus,independentCharacterContent} from './fixtures/independentCampaign2Content';
it('VAL-Q independent finite CONTENT specialization agrees on all graphs through three nodes and malformed/boundary cases',async()=>{
 const source=firstTraceModel(),registry=items(decodeCampaign2(source.registry),'list')[0];
 const entries=items(registry,'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const valEntries=entries.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(txt(id(f(rec(v,171n),2n)).payload)));
 const compiler=compileValDeclarations(canonicalEncode(set(valEntries)),source.registry),registered=entries.map(v=>f(rec(v,171n),1n));
 const registryBytes=canonicalEncode(registry);let validGraphs=0;
 for(const c of finiteContentCorpus(campaign2SchemaByType(170n))){
  const expected=independentCharacterContent(c.value,registered);let actual:Uint8Array|undefined;
  try{actual=(await compiler.compileContent(canonicalEncode(c.value),registryBytes)).canonicalBytes;}catch{}
  expect(actual,c.name).toEqual(expected);if(c.name.startsWith('graph/')&&expected)validGraphs++;
 }
 expect(validGraphs).toBe(30); // 1 empty graph, 1 one-node DAG, 3 two-node DAGs, 25 three-node DAGs.
},30000);
