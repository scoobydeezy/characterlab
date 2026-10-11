"""Scoped early Campaign3 claim review, retaining original occurrence identities."""
from pathlib import Path
from fractions import Fraction as F
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-seam-front-rev1';O.mkdir(exist_ok=True)
SOURCE='docs/planning/SEAM_LEDGER.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs=[(1, 'OLD-ROUTING', 'Sep21 current label is historical BIO component state; later ledger owns explicit native/identity successors.', '970/0 and21 corpus members do not describe current counts or whole phenotype closure. Refold/compression limits remain.', ['CAMPAIGN3_BIO_QUALIFICATION.md', 'CAMPAIGN3_IDENTITY_PUBLIC_QUALIFICATION.md']), (14, 'GA-COMPONENT-CHRONOLOGY', 'Registration, carrier, producer, source and role-audit receipts document intermediate GA scopes before later public qualification.', 'Test counts and symbolic templates not runtime qualification; current/latest words within historical block not live tasks. Source failures and supplied-stage limits retained.', ['GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md', 'CAMPAIGN3_HISTORY_LEDGER_COMPLETE_CHECKPOINT.md']), (106, 'GA-OWNER-PROTOCOL', 'Accepted candidateA controls preserve separate body cue, retrieval, significance, historical credit and ordinary memory ownership.', 'CandidateA label local first implementation, not general law. Compact credit tags do not authenticate origin; later actual source production required independently.', ['GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md', 'CAMPAIGN3_HISTORY_HQ007_CHECKPOINT.md']), (149, 'GRAPH-RESOURCE', 'Independent graph lifecycle/direct cue, zero-hop once, zero-state normalization and strength/resource policies are separate.', 'Finite tested graph does not establish scaling, universal priority/weakening or arbitrary modality; component counts remain dated.', ['GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md', 'CAMPAIGN3_HISTORY_HQ006_CHECKPOINT.md']), (190, 'ACQUISITION', 'Selection1143 not successful acquisition identity; preserve source provenance, nonborrowed per-kind semantic-child budgets, original-time baseline and acquired protection comparison.', 'No fragment/view/byte slot equivalence; initial acquisition and later attributed consolidation separate. Physical source labels do not define physiological ontology.', ['GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md', 'CAMPAIGN3_DEFINING_PUBLIC_QUALIFICATION.md']), (249, 'BOUNDED-TABLE', 'Table preserves named qualification scopes; later reviewed verdicts supply specific completed belief/affect/social/biology/lifecycle successors.', 'Rows still saying social not implemented, general factors unqualified or BIO open are old routing, not current blockers. General ontology, laws, current-lane, horizons and UI limits remain; no blanket promotion.', ['CAMPAIGN3_HISTORY_LEDGER_COMPLETE_CHECKPOINT.md', 'CAMPAIGN3_HISTORY_HQ005_DISPOSITION.md', 'CAMPAIGN3_HISTORY_RESEARCH_COMPLETE_CHECKPOINT.md']), (282, 'OLD-SHAPE-TABLE', 'Historical table distinguishes specification/shape, allocation, implementation and qualification; exact formal contracts outrank index.', 'No-writer-before-contract rule remains; old Campaign2 active/unimplemented labels superseded by explicit bounded completion. General ontology/current-lane use not automatically closed.', ['CAMPAIGN3_HISTORY_LEDGER_CAMPAIGN2_CHECKPOINT.md', 'CAMPAIGN3_HISTORY_CAMPAIGN2_ADMISSION_CHECKPOINT.md']), (324, 'ADAPT-REVISIONS', 'Successive drafts replace root proposal with logical families/two roots, closed input/rule/transaction path and exact typed access roles.', 'Proposal, internally shape-ready and frozen-not-passed gates not equivalent to execution. Later complete qualification supersedes routing, not frozen semantics or rejected designs.', ['CAMPAIGN3_HISTORY_CAMPAIGN2_ADMISSION_CHECKPOINT.md', 'CAMPAIGN3_HISTORY_LEDGER_CAMPAIGN2_CHECKPOINT.md'])]

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 1<=u['location']['startLine']<=397:continue
  assert u['location']['endLine']<=397
  _,name,claim,limits,paths=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],claim=name,disposition=claim,limits=limits,evidence=paths))
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes().startswith(raw)
lines=raw.decode('utf-8-sig').splitlines(keepends=True)
for r in rows:assert ''.join(lines[r['location']['startLine']-1:r['location']['endLine']])==r['text']
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={n for n in range(1,398) if lines[n-1].strip()}
evidence=[]
for n in sorted({n for s in specs for n in s[4]}):
 p=P/n;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='HQ011 SEAM ROUTING AND EARLY SHAPES REVIEWED; WIDER AUDIT OPEN',source=dict(path=SOURCE,frozenSha256=sha(B/'sources'/SOURCE)),rows=rows,evidence=evidence,obligations=['RO-C3-001','RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-015','RO-C3-016','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No fresh production simulation, test suite or build. Receipt bindings do not assert current source freshness for every old receipt.','Eight reviewed claim groups retain independent public/component, law and historical correction scopes.'],nextGate='SEAM_LEDGER398 onward; backing-role counts remain separate.')
save(O/'review.json',v)
c=dict(status=v['status'],originalOccurrences=len(rows),claimGroups=len(specs),indexedWholeOccurrenceLinks=1244+len(rows),freshBehavioralTests=0,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
