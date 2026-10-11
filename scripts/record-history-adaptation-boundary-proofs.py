from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev207/check.json');assert c['assignedSources']==10830
cp=P/'CAMPAIGN3_HISTORY_ADAPTATION_BOUNDARY_PROOFS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Adaptation boundary proof reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Seven historical read-evidence,binding-isolation,magnitude and reference mutation
receipts reconciled:282 original narrative/two backing occurrences,638 complete
JSON string leaves,16 recorded detected mutant instances and18 exact source bindings.
Original artifacts and every test name,status,error and mutation string remain intact.

Magnitude REV1/2 have identical payloads apart from evaluator fingerprints;three
reference revisions likewise change source commitments while retaining result rows.
Those are distinct historical identities,not independent psychological mechanisms.
The bounded-clamp mutation also clamps unbounded load by field identity;its third
failure is preserved. It is not an isolated bounded-domain intervention. Three
baseline alias tests retain direct4-to7 and derive4-to999 failures under two mutants.
The original seven-test read-evidence receipt predates the separate ten-test active-
interleaving cohort. Removing pre-instant validation reaches ingress at INT64_MAX
before rejection;that failure remains distinct from unknown-variable translation.

Four historical source groups remain unrecovered in this batch. One evaluator hash
was already among the five ADAPT gaps;three are additional:the original read-evidence
evaluator,test and reference REV3 runtime. The ADAPT group total is now eight.
Exact affected report/hash pairs and bounded search evidence are in unresolved.json.
Current files,1,193 indexed archives,reviewed sources,reachable exact-path Git raw/
LF/CRLF and seven exact-basename workspace candidates were checked. No global-absence,
unreachable-object or renamed-path claim is made. No original writer was rerun.

Independent adequacy must recover exact bodies or explicitly limit/exclude dependent
historical claims before HQ012. Later source,identical test rows and narrative
acceptance cannot impersonate missing committed bytes. Prose review alone does not
refresh mutation evidence or establish a complete dependency manifest.

SourceREV207:10,830 assigned/543 unassigned;185,944 narrative/211,680 backing;
1,193 indexed archives. Remaining role counts do not measure material adequacy.
Other identity groups remain:two composition,two Values,seven cognitive,80 exit-
inventory and one scheduler;do not assume global disjointness from group labels.
Formula provenance,legacy log,remaining support,post-cutoff joins and independent
adequacy remain open. No runtime,test,build,model,law,allocation,verdict,corpus or
obligation status changed. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;
108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;
RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adaptation-boundary-proofs-rev1','campaign3-history-source-roles-rev207'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:seven ADAPT boundary proof receipts reconciled.
Start CAMPAIGN3_HISTORY_ADAPTATION_BOUNDARY_PROOFS_CHECKPOINT.md.
282 narrative/two backing;638 strings;16 detected historical mutants;18 exact bindings.
Three additional ADAPT source gaps;one previously recorded gap also affects this batch.
SourceREV207:10830 assigned/543 unassigned;185944 narrative/211680 backing;
1193 archives. Values post-cutoff reviews retain separate denominators.
Open identities:eight ADAPT,two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
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
