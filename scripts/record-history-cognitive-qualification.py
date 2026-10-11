from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev176/check.json');assert c['assignedSources']==10249
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_QUALIFICATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical Campaign2 cognitive qualification — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Reconciled the three remaining exit-rationale support documents: cognitive
qualification, RNG persistence qualification and Campaign2 completion. All21 named
support paths now have explicit source roles. Eight supporting evidence indexes/
receipts were also reviewed. This completes that dependency list, not HQ011's universe.

The11 sources add71 original narrative and316 backing occurrences; all3,729 JSON
string leaves are schema-accounted including short status/source/test fields.
All1,220 historical fingerprint references resolve exactly.57 references across
nine changed live source paths bind previously preserved historical bytes;1,163
match current exact bytes. No old fingerprint was relaxed or source overwritten.
The18 predecessor receipt links retain their historical-versus-refreshed scope.

Fresh current verification is separately recorded:

- All21 frozen public recipes execute and reproduce every original reported result
  row and final save digest, including actual modes, counts, draws and identity.
-270 dice comparisons (140 active),11 ordered identity histories and12 aggregate
  coverage comparisons pass against historical mathematical implementations.
- Seven focused cognitive test files pass76 tests, including genuine prefix restore,
  trace/provenance controls and rollback. Source fingerprints remain unchanged.

The current public row/digest comparison is not a replacement for exact canonical
continuation checks; focused factory/history tests exercise those separately.
No fresh17-mutant matrix,64/65 boundary run,18 predecessor assays, historical1063/328
full suites or build is claimed. Their exact recorded evidence remains historical.
Two concurrent Vite arithmetic runners printed a WebSocket port-in-use warning,
then completed with exit0 and successful assertion receipts; no restart or failed
mathematical assertion was hidden. All processes are terminal.

Preserve public/component/exclusion distinctions; finite source substitutions are
not universal psychological necessity. Empty evidence bases in dice parity do not
prove aggregate coverage. Unknown differs from known zero; availability differs
from motivation; standing cannot author its own meaning; expression precedes physical
success. Exact provenance/history is not replaceable by equal counters. Preserve
missing-I-before-priors repair, successor307 codec/route correction, nondiscriminating
wrong-field save attempt and assay-anchor failures. Final118/1063 and43/328 counts
remain historical; no broader corpus or psychological sufficiency follows.

PERSIST-I successor RNG replay and the original cross-build absent-consumer gate are
distinct. The later campaign3-history-persist-i-rev1/proof.json supplies the latter
in bounded isolated module-graph scope; neither old receipt is rewritten as having
run it. Same seed is not cross-model address coupling; full-prefix replay is not
scalable checkpointing or antirollback security. Campaign2 completed the thin used
scaffold, not all ideal feedback or Campaign3. UI remains owner-deferred except
testing/validation needs. Later Campaign3 verdicts supersede only named old gaps.

SourceREV176:10,249 assigned/1,124 unassigned;129,742 narrative/208,982 backing;
1,185 indexed outside-census artifacts.740/820 inventory identities recovered;
80 explicitly unresolved historical identities remain. Formula historical identity,
legacy log, Values90/15 and prior exclusions remain open. Next remaining source
contracts, predecessor receipts and historical planning roles, then independent
adequacy. HQ012 unstarted; Campaign3 NOT EXIT-READY.

No production change, new verdict, law selection, corpus promotion or obligation
closure.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 CONDITIONAL but mandatory and UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
dirs=['campaign3-history-cognitive-qualification-rev1','campaign3-history-source-roles-rev176']
paths=[p.as_posix() for d in dirs for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:C2 cognitive qualifications and eight receipts reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_QUALIFICATION_CHECKPOINT.md.
All21 exit-rationale support paths assigned;1220 exact fingerprint bindings,
including57 references to nine preserved historical source identities.
Fresh21 public rows/digests match;270 dice/11 histories/12 coverage/76 tests pass.
SourceREV176:10249 assigned/1124 unassigned;129742 narrative/208982 backing;
1185 indexed archives.740/820 inventory identities recovered;80 identities OPEN.
Next remaining contracts/predecessor/planning roles,then independent adequacy.
Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
