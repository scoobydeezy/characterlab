from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev261/check.json');assert c['assignedSources']==11156
cp=P/'CAMPAIGN3_HISTORY_PRESERVED_CORPUS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Preserved corpus history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress; counters **1519 / 0**.

The preserved 0.28.0 corpus exactly matches the original promotion receipt's source
hash. Its successor preserves twenty member sections unchanged. The attention section
changes its version and adds an explicit bounded fixture annotation; its preceding
requirements are unchanged. Eleven intake bodies match the promoted requirement bodies
with only the declared version substitution. These are text and identity checks, not
new behavioral experiments or whole-member qualification.

The receipt's original intake bytes were recovered exactly from Git commit
6d54d35f3c612154658c6f9316f6f7e04071865b and archived as intake-at-promotion.md.
All three original source hashes are accounted for. Both prior and promoted canonical
encodings reproduce their declared digests; the successor encoding does too. No
historical writer was rerun, and hashes do not establish execution timestamps.

The review preserves 321 original narrative occurrences and examines all 96 receipt
string leaves. Of the preserved corpus paragraphs, 295 inherit content-specific
scientific dispositions through exact text matches; six identity/header paragraphs
receive explicit historical dispositions. The old ten-of-eleven error is corrected
forward as three partial plus eight blocked. Family membership and executable coverage
remain distinct. Dated ADAPT and memory annotations preserve their exact bounded scope,
including separate diagnostic, transient carriage, formation and recall evidence.

The corpus review's unresolved BIO comparator wording and full scientific adequacy
remain open. Text preservation does not resolve them or promote any phenomenon.
Source REV261: 11,156 assigned / 217 unassigned; 193,045 narrative / 212,202 backing;
1,293 indexed backing resources. No runtime test, model, law, allocation, verdict,
corpus or obligation status changed. HQ-012 is unstarted; Campaign 3 NOT EXIT-READY.
Counters 1519 / 0; 108 verdicts; 132 bounded clauses; 55 / 58 public wrappers;
corpus 0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-preserved-corpus-rev1','campaign3-history-source-roles-rev261'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: preserved corpus history reconciled.
Start CAMPAIGN3_HISTORY_PRESERVED_CORPUS_CHECKPOINT.md.
Two sources; 321 original narrative occurrences, 96 receipt string leaves.
Twenty unchanged successor sections; eleven preserved intake bodies; all three
original receipt source hashes resolved, including exact Git intake recovery.
Source REV261: 11156 assigned / 217 unassigned; 193045 narrative / 212202 backing;
1293 backing resources. No behavioral qualification follows from text equality.
Next: remaining material support, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign 3 NOT EXIT-READY. Counters 1519 / 0; 108 verdicts; 55 / 58 wrappers;
132 bounded clauses; corpus 0.29.0 / 21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
