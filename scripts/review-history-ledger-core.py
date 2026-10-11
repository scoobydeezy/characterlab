"""Scoped early Campaign3 claim review, retaining original occurrence identities."""
from pathlib import Path
from fractions import Fraction as F
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ledger-core-rev1';O.mkdir(exist_ok=True)
SOURCE='docs/planning/VERDICT_LEDGER.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs=[
 (1288,'MULTI001','Collective overlap differs from pairwise even when final probability equal; orphan Situation weakens unrelated body reason only under role-blind normalization.','Arithmetic operands and selected-view extension not public source proof. FamilyNormalized retained competitor; no universal role-aware normalizer refuted.',['MULTISOURCE_COMPARISON_REV1.json','MULTISOURCE_DESCRIPTION_CHECKPOINT.md']),
 (1343,'MULTI002','Authentic common fact supports distinct motive grounds;43 models,55 scenarios,62 runs are different denominators. Public duplicate/collective controls and orphan removal discriminate.','General receiving law unresolved. Original full-suite codec failure remains, followed by affected rerun; do not label full process PASS. Receipt correlation is not arbitrary renaming invariance.',['CAMPAIGN3_MULTISOURCE_PUBLIC_QUALIFICATION.md','MULTISOURCE_VALIDATION_CLOSURE_REV1.json']),
 (1402,'BELIEF','Fixed truth/different displays and goal-only interventions separate evidence, belief and appraisal. No opportunity not observed negative;140 influences later50.','Evidence weight not calibrated confidence; contradiction can raise diagnostic. LastObservation retained; current-lane, trust/correlation and causal inference not earned.',['CAMPAIGN3_BELIEF_QUALIFICATION.md','BELIEF_VALIDATION_CLOSURE_REV1.json']),
 (1442,'AFFECT','Independent likelihood/severity/vulnerability/control and competing commitment preserve affect versus command. Strictly later feedback changes appraisal without belief rewriting.','Receiver choice does not independently prove SplitExposure necessity. Fixed plans/known valuation and carried factors limit uncertainty/physiology/action discovery.',['CAMPAIGN3_AFFECT_QUALIFICATION.md','AFFECT_PUBLIC_EXPERIMENT_REV1.json']),
 (1484,'WORK','StoredSet/IndexedReplay equivalent on finite safe retained history; maintained access differs from retention, availability and stateless priority. Supplement isolates distractor priority.','Deriving cache does not eliminate source retention or reconstruction cost. Original confounded fixture retained; no general control or cache necessity result.',['CAMPAIGN3_WORKSPACE_CONTROL_QUALIFICATION.md','WORK_DISTRACTOR_DESIGN_FINDING.md']),
 (1519,'SKILL','Capability, observed performance expectation and temporary impairment have separate owners; hidden changes alter execution without rewriting prior intent/belief.','One exercise/one held choice not latent competence inference, calibrated confidence or confidence-sensitive choice. Preserve initial arbitration API failure.',['CAMPAIGN3_SKILL_QUALIFICATION.md','SKILL_VALIDATION_CLOSURE_REV1.json']),
 (1558,'SOCIAL','Recipient-owned fallible evidence and deduplication, reverse-order disjoint equality and closed safe views qualified.','Visible duplicate receipt not general independent-source proof. Target self-knowledge not tested; general privacy/reciprocity/recognition remain distinct.',['CAMPAIGN3_SOCIAL_QUALIFICATION.md','SOCIAL_VALIDATION_CLOSURE_REV1.json']),
 (1587,'HABIT','Acquired history supplies candidate availability after belief correction; derived/cached behavior equal under finite journal.','Not preference compulsion or universal conscious-awareness rule. Truth adaptation separate; CurrentRewardOnly violating, other ablations merely insufficient. No safe journal deletion or general episodic substitution.',['CAMPAIGN3_HABIT_QUALIFICATION.md','HABIT_VALIDATION_CLOSURE_REV1.json']),
 (1622,'REL','Matched person estimate/different dyadic history changes effective response. Rupture not automatically repaired by positive willingness report. Cache derivable in finite complete journal.','Old unit1 cohort failed behavioral discrimination; calibrated0.2 preserved as successor. No enacted action or reduction against every richer person model. Explanation not original-breach causal correction.',['CAMPAIGN3_RELATIONSHIP_QUALIFICATION.md','RELATIONSHIP_VALIDATION_CLOSURE_REV2.json']),
 (1657,'LONG','Acquired families survive actual episode loss; compact relationship preserves declared projections with different accessible detail.','Execution17 uses pre-update competence. Explicit interference not rust; accessible research diagnostics not character-safe. Old15 nondiscriminating models retained. No lifelong compression.',['CAMPAIGN3_LONGITUDINAL_QUALIFICATION.md','LONGITUDINAL_VALIDATION_CLOSURE_REV2.json']),
 (1683,'AUDIT001','Initial declared21-member/15-family denominator withholds exit and creates mandatory historical reconciliation gate.','Dated partial/blocked counts and RO status changes not current routing. Structural zero-unowned and declared inventory do not prove complete historical source adequacy.',['CAMPAIGN3_EXIT_AUDIT_2026_09_21.md','CAMPAIGN3_FINAL_HISTORY_GATE.md'])]

rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 1288<=u['location']['startLine']<=1715:continue
  assert u['location']['endLine']<=1715
  _,name,claim,limits,paths=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],claim=name,disposition=claim,limits=limits,evidence=paths))
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes().startswith(raw)
lines=raw.decode('utf-8-sig').splitlines(keepends=True)
for r in rows:assert ''.join(lines[r['location']['startLine']-1:r['location']['endLine']])==r['text']
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={n for n in range(1288,1716) if lines[n-1].strip()}
evidence=[]
for n in sorted({n for s in specs for n in s[4]}):
 p=P/n;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='HQ011 CORE CAMPAIGN3 CLAIMS REVIEWED; WIDER AUDIT OPEN',source=dict(path=SOURCE,frozenSha256=sha(B/'sources'/SOURCE)),rows=rows,evidence=evidence,obligations=['RO-C3-001','RO-C3-008','RO-C3-009','RO-C3-010','RO-C3-011','RO-C3-012','RO-C3-013','RO-C3-014','RO-C3-015','RO-C3-016','RO-C3-017','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No fresh production simulation, test suite or build. Receipt bindings do not assert current source freshness for every old receipt.','Eleven reviewed claim groups retain independent public/component, law and historical correction scopes.'],nextGate='Ledger1716 onward: mandatory residual phenomena and expanded agency/social/body cases.')
save(O/'review.json',v)
c=dict(status=v['status'],originalOccurrences=len(rows),claimGroups=len(specs),indexedWholeOccurrenceLinks=695+len(rows),freshBehavioralTests=0,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
