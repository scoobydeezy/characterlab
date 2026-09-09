# Campaign2 AD-E3 declaration commitment review

Date: 2026-09-09. Disposition: evidence submitted; AD-E3 remains OPEN pending review.
AD-E4, AD-E8 and AD-E13 remain PASS. Whole ADAPT-B and FCT remain OPEN.

## Frozen obligation and scope

`ADAPT_001_RULE_INTERPRETER_DRAFT.md` AD-E3 requires changes to Step, key V/L,
gate source, rule membership or Match to change ModelIdentity, and configuration
rejection of host callback/name-table substitution, unknown tags and orphan rules.
This packet exercises the accepted interpreter through existing compilers. It adds
no production source, formal semantics, permanent allocation or frozen profile.

## Executed commitment comparisons

`src/test/campaign2RuleCommitment.test.ts` contains three tests with the following
comparisons. All compare decoded ModelIdentity/103, requiring fields1..5 unchanged
and registry commitment field6 different, rather than comparing an incidental hash.

| Comparison | Actual governed entry point | Isolated change |
|---|---|---|
| Step | Public prepareCampaign2Model | tolerance signed1 to signed2 |
| Gate variant | Public prepareCampaign2Model | Always to valid FrozenBaseline at own target |
| Match | Public prepareCampaign2Model | different typed exposure referent |
| Membership | Public prepareCampaign2Model | remove tolerance rule and its consumer membership/read pattern |
| Key V | Generic registry/domain/transition compilers and structural identity builder | tolerance target V1 to V2 |
| Key L | Same generic components | accumulated-load target L1 to L2 |
| Gate source | Same generic components | FrozenBaseline source V1 to V2; gate tag and rule target fixed |

The four public alternatives preserve content and parameter bytes and produce five
distinct identities including the baseline. Membership changes its mandatory
consumer closure too; it is not an invalid dangling-rule specimen.

For generic comparisons, both variable domains and both load domains are present
in the baseline and alternatives. The second variable has its own consistently
referenced governed parameter. V/L changes therefore do not add a domain at the
same time as changing the rule. The gate-source pair changes only the source V.
The real compileCampaign2Registry, compileRegulatoryReferences,
compileAdaptationDomains and compileAdaptationTransitions accept each specimen;
the transition compiler reports five rules. The real structural createModelIdentity
builder commits the compiled registry.

These generic identities are structural component values, **not publicly admitted
richer models**. Public prepareCampaign2Model rejects every generic specimen at
the bounded one-variable/load restriction. Existing source metadata used to exercise
the structural builder does not authorize running those specimens under that profile.
This applies the accepted component-positive/profile-exclusion principle. A future
public V/L or alternate-source-domain witness remains conditional on a separately
accepted production profile admitting those domains; this packet does not widen one.

## Rejection evidence

The new public-boundary test submits a ruleInterpreter callback and a ruleTable
indexed by the existing tolerance RuleId. Each fails INVALID_CONFIGURATION and the
callback is never invoked. This is a public data-only configuration claim; it does
not prove universal equivalence against arbitrary internally rewritten interpreters.

`campaign2AdaptationDomains.test.ts` exercises orphan-rule rejection through the
real transition compiler, alongside unresolved assignment and declaration closure
negatives. `campaign2Codecs.test.ts` exercises all32 admitted union variants for
forbidden fields and unknown tags through both builders and raw encode/decode,
including Match, key derivation and gate. These are executed rejection controls,
not evidence inferred from a schema listing.

## Validation and limits

2026-09-09: the three new commitment tests, five adaptation-domain tests and seven
codec tests PASS: 15 tests in three files. TypeScript checking PASS. No production
file was changed for this packet. No new AD-E3 mutation assay is claimed; older
source-sensitive mutation reports are not silently refreshed by these tests.

Requested review: accept the finite AD-E3 commitment/rejection matrix with the
explicit generic-component and bounded-profile exclusion scopes above, or identify
a remaining clause within the frozen obligation. AD-E3 is not self-promoted here.
Whole B, AD-E7/9/10/11/12, composition and whole FCT remain OPEN. VAL qualification,
bounded no-RNG PERSIST-A..H, conditional/deferred PERSIST-I and PHEN-ADAPT PASS
remain unchanged. Campaign2 remains OPEN.

## Accepted disposition received 2026-09-09

AD-E3 PASS in the submitted finite and accepted split scopes. This receipt
supersedes the pending disposition above. Public Step/Gate-variant/Match and valid
membership/closure interventions are accepted. Generic V/L and isolated gate-source
commitments plus public richer-domain exclusions are accepted. Corresponding future
public prepare/restore witnesses are conditional on a separately accepted production
profile supporting those domains, not current blockers. Callback/name-table,
unknown-tag/forbidden-field and orphan rejection controls are accepted. A dedicated
AD-E3 mutation assay is not required. Whole B/FCT and AD-E7/9/10/11/12 remain OPEN.
