# Probe displacement read — missing accessor member

2026-09-07. **SYMBOLICALLY ACCEPTED. Successor trace profile and model required.**

The user accepts the exact member in 1028 and authorizes separate append-only allocation.
The proposed preservation of the frozen probe RulesVersion/ModelIdentity is explicitly REJECTED:
the new accessor fixes authoritative trace bytes. Preserve probe .1 as historical; use a successor
trace profile and RulesVersion, followed by replacement ModelIdentity freeze. The original proposal
below is retained as review history, not current authorization. No authoritative D read trace or
final probe runtime qualification may proceed until those gates close.

The accepted probe requires one instrumented D read and an ActualReadRecord in its phase-110
trace. Implementation inspection found a missing name in the otherwise frozen surface.

`src/substrate/state.ts` defines DirectProjectionBinding and ActualReadRecord with required
`accessorId: TypedIdentifierValue`. ContractReadProjection.read records that identity along with
the exact path, presence and value. Omitting it cannot express the accepted trace. Canonical
ActualReadRecord/147 likewise requires its AccessorId; no optional/anonymous read variant exists.

Shared ProjectionAccessorId/1028 is the accepted family. Its three allocated members are
ResolvedCharacterSubject, accessor/adaptation-target-prior and accessor/adaptation-gate-prior.
The latter two identify ADAPT evaluation roles, not this independent diagnostic consumer.
The frozen probe allocation covers twelve members but none in 1028. Its model likewise contains
no new accessor declaration. Structural acceptance of arbitrary TypedIdentifierValue in 147
does not choose the missing fixed probe accessor meaning.

## Proposed smallest resolution

Accept a single symbolic member in the existing family:

    ProjectionAccessorId/1028("accessor/regulatory-diagnostic-displacement-prior")

It denotes only the accepted probe's exact root 302 / field 3 / RegulatoryAdaptationKey(C,V)
direct read. Available=false produces no ActualReadRecord; Available=true produces one even when
permission=false. It grants no additional read, projection, state family, identity binding or
write capability. No new namespace, record, role field, registry kind or public accessor API.

The fixed accessor identity would appear only in the existing omniscient ActualReadRecord.
It is not a probe occurrence, observer evidence or model-authored channel/modality value.
Do not reuse an ADAPT role name or substitute RegistryDefinitionId/1027 as the accessor.

Requested disposition: treat this as an explicit symbolic completion of the already accepted
direct-read/trace contract, then perform a separate append-only member allocation review. Confirm
whether that completion preserves the frozen probe RulesVersion/ModelIdentity. The proposed
reading is that it completes a previously unnamed fixed implementation operand, analogous to
the earlier ADAPT accessor-home closure, without changing stored model declarations. That
interpretation is not adopted locally after a model freeze. If a new semantic version/model
commitment is required instead, keep the existing frozen packet intact and materialize a successor.

## Work completed independently

Model acceptance is recorded and materialization still derives the frozen digest. Structural
probe schemas are isolated from review construction to keep the source adapter independent.
The new whole ordered-input profile admits its two explicit source branches without old-parser
fallback, enforces probe time/multiplicity restrictions, authenticates original source execution,
and checks pending-source equality on restore. Existing bounded input profile remains closed.
Component controls do not claim public runtime activation, cancellation enforcement, or full
PROBE-P PASS. The state read and authoritative trace await the accessor ruling.

This is an implementation expressibility/name gap, not a request to redesign REG, ADAPT, the
probe mathematics, padding, observation-only scope or SEM/EVID carriage.
