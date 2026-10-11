from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev205/check.json');assert c['assignedSources']==10817
cp=P/'CAMPAIGN3_HISTORY_BUILD_RECEIPTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical build receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Thirteen historical build/typecheck receipts reconciled:13 original narrative and
21 backing occurrences;241 complete JSON string leaves and88 exact artifact bindings.
Existing biology development archives resolve old contract,factory,model,runtime,
test and qualifier references without new source gaps or byte normalization.

Recorded command PASS and exitCode0 remain historical support,not raw compiler
logs,fresh execution,full dependency manifests or behavioral qualification. Brief
receipts without artifact hashes are not retroactively furnished with invented
manifests. LONGITUDINAL's328 reference count is companion evidence,not tests executed
by TypeScript. Its inspection-array type correction remains distinct from the
earlier standing-law failure and later semantic successor.

BIOLOGY_PUBLIC REV1 to REV2 changes only factory and qualifier artifact identities;
REV3 adds the bytes helper and updates admission-related artifacts. Successful
builds do not erase large-save admission failure,duplicate-writer rejection or
later publication obligations. Restored buildinfo and named prior closures remain
historical housekeeping assertions,not a new integrity replay. No build was rerun.

SourceREV205:10,817 assigned/556 unassigned;185,543 narrative/211,678 backing;
1,193 indexed archives. Exact references to already preserved development files
are recorded directly; no duplicate outside-census archive entries were added.
Remaining role counts do not measure unresolved material findings or adequacy.

Open source-identity groups remain:five ADAPT,two composition,two Values,seven
cognitive,80 exit-inventory and one scheduler. Formula provenance,legacy log,
remaining material support,post-cutoff joins and independent adequacy remain open.
No runtime,test,build,model,law,allocation,verdict,corpus or obligation status changed.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-build-receipts-rev1','campaign3-history-source-roles-rev205'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:13 historical build/typecheck receipts reconciled.
Start CAMPAIGN3_HISTORY_BUILD_RECEIPTS_CHECKPOINT.md.
13 narrative/21 backing;241 complete strings;88 exact artifact bindings.
Recorded build success is bounded support,not fresh execution or behavioral closure.
SourceREV205:10817 assigned/556 unassigned;185543 narrative/211678 backing;
1193 archives. Values post-cutoff reviews retain separate denominators.
Open identities:five ADAPT,two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
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
