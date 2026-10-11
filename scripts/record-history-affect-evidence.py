from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev200/check.json');assert c['assignedSources']==10756
cp=P/'CAMPAIGN3_HISTORY_AFFECT_EVIDENCE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# AFFECT historical evidence reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Twelve AFFECT plan/result/closure sources reconciled:40 original narrative and6
backing occurrences,54,024 complete JSON string leaves.123 exact model-file,source,
predecessor,test-receipt and plan bindings pass. No new source gap identified.
The four original part files exactly concatenate to the91-run aggregate, including
its original modulo-four partition order.91 distinct RunIdentity values remain;
all18 models and90 frozen model files are accounted for.

Read-only reexecution of the original summarizer reproduces the entire historical
aggregate and all eleven claim checks. This is not a new scheduler run or restored
prefix. The1236 original save/next-step checks include91 terminal checks and1145
advancing steps. Four supplementary paired contrasts account for eight executions;
six interior-feedback executions test all three candidates away from saturation.
Their14 executions are not added to the91 main runs or1236 prefix checks.

Independent exact rational arithmetic reproduces81 cells/243 candidate evaluations
and the recorded scalar collision. Unknown control remains unavailable. Each interior
candidate has a recorded1/2 baseline and5/8 later response, with prior13 consumed at14;
this does not prove a universal feedback law or scalar/split psychological equivalence.
Seven timing-pair sides reuse exact main-plan rows; the eighth is the explicitly
modified relief-context-held input, not a falsely identical original.

The fixed-truth/display intervention, hidden-world safe-output/state equality,
unknown/zero/catalogue distinctions and rejected Fear-as-command/extra-die/relief-as-
evidence oracles retain their original scope. Two of eight matched competing-goal
seed pairs change sampled choices; all six equal pairs remain.82 affected and328
reference test counts are bound historical receipts, not fresh tests or a full active
suite. Candidate laws are retained; none is selected as psychologically final.

Preserved audit development finding: the first Python independent arithmetic checker
used an invented ScalarBalanced key instead of the recorded HistoricalProduct key.
It failed map equality before publishing review output. Exact rejected checker and
failure receipt are retained; only the checker label was corrected. Formula and
original experimental records were unchanged. This is not a production failure.

SourceREV200:10,756 assigned/617 unassigned;184,145 narrative/211,645 backing;
1,192 indexed archives. Existing two composition,two Values,seven cognitive,80
exit-inventory and one scheduler identity groups remain open. Formula provenance,
legacy log,remaining material support,post-cutoff joins and independent adequacy
remain owed. HQ012 unstarted;Campaign3 NOT EXIT-READY.

No runtime,test,mutant,build,model,law,allocation,verdict,corpus or obligation status
changed.1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-011','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-affect-evidence-rev1','campaign3-history-source-roles-rev200'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:12 AFFECT evidence sources reconciled.
Start CAMPAIGN3_HISTORY_AFFECT_EVIDENCE_CHECKPOINT.md.
40 narrative/6 backing;54024 strings;91 main runs/four parts/123 exact bindings.
1236 checks include91 terminal;14 supplementary executions separate;failed checker retained.
SourceREV200:10756 assigned/617 unassigned;184145 narrative/211645 backing;
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
