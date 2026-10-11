"""Reconcile eleven dated integration entries with their scoped successor evidence."""
from pathlib import Path
import json
import hashlib

P=Path('docs/planning')
O=P/'campaign3-history-chronology-integration-rev1'
C=P/'campaign3-history-chronology-candidates-rev1'

def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
    p=O/n
    if p.exists():assert load(p)==v,p
    else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

roles={x['path']:x for x in load(P/'campaign3-history-source-roles-rev313/index.json')['roleAssignments']}
def evidence(*names):
    result=[]
    for n in names:
        p=P/n;r=roles[p.as_posix()]
        assert ref(p)['sha256']==r['sha256'],p
        for e in r.get('evidence',[]):assert ref(e['path'])['sha256']==e['sha256']
        result.append(dict(**ref(p),sourceRole=r))
    return result

cross=evidence('CAMPAIGN3_CROSS_CONTEXT_IDENTITY_QUALIFICATION.md','CAMPAIGN3_CROSS_CONTEXT_QUALIFICATION.md')
coercion=evidence('CAMPAIGN3_ENACTED_COERCION_QUALIFICATION.md')
goal=evidence('LONGITUDINAL_GOAL_IMPLEMENTATION_CHECKPOINT.md','LONGITUDINAL_GOAL_EXECUTION_CHECKPOINT.md','LONGITUDINAL_GOAL_INTERIM_REVIEW.md','CAMPAIGN3_LONGITUDINAL_GOAL_QUALIFICATION.md')
routine=evidence('LONGITUDINAL_ROUTINE_IMPLEMENTATION_CHECKPOINT.md','CAMPAIGN3_LONGITUDINAL_ROUTINE_QUALIFICATION.md','LONGITUDINAL_ROUTINE_CLOSURE_REVIEW_FINDING_REV1.json')
habit=evidence('LONGITUDINAL_HABIT_IMPLEMENTATION_CHECKPOINT.md','CAMPAIGN3_LONGITUDINAL_HABIT_QUALIFICATION.md','LONGITUDINAL_HABIT_FREEZE_FINDING_REV1.json','LONGITUDINAL_HABIT_ORACLE_FINDING_REV1.json')
common=evidence('MOTIVE_AUDIT_VALIDATION_FINDING_REV1.json','CAMPAIGN3_EXIT_RECONCILIATION_READINESS.md')
sections=[
 (7088,7123,'CONTROLLED MEANING COMPONENT',cross,
  'Original127-run component earns controlled common meaning, not enactment of custody/disclosure/attendance. Seed1/7 aggregate cancellation preserves acquired contributions; seed7-only probe controls cannot establish nonzero receiving effects. Later enacted-domain/all-seed qualification resolves only those two gaps. Timeout/partition changes retain the original matrix/assertions; component replay is not Save132.'),
 (7124,7162,'ENACTED DOMAIN AND RECEIVING SUCCESSOR',cross,
  'Actual domain state now follows original chosen actions without changing original identity saves.55 domain runs/330 prefixes differ from144 receiving executions/864 prefixes,of which18 repeats leave126 new runs/756 new prefixes. Matched same-context NoFeedback yields4/8 choice differences; raw changedChoice across different action vocabularies is not that causal contrast. Meaning/acceptance remain controlled; physical failure and recipient knowledge are distinct. Component publication repair confers no native producer.'),
 (7163,7201,'ENACTED REFUSAL COST',coercion,
  'Actual refusal and permitted execution trigger an external conditional penalty; admitted source-specific evidence changes only later anticipated cost.576 runs/2880 prefixes preserve8/8 probability and5/8 action changes with3 equal sequences. Threshold excludes20 later high-pressure expressions without rewriting choice or earlier credit. No opportunity or no refusal is not known zero; false-high belief may persist when compliance prevents correction. Recognition/penalty policy remain controlled; no universal coercion or public admission.'),
 (7202,7240,'GOAL DEVELOPMENT BEFORE FREEZE',goal,
  'Seed0/selected-prefix development and8 focused checks do not qualify the120-run matrix. Coarse nonzero standing yields zero effective modifier; FineStanding1/16 is a separate candidate. Preserve the failed expected inequality. Later bounded verdict resolves prospective execution status,not a preferred calibration or native joined scheduler.'),
 (7241,7277,'GOAL HISTORICAL EXECUTION CAPTURE',goal,
  'Immutable20 trajectories/340 captured hashes/12 matched source pairs had zero new restored-prefix checks. These numbers are not added to later120/2040 totals. Historic session86267/36191 instructions are superseded by completed qualification and are not evidence of live workers now. All-seed conclusions were still pending at this capture.'),
 (7278,7318,'GOAL INTERIM TRAJECTORIES',goal,
  'The72-trajectory interim comparison preserves18/24 distribution and14/24 action differences,six zero-standing equalities and four stochastic equalities.24 retention pairs and8/8 goal interventions are trajectory evidence,not prefix restores. Later120-run closure resolves the remaining comparison/replay work without rewriting this dated capture.'),
 (7319,7359,'GOAL BOUNDED QUALIFICATION',goal,
  '120 runs/2040 original-prefix restores check one successor,not every future tail. Fine/NoFeedback differ18/24 distributions and14/24 sequences; coarse equals24/24.24 retention equalities are specific to this standing/current-goal receiver,not dispensability of episodic detail. Goal changes preserve biography. Prior tests reverified versus fresh build remain distinct. No receiving opportunities before14 means no established routine.'),
 (7360,7398,'ROUTINE DEVELOPMENT',routine,
  'Typed occurrence adapter rejection and failed must-resume-at14 assertion remain separate cohorts. Learned availability and maintained goal do not force action. Seed0 idle14 becomes later resumption15 in the completed horizon,not permanent non-resumption.10 tests/selected joined restores/8-seed pure equality are not the full source-reuse qualification. No calibration changed to force action.'),
 (7399,7438,'ROUTINE BOUNDED QUALIFICATION',routine,
  '504 receiver trajectories/8568 receiver reconstructions differ from16 reused native sources/272 prior prefixes and4 fresh joined horizons/68 comparisons/8 restores. Maintained/withdrawn8/8 probability differences yield5/8 action differences.96 Stored/Derived and24 retention equalities retain diagnostic cache and full journal. Source episode expiry is not forgetting these new practice episodes. ScheduledOnly grants availability,not guaranteed enactment; corrected closure assertion preserves original production/matrix bytes.'),
 (7439,7479,'HABIT DEVELOPMENT',habit,
  'Separately owned actual practice episodes can be lost while learned history survives; development supplied zero standing and did not execute native biography.17 receiver prefixes and owner faults remain development scope. Online restore binds prefix operands,not future admission. No failed initial development cohort does not erase later freeze/scanner or fault-oracle failures. Actual observed renewed practice,not positive report alone,restores availability.'),
 (7480,7519,'HABIT BOUNDED QUALIFICATION',habit,
  '960 REV2 receiver runs/16320 restores differ from8 reused sources/136 prior prefixes and4 fresh joined horizons/8 restores. Old REV1 joined receipt is preserved,not added to REV2 totals; production stays unchanged while experiment-bound identities differ. All8 regain corrected-belief availability after actual observed practice,but only4 act on final probes.192 Stored/Derived and480 retention behavioral equalities do not erase episodic differences or full fold history. New practice acquires new episode identities; lost content does not return. No global erasure,compression,native GA formation or joined public admission.')
]
selected=[]
for a,b,label,chain,note in sections:
    selected.append(dict(startLine=a,endLine=b,role=label,disposition=note,
        acceptanceChain=chain+common,obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
candidate=load(C/'occurrences.json');rows=[]
for item in candidate['rows']:
    u=item['original'];line=u['location']['startLine']
    ss=[s for s in selected if s['startLine']<=line<=s['endLine']]
    if not ss:continue
    assert len(ss)==1 and u['location']['endLine']<=ss[0]['endLine']
    rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],
        location=u['location'],text=u['text'],sectionStartLine=ss[0]['startLine'],
        disposition='DATED CHECKPOINT CLAIM/ROUTING; use bound section authority and scoped supersession,not current execution instructions'))
prior=load(P/'campaign3-history-chronology-tail-rev1/review.json')
assert not ({x['occurrenceId'] for x in rows}&{x['occurrenceId'] for x in prior['rows']})
assert len({x['occurrenceId'] for x in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='ELEVEN CHRONOLOGY ENTRIES RECONCILED; WHOLE LOG OPEN',
    checker=ref('scripts/review-history-chronology-integration.py'),candidates=ref(C/'occurrences.json'),
    resolvedSource=candidate['resolvedSource'],sections=selected,rows=rows,
    limits=['No original source,model,verdict or occurrence changed; no runtime suite or original writer rerun.',
            'Dated source roles are inherited only for the particular claims and limits described here; whole log remains unassigned.',
            'Historical jobs are not restarted or polled solely because archived routing names them.']))
save('findings.json',dict(status='DISTINCTIONS PRESERVED; NO REDUCTION OR OBLIGATION CLOSED',findings=[
    dict(owner='RO-C3-020',distinction='Aggregate cancellation,ineffective coarse modulation and stochastic equality differ.',blockedClaim='Equal action proves absent learning or absent evidence.',reopen='A new receiver/calibration/horizon needs its own discriminating comparisons.'),
    dict(owner='RO-C3-019',distinction='Controlled common meaning required actual-domain and matched all-seed receiving successors.',blockedClaim='Shared labels,generic protocol counts or cross-vocabulary choice difference prove transfer.',reopen='Natural recognition,acceptance or native source admission is claimed.'),
    dict(owner='RO-C3-020',distinction='Refusal cost evidence,anticipated pressure,actual choice and frozen identity credit differ.',blockedClaim='Hidden power may repair beliefs or later consequences may rewrite original authorship.',reopen='New social/causal attribution or feedback mechanisms are required.'),
    dict(owner='RO-C3-020',distinction='Practice-specific episodic loss differs from loss of source episodes or global history erasure.',blockedClaim='Stored/Derived equality with diagnostic cache/full journal proves compression or dispensable memory.',reopen='A consumer needs lost episodic content or compression is proposed.'),
    dict(owner='RO-C3-021',distinction='Development,captured hashes,reused native evidence,receiver replay and selected fresh joins have distinct denominators.',blockedClaim='Summing captures/repeats/reuse produces additional qualified native runs.',reopen='A broader public or replay claim requires matching admission/execution evidence.')]))
save('check.json',dict(status='PASS SCOPED CHRONOLOGY ACCOUNTING; HQ011 OPEN',sections=len(selected),
    newOccurrences=len(rows),priorOccurrences=len(prior['rows']),cumulativeReviewed=len(rows)+len(prior['rows']),
    remainingOriginalOccurrences=len(candidate['rows'])-len(rows)-len(prior['rows']),
    review=ref(O/'review.json'),priorReview=ref(P/'campaign3-history-chronology-tail-rev1/review.json')))
assert all(p.stat().st_size<50_000_000 for p in O.iterdir())
print(json.dumps(load(O/'check.json')))
