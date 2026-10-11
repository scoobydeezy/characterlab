from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev219/check.json');assert c['assignedSources']==10904
cp=P/'CAMPAIGN3_HISTORY_MEMORY_PACKETS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Blocked and corrected memory packets — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Eighteen packet JSON sources are reconciled: two historical manifests, two complete
control commitment sets and fourteen readable artifacts. The review preserves 1,133
original narrative /17 backing occurrences and all 57,452 JSON string leaves.
All 283 historical preservation references resolve exactly. Eight rejected packet/source
resources are now explicit backing outside the prose census.

A fresh read-only verifier checks fourteen canonical/readable artifact pairs, all
32 stored ModelIdentity digests and their registry commitments, and sixteen paired
registry amendments. Every corrected registry adds exactly the previously proposed
IDN map-key role, removes nothing, and preserves slots 0..4. Every corresponding
ModelIdentity changes. This verifies the precise repair without treating reproducible
or hashable blocked specimens as admitted models, frozen predecessors or migration aliases.

The blocked manifest's 531 checks and 133 preservation references remain distinct
from the corrected manifest's 589 checks and 150 references. Old NOT FROZEN and
NOT PASSED labels retain their historical context; separate FREEZE and bounded
runtime acceptance supply the successor authority. Finite input, permutation,
wrapper and exact-profile controls do not become a general memory language.
Repeated diagnostic labels such as inherited bare row undefined are retained without
interpreting them as new semantic objects or independently unique controls.

The first checker attempt preserved canonical bytes but serialized a decoded Node
Buffer using its type/data JSON shape instead of the historical numeric-index byte
view. Its script and failure are retained. Explicit byte-view formatting fixes the
checker; canonical byte and digest checks remain unchanged. This was a verification
presentation defect, not a changed packet or runtime result.

The fresh work runs shared decoding/encoding and identity functions only. Historical
constructors, factory admission, runtime behavior, negative controls, materializers
and restore tests were not rerun. Exact preservation hashes do not establish dates.

Source REV219: 10,904 assigned /469 unassigned; 188,189 narrative /211,856 backing;
1,219 indexed backing resources. Prior source gaps, formula provenance, legacy log,
post-cutoff joins and independent adequacy remain open. No model, law, allocation,
verdict, corpus or obligation status changed. HQ012 unstarted; Campaign3 NOT EXIT-READY.
Counters 1519/0; 108 verdicts; 132 bounded clauses; 55/58 wrappers; corpus 0.29.0/21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-packets-rev1','campaign3-history-source-roles-rev219'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:18 blocked/corrected memory packet sources reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_PACKETS_CHECKPOINT.md.
1133 narrative /17 backing;57452 strings;283 exact bindings;eight backing resources.
14 artifact pairs/32 model commitments checked;16 exact one-role registry amendments.
Source REV219:10904 assigned /469 unassigned;188189 narrative /211856 backing;
1219 backing resources. Values post-cutoff reviews retain separate denominators.
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
