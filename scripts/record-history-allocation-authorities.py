from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev311/check.json');assert c['assignedSources']==11369
cp=P/'CAMPAIGN3_HISTORY_ALLOCATION_AUTHORITIES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Allocation authority and registry chronology — 2026-10-11

**LOCAL DISPOSITION — permanent numbering and evidence scope reconciled.**
HQ-011 remains in progress; no owner ruling. Counters **1519 / 0**.

Campaign2 allocation freezes69 records,18 namespaces,58 member payloads,32 union
variants and10 finite values. A fresh read-only run of audit-campaign2-allocation.mjs
passes60 specification checks, including complete Markdown/JSON parity and the exact
accepted observation SeamId declaration. It does not rerun runtime, VAL or ADAPT proof.
Later bounded factory qualification and OPEN_DECISIONS supersede the dated open
statuses only for their named profiles. Allocation alone never grants implementation
or activation permission. Earlier generic trace/accessor schemas remain unchanged.

The canonical registry preserves structural identities and full saves, state-patch
presence semantics, complete mutation authority and immutable numeric assignments.
The introductory required-fields rule has an explicit type152 optional-field exception;
exact schema flags govern. Historical sorted-list trace sets are frozen representation,
not permission to recode later canonical sets. Presentation-only content stays outside
commitment. Profile-local occurrence types and reused namespace numbers remain subject
to their own admitted record/contract context, not universal evidence privileges.

The registry's census version ends at Development1508. Current bytes preserve that
entire original prefix and append exactly444 bytes for Values1509..1519 allocation
and bounded native closure. The original digest/occurrences are retained; a separate
current snapshot and delta bind the later text to its own Values qualification.
This does not retroactively materialize Campaign2 Values or prove wider developmental,
appraisal, physical-feedback or general learning claims. Linked allocation authorities
retain their previously reviewed source roles; this join does not rerun those proofs.

Two whole original sources preserve187 narrative occurrences across66 sections.
REV311:11,369 assigned /4 unassigned;199,111 narrative /212,699 backing;
2,804 outside-census resources. All old source assignments remain unchanged.
Remaining ADAPT/addenda/chronological sources, consolidated gaps, dependent claims,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-allocation-authorities-rev1','campaign3-history-source-roles-rev311'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: allocation authorities and registry chronology reconciled.
Start CAMPAIGN3_HISTORY_ALLOCATION_AUTHORITIES_CHECKPOINT.md.
187 original occurrences/66 sections;60 fresh specification checks pass.
Original registry preserved; exact444-byte Values appendix separately reviewed and bound.
Source REV311:11369 assigned /4 unassigned;199111 narrative /212699 backing;
2804 backing resources. No runtime suite or original-source change.
Next: ADAPT/addenda/chronological sources,consolidated gaps and independent adequacy.
Dependent claims/post-cutoff joins remain open. HQ-012 unstarted. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
