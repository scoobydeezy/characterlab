from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev229/check.json');assert c['assignedSources']==10941
cp=P/'CAMPAIGN3_HISTORY_PREDICTION_RUNTIME_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Prediction runtime receipts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Four receipts preserve64 original narrative/four backing occurrences and all310 string
leaves. Sixty-four reference bindings match exact bytes, including inherited reports.
Proof revisions share every result row and differ only in source fingerprints.
Five component baseline tests pass; the five substitutions record failed-test counts
1/2/1/1/1 for repeated observation, last-reading replacement,65th support, same-instant
back-edge and extra application output. Component and public test paths remain distinct.
There is no independent-target freeze witness or whole qualification in this proof.

The current writer requires one exact source transformation and no unhandled errors;
it was inspected, not executed. Its original source identity remains unresolved.
Identical result rows across revisions do not establish identical source cohorts or
independent behavioral findings. Mutant failures are expected detection evidence.

Both audits retain model digest f272823f9c3aca5894e7366d646cdfcad050b4062db084219860403324008278
and190 preserved-artifact count. Each binds18 inherited reports; five report identities
advance in REV2. REV1 records1124combined=796fresh+328reference plus separate8stage and
one forgery test. REV2 records974 before final task hardening,328reference and24 later
task/boundary tests. These are separate recorded runs, not additive unique tests or
fresh execution; the audits explicitly do not contain raw full-suite output.

One traceBinding source was recovered exactly from Git9e1e169ceb3d1aff85da952bccb6bdf0513320fb.
Six source groups remain unresolved after current-path, indexed-backing, path-specific
all-Git/raw-LF-CRLF and planning-basename searches. Three repeat known adaptationRuntime/
scheduler gaps. Additional groups are predictionExecution e3e1a49a..., traceBinding
ddb62d63... and original proof writer9c5933b5.... Exact hashes and search scopes are in
unresolved.json. This is not global absence; dependent claims still require explicit
source/claim disposition in independent adequacy. Recorded detection is not fully
source-authenticated qualification merely because its receipt survives.

Source REV229: 10,941 assigned /432 unassigned; 189,259 narrative /211,862 backing;
1,221 indexed backing resources. One archive added; three additional source groups
recorded with three repeated gaps. No runtime/test/build rerun, model, law, allocation,
verdict, corpus or obligation status change. Formula provenance, legacy log, post-cutoff
joins and independent adequacy remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.
Counters1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-prediction-runtime-rev1','campaign3-history-source-roles-rev229'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: prediction runtime receipts reconciled.
Start CAMPAIGN3_HISTORY_PREDICTION_RUNTIME_CHECKPOINT.md.
Four sources;64 narrative/four backing;310 strings;64 exact bindings.
One trace source recovered;six source gaps (three prior/three additional);no rerun.
Source REV229:10941 assigned /432 unassigned;189259 narrative /211862 backing;
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
