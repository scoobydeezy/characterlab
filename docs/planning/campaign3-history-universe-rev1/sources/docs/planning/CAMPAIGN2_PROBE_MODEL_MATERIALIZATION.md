# Probe model materialization — freeze review

2026-09-07. **CONCRETE BYTES ACCEPTED AND FROZEN.**
User acceptance closes PROBE-MODEL-BYTE-A as a materialization PASS and authorizes probe runtime
implementation under this model only. PROBE-A..P remain unpassed. The 15-file regeneration proof
records pre-freeze review metadata; acceptance updates report status only, not the seven artifacts.

[Review manifest](campaign2-probe-model/REVIEW_MANIFEST.json) contains all seven canonical byte
artifacts and readable counterparts, exact versions, semantic dependency bundle, fixed whole-profile
bindings, old-vs-probe structural diff and SHA256 preservation hashes for 30 old .1/.2 files.

ModelIdentity SHA256:
`2cc10295fc9c8f8b0777fc0ac56c526bcc4f4d26ec865bcad3776d696d5bf454`.

ContentManifest/Identity and ParameterManifest/Identity are byte-identical. Registry position 0
adds five descriptors, three governed union entries and one definition; position 5 adds eleven
roles. Positions 1..4 are byte-identical. ModelIdentity changes only fields 1 (RulesVersion) and
6 (RegistryIdentity, including changed RegistrySchemaVersion). Numeric/RNG versions are unchanged.

The review-only compiler validates the exact first specimen with its four committed boolean
variants, checks inherited declarations through the unchanged bounded compiler, and returns model
commitments only. It neither installs profile handlers nor constructs a run. The existing public
factory remains unchanged and does not activate this probe RulesVersion. Registry equality is
canonical, preserving set permutation equivalence; absent/extra/wrong specimen declarations reject.

Verification: production build and reference boundary check PASS; 72 test files / 459 tests PASS.
Three new packaging tests cover shifted layout, missing governed union entries, mixed profiles,
four distinct permission models and canonical permutation identity. All 15 generated packet files
were deleted from the verified probe-only directory, regenerated in a fresh process, compared by
SHA256 and verified in another fresh process. [Rematerialization proof](CAMPAIGN2_PROBE_REMATERIALIZATION_PROOF.json).
All 30 prior model files retain their recorded hashes. This is materialization evidence, not
authoritative runtime or full PROBE-PACK qualification.

Concrete model freeze is accepted. Runtime implementation may proceed; PROBE-A..P, ADAPT-9b,
parent control 9 and PHEN-ADAPT remain open. Subsequent implementation gaps must be resolved
explicitly without silently changing these frozen bytes.
