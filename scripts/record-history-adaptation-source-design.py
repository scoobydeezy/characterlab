from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev202/check.json');assert c['assignedSources']==10788
cp=P/'CAMPAIGN3_HISTORY_ADAPTATION_SOURCE_DESIGN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Adaptation source and bridge history — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Six ADAPT source/rule/bridge documents reconciled with202 exact original narrative
occurrences. They cover authored actual-fact admission, the fixed consequence bridge,
the closed rule interpreter, the observation-provenance decision and two incremental
implementation checkpoints. Larger consolidation and packaging documents retain their
separate review work; no broad ADAPT-document closure is inferred.

Authored contact/repetition counts are actual-fact controls, not attempts, perceived
success, dose or general biology. InputOnly provenance requires actual compiler-owned
origination; merely hashing original inputs into RunIdentity is insufficient. Exact
pending-source validation at save boundary replaces an earlier history-replay proposal
for that bounded profile; it does not authenticate arbitrary historical state.

Rule applicability is independent of count and state. Zero-count and false-gate rules
still produce evaluations and declared reads, and no-op targets still participate in
collision rejection. Every rule reads its own immutable projection of common B0, with
exact target/gate order and trace segments. CountStepWithBaselineGate is a thin integer
fixture, with no clamping, decay or general skill/physiology claim. Returning to zero
removes a present leaf; absence and invalid explicit stored zero remain distinct.

The consequence bridge exposes a fixed lab-intervention pulse, not the hidden contact
count. Both branches have the same actual root while cognitive evidence carries no
truth/source handle. The real old observation compiler returned a truth reference,
contradicting the proposed safe bridge output. Its passing mismatch reproduction was
not bridge success. The accepted fix preserves fields1..9 and measurement mathematics,
clears references and uses a scoped version. Only that projected observation is staged
or cited under the one allocated ObservationId; raw candidate remains private.

Historical373-test source/adaptation-only and375-test bridge checkpoints retain their
scope. Shape acceptance and listed adversarial vectors are not passed implementation
gates. Component composition does not imply integrated public factory/restore, full
mutation coverage or whole PHEN-ADAPT qualification. The later permanent unit1039
continuation closes the named vocabulary gap without rewriting older generic controls.

No runtime,test,mutant,build or old writer rerun. No model,law,allocation,verdict,
corpus or obligation status change. SourceREV202:10,788 assigned/585 unassigned;
184,447 narrative/211,656 backing;1,192 indexed archives. No source gap closed.
Existing composition,Values,cognitive,exit-inventory and scheduler identity gaps,
formula provenance,legacy log,remaining material support,post-cutoff joins and
independent adequacy remain open. HQ012 unstarted;Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adaptation-source-design-rev1','campaign3-history-source-roles-rev202'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:6 ADAPT source/rule/bridge documents reconciled.
Start CAMPAIGN3_HISTORY_ADAPTATION_SOURCE_DESIGN_CHECKPOINT.md.
202 exact narrative occurrences;authored counts and thin integer law remain controls.
Preserve truth-reference mismatch and sole safe observation;component proof scope separate.
SourceREV202:10788 assigned/585 unassigned;184447 narrative/211656 backing;
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
