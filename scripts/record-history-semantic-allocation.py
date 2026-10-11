from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev309/check.json');assert c['assignedSources']==11365
cp=P/'CAMPAIGN3_HISTORY_SEMANTIC_ALLOCATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Semantic schema and allocation authority — 2026-10-11

**LOCAL DISPOSITION — bounded historical authority reconciled.**
HQ-011 remains in progress; no owner ruling. Counters **1519 / 0**.

The two accepted SEM001I.1/I.2 sources distinguish occurrence identity, four
persistent state roots, governed definitions, typed values, transaction staging and
derived views. False evidence is not absent evidence; classification, recognition
and causal-role attribution remain distinct. Resolution history is append-only and
ordered by explicit revision links. Model-seeded knowledge is not silently learned.
Allocation numbers cannot confer psychological meaning or runtime qualification.

The numeric registry's namespace1004 availability is historical. Campaign2's accepted
allocation explicitly assigns it to SemanticKindId without changing the older source.
The inventory occurrence row calls event bindings a canonical list, but its specific
collection section requires a duplicate-free canonical set of complete binding bytes.
The numeric collection rule and worldEventTruthValue codec agree with that set rule.
Both wording issues are preserved with exact resolving evidence; no frozen contract
or production code is rewritten and no architectural decision is required.

A fresh read-only checker matches all50 record names/schema versions and252 field
numbers/names/required flags against exported metadata. This does not test namespace
or union behavior, runtime timing, codecs, or the complete SEM qualification. Historical
shape/allocation gates remain separate from I.3 codec and later vector gates.

Two full sources preserve101 original narrative occurrences across19 sections.
REV309:11,365 assigned /8 unassigned;198,464 narrative /212,699 backing;
2,803 outside-census resources. Source enumeration is not scientific adequacy.
Remaining semantic/allocation/ADAPT/chronological sources, consolidated gaps,
dependent claims, post-cutoff joins and independent adequacy remain open.
HQ-012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-semantic-allocation-rev1','campaign3-history-source-roles-rev309'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: semantic schema/allocation authority reconciled.
Start CAMPAIGN3_HISTORY_SEMANTIC_ALLOCATION_CHECKPOINT.md.
101 original occurrences/19 sections;50 records/252 fields pass read-only metadata parity.
Namespace1004 availability is historical; specific collection rule/codec resolve list wording.
Source REV309:11365 assigned /8 unassigned;198464 narrative /212699 backing;
2803 backing resources. No runtime suite or original-source change.
Next: remaining semantic/allocation/ADAPT/chronological sources,consolidated gaps and adequacy.
Dependent claims/post-cutoff joins remain open. HQ-012 unstarted. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
