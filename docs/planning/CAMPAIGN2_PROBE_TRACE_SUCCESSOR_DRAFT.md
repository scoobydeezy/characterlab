# Probe trace accessor completion — successor binding proposal

2026-09-07. **SHAPE ACCEPTED; SUCCESSOR MODEL NOW FROZEN; RUNTIME IMPLEMENTATION AUTHORIZED.**
The later [model freeze](CAMPAIGN2_PROBE_SUCCESSOR_MATERIALIZATION.md) satisfies the historical
gates below. See [executed runtime evidence](CAMPAIGN2_PROBE_RUNTIME_QUALIFICATION.md) for current
control disposition; proposal wording and the original NOT PASSED table remain review history.
The exact .2 trace profile and RulesVersion below are accepted. Proposal wording is retained as
review history. Accessor member allocation is permanent at probe-accessor-member-allocation/0.1-candidate.

The accepted symbolic accessor fixes an omitted authoritative trace operand. The user requires a
successor commitment; probe .1 and digest
2cc10295fc9c8f8b0777fc0ac56c526bcc4f4d26ec865bcad3776d696d5bf454 remain immutable historical controls.

Propose exact successor TraceProfile `campaign2-probe-trace-binding/0.2-candidate` and
RulesVersion `rules/campaign2-regulatory-probe/0.2-candidate`. Retain the entire accepted probe .1
semantic dependency order, replacing only its final probe trace dependency with the .2 trace
version. Fixed whole-profile selections remain identical except TraceProfile. In particular,
registry/input/persistence stay campaign2-probe-registry/0.1-candidate,
campaign2-probe-ordered-input/0.1-candidate and campaign2-probe-persistence/0.1-candidate.
The probe semantic seam remains regulatory-diagnostic-probe/0.1-candidate.

The sole trace mapping completion is at event/regulatory-diagnostic-probe, phase 110:

    Available=false: ActualReadRecords=[]
    Available=true: exactly one ActualReadRecord
        AccessorId=ProjectionAccessorId/1028(
            "accessor/regulatory-diagnostic-displacement-prior")
        StatePath=the accepted exact D(C,V) path
        Presence/Value=the actual authoritative leaf read
        DerivedSources=[]
        TransformationId absent (direct read)

ObserverPermitted does not alter that read rule. RegisteredReadDomain remains the same singleton
path. All other accepted trace fields, owners, event mappings, padding, provenance, occurrence
allocation and empty write/read rules remain unchanged. Wrong accessor rejects even for the right
path/value; no dummy read is emitted on unavailable probes. No model registry entry stores this
fixed trace-profile constant. No old-profile fallback, migration alias or retroactive .1 activation.

Expected successor artifact delta: only ModelIdentity field 1 changes. ContentManifest/Identity,
ParameterManifest/Identity, RegistryManifest/Identity and all their versions remain byte-identical.
If registry bytes change, stop and inspect rather than normalizing away that difference.
After member and successor binding acceptance, materialize in a separate directory, prove old
packet preservation and fresh-process reproducibility, then submit the new digest for freeze.

| Control | Frozen obligation; NOT PASSED |
|---|---|
| PROBE-ACCESSOR-A | Available=true has exactly one read with the exact accepted member; wrong member rejects. |
| PROBE-ACCESSOR-B | Available=false has zero reads; no dummy read/accessor. |
| PROBE-ACCESSOR-C | Substituting ADAPT target/gate accessors fails despite equal path. |
| PROBE-ACCESSOR-D | Changing authoritative accessor mapping requires trace-profile/RulesVersion change and changes ModelIdentity with all manifests fixed. |
| PROBE-ACCESSOR-E | Probe .1 cannot emit the new canonical accessor semantics; probe .2 requires exact .2 trace support. Emitting .2 semantics under .1 ModelIdentity fails qualification. |

Member allocation and exact successor binding are review proposals. Authoritative D-read trace,
canonical probe wrappers and final runtime qualification remain blocked until successor model freeze.
Independent accepted InputOnly component work is preserved; PROBE-A..P and all parent gates remain open.
