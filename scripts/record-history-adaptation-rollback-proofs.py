from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev208/check.json');assert c['assignedSources']==10836
cp=P/'CAMPAIGN3_HISTORY_ADAPTATION_ROLLBACK_PROOFS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Adaptation rollback and stage proof reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Six historical rollback/stage receipts reconciled:235 original narrative/11 backing
occurrences,555 complete JSON string leaves,21 recorded detected mutant instances
and12 exact source bindings. Original receipt bytes and failed test details remain.

The six rollback stages cover after reads,later out-of-range,staged outputs,patch
union,final trace and work limit. Failed-state publication is detected at final
trace;queue,allocator and trace/output leaks fail all six witnesses. This distinguishes
atomic rollback from merely catching an exception. Terminal Failed does not imply
an Active continuation or universal recovery from host failures. Original and REV2
payloads are identical apart from committed source fingerprints.

Stage evidence grows from four tests/two mutants to five/three and seven/four.
Ordinary phase140 events,late children,handler-generated InputOnly events and missing
consumption each have their own boundary. A later ingress error is not interchangeable
with the required earlier rejection. Positive exact-once dispatch and duplicate
execution without extra reads remain distinct. Internal fault injections do not
create public scheduling authority. REV3/4 share results but different sources;
later Task deadline guards are not retroactively part of these original receipts.

Five historical source groups remain unresolved here. The runtime was already
recorded;two scheduler versions and two stage-test versions are additional to the
prior ADAPT-associated inventory,which now totals twelve groups. Exact identities,
affected reports and bounded current/archive/Git/workspace searches are preserved
in unresolved.json. Nine exact-basename workspace candidates and reachable exact-
path Git raw/LF/CRLF variants yielded no matching bytes. No global absence or global
disjointness across historical gap inventories is claimed.

Independent adequacy must recover exact bodies or explicitly dispose dependent
claims before HQ012. Identical later results do not supply missing source bytes.
The parent-pair report was inspected only for schema;its hex-backed evidence is
still unassigned and requires separate joins,not acceptance from this batch.

SourceREV208:10,836 assigned/537 unassigned;186,179 narrative/211,691 backing;
1,193 indexed archives. Formula provenance,legacy log,remaining material support,
post-cutoff joins and independent adequacy remain open. Other source-gap inventories
are unchanged. No runtime,test,build,model,law,allocation,verdict,corpus or obligation
status changed. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;
132 bounded;55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;
RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adaptation-rollback-proofs-rev1','campaign3-history-source-roles-rev208'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:six ADAPT rollback/stage proof receipts reconciled.
Start CAMPAIGN3_HISTORY_ADAPTATION_ROLLBACK_PROOFS_CHECKPOINT.md.
235 narrative/11 backing;555 strings;21 detected historical mutants;12 exact bindings.
Four additional scheduler/test source gaps;previously recorded runtime gap remains.
SourceREV208:10836 assigned/537 unassigned;186179 narrative/211691 backing;
1193 archives. Values post-cutoff reviews retain separate denominators.
Open identities:twelve ADAPT-associated,two composition,two Values,seven cognitive,80 exit-inventory,one prior scheduler.
Next parent-pair evidence,remaining material support,post-cutoff joins and adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
