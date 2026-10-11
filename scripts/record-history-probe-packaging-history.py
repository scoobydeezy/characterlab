from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev247/check.json');assert c['assignedSources']==11054
cp=P/'CAMPAIGN3_HISTORY_PROBE_PACKAGING_HISTORY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Probe packaging and runtime qualification history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Five sources preserve159 exact original narrative occurrences. The diagnostic probe
measures an absolute operating point, not an effect or response law. Truth is signed n;
observation is exact rational n/Scale. Matching support identities cannot carry a changed
scalar into reference-only X/E/L. The rejected inference was identified by inspection,
not falsely recorded as a failed runtime experiment. A permitted observation difference
therefore did not qualify cognitive divergence.

Packaging binds complete input, trace and persistence profiles through exact RulesVersion.
Retained submappings are not permission to dispatch an old whole profile or autodetect new
inputs. Frozen probe.1 and accessor successor.2 retain separate identities; the successor
changes only ModelIdentity field1, preserving manifests. Materialization/deletion-regeneration
receipts and allocation audits did not pass runtime gates. Historical writers were not run.

The fixed eight-event/five-ordinal policy preserves later visible allocation without dummy
experiences or typed padding occurrences. Denied branches still perform private bookkeeping,
not semantic observation. The review preserves the state-bearing arithmetic isolation fix,
extra-learning output defect, exact cardinality/archive correction and fixture failures.
Thirty-two trace failure sites and18 post-allocation failure sites retain distinct ownership
scope. Historical477/523/549 full-suite cohorts are separate from later focused substitutions.
F/G generic temporal/signed positives plus public exclusions did not execute broader public
models. Final A..P/ADAPT9a acceptance supersedes intermediate partial tables only in that scope.

Source REV247:11,054 assigned /319 unassigned;191,494 narrative /212,032 backing;
1,241 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-probe-packaging-history-rev1','campaign3-history-source-roles-rev247'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: probe packaging and runtime qualification history reconciled.
Start CAMPAIGN3_HISTORY_PROBE_PACKAGING_HISTORY_CHECKPOINT.md.
Five sources;159 original narrative occurrences. Original/successor identities,
observation-only divergence, fixed hidden-work policy and output-closure failure preserved.
Source REV247:11054 assigned /319 unassigned;191494 narrative /212032 backing;
1241 backing resources. Values post-cutoff reviews retain separate denominators.
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
