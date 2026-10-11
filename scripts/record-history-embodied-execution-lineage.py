from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev288/check.json');assert c['assignedSources']==11285
cp=P/'CAMPAIGN3_HISTORY_EMBODIED_EXECUTION_LINEAGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Embodied execution review lineage — 2026-10-08

**LOCAL DISPOSITION — stored execution evidence reconciled; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

Both body execution reviews retain the same seven result rows and21 identical
output/trace/save artifact pairs. Each run checks9 originals and6 boundaries with
39 events. Denied/unavailable produce15 outputs and no SEM, versus21 outputs/6 SEM
otherwise. Hidden reserve expectations are intentionally not read or reconstructed.
The replenishment/runtime/trace revisions remain distinct source identities. These
receipts did not alone close receiving, action knowledge or general Need ownership.

The receiving reviews retain all28 specimens and196 identical artifact pairs.
REV3 retains every occurrence of the492 REV2 checks and adds196 byte-preservation
checks: seven artifacts per run. The688 total does not mean196 new scenarios or
restored prefixes. This review verifies those counts and hashes without rerunning
runtime writers or asserting a new full-suite result.

Named public contrasts preserve duplicate grounds at fair1/2, independent task/body
same-option grounds at221/256 versus1/2 ablations, and no-coverage duplicate2/3.
Hidden aliases preserve outputs; coarse sensing at35 removes a body option;
execution permission changes terminal outcome without rewriting intent. NoOptions
and NoActiveReasons remain distinct; five dice and three resolution modes are
reported. Deadline removes task participation while preserving body origins and
instruction context. The maximal declared instant has26 events/22 outputs.
Adopted instructions are not efficacy or replenishment knowledge. Generic aggregate,
negative/modifier comparisons, runtime mutants and final reconciliation belong to
separately scoped evidence in later embodied qualification.

Four sources preserve1,200 original narrative and14 backing occurrences, and all
2,460 string leaves.475 binding occurrences match exactly; nine occurrences/eight
historical source pairs remain unresolved, naming embodiedAdmission, two versions
each of embodiedRuntime/embodiedTrace, two receivingRuntime versions and an earlier
receivingTransforms. No source-exact rerun is claimed; include these in final gap
consolidation.453 existing source/artifact files newly indexed.

Source REV288:11,285 assigned /88 unassigned;195,891 narrative /212,253 backing;
2,469 backing resources. No model, law, verdict, allocation, corpus or obligation
status changed. Earlier gaps, post-cutoff joins and independent adequacy remain open.
HQ-012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-001','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-embodied-execution-lineage-rev1','campaign3-history-source-roles-rev288'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: four embodied execution reviews reconciled.
Start CAMPAIGN3_HISTORY_EMBODIED_EXECUTION_LINEAGE_CHECKPOINT.md.
Seven body/28 receiving runs;21/196 matching artifact pairs across revisions.
492 checks retained plus196 byte checks;475 exact bindings/nine gap occurrences.
Source REV288:11285 assigned /88 unassigned;195891 narrative /212253 backing;
2469 backing resources. No new runtime replay or qualification.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include new gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
