from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-values-development-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');assert (c['sources'],c['stringOccurrences'],c['exactBindings'])==(24,16622,1029)
cp=P/'CAMPAIGN3_HISTORY_VALUES_DEVELOPMENT_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Values post-cutoff development support — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Twenty-four remaining Values JSON plans, checks, readiness and development receipts
now have explicit scoped dispositions:16,622 string occurrences including short values;
1,029 exact source bindings; six preserved rejected-source files. All24 are post-cutoff,
so the original census/index totals remain unchanged. Prior90 paragraphs/15 finding
fields and512 run dispositions remain separate scopes, not inflated scientific counts.

Rejected component REV1 and corrected REV2 retain256 identical authored receipt lists,
case/seed/law assignments and six receiving contexts. Their input hashes differ because
the committed gapInstant changes65 to64; their run identities also differ. Native frames
preserve the admitted receipt lists, schedule the six contexts59..64 and add expiry65.
The first new checker incorrectly expected equal input hashes from equal receipt lists.
Its rejected bytes are preserved; the corrected check explicitly verifies both gap
constants and distinct input commitments. No old plan or run identity was rewritten.

All four rejected partitions stopped at chosenData on terminal65; none completed a run.
The syntax-rejected public test suite executed zero native assertions, while19 component
assertions passed. Six test receipts retain exact titles/statuses and their own counts;
passing labels do not expand clause scope. Earlier17-test and pre-cache-edit build claims
remain chronological; later19/31 focused and328 reference receipts are distinct. The
native build records transcribed observed output and103 source bindings, not an independently
captured terminal log. Rejected factory imports, forged-save test shape and syntax fixes
remain separate development findings. Prior RO routing is not current obligation status.

Two early component-checkpoint source identities remain unresolved: valuesComponent.ts
and valuesComponent.test.ts. Indexed archives, preserved rejected sources and reachable
exact-path Git raw/LF/CRLF variants did not match. No global absence, timestamp or later-
source substitution is claimed. These add to seven early cognitive runtime hashes,
80 exit-inventory identities and one older scheduler identity already carried underRO021.
Later qualified source/model identities do not retroactively authenticate the early pair.

The Values JSON support scope is now explicit, including failed cohorts; final post-cutoff
joins/independent adequacy remain open. Stronger Values cases2/3/autonomous7 remain
unexecuted. No fresh runtime/build, new law/model/allocation/verdict/corpus or obligation
closure. SourceREV185 remains10,358/1,015;131,393 narrative/211,258 backing;1,192 archives.
Formula provenance/legacy log and remaining material support remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 mandatory UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for p in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:24 Values post-cutoff support receipts reconciled.
Start CAMPAIGN3_HISTORY_VALUES_DEVELOPMENT_CHECKPOINT.md.
16622 strings;1029 exact bindings;six rejected-source archives;two early source gaps.
Preserve new checker input-hash assumption failure:gap65->64 changes commitment.
Prior90 paragraphs/15 findings/512 runs retained;cases2/3/autonomous7 remain OPEN.
SourceREV185 unchanged:10358 assigned/1015 unassigned;131393 narrative/211258 backing;
1192 archives. Post-cutoff sources use separate denominators.
Open identities:two early Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
