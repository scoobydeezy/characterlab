"""Join the current candidate delta to reviewed content and historical audit roles."""
from pathlib import Path
from collections import Counter
import hashlib,json,difflib
P=Path('docs/planning');O=P/'campaign3-hq012-freshness-rev1'
def load(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=p.as_posix(),sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def write(p,v):
    assert not p.exists(),p
    p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
d=load(O/'delta.json');m=load(P/'campaign3-history-universe-rev1/manifest.json')
index=load(P/'campaign3-history-source-roles-rev315/index.json')
reg=load(P/'RESEARCH_OBLIGATIONS.json');registered={r['path'] for r in reg['reportReviews']}
backing={r['path']:r for r in index['explicitBackingOutsideProseManifest']}
valueRefs={}
reviewNames=['values-addition','values-backing','values-development']
def visit(v,owner):
    if isinstance(v,dict):
        if isinstance(v.get('path'),str) and isinstance(v.get('sha256'),str):
            valueRefs.setdefault((v['path'],v['sha256']),[]).append(owner)
        for x in v.values():visit(x,owner)
    elif isinstance(v,list):
        for x in v:visit(x,owner)
for name in reviewNames:
    p=P/f'campaign3-history-{name}-rev1/review.json';visit(load(p),ref(p))
rows=[];pending=[]
for r in d['entries']:
    p=r['path'];row=dict(source=r)
    if r['change']=='CHANGED':
        dispositions={
          'AGENTS.md':'Mutable routing/history overlay; does not outrank named governing architecture or change a frozen contract.',
          'docs/planning/CAMPAIGN3_LOG.md':'Appended audit chronology; historical directions remain dated, not new current scientific authority.',
          'docs/planning/CURRENT.md':'Replaced current routing: HQ011 scoped handoff, HQ012 next. Frozen predecessor remains preserved.',
          'README.md':'Lossless evidence archive/restore and size-check instructions only; no scientific requirement removed.',
          'docs/formal/CANONICAL_RECORD_REGISTRY.md':'Appends Values native records1509..1519 and bounded closure; no previous allocation changed.',
          'docs/planning/VERDICT_LEDGER.md':'Exact106-verdict predecessor plus two Values verdicts; component/native scopes remain separate.'}
        assert p in dispositions,p
        row.update(role='EXPLICIT CHANGED-SOURCE REVIEW',disposition=dispositions[p])
    elif (p,r['sha256']) in valueRefs:
        row.update(role='REVIEWED VALUES ADDITION',evidence=valueRefs[(p,r['sha256'])],disposition='Accepted only in its bound content review; no stronger physical, autonomous or developmental claim.')
    elif p in backing and backing[p]['sha256']==r['sha256']:
        row.update(role='REVIEWED ARCHIVED BACKING',evidence=backing[p],disposition='Preserved historical source; not a new current authority or independent experiment.')
    elif p=='docs/planning/RESEARCH_OBLIGATIONS.json':
        row.update(role='REGISTRY OUTPUT',disposition='Excluded from scientific candidate selection; reciprocal ownership checked separately.')
    elif p=='docs/formal/FORMULA_SOURCE_PROVENANCE_ERRATUM.md':
        row.update(role='CORRECT-FORWARD PROVENANCE',evidence=ref(P/'campaign3-history-provenance-correction-rev1/review.json'),disposition='Candidate snapshot admitted with source limit; unsupported commit ancestry remains unearned.')
    elif p=='docs/planning/EVIDENCE_STORAGE_MIGRATION.md':
        row.update(role='LOSSLESS STORAGE MAINTENANCE',disposition='Restored identities unchanged; archive verification is separate from behavioral evidence.')
    elif p in registered:
        row.update(role='REGISTERED AUDIT OR PRESERVATION OUTPUT',disposition='Historical reconciliation output or named failed audit cohort. No new model, behavioral execution or law is inferred. HQ011 scoped acceptance and its source graph remain controlling.')
    else:
        pending.append(p);row.update(role='PENDING SOURCE-ROLE JOIN',disposition='No acceptance from filename alone.')
    rows.append(row)
changes=[]
old={e['path']:e for e in m['entries']}
for r in d['entries']:
    if r['change']=='CHANGED' and r['path'] not in ['AGENTS.md','docs/planning/CAMPAIGN3_LOG.md']:
        before=Path(old[r['path']]['snapshot']).read_text(encoding='utf-8-sig').splitlines(True)
        after=Path(r['path']).read_text(encoding='utf-8-sig').splitlines(True)
        changes.append(dict(path=r['path'],diff=''.join(difflib.unified_diff(before,after,fromfile='frozen',tofile='current'))))
write(O/'review.json',dict(status='SOURCE DELTA JOIN COMPLETE' if not pending else 'SOURCE DELTA JOIN IN PROGRESS',
    baseline=ref(P/'campaign3-history-universe-rev1/manifest.json'),inventory=ref(O/'inventory.json'),
    sourceRoles=ref(P/'campaign3-history-source-roles-rev315/index.json'),
    hq011=ref(P/'campaign3-history-hq011-handoff-rev1/review.json'),
    rows=rows,changedText=changes,pending=pending,counts=dict(Counter(r['role'] for r in rows)),
    limitation='Snapshot-specific source freshness, not whole Campaign3 acceptance. Audit-output membership does not accept every historical status as current. New HQ012 outputs and routing are a subsequent explicitly authored audit delta.'))
print(json.dumps(dict(counts=dict(Counter(r['role'] for r in rows)),pending=pending)))
