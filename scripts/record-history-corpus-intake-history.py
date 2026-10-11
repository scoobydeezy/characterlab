from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev260/check.json');assert c['assignedSources']==11154
cp=P/'CAMPAIGN3_HISTORY_CORPUS_INTAKE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical corpus intake review — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress; counters **1519 / 0**.

Two historical sources preserve 106 original narrative occurrences. The promotion
manifest and receipt identify eleven new members: three PARTIAL and eight BLOCKED.
The repeated claim that ten of eleven had these statuses is incorrect. The original
sources remain unchanged; this review records the correction with exact source hashes.
Both captured canonical encodings reproduce their declared SHA-256 digests. This
checks retained bytes, not historical execution order or each obligation's completion.

The intake preserves distinct evidence, belief, appraisal, action, acquisition and
retention requirements. It does not require every model to implement particular stored
meters, persistent roots or formulas. Comparators and counterfactual obligations remain
binding within their declared scope. A bounded rupture is not grief, supplied learned
state is not acquisition, and a finite history cannot establish lifelong equivalence.

Corpus membership, named family coverage, executable fixture coverage and passed
behavior are separate claims. The old thirteen-family statement mixes these measures
and cannot replace current coverage audits. The manifest's verdict-before-digest prose
is historical testimony, not a chronology independently proved by current hashes.

Source REV260: 11,154 assigned / 219 unassigned; 192,724 narrative / 212,202 backing;
1,292 indexed backing resources. The preserved corpus copy still needs its own review.
No runtime tests, model, law, allocation, verdict, corpus or obligation status changed.
Formula provenance, legacy log, source gaps, post-cutoff joins and independent adequacy
remain open. HQ-012 is unstarted; Campaign 3 is NOT EXIT-READY. Counters 1519 / 0;
108 verdicts, 132 bounded clauses, 55 producers / 58 factories, corpus 0.29.0 / 21.
RO-C3-019 remains ACTIVE; RO-C3-021 remains UNSATISFIED; RO-C3-022 remains CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-corpus-intake-history-rev1','campaign3-history-source-roles-rev260'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: historical corpus intake reviewed.
Start CAMPAIGN3_HISTORY_CORPUS_INTAKE_CHECKPOINT.md.
Two sources preserve 106 original narrative occurrences. All eleven new members
were partial or blocked (three/eight), contrary to the historical ten-of-eleven prose.
Membership, fixture coverage and scientific qualification remain separate.
Source REV260: 11154 assigned / 219 unassigned; 192724 narrative / 212202 backing;
1292 backing resources. The preserved corpus copy still needs review.
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
