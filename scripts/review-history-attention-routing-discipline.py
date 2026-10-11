"""Reconcile superseded attention routing and active checkpoint discipline."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-attention-routing-discipline-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def save(n,v):
 p=O/n
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
notes={'docs/planning/GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13.md': 'Historical user pause later resumed; not a current instruction to stop.705/706 append explicit nonlearning path capability while704/322 frozen; read-only and character-learning versus perception/goal/physical paths retain different grants. Fixed helper not whole-model authorization.23 focusedtests/4faults distinct314/46 earlier regression; post-review comment hash remains historical. Resume redirected through workorder then completed GA; do not rerun write-once allocations or alias704/706. No raw truth/source cache, futuretask warmup or implicit sameinstant access from this checkpoint. Old corpus0.27 commitment remains distinct.', 'docs/planning/GENERAL_ATTENTION_RESUME_BRIEF.md': 'Completion annotation supersedes dated entrypoint and unfinished steps: single primary owner completed67 bindings/43models/publicpaths. Historical7→12 ledger claim later corrected by finalGA: three said-recorded entries actually absent and added Sept20, not retroactively present. Corpus0.28 added11 obligations,3partial8blocked, not11passes;0.27 evidence unchanged.80/58 GA-local lower bound excludes inherited multiplicity/slots; first graph omitted18conditional edges, miscounted26roots versus12, joins/replacements distinct. Concern edge ratified narrowly, TaskConcern not generalAffect; CandidateC decouples encoding/retrieval, law unresolved, omega<=2 reopening conditional. No current owner blocker or delegation authorization inferred.', 'docs/planning/CAMPAIGN3_WORK_ORDER_2026_09_14.md': 'Issued ordering correction, not contract/allocation/model rewrite. Items1-6 explicitlycomplete Sept20; arithmetic/corpus/owedverdicts/template/concern/GA are historical completed work, not currenttodo.254records811planningfiles withzeroverdict/corpus additions motivated cadence. Corpus membership declares obligation notpass; receipt conformance notscientificverdict. StageC namedbeforeallocation and mutation sensitivity notnecessity. Concern comparator obligation discharged without selectinglaw/generalAffect. Preserve transferargument, budgets and all historicalmanifest identities; currentgoal no newallocation/corpuspromotion.', 'docs/planning/CHECKPOINT_TEMPLATE.md': 'Active process authority with historical examples. ReplaceCURRENT and preservechronology, reporthighest/sincelastverdict counters; >50requires experiment/promotion next. Revision5 triggers local load-bearing review, not automaticownerpermission: derivedcrosswalks generated/diffed, no ritualnear-duplicate scientific review. This audit adds previouslyunassigned sources and exactmaterialdispositions; unchangedindexassignments preserved mechanically, counts alone notadequacy. Typed namespace resemblance notordinalreservation; gaps needrealhistory. ROreferences mandatory forverdicts, conditionalnotclosed andzerounownednotcompletefindingaudit. StageC competitor beforeallocation; mutations notmechanismnecessity. Transferargument boundsfixtureclaims; template doesnotwaive finalcorpusgates.'}
ip=P/'campaign3-history-source-roles-rev257/index.json';ix=load(ip);entries={e['path']:e for e in load(B/'manifest.json')['entries']}
chain=[ref(P/n) for n in ['GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md','CAMPAIGN3_FINAL_HISTORY_GATE.md','RESEARCH_OBLIGATIONS.md']]
sources=[]
for p,n in notes.items():
 assert p in ix['unassignedCandidatePaths'] and ref(p)['sha256']==entries[p]['sha256']
 sources.append(dict(**ref(p),role='ATTENTION ROUTING HISTORY AND ACTIVE PROCESS DISCIPLINE',judgment=n,acceptanceChain=chain))
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in notes:continue
  assert u['sourceSha256']==entries[u['source']]['sha256']
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],category='NARRATIVE'))
assert len({r['occurrenceId'] for r in rows})==len(rows)
O.mkdir(exist_ok=True)
save('review.json',dict(status='FOUR ATTENTION ROUTING SOURCES RECONCILED',checker=ref(__file__),sourceIndex=ref(ip),sourceRoles=sources,rows=rows,preservedArtifacts=[],limits=['Planning and captured hashes do not establish completed replay; later qualifications preserve component/native distinctions.','Later bounded completion supersedes routing only within named profiles, not all ideal-loop phenomena.','No runtime/test/build rerun, source gap closure, law/model/verdict/corpus/obligation status change or historical adequacy claim.'],obligations=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021']))
save('check.json',dict(status='PASS ATTENTION ROUTING HISTORY',sources=len(sources),originalNarrativeOccurrences=len(rows),originalBackingOccurrences=0,review=ref(O/'review.json')))
print(json.dumps(load(O/'check.json')))
