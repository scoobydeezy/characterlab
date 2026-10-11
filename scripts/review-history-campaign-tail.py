"""Account for the campaign plan's dated historical tail without reviving stale routing."""
from pathlib import Path
import json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-campaign-tail-rev1'
SOURCE='CharacterLab — Reference Architecture Build & Research Campaign Plan.md'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs=[
 (366,'COMMUNICATION','ledger-agency-social','Private knowledge, assertion, delivery, recipient interpretation and current intent remain distinct.','Honest error is not lying; successful delivery need not inform sender; corrected personstate130 replaces premature50 cohort.'),
 (450,'SOCIAL/BIOLOGY','ledger-biology','Bounded relationship appraisal, safe learning, strategy/control and physiological/adaptation/choice scopes remain distinct.','Prospective distributions not enacted response; duplicate executions not coverage; fixed-reward feedback not universal escalation; no subjective distress from physical deficit alone. Owner biological integration superseded prior next identity intake.'),
 (701,'IDENTITY','ledger-identity','Eligibility, standing, self/observer estimates and original lineage remain separate; native and component qualifications have separate gates.','Output exclusion alone failed restricted-input proof; preserve corrected safe inputs, coarse modifier equality, torn-save repair and exact unchanged serial rows. Old RO21 ACTIVE prose is not current conditional status.'),
 (902,'DEVELOPMENT','ledger-identity','Practice history is not age; independent younger learning and event-time authorship gains are owner requirements, later component/native receipts have exact separate scope.','No retroactive reweighting or constitutional writer; interim matrix not full qualification, repeated receipts not extra cases; universal calendar-age law not selected.'),
 (960,'PARTIAL-AUDITS','ledger-identity','Dated partial audits examine all20 original clauses without replacing missing domains by neighboring witnesses.','Preserve scalar uncertainty gap, current-role versus enacted-coercion gap, episode-local versus repeated interference and component/native distinctions. Later explicit verdicts supersede partial routing only in their scope.'),
 (1066,'RESIDUAL-CLOSURES','ledger-residual','Exact repeated late historical closure/progress paragraphs retain their already reviewed scope.','No full native admission from receiver reconstruction; selected prefixes not full tails; scalar successes retained;132 bounded clauses not whole Campaign3 exit.')]
prior={}
for n in sorted({s[2] for s in specs}):
 p=P/('campaign3-history-'+n+'-rev1/review.json');prior[n]=dict(path=p.as_posix(),sha256=sha(p))
sourceUnits=[];candidates={};reviewed={}
for n in ['seam-front','seam-correspondence','seam-remainder','ledger-agency-social','ledger-biology','ledger-identity','ledger-residual']:
 p=P/('campaign3-history-'+n+'-rev1/review.json')
 for r in load(p)['rows']:reviewed[r['occurrenceId']]=dict(path=p.as_posix(),sha256=sha(p),row=r)
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']==SOURCE:sourceUnits.append(u)
  if u['id'] in reviewed:candidates.setdefault(u['text'].replace('\r\n','\n').strip(),[]).append(u)
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes().startswith(raw)
lines=raw.decode('utf-8-sig').splitlines(keepends=True);rows=[];matched=0
for u in sourceUnits:
 a=u['location']['startLine'];z=u['location']['endLine']
 if a<=365:continue
 assert ''.join(lines[a-1:z])==u['text']
 _,name,basis,d,limits=max((s for s in specs if s[0]<=a),key=lambda s:s[0])
 r=dict(occurrenceId=u['id'],location=u['location'],text=u['text'],subject=name,disposition=d,limits=limits,priorReview=prior[basis])
 matches=candidates.get(u['text'].replace('\r\n','\n').strip(),[])
 if matches:
  m=sorted(matches,key=lambda x:(x['source'],x['location']['startLine']))[0]
  r['exactHistoricalCorrespondence']=dict(original=m,review=reviewed[m['id']],rationale='Complete historical summary reproduced in sequencing document; reuse exact scoped judgment without increasing its authority or qualifying adjacent claims.')
  matched+=1
 rows.append(r)
assert {r['occurrenceId'] for r in rows}|{r['occurrenceId'] for r in load(P/'campaign3-history-campaign-policy-rev1/review.json')['rows']}=={u['id'] for u in sourceUnits}
v=dict(status='FROZEN CAMPAIGN PLAN HISTORICAL TAIL REVIEWED; WIDER HQ011 OPEN',rows=rows,evidence=list(prior.values()),obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['All current/next/open/running labels belong to their dated paragraphs; no process is assumed live from a historical session number.','Complete exact correspondences normalize only line endings and outer whitespace, retaining both original identities.','No new simulation, test suite, build, corpus pass, native admission or obligation closure.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],newWholeOccurrences=len(rows),exactCorrespondences=matched,completePlanOccurrences=len(sourceUnits),indexedWholeOccurrenceLinks=4352+len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
