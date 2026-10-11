from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev203/check.json');assert c['assignedSources']==10794
cp=P/'CAMPAIGN3_HISTORY_ADAPTATION_PACKAGING_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Adaptation packaging and write-scope history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Six packaging/write-boundary documents reconciled with172 exact original narrative
occurrences. Symbolic packaging is distinct from permanent allocation and executable
proof. Five typed key/value families,abstract domain scales,sole physical ownership,
logical routing and shared PRJ accessor identity retain their separate authorities.
Equal schemas or scales do not merge identity domains or supply physical conversions.

The static invariant scans all present entries,including untouched leaves. Stored
zero is invalid; absence is the only stored baseline. Namespace-role validity and
referenced-definition existence are separate checks. Static signed displacement
validity does not imply valid effective reference at currentT; REG owns that second
check. Initial/restore INVALID_VALUE,settlement STATE_VALIDATION_FAILURE,candidate-q
range failures and PRJ/WRT operation precedence must not collapse into one error.

The historical wrong-target write originally reached STALE_PRECONDITION too late.
The correction inserted transition scope and exact target checks after ownership and
before operation preconditions,then compared actual diff and staged evidence. A
redundant patch-byte mutant survived because the actual-diff guard already rejected
changed effective writes; its removal and original survived receipt remain explicit.
Passing a later rejection does not prove the intended earlier boundary worked.

The accepted reachability ruling preserves real generic-component positives plus
explicit frozen-public-profile exclusions. Two-authority and one-character constraints
were not widened to manufacture a requested witness. Equal-value Set remains valid
ordinary WRT; ADAPT's target/diff contract owns its stronger rejection. The independent
pre-snapshot RuleId/StatePath oracle strengthens the earlier staged-swap control in a
finite scope. Zero-count exposure has one dispatch and four evaluations,five outputs;
it does not evaluate five rules. One focused rerun with three skipped tests is not a
whole-file rerun. Historical mutation revisions retain their own source commitments.

The later composition review and bounded factory acceptance do not imply full
cognitive topology,universal malformed-input coverage or whole Campaign2 completion.
No old writer,runtime,test,mutant or build rerun. No model,law,allocation,verdict,
corpus or obligation status changed. SourceREV203:10,794 assigned/579 unassigned;
184,619 narrative/211,656 backing;1,192 indexed archives. No source gap closed.

Existing composition,Values,cognitive,exit-inventory and scheduler identity gaps,
formula provenance,legacy log,remaining support,post-cutoff joins and independent
adequacy remain open. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;
108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adaptation-packaging-rev1','campaign3-history-source-roles-rev203'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:6 ADAPT packaging/write-scope documents reconciled.
Start CAMPAIGN3_HISTORY_ADAPTATION_PACKAGING_CHECKPOINT.md.
172 exact narrative occurrences;static/REG validity and write failure order preserved.
Accepted generic-positive/profile-exclusion split;independent finite association oracle.
SourceREV203:10794 assigned/579 unassigned;184619 narrative/211656 backing;
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
