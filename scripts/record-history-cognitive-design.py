from pathlib import Path
import json,hashlib
P=Path('docs/planning');A=P/'campaign3-history-cognitive-appraisal-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(p,v):
 assert not p.exists(),p
 p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
c=load(P/'campaign3-history-source-roles-rev179/check.json');assert c['assignedSources']==10312
t=load(A/'receipt.json');assert len(t['results'])==5
assert len(t['results'][0]['rows'])==162 and all(x['status']=='PASS' for x in t['results'][0]['rows'])
assert all(any(x['status']=='ASSERTION_FAILURE' for x in v['rows']) for v in t['results'][1:])
for f in t['sourceFingerprints']:assert ref(f['path'])==f
vectors=[
 ('TA-A','EXISTING SCOPED EVIDENCE','CognitiveModel seven actual upstream stages reject lookalike children before reads; qualification TW-A/K and TP-I/K bind current-source authentication. Component supplement does not reexecute these or independently mutate every nested field.'),
 ('TA-B','SUPPLEMENTAL COMPONENT PASS','Inclusive lower/upper endpoints and maximum distance10 in either direction tested. Nine fixed scenarios, not exhaustive domain proof.'),
 ('TA-C','SUPPLEMENTAL COMPONENT PASS','Unknown versus known reading0, within known0 and concern known0 versus Unavailable; unknown-as-known-zero mutant detected.'),
 ('TA-D','PARTIAL EVIDENCE; EXPLICIT SCOPE RECONCILIATION OPEN','Same forecast with different overlapping goals yields distinct assessments. The earlier incompatible-interval scene was expressly relaxed in the accepted profile proposal. Literal nonoverlapping-goal component control is not supplied by this supplement; reconcile requirement scope before whole TA claim.'),
 ('TA-E','SUPPLEMENTAL COMPONENT PASS','Gain0,1/2,1 and maximum distance use literal independent expected intensities. Ignored gain and wrong denominator mutations detected. Invalid gain admission remains a separate codec/model boundary.'),
 ('TA-F','SUPPLEMENTAL COMPONENT PASS','Enabled/disabled concern retains identical nested appraisal bytes in all cases. Disabled-as-known-zero mutant detected. No public new model or persistent affect claim.'),
 ('TA-G','SUPPLEMENTAL COMPONENT PASS','Empty/one/two distinct task keys preserve exact source order and one assessment/response per selected task. This does not replace malformed-source admission checks.'),
 ('TA-H','EXISTING STATIC/COMPONENT EVIDENCE; NO UNIVERSAL CAPABILITY CLAIM','Restricted transformer signatures have no state/registry/truth resolver. CognitiveModel actual upstream stage tests require empty reads and unchanged whole state. Full trusted-host noninterference is not established by signatures alone.'),
 ('TA-I','EXISTING PUBLIC/COMPONENT EVIDENCE','Qualification TW-H/I/J and CS-I/J cover actual output/child allocation, prefix continuation and composed final-trace rollback. That is not a dedicated fault after every appraisal stage. Same-phase scheduling remains owned by accepted runtime registrations.'),
 ('TA-J','PARTIAL SUBSTITUTION EVIDENCE; RECONCILIATION OPEN','New four substitutions plus earlier ignored-forecast mutant discriminate named cases. Proposed truth comparison, independent copied evidence, direct retirement and affect-as-base alternatives are not all separately executed here. Capability/ownership/source controls may own exclusions; their explicit vector disposition is still owed rather than inventing detection claims.')
]
save(A/'crosswalk.json',dict(status='SCOPED TA EVIDENCE MAP; WHOLE TA RECONCILIATION OPEN',draft=ref(P/'CAMPAIGN2_TASK_APPRAISAL_AFFECT_DRAFT.md'),qualification=ref(P/'CAMPAIGN2_COGNITIVE_QUALIFICATION.md'),priorFocusedTests=ref(P/'campaign3-history-cognitive-qualification-rev1/test-sources.json'),currentSupplement=ref(A/'receipt.json'),vectors=[dict(vector=v,disposition=d,evidenceAndLimits=s) for v,d,s in vectors],remaining=['Explicitly reconcile incompatible-goal wording against accepted scene refinement or add separately scoped control.','Map remaining TA-J proposed faults and invalid-domain/source admission to executed evidence or precise exclusions; do not substitute green bookkeeping or formula inspection for that work.'],obligations=['RO-C3-019','RO-C3-020','RO-C3-021']))
save(A/'check.json',dict(status='PASS CURRENT COMPONENT SUPPLEMENT; FULL VECTOR DISPOSITION OPEN',baselineCases=162,sourceMutants=4,failedAssertions=[dict(name=v['name'],count=sum(x['status']=='ASSERTION_FAILURE' for x in v['rows'])) for v in t['results'][1:]],unchangedSourceFingerprints=len(t['sourceFingerprints']),receipt=ref(A/'receipt.json'),crosswalk=ref(A/'crosswalk.json')))
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_DESIGN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive design corrections — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Reconciled14 complete design/component documents and320 original narrative
occurrences. Preserve independent deliberation versus successful sensing, original
opportunity versus generated source, procedural instruction versus efficacy belief,
availability versus base motivation and retained-state causation versus scheduler
parenthood. The final workspace reserves the forecast slot; it does not donate it
to another task when access is disabled. Diagnostic absence causes are not knowledge.

Two rejected design choices remain explicit. Nonoverlapping task windows were
unnecessary because each concrete task owns a distinct key; the restriction would
have prevented competing commitments. Initial alignment-scaled standing selected
Phase2.95 instead of Phase2.97's direct I. Earlier mixed-component experiments remain
valid feasibility controls, with corrected interpretation, not discarded failures or
proof of generated public behavior. Actual source chronology is preserved, including
eight broad-run timeouts/43 serial passes, the successor307 decoder correction and
missingI participant validation moved before every prior read. Later bounded
qualification supersedes intermediate OPEN status without rewriting those sources.

Found an evidence-accounting gap: the accepted appraisal draft names TA-A..J, while
the inspected later qualification explicitly crosswalks TW/TP/RI/IH/TRC4/CS rather
than TA. Existing evidence covers several TA requirements but does not warrant
claiming every proposed fault has its own executed mutation. This is not evidence
of a production defect or a reason to reopen accepted mathematics.

A fresh, separately labeled component supplement now passes162 cases: nine scenarios,
three gains, enabled/disabled concern and0/1/2 tasks. Literal expected intensities
cover inclusive endpoints, maximum distance10, known neutral, absent forecast and
gain0/1/2/1. Exact nested operands and key ordering remain unchanged. Four in-memory
source mutations are detected by assertions: unknown-as-known-zero6 failures,
disabled-as-known-zero54, ignored gain22, wrong domain span22. No source file was
mutated; all source fingerprints remain unchanged. These are present-source
component results, not historical execution or new public model qualification.

The explicit TA crosswalk remains OPEN for final scope reconciliation: incompatible
goal wording versus the accepted overlapping-goal scene; remaining proposed TA-J
faults and invalid-domain/source admission must have executed evidence or precise
exclusion rationale. Public parent/rollback evidence and static capability arguments
remain separate from the new arithmetic/component matrix. No whole TA PASS inferred.

SourceREV179:10,312 assigned/1,061 unassigned;130,365 narrative/211,150 backing;
1,190 indexed outside-census artifacts.80 exit-inventory identities plus one separate
scheduler identity remain unresolved. Formula provenance, legacy log, Values90/15,
remaining component contracts and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY. No model/allocation/production change, new verdict, law
selection, corpus promotion or obligation closure.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 mandatory and UNSATISFIED;
RO022 CLOSED. Next finish the TA crosswalk, then remaining contracts/planning roles.
'''.replace('gain0/1/2/1.','gain0,1/2,1.'),encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
dirs=['campaign3-history-cognitive-design-rev1','campaign3-history-source-roles-rev179','campaign3-history-cognitive-appraisal-rev1']
paths=[p.as_posix() for d in dirs for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:14 cognitive design/component documents reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_DESIGN_CHECKPOINT.md.
320 original narrative occurrences;rejected overlap restriction and wrong
historical standing selection preserved. TA-A..J explicit crosswalk gap found.
Fresh supplement:162 component cases/four detected source mutants;source bytes
unchanged. Whole TA disposition OPEN;no new public or historical qualification.
SourceREV179:10312 assigned/1061 unassigned;130365 narrative/211150 backing;
1190 archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next finish TA scope/fault crosswalk,then remaining contracts/planning roles.
Formula provenance,legacy log,Values90/15 and independent adequacy OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
assert all(p.stat().st_size<50000000 for d in dirs for p in (P/d).iterdir())
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
