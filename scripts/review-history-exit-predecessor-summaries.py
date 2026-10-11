from pathlib import Path
import collections,hashlib,json,re
P=Path('docs/planning');O=P/'campaign3-history-exit-predecessor-summaries-rev1';O.mkdir(exist_ok=True)
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(name,v):
 p=O/name
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
groups=[
(2,2,'Original readiness preservation before external review; no behavioral evidence added.'),
(3,9,'Bounded mandatory-corpus comparisons change the named member dispositions. Revision-cap unchanged-disposition wording is a local procedural explanation, not permission to waive other gates.'),
(10,12,'Agency qualification and two corrections preserve later nonrecipient leakage and exact intent70 versus incorrect80. Earlier passing cohorts do not qualify the corrected boundary.'),
(13,18,'Separate goal, control, report correction, instructed reappraisal, reconstruction and familiarity witnesses; no general inference, regulation or identity recognition from these joined counts.'),
(19,22,'Communication choice, belief-relative lying, independent display and fixed-convention meaning remain separate profiles; no whole communication/language integration.'),
(23,27,'Attribution, personstate, fear/guilt, goal inference and hearsay add scoped social coverage. Preserve appraisal130 correction and whole-view privacy limits; authored policy is not earned personality.'),
(28,34,'Relationship dimensions/history/attribution/reliance/familiarity/attachment/betrayal/grief support prospective responses, not enacted delegation, repair or mourning.'),
(35,37,'Performance switching, rumination and fatigue qualify separate control witnesses; duplicate rumination alias is not independent coverage and no common resource law is selected.'),
(38,41,'Procrastination, delay, intention loss/access and temporal goals retain late-adoption, completion-capacity and zero-score cue limits. Component cases are not new native public admission.'),
(42,43,'Reconciliation of existing CONTROL/HABIT evidence is not a new mechanism or additive independent cohort; preserve missing identity-field wrapper correction.'),
(44,50,'Substitution, reinforcement, tolerance, absence deficit, craving, relapse and costly pursuit remain distinct. No earlier world/component result is silently promoted to physiology, public scheduler or whole addiction; keep REV49 reconstruction disclosure.'),
(51,52,'Functional biology component and native admission have separate rosters;58 distinct native runs versus59 executions and excluded duplicate remain. No automatic Brief-clause promotion.'),
(53,53,'Line-ending and doubled-log repair is documentation-only. Preserved pre-correction report/checker and unchanged scientific results must not count as new evidence.'),
(54,58,'Eligibility, native separate identity channels, represented belief and its native admission preserve numerical-versus-capability correction, coarse/fine equalities and timeout cohorts. Standing is not belief.'),
(59,62,'Wrapper repair, recovery, plastic disposition and native disposition retain separate scientific/protocol scopes; closed49-wrapper inventory is historical, not current completeness.'),
(63,68,'Sleep/intoxication, chosen reappraisal and embarrassment retain distinct component/native qualifications and no whole Campaign3 exit inference.'),
(69,70,'Defining bridge and meaning/use are components only. Native continuation and clause2 remain open.'),
(71,78,'Acquisition, inputs, lifecycle, memory owners, current assessment, rehearsal, selected native cohort and focused public implementation are development checkpoints. Passing local tests or68 internal programs does not discharge the68 public matrix.'),
(79,79,'Full bounded public defining matrix supports clause2 promotion, not full tails or general autobiographical memory.'),
(80,82,'Historical practice is not developmental state. Explicit owner requirement preserves independently greater younger learning plasticity and early personality authorship weight.'),
(83,85,'Development component, native implementation and full native matrix are distinct steps. Only the full matrix supports bounded clause promotion.'),
(86,92,'Partial-coverage audits reconcile existing evidence and preserve remaining gaps; completed auditing is not completed phenomena. No new execution is implied by prose counters.'),
(93,97,'Importance/urgency, explicit uncertainty, vividness, affect retrieval and scalar receiving comparison retain exact component scope. Successful ScalarUncontrolled equality is not discarded.'),
(98,102,'Latent cause, cross-episode expectation, shared meaning then enacted contexts, and enacted coercion supply separate bounded causal chains. Generic execution atREV99 remains insufficient for domain enactment.'),
(103,106,'Longitudinal goal development, running matrix and interim trajectories are not closure; later full bounded goal qualification has its own receipt. Running status is historical, not a live process handle.'),
(107,111,'Routine development/closure, habit development/closure and personal-loss closure preserve decomposition, actual new practice-memory loss and fallible loss evidence. None qualifies joint native lifetime integration.')]
snapshots={r:load(P/f'CAMPAIGN3_EXIT_AUDIT_REV{r}.json') for r in range(1,112)}
rows=[];checks=collections.Counter()
for rev in range(2,112):
 v=snapshots[rev];pre=v['predecessor'];assert ref(pre['path'])==dict(path=pre['path'],sha256=pre['sha256'])
 text=pre['disposition'];target=rev if 3<=rev<=80 else rev-1;t=snapshots[target]
 counts=collections.Counter(c['status'] for f in t['brief']['families'] for c in f['clauses']);verified={}
 m=re.search(r'(\d+) bounded/(\d+) partial/(\d+) blocked',text)
 if m:
  stated=tuple(map(int,m.groups()));actual=tuple(counts[x] for x in ['QUALIFIED BOUNDED','PARTIAL','BLOCKED']);assert stated==actual;verified['briefStatusCounts']=stated;checks['briefStatusCounts']+=1
 m=re.search(r'(\d+) (?:named )?verdicts',text)
 if m:assert int(m[1])==len(t['verdicts']);verified['verdicts']=int(m[1]);checks['verdicts']+=1
 m=re.search(r'\b(1[45]\d\d)/(\d+)\b',text)
 if m:assert tuple(map(int,m.groups()))==(t['counters']['highestAllocatedRecordType'],t['counters']['allocatedSinceVerdict']);verified['programCounters']=list(map(int,m.groups()));checks['programCounters']+=1
 old=snapshots[rev-1];before={c['id']:c['status'] for f in old['brief']['families'] for c in f['clauses']};after={c['id']:c['status'] for f in v['brief']['families'] for c in f['clauses']}
 matches=[g for g in groups if g[0]<=rev<=g[1]];assert len(matches)==1
 rows.append(dict(source=ref(P/f'CAMPAIGN3_EXIT_AUDIT_REV{rev}.json'),pointer='/predecessor/disposition',text=text,linkedPredecessor=ref(pre['path']),describedSnapshot=ref(P/f'CAMPAIGN3_EXIT_AUDIT_REV{target}.json'),textScope='SUCCESSOR WORK / TRANSITION' if target==rev else 'LINKED PREDECESSOR STATE',judgment=matches[0][2],verifiedSummaryFields=verified,actualSuccessorClauseChanges=[dict(clause=k,before=before[k],after=after[k]) for k in before if before[k]!=after[k]],actualAddedVerdicts=sorted(set(v['verdicts'])-set(old['verdicts']))))
assert len(rows)==110 and len({x['text'] for x in rows})==109
assert rows[78]['text']==rows[79]['text'] # REV80 and REV81 describe the same REV80 history audit.
save('review.json',dict(status='PREDECESSOR SUMMARY SEMANTICS RECONCILED; HQ011 OPEN',checker=ref(__file__),rationaleUnion=ref(P/'campaign3-history-exit-identity-longitudinal-rev1/rationale-union-check.json'),chainReview=ref(P/'campaign3-history-exit-audit-chain-rev1/review.json'),rows=rows,summaryFieldChecks=dict(checks),scopeFinding='The field name is not a uniform temporal promise. REV2 describes predecessor1; REV3..80 describe successor work or its transition; REV81..111 describe linked predecessors. All stated Brief/verdict/allocation counts checked against the described snapshot. REV80/81 duplicate wording refers to the same actualREV80, not two experiments.',limits=['Original predecessor paths/hashes still point to the actual previous snapshot. No chronology or qualification is moved earlier by narrative wording.','Behavioral roster/test/build claims reuse the separately reviewed qualification spine and rationale union; no fresh simulation or execution is claimed here.','Development, interim running status and focused passing tests do not imply native qualification, live process state or Campaign3 exit.','No snapshot rewrite, law selection, verdict, source-role promotion or obligation closure. Shared Markdown, inventory/support adequacy and remaining source roles still pending.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS; SEMANTIC TEMPORAL SCOPE AND DECLARED SUMMARY COUNTS',review=ref(O/'review.json'),rows=110,uniqueTexts=109,summaryFieldChecks=dict(checks),sourceRolesPromoted=0))
print(json.dumps(load(O/'check.json')))
