"""Scoped early Campaign3 claim review, retaining original occurrence identities."""
from pathlib import Path
from fractions import Fraction as F
import json,hashlib,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-ledger-early-rev1';O.mkdir(exist_ok=True)
SOURCE='docs/planning/VERDICT_LEDGER.md'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs=[
 (800,'PRE-IDENTITY','Four matched public pairs preserve first three decisions and prior history; standing changes later activation despite zero integer modifier. Three sampled choices differ.','Shared six natural addresses only; later draw sets differ. No zero-base resurrection or general identity necessity. REV1 exploratory versus REV2 matched-prefix evidence remain distinct.',['CAMPAIGN3_IDENTITY_ABLATION_SUMMARY.json','CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV2.json']),
 (844,'CONCERN001','A/B neutral equality and fixture-specific retrieval discrimination retain modulation shape as load-bearing. Exact5/3 tie at q2/3 is not a flip.','A/B law unresolved. Three availability branches distinct; TaskConcern not general Affect. Preserve initial mistaken tie assertion.',['CONCERN_MODULATION_COMPARISON_REV1.json']),
 (937,'CONCERN002','Separate encoding/retrieval arms satisfy accepted fixture-relative constraints; B is exactly gain1 C; gain3 preserves nonzero encoding and crosses fixture threshold.','C not selected law; A/B retained. Descriptive A-linear-limit phrase does not establish A as a literal limit of the displayed one-parameter C formula whose encoding arm is fixed. No psychological limit theorem used.',['CONCERN_MODULATION_CANDIDATE_C_REV1.json']),
 (1024,'CONCERN ceiling annotation','All displayed retrieval gains are at most2; finite C gains strictly below2; A reaches2 only with zero residual. K2 also changes membership.','C6 is declared-fixture relative; crossover at/above2 needs reopened family, not more gain. Wider bound comparator conditional, not current blocker.',['CONCERN_RETRIEVAL_CEILING_REV1.json']),
 (1072,'GA','43 public models/runs and36 comparisons qualify bounded source/selection/encoding/access and retention paths. Score/edge differences can coexist with same winner.','No universal budget or retention necessity; three protection models equal. Actual corpus0.28 execution differs from0.29 promotion. Component/fault/public scopes preserved; general affect and broader sources separate.',['GA_PUBLIC_QUALIFICATION_REV1.json','GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md','CORPUS_0_29_0_PROMOTION_REV1.json']),
 (1162,'Ledger repair','Three reported entries were absent and recorded September20 from existing receipts.','No backdated write or fresh run; historical mistaken count preserved.',['GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md']),
 (1172,'SALIENCE','Four arithmetic laws discriminated; independent/hybrid focal invariance does not imply association-footprint invariance. Scale100 zero edges can be quantization artifacts.','No public producer/ModelIdentity in pure arithmetic; historical labels not admitted source semantics. RET001 stays retracted, other law choice unresolved.',['SALIENCE_LAW_COMPARISON_REV1.json']),
 (1210,'EMB','Independent task/body grounds and adopted instructions affect probabilities; duplicate descriptions preserve origin but not duplicate nuclei.','Thirteen models/28 public runs bounded; aggregate-versus-pairwise comparison component only. Original ownership debt not silently solved by this receipt; later BODY/BIOLOGY verdicts separate.',['CAMPAIGN3_EMBODIED_QUALIFICATION.json']),
 (1250,'ATTN','Public capacity/selection/selected-only consumption qualified with denied-port equality.32 models/224 cases include seven work-bound rejections.','Old list-S0 identities inadmissible; no continuous encoding law or identifier-renaming invariance. Later GA adds footprint/retrieval, not retroactive old-scope rewrite.',['ATTENTION_PUBLIC_QUALIFICATION_REV1.json'])]
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or not 800<=u['location']['startLine']<=1287:continue
  assert u['location']['endLine']<=1287
  _,name,claim,limits,paths=max((s for s in specs if s[0]<=u['location']['startLine']),key=lambda s:s[0])
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],claim=name,disposition=claim,limits=limits,evidence=paths))
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes().startswith(raw)
lines=raw.decode('utf-8-sig').splitlines(keepends=True)
for r in rows:assert ''.join(lines[r['location']['startLine']-1:r['location']['endLine']])==r['text']
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={n for n in range(800,1288) if lines[n-1].strip()}
# Independent exact arithmetic checks; not a rerun of production experiments.
qs=[F(0),F(1,4),F(1,2),F(2,3),F(3,4),F(1)]
math=[]
for q in qs:
 a=1+q;b=1+q/(1+q);c=1+3*q/(1+3*q)
 score=lambda w:F(1,4)+w*F(1,4)-(F(1,2)+w*F(1,10))
 math.append(dict(q=str(q),aOmega=str(a),bOmega=str(b),cOmega=str(c),aDifference=str(score(a)),bDifference=str(score(b)),cDifference=str(score(c))))
assert F(math[3]['aDifference'])==0 and F(math[4]['aDifference'])>0
assert all(F(x['bDifference'])<0 for x in math)
assert F(math[3]['cDifference'])==0 and F(math[4]['cDifference'])>0
assert F(1)/(1+F(3,4))==F(4,7) and 1-F(3,4)==F(1,4)
evidence=[]
for n in sorted({n for s in specs for n in s[4]}):
 p=P/n;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='HQ011 EARLY CAMPAIGN3 CLAIMS REVIEWED; WIDER AUDIT OPEN',source=dict(path=SOURCE,frozenSha256=sha(B/'sources'/SOURCE)),rows=rows,evidence=evidence,independentRationalChecks=math,obligations=['RO-C3-002','RO-C3-003','RO-C3-004','RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-008','RO-C3-009','RO-C3-019','RO-C3-020','RO-C3-021'],limits=['No fresh production simulation, test suite or build. Receipt bindings and exact rational calculation do not assert current source freshness for every old receipt.','Nine reviewed claim groups retain independent public/component, law and historical correction scopes.'],nextGate='Ledger1288 onward: multisource through longitudinal and first audit, then expanded phenomena.')
save(O/'review.json',v)
c=dict(status=v['status'],originalOccurrences=len(rows),claimGroups=len(specs),indexedWholeOccurrenceLinks=660+len(rows),exactRationalRows=len(math),freshBehavioralTests=0,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
