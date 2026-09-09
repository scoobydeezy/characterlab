# PERSIST-I accepted qualification sequencing addendum

2026-09-08. User review: **SCOPE RULING APPROVED**. Correct-forward addendum to
[campaign2-persistence/0.1-candidate](CAMPAIGN2_PERSISTENCE_CLARIFICATION.md).
The original PERSIST-I obligation remains verbatim in that contract.

PERSIST-I is **FROZEN / RETAINED / DEFERRED / NOT PASSED**. The required positive
precondition does not exist: an independently accepted, implemented production
RNG-consuming seam supported by the build but absent from the committed model.
`RandomRunOracle.drawBounded` is a substrate primitive, not such a seam.
No qualification-only consumer, callback, plugin, registry declaration, mock decision
seam or historical consumer import is authorized.

Current bounded no-RNG profile qualification may continue. Exact empty field 9,
malformed/nonempty metadata rejection, unsupported-declaration exclusion and the
state-ID scan mutants are valid bounded evidence, not PERSIST-I PASS. Whole
PERSIST-A..I are not all passed. No VAL/factory/global persistence qualification,
runtime activation, model or allocation change follows from this ruling.

## Mandatory future trigger

PERSIST-I becomes executable and mandatory as soon as the first RNG-consuming seam
is both separately accepted under CharacterLab governance and implemented as
production-supported build capability. Execute it before treating that build as
having complete persistence qualification.

Compare builds without/with that capability using the same committed model M that
does not admit the seam. Preserve its admitted closure and exact empty field 9,
save/restore bytes and ModelIdentity, subject to the then-accepted build-identity
policy. Prove no new seam handler/capability enters M and no build-wide scan
discovers it for M. A model admitting the new seam needs a separately accepted
RNG-capable persistence profile and its own qualification. These are distinct gates.

Any eventual current bounded-profile verdict must explicitly state:

> This verdict does not establish PERSIST-I's cross-build/model RNG-consumer
> separation witness. PERSIST-I remains deferred until its accepted positive
> precondition exists.

## Executed bounded build-dependence control

[Machine proof](CAMPAIGN2_BUILD_METADATA_PROOF.json), reproduced with
`node scripts/prove-campaign2-build-metadata.mjs`, records six isolated executions:
baseline, save substitution and restore substitution, each with an empty catalog
and a catalog exposing the eight existing RNG schema definitions (110..117).
The catalog is test instrumentation; actual codecs and model declarations stay
fixed. It neither introduces nor claims a stochastic consumer.

The baseline preserves exact ModelIdentity, field 9 and complete save/restore bytes
across the catalog intervention. The save substitution scans catalog schema IDs
into field 9, changing save bytes and causing restore rejection. The independent
restore substitution leaves the valid save untouched but rejects it by deriving
metadata from the catalog. Both substitutions pass with the empty catalog and
are detected with the populated catalog; this isolates the prohibited dependency.
All runs retain identical ModelIdentity. Production source fingerprints are unchanged.

Disposition: **BOUNDED BUILD-DEPENDENCE CONTROL / COMPONENT PASS**. This fulfills
the requested targeted substitution evidence for the current bounded review. It
does not exhaust every possible build-global dependency and is not the future
PERSIST-I positive witness. The separate state-scan proof remains a different control.

The sequencing blocker is resolved. Remaining schema/version, restore-stage,
branch/mutant, finite-corpus and VAL/PERSIST/FCT reconciliation continues. PHEN-ADAPT
PASS is unchanged; Campaign 2 remains OPEN.
