"""Scoped governing campaign policy; no inference of scientific gate completion."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-campaign-policy-rev1'
SOURCE='CharacterLab — Reference Architecture Build & Research Campaign Plan.md'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs=[
 (1,'SEQUENCE','Campaign0 substrate,1 epistemic seam,2 thin scaffold,3 traversal/corpus and4 reduction are the active framework.','Historical Campaign1-active parent-SEM text is superseded by explicit later bounded completion, not general recognition sufficiency.'),
 (25,'ENTRY','Each work package names topology/contracts/preservation/corpus/competitors/outputs/verdicts/unresolved dependencies.','Relevant P0 blocks implementation; ordinary bounded choices follow the later escalation policy and are not automatically owner decisions.'),
 (40,'SUBSTRATE','Exact identities, addressing, numerical remainder, ordering, atomicity and sole mutation authority have separate mandatory gates.','A correct scheduler is not sufficient settlement; psychological reduction is not earned by substrate ports. Fixed algorithm authority and proof scopes are in accepted formal contracts.'),
 (99,'EPISTEMIC','Observed evidence, roles, classification and recognition are separate from hidden truth and historical direct-token controls.','Historical unproven/active language is dated. Bounded Campaign1 completion does not prove arbitrary ontology, segmentation, recognition or perception.'),
 (127,'SCAFFOLD','Bounded Campaign2 completion and explicit thin topology/vertical slices preserve distinct truth/evidence/intent/outcome owners.','Thin traversability is not every feedback edge, whole corpus, or psychological necessity. UI later owner-deferred except validation needs.'),
 (159,'CAMPAIGN3','Public expressibility and accepted model/contract gates precede a whole phenomenon claim; all15 families remain in denominator.','Missing fixture is blocked/unknown, not failed or vacuous pass. Pilot comparisons may precede Campaign4 with explicit relevance limits.'),
 (196,'BOUNDED-CHRONOLOGY','Dated multisource through BIO summaries report scoped completion and sequential coverage snapshots.','Supersede old next tasks only through reviewed verdict spine. Component BODY/BIO equality is not native admission or state retirement; stored/derived successes survive. Old active-obligation counts are not current.'),
 (307,'EXIT','Full declared obligations must execute or be explicitly amended; mandatory historical reconciliation and retained corpus gates survive conditional debt transfer.','132 bounded Brief clauses alone cannot imply exit. RO registry green is necessary bookkeeping, not source adequacy or corpus acceptance.'),
 (345,'REDUCTION','After Campaign3, rank reductions by invalidation radius, normative importance, epistemic/numeric risk and serious comparison availability.','No fixed priority list or retired phase ladder. Consult obligations and bound affected claims; preserve old evidence when upstream discoveries reorder work.')]
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes().startswith(raw)
lines=raw.decode('utf-8-sig').splitlines(keepends=True);rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or u['location']['startLine']>365:continue
  assert u['location']['endLine']<=365
  _,name,claim,limits=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  assert ''.join(lines[u['location']['startLine']-1:u['location']['endLine']])==u['text']
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],subject=name,disposition=claim,limits=limits))
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={i for i in range(1,366) if lines[i-1].strip()}
evidence=[]
for n in ['CAMPAIGN3_HISTORY_LEDGER_COMPLETE_CHECKPOINT.md','CAMPAIGN3_HISTORY_CORPUS_AUTHORITY_CHECKPOINT.md','CAMPAIGN3_HISTORY_HQ005_DISPOSITION.md','CAMPAIGN3_FINAL_HISTORY_GATE.md','CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md']:
 p=P/n;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='CAMPAIGN POLICY THROUGH LINE365 REVIEWED; HISTORICAL TAIL AND WIDER HQ011 OPEN',rows=rows,evidence=evidence,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Sequence document cannot override higher research method or accepted exact formal semantics.','Later chronology and post-cutoff additions require their own accounting.','No fresh behavioral tests, build, corpus promotion or architectural verdict.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],newWholeOccurrences=len(rows),indexedWholeOccurrenceLinks=2196+len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
