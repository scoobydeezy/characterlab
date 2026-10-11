from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev297/check.json');assert c['assignedSources']==11332
cp=P/'CAMPAIGN3_HISTORY_EARLY_ALLOCATION_AUDITS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Early allocation audits — 2026-10-08

**LOCAL DISPOSITION — mechanical allocation evidence, not runtime qualification.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Four audits report233/197/332/201 primary checks and60 additional final mechanical
checks. Their table ranges260..328,336..341,342..355 and356..358 are disjoint and
retain schema1. Current table counts, exact ranges, unique record names and unique
field IDs/names are checked. Five embedded table/Markdown/observation commitments
resolve exactly. Historical writers and every parity predicate were not rerun.

The permanent Campaign2 table has69 records,18 namespaces,58 members,32 union
variants and10 finite values. FinalA/B gates record complete Markdown/JSON parity
and a direct accepted observation seam declaration. Five accepted identity uses
retain separate owners. Its empty unresolved list covers allocation only; VAL001,
runtime, codecs and phenomena remain independent gates.

Carriage adds six records/namespace1124/six members/eight roles/two occurrence rules.
It excludes learning-route member,state root,new CharacterId/observation/evidence
store identities,new union/domain validator and runtime. Its audit has no table
hash, so the linked frozen table is not a recovered historical writer commitment.
Memory adds fourteen records/namespaces1125-1126/fifteen members/fourteen roles/two
occurrence rules. It excludes new projection definitions/topology,CueId/MemoryEpisodeId,
formation/padding IDs,stage policy,persistence certificates,new write capability/save
field,concrete recall delay and runtime. The wrapper adds only three typed contracts,
with no namespace/member/role/occurrence/union/finite-value additions. Generic values,
heterogeneous sets,anonymous envelopes and new wrapper identity remain excluded.

77/127/132 preserved-source check labels are historical reported checks, not fresh
byte verification of every named resource. Later carriage/memory/factory qualification
provides separately scoped execution evidence. No allocation or behavior is changed.
508 original narrative occurrences and all2,087 string leaves retain scope. No new
backing resource or exact hash gap; missing-provenance limitations remain explicit.

REV297:11,332 assigned /41 unassigned;197,802 narrative /212,373 backing;
2,595 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-early-allocation-audits-rev1','campaign3-history-source-roles-rev297'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four early allocation audits reconciled.
Start CAMPAIGN3_HISTORY_EARLY_ALLOCATION_AUDITS_CHECKPOINT.md.
963 primary/60 final mechanical checks; exact ranges and five embedded bindings.
Allocation PASS remains separate from runtime; hashless preservation labels bounded.
Source REV297:11332 assigned /41 unassigned;197802 narrative /212373 backing;
2595 backing resources. No new source gap/backing resource or historical writer rerun.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier gaps and artifact limits in final reconciliation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
