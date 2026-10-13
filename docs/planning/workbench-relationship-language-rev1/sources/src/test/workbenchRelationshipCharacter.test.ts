import {expect,it} from 'vitest';
import {projectRelationshipCharacter} from '../workbench/relationshipCharacter';
import {prepareRelationshipModel,createRelationshipRun} from '../campaign3/relationshipFactory';
import {OBSERVERS} from '../campaign3/relationshipModel';
import {canonicalEncode,canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {relationshipSupportedSchemas} from '../campaign3/relationshipCodecs';
import {fromHex} from '../workbench/canonical';
import catalog from '../workbench/relationshipCatalog.json';
const decode=(b:Uint8Array)=>canonicalDecode(b,new RecordSchemaRegistry(relationshipSupportedSchemas()));
async function run(name:string){const p=catalog.programs.find(p=>p.name===name)!,m=catalog.models.find(m=>m.name===p.model)!;return createRelationshipRun(await prepareRelationshipModel({parameters:fromHex(m.parameters),content:fromHex(m.content),registry:fromHex(m.registry)}),{initialState:fromHex(m.initialState),orderedInputs:fromHex(p.orderedInputs),runSeed:new Uint8Array(32)});}
const projection=(r:Awaited<ReturnType<typeof run>>,candidate=1)=>projectRelationshipCharacter(decode(r.observerView(canonicalEncode(OBSERVERS[0]))),candidate);
it('keeps appraisal-time history separate and excludes mechanical response draws',async()=>{const r=await run('candidate-1-law-1-reverse-0');await r.settleNextInstant();const a=projection(r);expect(a.entries.find(e=>e.kind==='appraisal')!.human).toContain('used 0 cooperation');expect(a.current!.journal).toContain('RelationshipEntry');expect(a.entries.some(e=>e.kind==='prospective response')).toBe(true);expect(JSON.stringify(a)).not.toContain('Draws');await r.settleNextInstant();const b=projection(r);for(const e of a.entries)expect(b.entries.find(x=>x.occurrence===e.occurrence)).toEqual(e);},600000);
it('suppresses violating models and preserves fixed-display hidden-world invariance',async()=>{const a=await run('fixed-display-cooperation'),b=await run('fixed-display-breach');await a.settleNextInstant();await b.settleNextInstant();expect(projection(a)).toEqual(projection(b));expect(projection(a,5)).toMatchObject({suppressed:true,current:null,entries:[]});expect(()=>projectRelationshipCharacter(decode(fromHex(catalog.models[0].parameters)),1)).toThrow();},600000);
