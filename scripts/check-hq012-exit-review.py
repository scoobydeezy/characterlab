"""Verify HQ012 receipt integrity and exact requirement preservation, not psychology."""
from pathlib import Path
from functools import cache
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-hq012-exit-review-rev1'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
@cache
def sha(name):return hashlib.sha256(Path(name).read_bytes()).hexdigest()
checked=set()
def refs(v):
    if isinstance(v,dict):
        if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):
            assert sha(v['path'])==v['sha256'],v['path'];checked.add(v['path'])
        for x in v.values():refs(x)
    elif isinstance(v,list):
        for x in v:refs(x)
for n in ['review','corpus','families','open-gates','freshness-disposition','registration']:
    refs(load(O/(n+'.json')))
a=load(P/'CAMPAIGN3_EXIT_AUDIT_REV111.json');c=load(O/'corpus.json');f=load(O/'families.json')
assert len(c['members'])==21 and c['mandatoryCount']==9
assert [m['id'] for m in c['members']]==[m['id'] for m in a['corpus']['members']]
for new,old in zip(c['members'],a['corpus']['members']):assert new['requirements']==old['clauses']
assert len(f['families'])==15
ids=[]
for new,old in zip(f['families'],a['brief']['families']):
    assert new['clauses']==old['clauses'];ids.extend(x['id'] for x in new['clauses'])
assert len(ids)==len(set(ids))==132
old=load(P/'campaign3-hq012-freshness-rev1/review.json');fix=load(O/'freshness-disposition.json')
assert {r['source']['path'] for r in fix['resolved']}==set(old['pending'])
assert len(old['rows'])==4412 and not fix['pending']
reg=load(P/'RESEARCH_OBLIGATIONS.json');registered={r['path'] for r in reg['reportReviews']}
for path in load(O/'registration.json')['addedReports']:assert path in registered and Path(path).exists(),path
for folder in ['campaign3-hq012-freshness-rev1','campaign3-hq012-corpus-checks-rev1','campaign3-hq012-exit-review-rev1']:
    for path in (P/folder).rglob('*'):
        if path.is_file():assert path.stat().st_size<50_000_000,path
assert load(O/'review.json')['status']=='HQ012 EXIT REVIEW COMPLETE; CAMPAIGN3 NOT EXIT-READY'
assert len(load(O/'open-gates.json')['gates'])==3
print(json.dumps(dict(status='PASS HQ012 receipt/requirement integrity',boundFiles=len(checked),members=21,families=15,clauses=132,deltaPaths=4412,activeImplementationGates=3)))
