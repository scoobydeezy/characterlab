from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev236/check.json');assert c['assignedSources']==10974
cp=P/'CAMPAIGN3_HISTORY_CONTENT_ORIGIN_AUTHORITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Content, origin and observation-unit authority reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Seven formal and component sources preserve126 original narrative occurrences. Complete
typed identity, contextual profile admission, physical meaning and observer permission
remain distinct. Governed content identity is authored and immutable; only the first
character profile requires its new family. Generic CONTENT StableId stays broad.
Authored semantic origins retain the complete typed StableId; runtime origins consume
the shared allocator once. Opaque ordinals imply no age, similarity or psychological
magnitude. A runtime origin may qualify exposure while failing the character role.

Closed identity grammar validates before semantic role qualification. Missing/wrong-kind
authored content and valid runtime characters fail the role; malformed nested identities
fail structurally first. Schema-bearing StableIds still need the explicit admitted decoder
registry. No codec may guess an origin. Old text-only and corrected nested identities are
not equal committed model/run bytes; original PHEN-SEM and migrated regression retain
separate evidence scopes without retroactively rewriting the earlier result.

ObservationUnitId names vocabulary, not dimension, conversion, dose or reward. The fixed
bridge admits only unit/fixture-pulse; the namespace role alone does not enforce that
member. Other structurally valid text still fails profile admission. Generic observation
fixtures remain valid in their own scope. Source counts and state cannot replace the
committed channel unit, and the counted adaptation branch does not rescale observation.

Content may author facts and affordances, not appraisal or private character conclusions.
Visibility grants no permission to copy truth identities/facets. Facet applicability
cannot secretly become psychological pressure. Later allocation appendices supersede
pending statements only at their named gate; model-semantic choices, build support,
component evidence, public factory admission and phenomenon qualification remain separate.

Historical test denominators are preserved: origin338 full tests followed by an additional
control/current339 inventory; content351 followed by four tests and a later full355;
observation-unit380 full tests. They are not additive unique totals or fresh test runs.
The valid second-kind VAL-T branch remains conditional despite wrong-kind rejection.

Source REV236:10,974 assigned /399 unassigned;189,925 narrative /211,939 backing;
1,221 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior source gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-content-origin-authority-rev1','campaign3-history-source-roles-rev236'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: content/origin/unit authority reconciled.
Start CAMPAIGN3_HISTORY_CONTENT_ORIGIN_AUTHORITY_CHECKPOINT.md.
Seven sources;126 narrative occurrences; no new archive/source gap or rerun.
Typed identity, profile admission, physical meaning and observer permission stay distinct.
Source REV236:10974 assigned /399 unassigned;189925 narrative /211939 backing;
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
