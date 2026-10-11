from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev230/check.json');assert c['assignedSources']==10947
cp=P/'CAMPAIGN3_HISTORY_PREDICTION_ALLOCATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Prediction numeric and allocation history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Six numeric/allocation sources are reconciled, preserving57 original narrative and17
backing occurrences plus all594 JSON string leaves. All220 referenced source, draft,
accepted-artifact and preservation fingerprints match current or already indexed bytes.
The frozen audit's166 preservation references are included in that binding count.

Fresh checks confirm eleven records359..369,45 fields,15 members,20 role positions,
one namespace1127 and one readout occurrence rule. Both Markdown inventories match
every machine record, member and role row. Draft and frozen machine payloads differ
only in version/status/acceptance/reviewed-draft metadata. These inventory facts remain
valid independently of the original audit's semantic reference error.

The original367/1 field2 names275 as an occurrence rule. That interpretation was wrong:
275 authenticates input production. The later accepted correction retires the field
in367/2, updates368/2 and retains shared279/3 as sole occurrence authority. Permanent
field/type identities are preserved; old367/1 and368/1 are historical allocations,
never executable-profile authority. A PASS for numeric existence and table parity did
not prove the semantic meaning of referenced records. Original audit bytes remain.

The numeric profile separately admits arbitrary-precision exact averaging of diagnostic
points k/10 in[0,10], with nonempty support bounded at64. Positive n+1 permits exact
division; no rounding, saturation or confidence transformation is introduced. Denominator
dividing10n and resulting640/6400 bounds are validity consequences, not clipping or
proof of history. Unknown absence differs from learned zero, and support identity does
not establish statistical independence. Producer/owner/prefix contracts authenticate
history. Numeric/exact-1 and earlier models remain immutable. No RNG qualification is
supplied merely by retaining the addressed-RNG identifier with zero draws.

Source REV230: 10,947 assigned /426 unassigned; 189,316 narrative /211,879 backing;
1,221 indexed backing resources. No new archive/source gap or runtime/test/build rerun.
No model, law, allocation, verdict, corpus or obligation status change. Prior gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY. Counters1519/0;108 verdicts;
132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-prediction-allocation-rev1','campaign3-history-source-roles-rev230'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: prediction numeric/allocation history reconciled.
Start CAMPAIGN3_HISTORY_PREDICTION_ALLOCATION_CHECKPOINT.md.
Six sources;57 narrative/17backing;594strings;220exact bindings.
Inventory parity distinct from corrected semantic reference error;no runtime rerun.
Source REV230:10947 assigned /426 unassigned;189316 narrative /211879 backing;
1221 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
Next remaining material support,post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
