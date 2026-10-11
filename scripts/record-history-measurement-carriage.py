from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev216/check.json');assert c['assignedSources']==10871
cp=P/'CAMPAIGN3_HISTORY_MEASUREMENT_CARRIAGE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Measurement carriage historical reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Five sources are reconciled: two materialization/qualification reviews and three
compact receipts. All 50 original narrative occurrences and 64 JSON strings are
preserved. All 15 packet-file hashes match; seven canonical hex resources are now
explicit backing outside the prose census. No historical writer was run.

The accepted concrete-byte freeze is distinct from subsequent bounded runtime
qualification. Its registry delta adds nine/removes one slot-0 entry and adds eight
slot-5 roles, leaving slots 1..4 unchanged. Four variant identities are represented,
not four full packet directories. The 102 checks and 87 preservation claims belong
to the historical materialization scope, not new runtime execution.

Carriage publishes exact observer-side observation 203 and safe unit inside 337
through shared V07 ingress. It neither writes persistent cognition nor establishes
a responding learning mechanism. The accepted EVC-B result requires both an actual
generic REG/probe/intake equality witness and frozen public changed-anchor exclusion.
It does not admit public R0 variation. Present-only diagnostic scope, exact first
profile and bounded input witnesses remain explicit limits.

The earlier restore defect omitted carriage configuration and selected the old probe
trace binding. Its repair and the four contention timeouts remain preserved. The
563-test regression preceded five final additions; the 18-test focused result cannot
be counted as another full suite. Historical unresolved parent scope is not a new
architecture decision or a current blanket rejection of later cognition work.

Continuation records a two-process post-carriage restore followed by authored
adaptation, with complete-save equality. Its compact receipt contains hashes rather
than save bytes or a source manifest. Current helper inspection identifies the intended
exposure2/probe4/exposure6 sequence without authenticating the old helper or freshly
replaying the saved history. Exact packet integrity likewise does not rerun deletion
and rematerialization. Full packet semantic/source-role review remains separate.

Source REV216: 10,871 assigned /502 unassigned; 186,855 narrative /211,832 backing;
1,204 indexed backing resources. Prior source gaps, formula provenance, legacy log,
post-cutoff joins and independent adequacy remain open. No model, law, allocation,
verdict, corpus or obligation status change. HQ012 unstarted; Campaign3 NOT EXIT-READY.
Counters 1519/0; 108 verdicts; 132 bounded clauses; 55/58 wrappers; corpus 0.29.0/21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-measurement-carriage-rev1','campaign3-history-source-roles-rev216'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: five measurement carriage sources reconciled.
Start CAMPAIGN3_HISTORY_MEASUREMENT_CARRIAGE_CHECKPOINT.md.
50 narrative /0 backing; 64 strings; 15 exact packet bindings; seven backing resources.
Byte freeze, runtime qualification and recorded continuation scopes remain distinct.
Source REV216: 10871 assigned /502 unassigned; 186855 narrative /211832 backing;
1204 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open; no global deduplication or absence claim.
Next remaining material support, full packet roles, post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN; HQ012 unstarted.
Campaign3 NOT EXIT-READY. 1519/0; 108 verdicts; 55/58 wrappers; 132 bounded;
corpus 0.29.0/21. RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
All jobs terminal; no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
