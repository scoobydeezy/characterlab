# Protocol bridge registration closure

Status: DRAFT; no allocation or activation. This closes the special projected-payload
bridge separately from ordinary exact-source-output transition ingress.

## Actual-fact bridge

The actual-fact producer uses ordinary272 with input274/275 naming the exact live
ExecutionOutcome output and its execution TransitionKind. It executes at110 through
276 immediate generated-child ingress; ReadDomain={},273 NoStateWrites and output
277 exactly307. The source record supplies actor and completed count under the exact
protocol projection; there is no separate authored producer definition or callback.

The successor ADAPT consumer uses321 RegisteredTransitionProducer naming this bridge.
Existing307/1118 and its one occurrence rule are reused. Original304 facts are excluded
from this profile. The unchanged predecessor's authored producer remains valid only
in its own frozen profiles. A new consumer admission does not loosen old source checks.

## Observation projection is not ordinary exact-payload ingress

An ExecutionOutcome is not a310 payload. The bridge constructs310 from its private
200 truth view and declared201 channel. Therefore it cannot claim276 exact-copy
payload semantics or pretend Execution published310 as a second semantic output.
Use a new explicit bridge definition under171 with the observation-cut version.

ProtocolObservationBridgeDefinition ordered fields:

1. ProducingTransitionKind
2. ProducerOutputSchema (254)
3. Channel (201)
4. Permitted (Boolean)
5. StageEventTypes (canonical map<unsigned phase,EventTypeId>)
6. ObservationInputSchema (254)
7. PublishedOutputSchemas (set254)

The producer is exactly Execution with its ExecutionOutcome schema. StageEventTypes
contains exactly120,121,122,123,124 and the five new fixed protocol consequence event
members. ObservationInputSchema is310/1. PublishedOutputSchemas is exactly203/1 and
227/1; the stage semantics fix203 at120 and227 at124, with no semantic outputs at
121..123. Occurrence rules for203/227 remain their accepted ones. There is no rule for
a second200 occurrence because200 is a private view of the existing execution record.

The new outer compiler verifies the complete source/projection/stage closure and
normalizes these phases into its private producer metadata. EVID still names the
accepted SEM consequence producer; the bridge must invoke actual SEM reservation,
classification/freeze and settlement checks before presenting the frozen227 source.
A compatible-looking227 emitted by an arbitrary handler is not enough.

## Fixed generated child order

On Execution completion, generate the one actual-fact bridge child110 first, then
the observation120 child if permitted. This is the new profile's explicit ordering;
it does not rewrite the predecessor authored bridge's ordering. The actual-fact
bridge later emits its required ADAPT140 child. Expression's qualification130 child
was already generated at90; stage order, not event allocation order, governs execution.

The observation child carries exactly310(derived200, declared201). Bind the complete
allocated event before it can run. At120 validate the source/view/channel equality,
compile and project the sole observation, reserve its experience, and schedule121.
Stages121..124 use the accepted observer-safe support216 and private reservation
association, not execution truth or a trace lookup. Each schedules exactly one next
stage except124, which completes freeze and hands its one authentic227 to EVID ingress.

If Permitted=false, create no observation child, no observation/experience occurrence,
no reservation and no EVID ingress. This matches the explicit new no-padding policy
in the work-accounting draft. It does not suppress the actual-fact branch. A future
multi-observer model requires its own exact cardinality and ordering extension.

All bridge operations have empty character ReadDomain and write capability. Truth
is received through the private execution source projection, never a character-state
read or generic world iterator. The observer projection removes the raw truth reference
before publication. Exact channel/member/permission rules are model commitments.

The bridge's full pending source/event/reservation sets join instant completion and
rollback. An unexecuted stage, forged support, substituted view, missing freeze or
extra child aborts the whole instant. Full-prefix restore reconstructs these actual
associations; no public source certificate or serialized handler is introduced.
