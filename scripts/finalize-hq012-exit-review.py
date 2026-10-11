"""Preserve routing, register HQ012 evidence and point to the active integration gate."""
from pathlib import Path
import hashlib,json
P=Path('docs/planning');O=P/'campaign3-hq012-exit-review-rev1'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=p.as_posix(),sha256=hashlib.sha256(p.read_bytes()).hexdigest())
assert not (O/'registration.json').exists()
inventory=load(P/'campaign3-hq012-freshness-rev1/inventory.json')
lookup={r['path']:r for r in inventory['entries']}
snapshots=[]
for name in ['AGENTS.md','docs/planning/CURRENT.md','docs/planning/CAMPAIGN3_LOG.md','docs/planning/RESEARCH_OBLIGATIONS.json']:
    source=Path(name);assert ref(source)['sha256']==lookup[name]['sha256'],name
    dest=O/'routing-before'/source.name;dest.parent.mkdir(exist_ok=True);assert not dest.exists()
    dest.write_bytes(source.read_bytes());snapshots.append(dict(original=name,archive=ref(dest)))
cp=P/'CAMPAIGN3_HQ012_EXIT_REVIEW.md';work=P/'VALUES_INTEGRATED_CLOSURE_WORK_ORDER.md'
paths=[p.as_posix() for folder in ['campaign3-hq012-freshness-rev1','campaign3-hq012-corpus-checks-rev1','campaign3-hq012-exit-review-rev1'] for p in sorted((P/folder).glob('*.json'))]
paths += [cp.as_posix(),work.as_posix(),(O/'registration.json').as_posix(),(O/'validation.json').as_posix(),
          'docs/planning/campaign3-history-hq001-002-rev1/rejected-development-finding.json']
reg=load(P/'RESEARCH_OBLIGATIONS.json');obs=['RO-C3-019','RO-C3-020','RO-C3-021']
known={r['path'] for r in reg['reportReviews']}
added=[]
for name in paths:
    if name in known:continue
    reg['reportReviews'].append(dict(path=name,obligations=obs));added.append(name)
    for ob in reg['obligations']:
        if ob['id'] in obs:ob['evidence'].append(name)
for ob in reg['obligations']:
    if ob['id']=='RO-C3-019':
        ob['established']+=' HQ012 (2026-10-11) retains21 scoped corpus qualifications and132 bounded clause witnesses; publication inventory55/58 and named current/history integrity checks pass within their separate scopes.'
        ob['unresolved']+=' HQ012-VALUES-OUTCOME, HQ012-VALUES-GOAL and HQ012-VALUES-APPRAISAL remain active: actual physical/admitted-evidence interventions, completion/retirement with retained Value, and the canonical Value-to-appraisal consumer. See VALUES_INTEGRATED_CLOSURE_WORK_ORDER.md; no owner ruling required.'
    if ob['id']=='RO-C3-021':
        ob['established']+=' HQ012 exit review (2026-10-11) accounts the declared current document delta and retains HQ011 acceptance, including the owner-directed RESEARCH.md successor. Exit remains withheld for named active Values integration gates; refresh freshness after that work.'
(P/'RESEARCH_OBLIGATIONS.json').write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-012 exit review COMPLETE: Campaign3 NOT EXIT-READY; no owner ruling.
Start CAMPAIGN3_HQ012_EXIT_REVIEW.md and VALUES_INTEGRATED_CLOSURE_WORK_ORDER.md.
Next bounded Values integration: actual outcome/evidence separation, retained Value
across goal completion/retirement, and the canonical Values-to-appraisal edge.
21 corpus scopes/15 families/132 bounded clauses retained; no law or comparator retired.
Freshness snapshot:11367 unchanged,6 changed,4406 added,0 missing; all delta paths accounted.
55/58 publication check PASS. BODY historical-source drift resolved in its declared scope.
HQ011 remains accepted; missing legacy log is not a gate;208 historical limits retained.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
receipt=dict(status='REGISTERED; VALIDATION FOLLOWS',addedReports=added,reports=len(reg['reportReviews']),
    preHandoffSnapshots=snapshots,checkpoint=ref(cp),workOrder=ref(work),
    counters=[1519,0],runtimeMutations=0,scope='Only named HQ012 audit outputs and routing/obligation changes after the frozen delta.')
(O/'registration.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
# Placeholder is explicitly not a pass; the validation command will replace it with
# its actual results before any parent report binds its hash.
(O/'validation.json').write_text(json.dumps(dict(status='NOT RUN',commands=[]),indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(reg['reportReviews']),added=len(added))))
