from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev201/check.json');assert c['assignedSources']==10782
cp=P/'CAMPAIGN3_HISTORY_AGENCY_COHORTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# AGENCY historical cohort reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

26 historical AGENCY sources reconciled:100 original narrative and11 backing
occurrences,1,101 complete JSON string leaves and170 exact current/archive bindings.
The historical contracts,plans,model freezes,result rows,build/test descriptions,
preservation maps and superseded qualification claims remain independently identified.
No new missing source identity was found.

First-cohort17-run/61-prefix PASS remains true for its narrower matrix. It missed an
unreceived report followed by a later attempt: B's belief values agreed but its public
occurrence IDs changed. Second-cohort19-run/71-prefix PASS includes the added future
nonrecipient controls and corrects reservation behavior, yet still produced intent80
against its required70. Both drafted COMPLETE claims are superseded by final0.3;
they do not regain closure authority merely because recorded counts or hashes pass.
The first matrix has44 advancing/17 terminal checks; the second52/19.

All17 original scenario inputs persist in the19-row successor. All19 inputs then
persist through the phase correction. Every shared model/run identity changes at
both transitions. Thus the final implementation does not silently inherit the earlier
run identities. Exact older source/contract/qualification/closure-script references
resolve to preserved artifacts where current bytes differ; no replacement by current
code is used. Shared allocation grammar does not make revisions interchangeable.

The first35-test receipt explicitly records terminal output after npm consumed the
reporter flags. It is not a Vitest JSON export. Historical build summaries and retained
328-test reference receipt are not fresh executions or an all-active-suite claim.
Documentation-only cp1252/EEXIST failures remain separate from scientific defects.
The intake's cross-episode prediction and coercion limits remain historical scope;
this review does not erase later separately earned qualifications.

No historical writer,runtime,test,restore,mutant or build rerun. No model,law,
allocation,verdict,corpus or obligation status changed. SourceREV201:10,782 assigned/
591 unassigned;184,245 narrative/211,656 backing;1,192 indexed archives.

Existing two composition,two Values,seven cognitive,80 exit-inventory and one scheduler
identity groups remain open. Formula provenance,legacy log,remaining material support,
post-cutoff joins and independent adequacy remain owed. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-agency-cohorts-rev1','campaign3-history-source-roles-rev201'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:26 historical AGENCY sources reconciled.
Start CAMPAIGN3_HISTORY_AGENCY_COHORTS_CHECKPOINT.md.
100 narrative/11 backing;1101 strings;170 exact current/archive bindings.
17/61 then19/71 scoped matrix passes remain superseded as closure authority.
SourceREV201:10782 assigned/591 unassigned;184245 narrative/211656 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two composition,two Values,seven cognitive,80 exit-inventory,one scheduler.
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
