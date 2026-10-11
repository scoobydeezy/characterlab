from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev218/check.json');assert c['assignedSources']==10886
cp=P/'CAMPAIGN3_HISTORY_MEMORY_QUALIFICATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Measurement memory historical qualification — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Seven sources are reconciled: four reviews, two compact proof receipts and the
separate accepted freeze. The review preserves 86 original narrative /7 backing
occurrences and all 109 JSON strings. Sixteen freeze-file bindings match exactly;
seven canonical packet files are newly indexed backing outside the prose census.

The original 531-check blocked packet lacked the IDN StateMapKey declaration.
Constructor equality and reproducibility did not establish substrate admission.
The accepted successor added one existing-schema map-key role to the 14 memory
RecordField roles and recomputed all 16 commitments. The blocked predecessors were
never admitted, never frozen, and are neither aliases nor migration sources.

The corrected review's 589 checks preceded a separate concrete freeze and runtime
qualification. Formation and recall ablations remain distinct: evidence can survive
without an episode, and an episode can survive without recall. The bounded runtime
uses original-S0 prefix replay and exact whole-save equality before constructing a
fresh restored runtime. This is prefix integrity, not antirollback protection.
Generic R0/D witnesses and public profile exclusions remain explicitly composed.
Public later adaptation occurs after recall; a separate component supplies D change
between formation and recall. Frozen calibration/permission are not mutable knobs.

The 599-test full suite plus two later focused witnesses is not a 601-test full run.
The 16 model labels/digests match frozen control commitments. Four compact restore
modes are not sixteen fresh restores or universal persistence evidence. No historical
writer, model constructor, runtime, test or restore was rerun for this review.

The runtime prose claims 17 frozen-file fingerprints. FREEZE.json lists 16; the
directory contains 17 files including FREEZE.json itself. The audit records this
count correction while preserving the original prose and every frozen byte. A new
audit checker also initially used referenceDigest instead of the blocked manifest's
modelDigest key. Its failed script/error are preserved; the corrected schema check
passes. Neither issue is a runtime failure or a changed scientific model.

Source REV218: 10,886 assigned /487 unassigned; 187,056 narrative /211,839 backing;
1,211 indexed backing resources. Prior source gaps, formula provenance, legacy log,
post-cutoff joins and independent adequacy remain open. No model, law, allocation,
verdict, corpus or obligation status changed. HQ012 unstarted; Campaign3 NOT EXIT-READY.
Counters 1519/0; 108 verdicts; 132 bounded clauses; 55/58 wrappers; corpus 0.29.0/21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-qualification-rev1','campaign3-history-source-roles-rev218'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: seven measurement memory qualification sources reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_QUALIFICATION_CHECKPOINT.md.
86 narrative /7 backing; 109 strings; 16 exact freeze bindings; seven backing resources.
Blocked specimens preserved;16 fingerprints versus17 directory files corrected.
Source REV218: 10886 assigned /487 unassigned; 187056 narrative /211839 backing;
1211 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open; no global deduplication or absence claim.
Next remaining material support, post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN; HQ012 unstarted.
Campaign3 NOT EXIT-READY. 1519/0; 108 verdicts; 55/58 wrappers; 132 bounded;
corpus 0.29.0/21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
