from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev312/check.json');assert c['assignedSources']==11370
cp=P/'CAMPAIGN3_HISTORY_SUBSTRATE_ADDENDA_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Projection and write-path addenda — 2026-10-11

**LOCAL DISPOSITION — distinct acceptance levels and findings preserved.**
HQ-011 remains in progress; no owner ruling. Counters **1519 / 0**.

PRJ shape acceptance and WRT implementation acceptance are separate. Later allocation,
generic projection and bounded factory qualification supersede dated activation labels
only within their actual scopes. Generic roster-positive evidence does not imply the
frozen zero-read public EVID profile admits that branch. Existing projection-cohort
historical source gaps remain open; this review does not recover those bytes.

The original derived machinery passed six composition conditions but failed two:
its named callback was uncommitted, and lazy required reads could fail mid-transition.
The accepted closed declaration resolves one admitted selector into one exact path,
requires its source during projection construction, and exposes only the field. Failed
required lookup precedes transition work, not the read necessary to discover absence.
Output-role compatibility is exact and non-inferential. Key shape and recursively
validated identity roles remain separate. Bidirectional grammar coverage depends on
model admission, not the date a family was written. Read-only families remain disjoint.

WRT fixes authority-before-writability and the single-operation sort-comparator hole.
Its common prefix is structural validity, declared writable leaf, then owning authority.
Section2.3's shorthand cannot override the explicit2.2/OPEN_DECISIONS acceptance:
operation-specific suffixes stay unchanged. Current code checks set/remove preconditions
before their respective value/removal checks. The draft's narrower reopen wording also
does not revoke its explicit IdentityKey/CanonicalRecordKey grammar.

Four old failing tests contained five deliberately reclassified assertion sites.
The historical315-test receipt is retained, not freshly rerun. Typed state-contract
codes distinguish undeclared paths from wrong authority, but scheduler diagnostics
still flatten causes into STATE_VALIDATION_FAILURE plus text. A structured diagnostic
claim would need a separately owned contract and evidence. Four material distinctions
are recorded with obligation owners, blocked claims and reopening conditions.

One whole source preserves195 original narrative occurrences. No production or frozen
source changed; no runtime/tests rerun. REV312:11,370 assigned /3 unassigned;
199,306 narrative /212,699 backing;2,804 outside-census resources.
ADAPT resolution/consolidation and chronology remain, followed by consolidated gaps,
dependent claims, post-cutoff joins and independent adequacy. HQ-012 unstarted;
Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-substrate-addenda-rev1','campaign3-history-source-roles-rev312'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: projection/write-path addenda reconciled.
Start CAMPAIGN3_HISTORY_SUBSTRATE_ADDENDA_CHECKPOINT.md.
195 original occurrences;four explicit material distinctions preserve defects and diagnostic limits.
Shape/generic/public evidence stay separate; accepted prefix/suffix resolves draft shorthand.
Source REV312:11370 assigned /3 unassigned;199306 narrative /212699 backing;
2804 backing resources. No runtime suite or original-source change.
Next: ADAPT resolution/consolidation and chronology,then consolidated gaps and adequacy.
Dependent claims/post-cutoff joins remain open. HQ-012 unstarted. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0].replace('Updated2026-10-08','Updated2026-10-11')+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+'**Current routing (2026-10-11):**'+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
