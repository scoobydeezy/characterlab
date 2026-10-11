from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev213/check.json');assert c['assignedSources']==10858
cp=P/'CAMPAIGN3_HISTORY_DECLARATION_DEPENDENCIES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Declaration and dependency receipt reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Four original/refreshed receipts reconciled:12 original narrative/60 backing
occurrences and5,306 complete JSON string leaves. Eight exact source/harness bindings
resolve,using the already recovered original validator where needed. No new source gap.

The declaration baseline has359 distinct cases:336 context/role/position/wrapper
combinations,two shared/duplicate controls and21 runtime record-role controls. Complete
name matrices and exact agreement rows check out. Eleven mutations retain discrepancy
counts42/42/42/21/21/21/1/66/2/2/4. Those overlapping sets are not additive independent
behavior coverage. Typed-identifier payloads remain opaque to declaration traversal;
map keys,values,list/set and record fields have separate obligations. Expected labels
come from corpus construction,not a second general declaration compiler. Historical
wrong-schema/wrapper and orphan-validator setup failures remain distinct from success.

The dependency baseline accepts all20 present/absent cases without ambient reads.
Each of ten added-dependency mutations rejects only its named absent case;the other
19 still admit. All20 disagree with the baseline because each performs a forbidden
proxy read. Accept/reject equality alone would miss those accepting dependencies.
These Boolean stand-ins are test instrumentation,not biological,recognition,roster
or stochastic semantics. They qualify named dependencies for one fixed character,
not universal host isolation. Harness cleanup restores the prior ambient property.

Original and refreshed payloads match except validator source commitments. The new
checks inspect recorded rows and complete case-name matrices;no historical writer,
production,mutant,test or build was rerun. Missing historical sources elsewhere are
not repaired by these exact matches or by later prose acceptance.

SourceREV213:10,858 assigned/515 unassigned;186,686 narrative/211,817 backing;
1,196 indexed archives. Prior source-gap inventories,formula provenance,legacy log,
remaining support,post-cutoff joins and independent adequacy remain open. No model,
law,allocation,verdict,corpus or obligation status changed. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-declaration-dependencies-rev1','campaign3-history-source-roles-rev213'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:four declaration/dependency receipts reconciled.
Start CAMPAIGN3_HISTORY_DECLARATION_DEPENDENCIES_CHECKPOINT.md.
12 narrative/60 backing;5306 strings;eight exact source/harness bindings.
359 declaration matrix and20 ambient cases checked;accepting forbidden reads preserved.
SourceREV213:10858 assigned/515 unassigned;186686 narrative/211817 backing;
1196 archives. Values post-cutoff reviews retain separate denominators.
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
