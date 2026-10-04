# Probe .2 successor — concrete-byte freeze review

2026-09-07. **CONCRETE MODEL BYTES ACCEPTED AND FROZEN.**
User acceptance closes `PROBE-ACCESSOR-MODEL-BYTE` with PASS and authorizes authoritative
D-read trace implementation under the exact .2 model only.

Accepted RulesVersion: `rules/campaign2-regulatory-probe/0.2-candidate`.
Accepted trace profile: `campaign2-probe-trace-binding/0.2-candidate`.
Derived ModelDigest:
`fda39ae4a8d82cbf531b41ce35c9af7ebb2ec5c7f233c4f7adbd7e6d7eba80e9`.

[Complete packet](campaign2-probe-successor-model/REVIEW_MANIFEST.json) contains seven canonical
artifacts, readable counterparts, exact versions, ordered semantic bundle, fixed whole-profile
bindings, structural diff and 45 prior-file preservation hashes.

Only ModelIdentity field 1 (RulesVersion) changes relative to frozen probe .1. All three manifests
and component identities are byte-identical, including RegistryManifest/RegistryIdentity. No
registry slot changes; numeric/RNG versions are unchanged. The bundle replaces only the final
probe trace dependency with .2. Input/persistence/registry profiles retain their accepted .1 names.

The review builder derives .2 from accepted declarations through the .1 review compiler and the
existing identity constructor; stored model artifacts are comparison outputs, not construction
inputs. [Fresh-process proof](CAMPAIGN2_PROBE_SUCCESSOR_REMATERIALIZATION_PROOF.json): delete the
15 generated files in the checked successor directory, recreate in a fresh process, compare every
file SHA256, then verify in another process. All 45 prior bounded .1/.2 and probe .1 files remain
byte-identical. Production build and reference boundary check pass.

Initial Vite shutdown printed a canceled background dependency-build message after successful
materialization (exit 0). Dependency discovery/pretransform are unnecessary for this SSR review
script; disabling them removed that diagnostic. A subsequent fresh-process verify reproduced all
packet bytes with no cancellation message. No artifact values or model semantics changed.

Accessor allocation is permanent at probe-accessor-member-allocation/0.1-candidate; its audit
passes 43 checks. This packet is a materialization result, not PROBE-ACCESSOR runtime evidence.
The freeze itself passes no runtime control. Subsequent implementation and executed evidence are
recorded separately in [runtime qualification](CAMPAIGN2_PROBE_RUNTIME_QUALIFICATION.md).
Frozen probe .1 remains historical, without migration alias, runtime fallback or retroactive
accessor semantics. Re-materialization after the acceptance reproduces the same seven artifacts
and preserves all 45 prior files; only review-manifest disposition metadata changes.
