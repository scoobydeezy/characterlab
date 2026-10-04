# Campaign-2 qualification scope — FCT-C roster witness

2026-09-07. **SCOPE RULING ACCEPTED; FCT-C split-scope implementation qualification PASS (pass 15).**

## Accepted scope ruling

The user accepted the evidence boundary on 2026-09-07: FCT-C1 generic invariance, FCT-C2 forbidden projection, and FCT-C3 bounded exclusion are jointly required.
The question is which implementation/profile must execute the roster-change positive
witness. It does not reopen EVID's zero-read semantics, PRJ/IDN, the frozen model or allocations.

## Accepted obligations and executable evidence

[Factory design §9](CAMPAIGN2_FACTORY_DESIGN.md#9-current-disposition) requires FCT-C:

> With safe EVID source fixed, remove/change roster: E/L payloads and zero ActualReadRecords remain identical; injecting a subject projection rejects.

[Accepted model packaging](CAMPAIGN2_MODEL_PACKAGING_DECISION.md) fixes an empty read-only
collection and no roster-dependent EVID path. The concrete first model is frozen; the .2
trace model preserves that state topology. `compileBoundedModelDeclarations` rejects every
nonempty read-only collection, not merely the current fixture's particular roster bytes.

`src/test/campaign2RosterScope.test.ts` establishes:

1. An exact IDN roster with its accepted type-262 read-only declaration, type-261 IdentityKey
   grammar, ObserverId map-key role and existing CharacterId record role successfully compiles
   through the generic registry/state substrate and validates its roster state.
2. The same valid declarations fail bounded factory preparation with INVALID_CONFIGURATION
   at the explicit one-character/five-map/no-read-only profile check.
3. Adding roster state to the unchanged bounded model fails initial admission with INVALID_PATH.
   Adding it to a save also fails restore. Neither call constructs a runtime; the valid save
   remains byte-identical.

This is a profile expressibility limit, not an IDN record/role defect. Removing an already-absent
roster cannot stand in for the required changed-roster positive comparison. Passing these rejection
tests alone must not be labelled FCT-C PASS. Current generic PRJ tests also do not by themselves
establish that positive EVID invariance witness.

## Accepted ruling

Keep both accepted contracts and the frozen profile unchanged. Qualify FCT-C in two explicitly
reported scopes:

- **Generic accepted EVID/PRJ/IDN component:** execute the positive fixed-X roster removal/change
  comparison in a valid generic substrate fixture, with fixed occurrence allocation, exact E/L
  bytes, zero actual reads, and a rejected subject-projection substitution. This required work was subsequently completed in pass 15 below.
- **Bounded factory profile:** retain the demonstrated roster/model inadmissibility controls and
  the existing fixed-source zero-read EVID controls. Record that this profile has no admitted
  roster-bearing positive branch. Cite the generic component witness explicitly rather than
  claiming the bounded factory executed that branch.

This is an explicit qualification-scope ruling, not deletion of the inherited positive obligation
or permission to add read-only state to the frozen profile. The acceptance required FCT-C to stay NOT PASSED until the
component witness, negative substitution and combined review were complete; pass 15 records that completion. All other gates remain
unchanged; this ruling alone does not activate the factory or complete Campaign 2.

## Alternative

Require the positive roster intervention to execute through a public factory profile. That needs
a separately reviewed roster-capable RulesVersion/bundle and a new model identity, plus its
construction, persistence and inherited gates. It must not silently widen the frozen .2 profile.
No new version name, identity, numeric allocation or implementation is proposed here.

## Work retained while preparing this review

Qualification passes 13–14 add the exact AD-E1/6/7 batch controls, four detected interpreter
mutations, and a real same-instant repair challenge: decrement D=20→19 succeeds just before
the REG time boundary, but the same committed rule cannot repair initially invalid retained
state at the boundary. Early rejection preserves all transactional artifacts. Production source
and frozen model artifacts remain unchanged. Detailed checks and limitations are retained in
[the qualification record](CAMPAIGN2_FCT6_QUALIFICATION.md).

The broader Campaign-2 completion gate still requires the contracted full causal path and retained
decision/identity pipeline. Neither this bounded qualification work nor the requested scope ruling
claims that larger campaign complete.

## Executed qualification — pass 15

[Machine evidence](CAMPAIGN2_FCT_C_PROOF.json) now passes the conjunction. The generic pair
uses the same production EVID implementation with a valid two-character content/REG model and
A/B/absent observer rosters. It fixes X, registrations and allocation positions, and compares E/L
bytes, empty handler read evidence and patches, unchanged state and zero roster reads. The generic
test harness identity is not an admitted bounded factory RulesVersion or a new profile.

The initially guarded projection rejected, but a direct context.state substitution succeeded.
That failed capability claim was not counted as a pass. Production semantic execution is now
isolated in evidExecution.ts behind data-only operands; the host retains scheduler state, events
and admission metadata. Twelve state/event/trace/parent/content/registry requests, independently
in E and L, fail inner ILLEGAL_READ / outer TRANSITION_FAILURE before lookup and roll back the
whole instant. The exact IDN required projection also fails empty-ReadDomain construction.

The two bounded roster-exclusion tests pass unchanged. Thus FCT-C is PASS, split-scope
qualification. This neither activates the whole factory nor passes remaining EVID/VAL/ADAPT
controls. Earlier proposed text above records the accepted scope reasoning, not new pending work.
