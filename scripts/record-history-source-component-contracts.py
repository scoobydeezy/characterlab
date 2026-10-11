from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev186/check.json');assert c['assignedSources']==10366
cp=P/'CAMPAIGN3_HISTORY_SOURCE_COMPONENT_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Source and adapter contract reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Eight formal source/adapter/goal contracts and their two historical development
checkpoints reconciled:52 original narrative occurrences with exact text/locations.
Later accepted GA and corrected agency0.3 qualification remain separately scoped.
Current test-source inspection records no fresh execution or historical attestation.

Preserved distinctions:
- Agency source receives supplied frozen intent; public0.3 later generates actual
  choice. Failure alone is not obstruction evidence; witnessed blockage plus hidden
  incompetence does not prove success if unblocked. Reports remain fallible and
  observer-local; evidence counts are not calibrated confidence. Corrected public
  intent70/expression80/plan90/attempt100 supersedes the source plan's early shorthand,
  preserving the first observer-ID leak and second phase-mismatch cohorts.
- Body cue can be present at numeric zero and independent of acquisition capacity.
  Shape-valid same-time evidence is not proof of same-run public source provenance.
- Adopted maintenance goals target experienced signal, not hidden reserves. Satisfaction
  does not retire them. Explicit expiry precedes a boundary read; unavailable reasons
  remain distinct, and changed state is not a historical snapshot.
- No focal consequence means no callback/result. Present incomplete attribution emits
  identified Unavailable and retains actual partial consumption; only the focal consumed
  endpoint gets credit. One-use preparation capability does not own scheduler rollback.
- Temporary canonical child-key labels preserve byte order, never persist and never
  become authority. Construction bounds are not memory capacities or identity reduction.
- Combined observation actually samples requested channels, does not infer Actor from
  position/panel, and publishes local owners only after successful SEM preparation.
  Expressibility does not prove every public profile sampled all channels.

SourceREV186:10,366 assigned/1,007 unassigned;131,445 narrative/211,258 backing;
1,192 indexed archives. Values post-cutoff90 paragraphs/15 finding fields/512 runs/
24 support receipts retain separate denominators and stronger open cases.
Open source identities:two Values,seven cognitive,80 exit-inventory and one scheduler.
Formula provenance,legacy log,remaining material support and independent adequacy
remain open. HQ012 unstarted;Campaign3 NOT EXIT-READY. No runtime/build/model/law/
allocation/verdict/corpus/obligation change.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-source-component-contracts-rev1','campaign3-history-source-roles-rev186'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:eight source/adapter/goal contracts reconciled.
Start CAMPAIGN3_HISTORY_SOURCE_COMPONENT_CONTRACTS_CHECKPOINT.md.
52 original narrative occurrences;later bounded GA/agency authority remains separate.
Preserve zero-valued independent cue,explicit goal expiry,focal credit and temporary keys.
SourceREV186:10366 assigned/1007 unassigned;131445 narrative/211258 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
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
