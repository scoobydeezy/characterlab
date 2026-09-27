import { describe, expect, it } from 'vitest';
import { compileRegistryManifest } from '../substrate/contentManifest';
import { bytesToHex, canonicalEncode, record, set, text, typedIdentifier, unsigned } from '../substrate/canonicalEncoding';
import {
  SEMANTIC_FINITE_REGISTRIES, SEMANTIC_OCCURRENCE_NAMESPACES, SEMANTIC_RECORD_SCHEMAS,
  SEMANTIC_SCHEMA_ALLOCATION_VERSION, SEMANTIC_TYPED_ID_NAMESPACES,
  SEMANTIC_UNION_VARIANT_ENTRIES, SEMANTIC_UNION_VARIANTS, UNION_VARIANT_REGISTRY_KIND,
  validateSemanticRegistryEntryKinds, validateSemanticUnionVariant,
} from '../semanticBinding/semanticSchemaRegistry';

describe('accepted SEM-001I.2 allocation closure', () => {
  it('CV-SEM-091 allocates one append-only collision-free record range', () => {
    expect(SEMANTIC_SCHEMA_ALLOCATION_VERSION).toBe('semantic-schema-allocation/0.1-candidate#SEM-001I.2');
    expect(SEMANTIC_RECORD_SCHEMAS.map(s=>s.typeId)).toEqual(Array.from({length:50},(_,i)=>BigInt(210+i)));
    expect(SEMANTIC_RECORD_SCHEMAS.find(s=>s.name==='WorldEventTruth')?.fields[0].name).toBe('WorldEventId');
  });
  it('CV-SEM-092 gives every schema positive unique fields and explicit optionality', () => {
    for (const schema of SEMANTIC_RECORD_SCHEMAS) {
      expect(schema.fields.map(f=>f.id)).toEqual(Array.from({length:schema.fields.length},(_,i)=>BigInt(i+1)));
      expect(new Set(schema.fields.map(f=>f.name)).size).toBe(schema.fields.length);
    }
    expect(SEMANTIC_RECORD_SCHEMAS.find(s=>s.name==='RecognitionResolutionRecord')?.fields.map(f=>f.name)).not.toContain('RecognitionEvaluationId');
  });
  it('CV-SEM-093 separates every typed namespace even when ordinals match', () => {
    const values=[...Object.values(SEMANTIC_TYPED_ID_NAMESPACES),...Object.values(SEMANTIC_OCCURRENCE_NAMESPACES)];
    expect(new Set(values.map(String)).size).toBe(values.length);
    expect(Object.values(SEMANTIC_TYPED_ID_NAMESPACES)).not.toContain(1004n);
    expect(SEMANTIC_OCCURRENCE_NAMESPACES.WorldEventId).toBe(1114n);
    expect(SEMANTIC_OCCURRENCE_NAMESPACES.ObservationId).toBe(1115n);
    expect(SEMANTIC_TYPED_ID_NAMESPACES.RegistryKindId).toBe(1023n);
    expect(SEMANTIC_TYPED_ID_NAMESPACES.UnionVariantDefinitionId).toBe(1024n);
    expect(UNION_VARIANT_REGISTRY_KIND).toEqual(typedIdentifier(1023n,text('registry/union-variant-definition')));
    expect(SEMANTIC_UNION_VARIANT_ENTRIES.every(entry=>entry.registryKind===UNION_VARIANT_REGISTRY_KIND)).toBe(true);
    expect(()=>validateSemanticRegistryEntryKinds(SEMANTIC_UNION_VARIANT_ENTRIES)).not.toThrow();
    expect(()=>validateSemanticRegistryEntryKinds([{...SEMANTIC_UNION_VARIANT_ENTRIES[0],registryKind:typedIdentifier(1023n,text('registry/unknown'))}])).toThrow(/unknown semantic registry kind/);
    expect(SEMANTIC_OCCURRENCE_NAMESPACES.ClassificationEvidenceId).not.toBe(SEMANTIC_OCCURRENCE_NAMESPACES.RecognitionCueEvidenceId);
  });
  it('CV-SEM-094 closes finite registries without renumbering causal roles', () => {
    for (const values of Object.values(SEMANTIC_FINITE_REGISTRIES)) expect(new Set(values).size).toBe(values.length);
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole[8]).toBe('Context');
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole[9]).toBe('Incidental');
    expect(SEMANTIC_TYPED_ID_NAMESPACES.CausalRoleId).toBe(1019n);

    const authoredOrigin=typedIdentifier(20n,text('person/glen'));
    const runtimeOrigin=typedIdentifier(21n,text('person/glen'));
    const authoredReferent=typedIdentifier(SEMANTIC_TYPED_ID_NAMESPACES.SemanticReferentId,authoredOrigin);
    const runtimeReferent=typedIdentifier(SEMANTIC_TYPED_ID_NAMESPACES.SemanticReferentId,runtimeOrigin);
    expect(bytesToHex(canonicalEncode(authoredReferent))).not.toBe(bytesToHex(canonicalEncode(runtimeReferent)));
  });
  it('CV-SEM-095 governs each tagged union and commits its matrix into manifest identity', async () => {
    expect(SEMANTIC_UNION_VARIANTS).toHaveLength(26);
    const keys=SEMANTIC_UNION_VARIANTS.map(value=>`${value.recordTypeId}/${value.variantTag}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(SEMANTIC_UNION_VARIANT_ENTRIES.every(entry=>entry.stableId.namespaceId===1024n && typeof entry.stableId.payload==='object' && entry.stableId.payload.kind==='list')).toBe(true);
    expect(new Map([...new Set(SEMANTIC_UNION_VARIANTS.map(value=>value.recordTypeId))].map(typeId=>[
      typeId, SEMANTIC_UNION_VARIANTS.filter(value=>value.recordTypeId===typeId).length,
    ]))).toEqual(new Map([[223n,2],[230n,2],[231n,3],[233n,3],[235n,2],[237n,9],[238n,3],[245n,2]]));
    expect(SEMANTIC_RECORD_SCHEMAS.filter(schema=>schema.fields[0]?.name==='VariantTag').map(schema=>schema.typeId)).toEqual([223n,230n,231n,233n,235n,237n,238n,245n]);
    for (const contract of SEMANTIC_UNION_VARIANTS) {
      const schema=SEMANTIC_RECORD_SCHEMAS.find(value=>value.typeId===contract.recordTypeId)!;
      const optionalPayloads=schema.fields.filter(field=>!field.required).map(field=>field.id);
      expect(new Set([...contract.requiredPayloadFieldIds,...contract.forbiddenPayloadFieldIds].map(String))).toEqual(new Set(optionalPayloads.map(String)));
      validateSemanticUnionVariant(contract.recordTypeId,contract.variantTag,contract.requiredPayloadFieldIds);
    }
    expect(()=>validateSemanticUnionVariant(230n,1n,[])).toThrow(/missing required/);
    expect(()=>validateSemanticUnionVariant(230n,1n,[2n,3n])).toThrow(/forbidden/);
    expect(()=>validateSemanticUnionVariant(230n,99n,[])).toThrow(/unknown/);

    const forward=await compileRegistryManifest(SEMANTIC_RECORD_SCHEMAS,SEMANTIC_UNION_VARIANT_ENTRIES);
    const reverse=await compileRegistryManifest([...SEMANTIC_RECORD_SCHEMAS].reverse(),[...SEMANTIC_UNION_VARIANT_ENTRIES].reverse());
    expect(bytesToHex(forward.canonicalBytes)).toBe(bytesToHex(reverse.canonicalBytes));
    expect(bytesToHex(forward.digest)).toBe(bytesToHex(reverse.digest));
    const changed=[...SEMANTIC_UNION_VARIANT_ENTRIES];
    const source=changed[0];
    const unionSchema=SEMANTIC_RECORD_SCHEMAS.find(value=>value.typeId===259n)!;
    changed[0]={...source,definition:record(unionSchema,new Map([[1n,unsigned(223)],[2n,unsigned(1)],[3n,set([])],[4n,set([unsigned(2)])]]))};
    const changedManifest=await compileRegistryManifest(SEMANTIC_RECORD_SCHEMAS,changed);
    expect(bytesToHex(changedManifest.digest)).not.toBe(bytesToHex(forward.digest));
    const changedKind=[...SEMANTIC_UNION_VARIANT_ENTRIES];
    changedKind[0]={...changedKind[0],registryKind:typedIdentifier(1023n,text('registry/not-a-union-definition'))};
    const changedKindManifest=await compileRegistryManifest(SEMANTIC_RECORD_SCHEMAS,changedKind);
    expect(bytesToHex(changedKindManifest.digest)).not.toBe(bytesToHex(forward.digest));
  });
});
