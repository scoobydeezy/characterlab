from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev271/check.json');assert c['assignedSources']==11216
cp=P/'CAMPAIGN3_HISTORY_GA_STRUCTURAL_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical GA structural and work-budget controls — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Six receipts preserve35 original narrative occurrences and all163 JSON string
leaves. They record35 detected/rejected mutation occurrences. Fourteen source
bindings match exact current or indexed bytes; nine unresolved occurrences retain
their historical hashes and explicit reproducibility limits. Later qualification
does not substitute its source bytes for these missing earlier versions.

Symbolic163-record expressibility, distinct numeric union identities, codec
acceptance and public model activation are separate gates.218 registry members,
67 templates,8 accessors and6 authorities describe declared shape; names do not
grant capabilities or establish source authentication and compiled owner scope.

The local work receipt's phase sums are freshly checked:80 invocations and58
outputs in either mutually exclusive lane. Nine stages repeat; each three-parent
join invokes once, avoiding four excess invocations from naive parent counting.
48 next plus18 conditional edges total66; ignoring conditional edges incorrectly
counts26 roots instead of12. This remains a topology derivation, not execution.
The later qualified92/239/228 whole-model bound includes inherited work and nested
identities. Observed21 invocations is not substituted for the derived ceiling.

Fixture budget controls count empty selections and attempts, keeping cue access
independent of successful encoding. The successor adds actual sample projection
and body-only SEM reservation; fixture selection allocation and public completion
still require separate evidence. Repeated controls are not independent phenomena.

Source REV271:11,216 assigned /157 unassigned;194,027 narrative /212,202 backing;
1,368 indexed backing resources. No historical writers or runtime tests rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-ga-structural-controls-rev1','campaign3-history-source-roles-rev271'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: six GA structural and budget receipts reconciled.
Start CAMPAIGN3_HISTORY_GA_STRUCTURAL_CONTROLS_CHECKPOINT.md.
35 original narrative occurrences;163 string leaves;35 stored fault controls.
14 exact source bindings;9 unresolved binding occurrences remain explicit.
Source REV271:11216 assigned /157 unassigned;194027 narrative /212202 backing;
1368 backing resources. Local80/58 bound is not whole-model92/239/228.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN;HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
