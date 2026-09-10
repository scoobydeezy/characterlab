# EMB-001 closed profile witness

2026-09-10, revision1. **SYM-3 proposed specimen; NOT EXECUTED OR SHAPE ACCEPTED.**
Expected values are recorded in `CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json`.
They are exact symbolic expectations, not canonical bytes or a frozen ModelIdentity.
Numeric record/tag allocation and factory packaging have not occurred.

## 1. Closed fixture identities and definitions

One observer: ObserverId1000(`observer/embodied-subject`). One character: the accepted
authored-origin SemanticReferentId construction over GovernedContentDefinitionId1038
(`character/embodied-subject`), qualified through existing VAL character-kind semantics.
The immutable IDN roster maps that observer to that character. No other character,
observer, body, channel, instruction, learned state or motive source is admitted.

ObservationChannelId1005(`channel/embodied-fuel-level`) is explicitly stored in its
channel definition, not derived from its DefinitionId. Modality/unit/accessor/owner,
event and transition members are the exact proposals in the vocabulary packet.
The following are proposed **instance payloads**, not allocations:

| DefinitionId1027 payload | Value |
|---|---|
| definition/embodied-reserve-parameters | Unit=fuel-stock; capacity100; rate1 per canonical time quantum |
| definition/embodied-reserve-bodies | Singleton binding of the above character to those parameters |
| definition/embodied-level-channel | Above channel/O; capacity100; width10; Available=true; Permitted=true |
| definition/embodied-pressure | Above channel definition; threshold60 |
| definition/embodied-level-source | Exact LevelSourceRegistration with the singleton body registry/channel |
| definition/embodied-replenishment | Exact writer registration; allowed definition set is the next three rows |
| definition/embodied-delivery-30 | Above character/parameters/unit; amount30 |
| definition/embodied-delivery-5 | Above character/parameters/unit; amount5 |
| definition/embodied-delivery-60 | Above character/parameters/unit; amount60 |

The two pressure registration entries use their exact TransitionKindId1009 StableIds
from the vocabulary proposal, and point to definition/embodied-pressure. Do not create
a second DefinitionId pretending to alias a TransitionKindId. Registry entry kind and
version select each exact typed payload, as specified in SYM-2.

All amounts above are canonical rational atoms, including integers. S0 clock=0,
reserve anchor=(80,0); immutable model binds its parameters. No RNG is used. Proposed
initial allocator states are runtime=0,event=0,sequence=0 before original-input
compilation. These are run-fixture counters, not permanent numeric allocations.
No implicit initialization event, observation, track or pressure allocation is allowed.

## 2. Exact original input timeline

Canonical ordered-input order is the table order. Payload is the exact source record
with the named definition (and O for sampling); all dependencies and parents empty.

| Original event/sequence | DueAt | Phase | Source |
|---:|---:|---:|---|
| 0 | 10 | 10 | sample |
| 1 | 40 | 10 | sample |
| 2 | 40 | 110 | delivery30 |
| 3 | 41 | 10 | sample |
| 4 | 75 | 10 | sample |
| 5 | 75 | 110 | delivery5 |
| 6 | 75 | 110 | delivery60 |
| 7 | 76 | 10 | sample |
| 8 | 180 | 10 | sample |

After input compilation, nextEventId=nextEventSequence=9, nextRuntimeId=0. Each sample
generates five consecutive children at11,12,13,14,60. Thus sample child event/sequence
ranges are9..13,14..18,19..23,24..28,29..33,34..38 respectively. This is a symbolic
expected scheduler trace under the fixed profile; the scheduler has not executed it.

## 3. Exact expected behavior

| Sample time | Materialized reserve | Permitted interval | Pressure |
|---:|---:|---|---|
| 10 | 70 | [70,80] | 0 |
| 40 | 40 | [40,50] | 1/6 |
| 41 | 69 | [60,70] | 0 |
| 75 | 35 | [30,40] | 1/3 |
| 76 | 99 | [90,100] | 0 |
| 180 | 0 | [0,10] | 5/6 |

At40 the sample/pressure finish before delivery30: Before40, Applied30, Overflow0,
After70; anchor becomes(70,40). At75 the two deliveries execute after that time's
sample: first Before35/Applied5/Overflow0/After40, then Before40/Applied60/Overflow0/
After100. The second operation's expected prior is exactly anchor(40,75), not the
pre-instant anchor. Final anchor remains(100,75) even when q(180)=0; pure sampling does
not reanchor on depletion. Final counters: runtime18,event39,sequence39.

Domain totals:39 events,30 generated children,18 runtime advances,6 sample outputs,
6 real227 envelopes,6 pressure outputs and3 trace-only replenishment results. There
are3 checked anchor set patches; all character-learning families remain absent or
byte-identical. These counts are not a full choice/learning pipeline claim.

Sample i (zero-based) uses observation ordinal3i, experience ordinal3i+1 and pressure
ordinal3i+2 in their respective typed families. An unavailable comparison burns3i+1
privately instead of minting an experience. Source event and occurrence counters
are different identity systems and must not be substituted for one another.

## 4. Separately committed comparison specimens

Each comparison keeps original inputs/identity payloads/order but changes only the
listed S0 or definition value under a distinct future ModelIdentity/RunIdentity.
Full-record equality is claimed only where the compared record's operands match.

| Comparison | Difference and expected discriminator |
|---|---|
| hidden initial reserve | S0=89 instead of80: samples10/40 are79/49, same intervals/pressures as baseline. Sample41 is78 and may differ. No claim that all later history matches. |
| slower consumption | rate1/2: at10 q75 versus70; at40 q60 versus40, yielding pressure0 versus1/6. Same initial level, different trajectory. |
| coarser interoception | width20: at40 interval[40,60], pressure0 versus1/6; body trajectory unchanged. |
| denied | Permitted=false:6 Unavailable samples/pressures, no SEM, no body reads by sampling; writer still executes. Same domain event/runtime budgets. |
| unavailable | Available=false with Permitted=true: sample/pressure values match denied at matched allocation; private causes differ. |
| overflow | Change delivery60's amount to64, retaining its definition identity in the distinct model: at75 second delivery Applied60/Overflow4/After100; later samples match baseline. |

The first one-observer model cannot execute cross-observer positive or valid-other-body
binding controls. Those require actual generic components plus profile exclusion,
or a separately reviewed expanded specimen. None is marked passed by this table.

## 5. Save boundaries and exact pending closure

After completed T40: anchor(70,40), runtime6,event19,sequence19; pending original IDs
3..8 only. After T75: anchor(100,75), runtime12,event29,sequence29; pending original
IDs7,8 only. After180: anchor(100,75),runtime18,event39,sequence39; pending queue empty.
Save before the first input retains all original IDs0..8 and counters0/9/9 after
input compilation. No internal carrier or pressure child persists at these boundaries.

Continuing each restored prefix must match the uninterrupted suffix in canonical
outputs, state, trace and allocators once schemas/model bytes are allocated. Current
JSON expectations are not substitutes for those future golden-byte comparisons.

Inspection: substrate persistence has `SaveContractError`, with no typed failure-code
enum. The new profile must normalize semantic archive rejection to that existing class;
do not invent an allegedly existing INVALID_SAVE code. Canonical decode errors may
remain the existing canonical exception before semantic save validation. Required
SaveContractError cases: wrong model/run/save version; invalid anchor or body binding;
allocator invalidity; missing/extra/changed original pending input from either family;
injected generated child; mid-instant save; inconsistent historical output/schema;
incompatible source/producer/version profile. Runtime-origin violations remain their
runtime classes, not SaveContractError. Diagnostic message wording is not canonical.

## 6. Review disposition

The accompanying script checks exact arithmetic and expected prefix/count tables; it
does not run a scheduler, write a body patch or admit an observation. Existing446
preservation checks remain separate from EMB proof. No runtime vector is promoted.

SYM-3 now has a proposed bounded specimen and concrete restore-failure class. Whole
review must still compose the typed inventory, member matrix and these definitions,
checking complete dependency/role closure and whether this limited subprofile deserves
separate shape acceptance before action knowledge and non-task receiving. Numeric
allocation, model digest, public implementation and BODY+MULTISOURCE remain unapproved.
