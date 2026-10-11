from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev310/check.json');assert c['assignedSources']==11367
cp=P/'CAMPAIGN3_HISTORY_SEMANTIC_PARENT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Parent semantic contract and integrated gate — 2026-10-11

**LOCAL DISPOSITION — historical authority and bounded closure reconciled.**
HQ-011 remains in progress; no owner ruling. Counters **1519 / 0**.

The parent contract preserves separate truth bindings, observer-relative continuant
and event files, boolean classification, recognition and appraisal. Tracking can be
wrong; recognition never repairs it from truth. Missing evidence is not negative
and missing cues do not withdraw recognition. Unique supported recognition is a
categorical commitment, not calibrated confidence. Correction appends a resolution
without rewriting the experience, prior recognition or observer file identity.

Evidence requires exact producer/schema and consumer capabilities, observer ownership,
time and carrier scope. Safe occurrence identity and temporal precedence do not by
themselves grant read permission. Character provenance is distinct from omniscient
ancestry. Perceived-outcome learning and automatic physical adaptation retain separate
authorities even when scheduled near each other. Current/consequence lanes freeze
inputs before evaluation and commit together only after whole-instant settlement.

Earlier symbolic-only, allocation-blocked and I.3/J-open statements are superseded
explicitly by OPEN_DECISIONS I.2/I.3/J acceptance. Early transition/cue sketches are
refined by the accepted schema inventory and numeric registry. Namespace1004 availability
is historical; Campaign2 allocates it. Original source bytes remain untouched.

The closed manifest names100 passing historical vector rows,13 formerly pending
integrated entries,31 negative controls and10 acceptance items. A file-presence or
ledger check is not behavioral proof. Codec-level single-observer persistence does
not alone prove the integrated three-observer fixture. Canonical serialization after
symbolic execution does not satisfy the carried occurrence-ID condition; the accepted
gate instead requires typed in-memory identities, field-to-namespace binding, version
rejection and scaffolding-label invariance. Registration does not imply admission:
Context9 remains registered and unadmitted, without renumbering Incidental10.

Preserved findings: duplicate transition detection belongs to history validation;
a refused recognition rewrite does not uniquely attribute the failing history clause.
The finite measurement citation control does not qualify a general measurement consumer.
Continuous perception, graded confidence, general ontology, learned action schemas,
and downstream learning/appraisal/social cognition are outside this original gate.
Later seams require their own evidence. No tests, runtime or original writers rerun.

Two complete sources preserve460 original narrative occurrences across41 sections.
REV310:11,367 assigned /6 unassigned;198,924 narrative /212,699 backing;
2,803 outside-census resources. Source enumeration is not scientific adequacy.
Remaining allocation/ADAPT/chronological sources, consolidated gaps, dependent claims,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-semantic-parent-rev1','campaign3-history-source-roles-rev310'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: parent semantic contract/integrated gate reconciled.
Start CAMPAIGN3_HISTORY_SEMANTIC_PARENT_CHECKPOINT.md.
460 original occurrences/41 sections;100 historical vector rows preserved.
Accepted I.3/J supersede stale open labels; finite scope and negative findings retained.
Source REV310:11367 assigned /6 unassigned;198924 narrative /212699 backing;
2803 backing resources. No runtime suite or original-source change.
Next: allocation/ADAPT/chronological sources,consolidated gaps and independent adequacy.
Dependent claims/post-cutoff joins remain open. HQ-012 unstarted. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
