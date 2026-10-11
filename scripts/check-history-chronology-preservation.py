"""Read-only preservation check for a named partial chronology batch."""
from pathlib import Path
from functools import cache
import hashlib,json,sys
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def walk(x):
    if isinstance(x,dict):
        if isinstance(x.get('path'),str) and isinstance(x.get('sha256'),str):yield x
        for v in x.values():yield from walk(v)
    elif isinstance(x,list):
        for v in x:yield from walk(v)
a=P/'campaign3-history-source-roles-rev312/index.json';b=P/'campaign3-history-source-roles-rev313/index.json'
assert sha(b)=='26ed294d53dcd52f7fc2627c8812057e5d025e37f23f2106221ab891e43835c5'
av=load(a);bv=load(b);assert bv['predecessor']['sha256']==sha(a)
by={r['path']:r for r in bv['roleAssignments']}
assert all(by[r['path']]==r for r in av['roleAssignments'])
k='explicitBackingOutsideProseManifest';assert bv[k][:len(av[k])]==av[k]
refs=list(walk(bv[k]))+[r for role in bv['roleAssignments'] for r in walk(role.get('acceptanceChain',[]))]
for r in refs:assert sha(r['path'])==r['sha256'],r['path']
assert len(refs)==39084
o=P/f'campaign3-history-chronology-{sys.argv[1]}-rev1';review=load(o/'review.json');check=load(o/'check.json')
rows=review['rows']+[r for p in review['priorReviews'] for r in load(p['path'])['rows']]
assert len(rows)==len({r['occurrenceId'] for r in rows})==check['cumulativeReviewed']
assert sha(P/'campaign3-history-universe-rev1/sources/docs/planning/CAMPAIGN3_LOG.md')=='b1b0927aaf66da3cbc6ed85d2fb791c3678530c8d4698b4ac85e4d061fe3309b'
newrefs=[]
for p in o.glob('*.json'):
    assert p.stat().st_size<50_000_000
    newrefs.extend(walk(load(p)))
for r in newrefs:assert sha(r['path'])==r['sha256'],r['path']
print(json.dumps(dict(status='PASS',priorBindings=len(refs),batchBindings=len(newrefs),reviewed=len(rows),pending=check['remainingOriginalOccurrences'])))
