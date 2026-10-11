"""Bind six dated coverage entries to scoped qualification and successor evidence."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-chronology-agency-goal-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
    p=O/n
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
roles={x['path']:x for x in load(P/'campaign3-history-source-roles-rev313/index.json')['roleAssignments']}
def evidence(*names):
    result=[]
    for name in names:
        p=P/name;r=roles[p.as_posix()]
        assert ref(p)['sha256']==r['sha256']
        for x in r.get('evidence',[]):assert ref(x['path'])['sha256']==x['sha256']
        result.append(dict(**ref(p),sourceRole=r))
    return result
sections=[
 (2431, 2482, 'AGENCY PHASE CORRECTION',evidence('CAMPAIGN3_AGENCY_QUALIFICATION.md'),'Dated running0.3 index retains0.2 counts36 tests and19/71 matrix before appended final38-test completion. Do not conflate phases or use running snapshot as final authority.0.1 first17-run PASS missed report-to-A shifting future B occurrence IDs;0.2 equal empty reservations fixes later nonrecipient provenance without manufacturing evidence.0.2 still emitted intent/expression both80 despite70/80 contract. Archived reexecution confirms;0.3 splits actual producers and refreezes plan/result. Both failed cohorts and draft audits10/11 preserved; schemas/namespaces/psychological mechanism unchanged. Final0.3 authoritative19/71 and38 tests.'),
 (2483, 2532, 'AGENCY QUALIFIED',evidence('CAMPAIGN3_AGENCY_QUALIFICATION.md'),'Five models19 runs71 prefixes final0.3 preserve chosen intent/expression through external prevention. Actual trace70/80/90/100/110 and complete saves/addressed RNG checked.38 tests=29 public8 source1integration,actual Vitest export distinct first terminal-count receipt. Block/no-block/incompetence preserve reasons/choice/intent/attempt while execution differs. Outcome-only B cannot infer hidden cause; A responds to visible blocker. GroupedMean/LastClaim retained; OutcomeOnly loses evidence,OmniscientCause leaks,SuccessAsIntent discards failed expressions. Duplicate source counts once; negative versus unknown distinct; correction1/2 not certainty. Repeated episode beliefs are not cross-episode prediction. Witnessed blockage does not prove counterfactual success; prevention not coercion. Dated riskREV9 not current coverage.'),
 (2533, 2574, 'GOAL COMPONENT',evidence('GOAL_STRATEGY_COMPONENT_CHECKPOINT.md'),'Eight component tests/no-emit implement finite trusted-operand selector only,not canonical public qualification or acquired S0. Old373 instruction immutable,not mutable plan. Goal survives route change/gap; failure alone neither proves impossible nor supplies alternative. Missing,expired,known unavailable distinct; newer expired evidence cannot revive old current evidence. Out-of-roster simultaneous readings reject rather than silently prioritizing. No new coverage/allocation; later public admission remains necessary.'),
 (2575, 2614, 'GOAL PUBLIC',evidence('CAMPAIGN3_GOAL_STRATEGY_QUALIFICATION.md'),'Four models19 runs94 prefixes start empty with separate goal,plan,evidence owners;adopt140,next40/90 planning,100attempt110execute120observe140update.26 tests include8component16runtime2public; earlier24 retained and final witness includes actual route-B completion. Ordinary planning has empty random ledger,not new Decision/stochastic qualification. GoalEqualsPlan abandons gap,FixedRoute continuesclosedA,FailureAbandonsGoal retireswithoutimpossibility; no universal persistence law. External observed attainment can fulfill without own attempt,false display can wrongly fulfill,hidden completion has no effect. Simultaneous positive evidence does not skip adoption;terminalno-readopt/no-adoptionnoact. Hidden obstruction/incompetence and denied/absent preserve whole later views. Onegoal/twoauthoredroutes not general search,learnedefficacy,multigoal or procrastination.'),
]
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
ss=[dict(startLine=a,endLine=b,role=k,disposition=n,acceptanceChain=e+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']) for a,b,k,e,n in sections]
cpath=P/'campaign3-history-chronology-candidates-rev1/occurrences.json';candidate=load(cpath);rows=[]
for item in candidate['rows']:
    u=item['original'];s=[x for x in ss if x['startLine']<=u['location']['startLine']<=x['endLine']]
    if not s:continue
    assert len(s)==1 and u['location']['endLine']<=s[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],sectionStartLine=s[0]['startLine'],disposition='DATED CLAIM/ROUTING; bound section specifies scoped acceptance and supersession'))
priorPaths=[P/f'campaign3-history-chronology-{n}-rev1/review.json' for n in ['tail','integration','cognition','coverage','development-audits','development-workers','development-scope','defining-public','defining-owners','embarrassment-bridge','intoxication-reappraisal','disposition-sleep','belief-wrapper-recovery','identity-admission-belief','eligibility-capability','biology-public','biology-work-order','tolerance-relapse','habit-reinforcement','prospective-goals','grief-control','relationship-history','social-attribution','personstate-fear','interpretation-attribution','lying-display','recollection-communication','control-reappraisal']]
prior=[r for p in priorPaths for r in load(p)['rows']]
ids=[r['occurrenceId'] for r in prior+rows];assert len(ids)==len(set(ids))
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR AGENCY AND GOAL ENTRIES RECONCILED; WHOLE LOG OPEN',checker=ref('scripts/review-history-chronology-agency-goal.py'),candidates=ref(cpath),resolvedSource=candidate['resolvedSource'],sections=ss,rows=rows,priorReviews=[ref(p) for p in priorPaths],limits=['No runtime tests or original writer rerun. Historical counts are not fresh execution.','No whole-log assignment or HQ011 closure. Original bytes and occurrence identities preserved.']))
save('findings.json',{'status': 'OWNED LIMITS PRESERVED', 'findings': [{'owner': 'RO-C3-020', 'distinction': 'Passing finite matrix can miss later provenance leakage or wrong producer phase.', 'blockedClaim': 'Earlier agency PASS qualifies0.3 or declared phase proves execution ordering.', 'reopen': 'New admission needs actual later-view and phase evidence with exact identities.'}, {'owner': 'RO-C3-020', 'distinction': 'Prevented action preserves chosen intent but does not prove counterfactual success.', 'blockedClaim': 'Blockage proves competence or repeated local beliefs establish prediction/coercion.', 'reopen': 'Broader agency requires independent competence,expectation and coercion phenomena.'}, {'owner': 'RO-C3-020', 'distinction': 'Trusted selector tests differ from public acquired ownership.', 'blockedClaim': 'Component tests qualify arbitrary learned S0 or mutable instruction state.', 'reopen': 'Public admission requires empty-state acquisition and distinct writers.'}, {'owner': 'RO-C3-020', 'distinction': 'Perceived attainment,physical completion,goal and plan differ.', 'blockedClaim': 'World success silently fulfills goals or failed route proves goal impossibility.', 'reopen': 'Broader lifecycle/search claims require explicit evidence and separate ownership.'}]})
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(ss),newOccurrences=len(rows),priorOccurrences=len(prior),cumulativeReviewed=len(ids),remainingOriginalOccurrences=len(candidate['rows'])-len(ids),review=ref(O/'review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
