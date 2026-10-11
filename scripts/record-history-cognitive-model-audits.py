from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev184/check.json');assert c['assignedSources']==10352
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_MODEL_AUDITS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive model construction audits — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Four declaration-join, receiving-definition, recipe-difference and model-admission
receipts reconciled:24 narrative/3 backing original occurrences, all191 string
leaves and19 exact bindings. Two distinct historical taskDeclarations versions
resolve to existing exact archives. Neither is replaced by the current implementation.

All21 recipe names align; all21 admitted digests match the frozen cohort. The join
receipt covers16 stages/11 state families and two ownership construction rejections.
Inherited IDN construction context is not new runtime-value qualification. Receiving
checks cover13 definition rows/model and three wrong-kind/producer/registry controls.
The2047 field/233 reference figures count cumulative traversals, including partial
traversals before expected rejection; they are not independent test counts.

Recipe changes retain exact row sets and shared content/parameters/slots1..5/base/gain/K.
History-boundary changes three rows and deadline-overlap two; these are not relabeled
single-factor interventions. Model admission is declaration/ownership scope only,
explicitly excluding public execution, source authenticity, RNG and persistence.
Later scoped public qualification remains distinct from these historical receipts.

A read-only inspection helper initially assumed models was a list; the definition
receipt stores integer21. Schema-aware inspection corrected the helper; no source,
report, checker or scientific result changed. No historical writer or runtime suite
was rerun. No new model, allocation, verdict, corpus promotion or obligation closure.

SourceREV184:10,352 assigned/1,021 unassigned;131,089 narrative/211,252 backing;
1,190 indexed archives. Next earlier runtime receipts and correction chains.
80 exit-inventory identities plus one older scheduler identity remain open, along
with formula provenance, legacy log, Values90/15 and independent adequacy.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 mandatory UNSATISFIED;
RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-cognitive-model-audits-rev1','campaign3-history-source-roles-rev184'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:four cognitive model construction audits reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_MODEL_AUDITS_CHECKPOINT.md.
24 narrative/3 backing occurrences;191 string leaves;19 exact source bindings.
21 admitted model identities match freeze;two distinct taskDeclarations archives.
Field/reference counts include rejected partial traversals, not independent tests.
SourceREV184:10352 assigned/1021 unassigned;131089 narrative/211252 backing;
1190 archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next earlier runtime receipts and correction chains.
Formula provenance,legacy log,Values90/15 and independent adequacy OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
