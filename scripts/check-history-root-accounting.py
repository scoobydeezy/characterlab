"""Independent original-ID/text accounting for all18 frozen roots and four navigation files."""
from pathlib import Path
import json,hashlib,collections,copy
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-root-accounting-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
names='formula-review queue hq010 authority-decisions foundation-decisions campaign2-admission probe-carriage memory-parent factory cognitive verdict-spine ledger-campaign2 ledger-early ledger-core ledger-agency-social ledger-biology ledger-identity ledger-residual research-early research-censoring research-salience research-identity seam-front seam-correspondence seam-remainder corpus-authority formal-intro reference-parents campaign-policy research-charter north-star architecture-map campaign-tail governance agent-routing'.split()
m=load(B/'manifest.json');roots=set(m['roots']);navigation={'README.md','CLAUDE.md','docs/formal/README.md','docs/planning/README.md'}
units={};counts=collections.Counter()
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] in roots|navigation:units[u['id']]=u;counts[u['source']]+=1
bindings={};reports=[];adapters=[]
for n in names:
 path=P/f'campaign3-history-{n}-rev1/review.json';j=load(path);key={'formula-review':'records','queue':'amendments','authority-decisions':'ownerOccurrences'}.get(n,'rows')
 reports.append(dict(path=path.as_posix(),sha256=sha(path),primaryRowsKey=key))
 for i,r in enumerate(j[key]):
  oid=r.get('occurrenceId')
  if oid not in units:continue
  u=units[oid];t=r.get('text')
  if t is None and isinstance(r.get('source'),dict):t=r['source'].get('text')
  assert isinstance(t,str),(n,i,'missing reviewed original text')
  if t!=u['text']:
   assert t.replace('\r\n','\n')==u['text'].replace('\r\n','\n'),(n,i,oid)
   adapters.append(dict(path=path.as_posix(),row=i,occurrenceId=oid,adapter='CRLF-to-LF only; no whitespace/content deletion'))
  bindings.setdefault(oid,[]).append(dict(path=path.as_posix(),row=i,key=key))
assert set(bindings)==set(units),[units[i]['source'] for i in set(units)-set(bindings)]
entries={e['path']:e for e in m['entries']};sources=[]
for source in sorted(roots|navigation):
 e=entries[source];assert sha(e['snapshot'])==e['sha256'],source
 selected=[u for u in units.values() if u['source']==source]
 ls=Path(e['snapshot']).read_bytes().decode('utf-8-sig').splitlines(keepends=True);covered=set()
 for u in selected:
  a=u['location']['startLine'];z=u['location']['endLine'];assert ''.join(ls[a-1:z])==u['text'];covered.update(range(a,z+1))
 assert {i for i in covered if ls[i-1].strip()}=={i for i,l in enumerate(ls,1) if l.strip()},source
 sources.append(dict(path=source,sha256=e['sha256'],role='FROZEN ROOT' if source in roots else 'REVIEWED NAVIGATION',occurrences=len(selected),occurrenceIds=[u['id'] for u in selected]))
v=dict(status='ALL FROZEN ROOT OCCURRENCES ACCOUNTED; WIDER UNIVERSE ADEQUACY OPEN',manifestSha256=sha(B/'manifest.json'),sources=sources,reports=reports,bindings=bindings,lineEndingAdapters=adapters,
 obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['This independently verifies original IDs/text/nonblank-line coverage, not the truth or completeness of every scientific disposition.','Only18 roots and4 navigation sources; no automatic acceptance/exclusion of the other11351 candidate files.','Original root roles are detailed in bound reviews. Historical routing is not current authority or fresh experimental evidence.','Post-cutoff rows, fragment-only excerpts and backing JSON occurrences are separate; counted neither as original roots nor independent findings.'])
def validate(x):
 assert x==v
 assert set(x['bindings'])==set(units)
 for r in x['reports']:assert sha(r['path'])==r['sha256']
validate(v);faults=[]
for mode in ['omitted-original','changed-report','unreviewed-addition','root-as-universe-pass']:
 x=copy.deepcopy(v)
 if mode=='omitted-original':x['bindings'].pop(next(iter(x['bindings'])))
 elif mode=='changed-report':x['reports'][0]['sha256']='0'*64
 elif mode=='unreviewed-addition':x['bindings']['new-unreviewed']=[]
 else:x['status']='COMPLETE CAMPAIGN3 PASS'
 try:validate(x)
 except AssertionError:faults.append(mode)
 else:raise AssertionError(mode)
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],roots=len(roots),rootOccurrences=sum(counts[s] for s in roots),navigationSources=len(navigation),navigationOccurrences=sum(counts[s] for s in navigation),uniqueOriginalOccurrences=len(units),lineEndingAdapters=len(adapters),unclassifiedCandidateFiles=len(m['entries'])-len(sources),rejectedAccountingMutations=faults,reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
