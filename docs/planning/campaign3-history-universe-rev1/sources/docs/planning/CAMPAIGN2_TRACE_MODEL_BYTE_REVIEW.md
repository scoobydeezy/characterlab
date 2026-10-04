# Replacement bounded model — trace-profile byte review

2026-09-06. **ACCEPTED AND FROZEN.**

Both SeamId/1036 members are permanently frozen. The exact trace-profile and RulesVersion
0.2 meanings are accepted in formal/CAMPAIGN2_TRACE_BINDING.md and
formal/CAMPAIGN2_BOUNDED_RULES_02.md. Qualification vectors are not runtime operands.
This packet completes the next materialization gate without implementing trace wrappers.

| Operand | Old | Replacement |
|---|---|---|
| RulesVersion | rules/campaign2-bounded-bridge/0.1-candidate | rules/campaign2-bounded-bridge/0.2-candidate |
| ModelIdentity size | 337 bytes | 337 bytes |
| ModelDigest / SHA-256 of canonical identity | 40bcb3c3feec3e3eaaa35161b8164cfdb56eb11f0bd452393f9ec08af489ffd0 | 57e0d7de1de0ffad564ebef4af5ce6b5a3b515069dc85df48f181f5629d1f39b |

Exact bytes: [old identity](campaign2-first-model/model-identity.cenc.hex),
[replacement identity](campaign2-trace-model/model-identity.cenc.hex).
Decoded records: [old](campaign2-first-model/model-identity.json),
[replacement](campaign2-trace-model/model-identity.json).
The [replacement REVIEW_MANIFEST](campaign2-trace-model/REVIEW_MANIFEST.json) contains all
seven hashes/sizes, versions, full exact bundle, old-packet preservation hashes and operand diff.

## Exact structural delta

Existing ModelIdentity/103 field 1 (RulesVersion) is the only changed structural operand.
Fields 2..6 compare canonically equal: ContentIdentity, ParameterIdentity, NumericProfileVersion,
RandomAlgorithmVersion and RegistryIdentity. The six unchanged artifacts are:

| Artifact | Bytes | SHA-256 (old = replacement) |
|---|---|---|
| ContentManifest | 124 | 5d950405ca403c527029c16ffaadc1f12ed0b0785ac79f44f4bc20142ae2b1dd |
| ParameterManifest | 11 | 689e8db5bcd83878d3fed0b65f1bb733ee8e50d34969c7d2cb3e02d2c445a8c4 |
| RegistryManifest | 45760 | 1104a2a43c33f62c15ebf7ceb9b5e2ef050b67a8a3d658b14199c04158f8b764 |
| ContentIdentity | 65 | 67e8beed1d99ed0f964190d361da166d755e5956d39085898037a4cbc79acef5 |
| ParameterIdentity | 78 | 4e2ec3bccb8f623be26257b857c5c10c737cdfc9d4f1ca0edee8e971f0571fb4 |
| RegistryIdentity | 76 | 855b10ed007315fd7887bfecf5022ab253e5f33e6d5f27fe24197e3be144d660 |

No member allocation entered RegistryManifest. All existing semantic-bundle entries retain
their order; only trace/0.2-candidate and campaign2-trace-binding/0.1-candidate append.
The ordered-input and persistence profiles are unchanged. No old/new equivalence is claimed.

## Reproduction evidence and scope

`scripts/materialize-campaign2-trace-model.mjs` reconstructs source declarations with the
existing frozen builder, validates them with the existing declaration compilers and calls
the existing createModelIdentity constructor with the accepted new RulesVersion. It does
not add runtime support for 0.2. Old artifacts serve as comparison evidence, not construction
inputs for replacement identity bytes. Any manifest/component-identity delta fails immediately.

`scripts/prove-campaign2-trace-model-byte-a.mjs` deletes exactly the 15 replacement packet
files after checking their resolved parent, reconstructs them in a fresh subprocess, and
requires every byte/rendering/report to match. Failure restores the removed review files.
PASS is recorded in [fresh-process proof](CAMPAIGN2_TRACE_MODEL_BYTE_A.json).
All 15 old packet files remain byte-identical; the permanent allocation audit additionally
preserves those plus 18 prior authority/allocation files (33 total).

This supplies exact materialization evidence for TRACE-C2-M. TRACE-C2-A..N remain frozen
qualification gates, not blanket PASS labels. TRACE-C2-N activation negatives and old-save
rejection under the eventual 0.2 runtime remain implementation qualification work.
There is no auto-upgrade or old-identity alias. Existing 0.1 source behavior remains unchanged.

## Accepted disposition

The replacement seven-artifact packet and derived ModelIdentity are ACCEPTED AND FROZEN
under the exact 0.2 bundle. TRACE-C2-M is COMPONENT / MATERIALIZATION PASS. Canonical wrappers
are authorized only against 0.2; the old packet remains historical. VAL/FCT-6/PHEN-ADAPT and
remaining trace qualification are open. No equivalence or save migration is admitted.
