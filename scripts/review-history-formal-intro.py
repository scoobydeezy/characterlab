"""Finish the formal register's intro/table occurrence coverage without new rulings."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-formal-intro-rev1'
SOURCE='docs/formal/OPEN_DECISIONS.md'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
prior=P/'campaign3-history-authority-decisions-rev1/review.json'
fragments=load(prior)['formalRowFragments']
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes()==raw
lines=raw.decode('utf-8-sig').splitlines(keepends=True)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE or u['location']['startLine']>240:continue
  assert u['location']['endLine']<=240
  a=u['location']['startLine'];z=u['location']['endLine']
  assert ''.join(lines[a-1:z])==u['text']
  included=[r for r in fragments if a<=r['source']['startLine']<=z]
  if included:
   assert len(included)==20
   for r in included:assert r['source']['text'] in u['text']
   judgment='Register table includes exactly the20 independently reviewed decision rows; retain each row disposition, owner, blocked claim, evidence and reopen condition.'
   limits='P1/P2 labels are scoped dependent gates, not current owner rulings. PERSIST-I requires the later actual executable proof; no blanket row closure from the table.'
  elif a<191:
   judgment='Historical GA component/source/owner/allocation progress and accepted conservative choices precede bounded public GA qualification. Current/latest/open labels inside this chronology are dated routing.'
   limits='Preserve failed source assumptions, supplied-state scope, selection versus acquisition identity, nonborrowed semantic-child budgets, independent graph life, selected-only formation, original-time recency and acquired-protection comparisons. Generic ownership or symbolic templates are not public admission; Candidate A is not a universal law.'
  else:
   judgment='Formal process: priorities name dependent scope; exact contract resolution includes alternatives, versions, domains, error bounds, conformance, corpus and reopen conditions.'
   limits='Code defaults cannot close a decision. A scientific condition may remain conditional despite zero architectural rulings; research-method and exact formal semantics retain scoped authority.'
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],disposition=judgment,limits=limits,reviewedTableRows=included))
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={i for i in range(1,241) if lines[i-1].strip()}
evidence=[]
for p in [prior,P/'campaign3-history-ledger-early-rev1/review.json',P/'campaign3-history-seam-front-rev1/review.json',P/'campaign3-history-persist-i-rev1/proof.json',P/'CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md']:
 evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='FORMAL REGISTER INTRO/TABLE REVIEWED; WIDER HQ011 OPEN',rows=rows,evidence=evidence,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['20 fragment reviews are reused within one complete original table occurrence; fragments are not counted again.','No fresh production tests or changed formal decision, model, allocation, corpus or semantic authority.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
seen=set();total=0
for name in ['formal-intro','foundation-decisions','campaign2-admission','probe-carriage','memory-parent','factory','cognitive']:
 r=load(P/('campaign3-history-'+name+'-rev1/review.json'))
 for x in r['rows']:
  assert x['occurrenceId'] not in seen
  seen.add(x['occurrenceId'])
original=set()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']==SOURCE:original.add(u['id'])
assert original==seen,(len(original),len(seen))
c=dict(status=v['status'],newWholeOccurrences=len(rows),completeFormalOccurrences=len(seen),indexedWholeOccurrenceLinks=2103+len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
