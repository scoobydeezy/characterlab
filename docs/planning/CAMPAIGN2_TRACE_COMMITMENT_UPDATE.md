# Campaign-2 trace commitment update

2026-09-06 — required by C2-TRACE-001 revision-2 acceptance. **Exact trace-profile and
RulesVersion/bundle meanings ACCEPTED AND FROZEN; replacement bytes ACCEPTED AND FROZEN.**

Trace mapping is authoritative output, so the accepted old RulesVersion cannot acquire
it retrospectively. No fields are added to source/308 or bridge/309.

Accepted exact names:

```text
trace profile: campaign2-trace-binding/0.1-candidate
new RulesVersion: rules/campaign2-bounded-bridge/0.2-candidate
```

The profile's complete semantics are the accepted C2-TRACE mapping and transaction/finalization
rules, frozen in ../formal/CAMPAIGN2_TRACE_BINDING.md. TRACE-C2-A..N are the frozen qualification
obligations proving an implementation conforms to those semantics. It has no numeric ID, registry
entry, schema or public selector. The new fixed RulesVersion bundle retains every entry
of the old REVIEW_MANIFEST.json semanticBundle, in the same order, then appends:

```text
trace/0.2-candidate
campaign2-trace-binding/0.1-candidate
```

The existing ordered-input and persistence profiles remain exact and unchanged. Numeric,
random, content-schema, registry-schema and parameter-schema versions remain unchanged.
Five rules, work limit 100, specimen values, ownership and output occurrences stay fixed.

After member allocation acceptance, freeze the trace-profile meaning and exact new bundle,
then materialize the replacement into a separate review directory. Preserve all 15 old
packet files, including its REVIEW_MANIFEST.json, as historical frozen artifacts. Do not
overwrite the old packet or change the meaning of its RulesVersion.

Expected byte proof:

- Content, registry and parameter manifests remain byte-identical.
- ContentIdentity, RegistryIdentity and ParameterIdentity remain byte-identical.
- Only RulesVersion changes in ModelIdentity's existing structural operands.
- ModelIdentity bytes and ModelDigest must change; no equivalence is claimed.
- New RunIdentity embeds the new ModelIdentity. Old saves fail new-model identity admission.
- Reconstruct the complete replacement packet in a fresh process and compare structural
  values and bytes, retaining both old/new hashes and an explicit operand diff.

Old ModelDigest is
`40bcb3c3feec3e3eaaa35161b8164cfdb56eb11f0bd452393f9ec08af489ffd0`.
The replacement digest was computed by the existing identity constructor and is frozen:
57e0d7de1de0ffad564ebef4af5ce6b5a3b515069dc85df48f181f5629d1f39b.
No runtime fallback or nearest-version behavior may alias old and new bundles. The old
incomplete trace implementation receives no new qualification from this migration.

Replacement ModelIdentity review PASSED; bytes ACCEPTED AND FROZEN. The two members are permanently
frozen and profile/bundle meanings accepted. Canonical trace wrappers are UNBLOCKED only for the exact 0.2 model. No VAL/FCT/PHEN qualification follows from these acceptances.

TRACE-C2-M (COMPONENT / MATERIALIZATION PASS by acceptance): old/replacement materialization preserves all three
manifests and their identities; only RulesVersion differs structurally in ModelIdentity.
TRACE-C2-N (FROZEN, NOT PASSED): canonical trace wrapper activation under old 0.1 rejects;
activation under 0.2 without exact trace-profile support rejects. No retroactive upgrade.
