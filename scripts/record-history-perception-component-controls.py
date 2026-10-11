from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev269/check.json');assert c['assignedSources']==11205
cp=P/'CAMPAIGN3_HISTORY_PERCEPTION_COMPONENT_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical perception and source component controls — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Thirteen receipts preserve 41 original narrative occurrences and all 440 JSON string
leaves. They record 85 detected mutation occurrences across bounded windows,
canonical children and selection, multimodal opportunities, roles, schedules,
requested sampling, body context and selected spatial capabilities. Repeated
controls are not independent phenomena or serious competing psychological laws.

Seventy-eight source-binding occurrences represent 63 distinct path/hash pairs.
Fifty-three bindings match current or previously indexed exact bytes; 25 do not.
The unresolved receipt lists each historical identity and dependent claim limit.
Search covered current paths and indexed archives, not all Git or local history.
No fresh source-exact reproducibility claim is made for those unresolved versions.
The duplicated visual composition-test binding is preserved without inflating
its distinct-source count. Later qualification does not replace historical hashes.

Missing required samples, observed unavailable evidence, empty selection and
unrequested sources remain different cases. Selection is not acquisition or
experience identity. Actor roles cannot be inferred from position; unknown spatial
evidence is not zero. Selected capabilities are single-use and failed joins consume
them. Freeze-before-publication and detached views preserve owner boundaries.
The successor body-context review adds an unfrozen-producer control absent from REV1.

Component adapters and trusted source joins do not establish public authentication,
allocator rollback or full-prefix persistence. The later GA qualification retains
public missing-glyph/position exclusions even though component controls exist.
No new public coverage is inferred from this reconciliation.

Source REV269: 11,205 assigned / 168 unassigned; 193,987 narrative / 212,202 backing;
1,352 indexed backing resources. No historical writers or runtime tests were rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY; 108 verdicts; 132 bounded clauses; 55 / 58 wrappers;
corpus0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-perception-component-controls-rev1','campaign3-history-source-roles-rev269'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: perception/source component controls reconciled.
Start CAMPAIGN3_HISTORY_PERCEPTION_COMPONENT_CONTROLS_CHECKPOINT.md.
Thirteen sources preserve 41 original narrative occurrences and 440 string leaves.
85 stored detected controls; 53 exact bindings; 25 unresolved binding occurrences.
Source REV269: 11205 assigned / 168 unassigned; 193987 narrative / 212202 backing;
1352 backing resources. Public missing-glyph/position exclusions remain explicit.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 / 0;108 verdicts;55 / 58 wrappers;
132 bounded clauses;corpus0.29.0 / 21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
