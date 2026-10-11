from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev211/check.json');assert c['assignedSources']==10850
cp=P/'CAMPAIGN3_HISTORY_FCT_C_COHORTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical FCT-C cohort reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Three FCT-C receipts reconciled:137 original narrative/48 backing occurrences and
506 complete JSON string leaves. Original cohort has12 expected-rejection controls;
REV2/3 have18 each. The48 recorded executions are not48 independent mechanisms.
Each cohort retains two generic and two bounded baseline tests. The capability
substitutions execute one passing targeted test asserting the required rejection;
they are not arbitrary failed tests counted as detected mutants.

Generic actual EVID compares A/B/absent rosters with fixed X and allocation. Public
bounded-profile declaration/state exclusions remain separate. The original direct
context.state bypass is preserved in every receipt. Detached operand capability
correction requires inner ILLEGAL_READ,outer TRANSITION_FAILURE,zero roster reads
and whole-instant rollback in both E and L. Host admission and allocation remain
outside that semantic executor. Later identityOrdinal,traceAncestry and perceivedSuccess
controls exclude named operands;carried occurrence bytes do not imply universal
protection against arbitrary trusted-host inspection. REV2/3 share result payloads
but different runtime source commitments.

Twenty-two exact artifact bindings resolve. Original transitionIngressV04.ts and
state.ts bodies were recovered byte-for-byte from Git commit
42c2713ce044a04d53c294032462dd6ac25446e0 and indexed as two additional archives.
Two runtime hashes remain unresolved:REV3 was already recorded;the original
cb6adb0fb43cfdaab2acecbdb493bf21865b78aa68267efe014f60c5b00be93a
is additional to the ADAPT-associated inventory,now thirteen groups. Bounded
current/indexed-source,reachable exact-path Git raw/LF/CRLF and six exact-basename
workspace searches are recorded. No global absence or timestamp proof is claimed.
Independent adequacy still requires exact recovery or explicit dependent-claim disposition.

SourceREV211:10,850 assigned/523 unassigned;186,648 narrative/211,739 backing;
1,195 indexed archives. Other historical gap inventories,formula provenance,legacy
log,remaining support,post-cutoff joins and independent adequacy remain open.
No historical writer,runtime,test,build,model,law,allocation,verdict,corpus or obligation
status changed. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;
132 bounded;55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;
RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-fct-c-cohorts-rev1','campaign3-history-source-roles-rev211'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:three FCT-C historical receipts reconciled.
Start CAMPAIGN3_HISTORY_FCT_C_COHORTS_CHECKPOINT.md.
137 narrative/48 backing;506 strings;48 expected-rejection executions;22 exact bindings.
Two original ingress/state sources recovered;one additional runtime identity gap.
SourceREV211:10850 assigned/523 unassigned;186648 narrative/211739 backing;
1195 archives. Values post-cutoff reviews retain separate denominators.
Open identities:thirteen ADAPT-associated,two composition,two Values,seven cognitive,80 exit-inventory,one prior scheduler.
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
