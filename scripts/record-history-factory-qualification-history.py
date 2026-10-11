from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev210/check.json');assert c['assignedSources']==10847
cp=P/'CAMPAIGN3_HISTORY_FACTORY_QUALIFICATION_HISTORY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Factory qualification history reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Five historical qualification,scope and later-challenge documents reconciled:
223 original narrative occurrences. The sixteen component increments remain a
chronology of expanding evidence;they are not sixteen final qualifications or
additive independent test totals. Later bounded factory qualification is attributed
to user-authorized agent adversarial self-review,not an external planning agent.

The content,role,scalar,gate,REG and declaration comparisons preserve their separate
independence limits. Shared canonical transport is not an independent decoder;
authored declaration-case labels are not a second general compiler. A one-site
missing-reference mutant survived later traversal. A restore mutant originally
failed only at a later constructor check. Their corrected controls preserve the
failed attempts and assert the intended earlier boundary instead of generic rejection.

The real EVID capability flaw remains explicit: empty ReadDomain blocked declared
projection access while direct context.state access still succeeded. Detached operand
capabilities corrected that bypass. FCT-C acceptance requires all three parts:
actual generic roster invariance,forbidden projection/capability controls,and bounded
profile exclusion. No roster-bearing public model is claimed. Inner ILLEGAL_READ
and outer TRANSITION_FAILURE remain separate,including rollback of prior E on L failure.

Zero-count events are not silence. Saved E/L archives are preserved but cannot become
new original or pending work. Inert parameter-shaped content has no REG ownership.
Untouched-state validation and generic future-writer controls do not admit a new
public writer. Earlier fixed-pulse equality demonstrated a missing later-response
consumer;the separate accepted probe/carriage/memory history supplies its bounded
successor. Diagnostic R0+D is not a physiological,appraisal or reward law.

Forward acceptance resolves the old pending scope requests without rewriting them.
The bounded no-RNG factory qualification does not cover general topology,arbitrary
hostile code or its then-deferred PERSIST-I. Original facade restore preparation and
memory original-S0 replay remain distinct. Historical721tests102files and preservation
fingerprints are recorded support,not fresh execution or repair of missing source bytes.

SourceREV210:10,847 assigned/526 unassigned;186,511 narrative/211,691 backing;
1,193 indexed archives. All prior source-gap inventories remain open. Formula
provenance,legacy log,remaining support,post-cutoff joins and independent adequacy
remain open. No runtime,test,build,model,law,allocation,verdict,corpus or obligation
status changed. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;
132 bounded;55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;
RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-factory-qualification-history-rev1','campaign3-history-source-roles-rev210'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:five factory qualification/scope histories reconciled.
Start CAMPAIGN3_HISTORY_FACTORY_QUALIFICATION_HISTORY_CHECKPOINT.md.
223 narrative occurrences;sixteen component increments retain separate proof limits.
Direct EVID context.state bypass and accepted generic/public split preserved.
SourceREV210:10847 assigned/526 unassigned;186511 narrative/211691 backing;
1193 archives. Values post-cutoff reviews retain separate denominators.
Open identities:twelve ADAPT-associated,two composition,two Values,seven cognitive,80 exit-inventory,one prior scheduler.
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
