from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev258/check.json');assert c['assignedSources']==11148
cp=P/'CAMPAIGN3_HISTORY_ATTENTION_ROUTING_DISCIPLINE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical attention routing and discipline — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Four sources preserve137 exact original narrative occurrences. The first recorder
rejected an existing checkpoint filename before any write; its source/finding are
preserved and this distinct checkpoint leaves the existing document untouched. The September13 pause
was resumed; the later completion annotation supersedes the old GA entry point and
unfinished work-order steps. No old allocation writer or completed owner ruling needs
reopening.705/706 remain additive corrections, never aliases for704.

The resume brief's claimed ledger additions require the final qualification's explicit
September20 correction: three entries said to be recorded were actually absent and
were then added. Corpus membership declares an obligation, not its satisfaction.
The80/58 local work calculation omitted inherited stages and slots; its first graph
also omitted conditional edges. Final whole-model accounting remains separate.

Checkpoint discipline remains active. Revisions must add material evidence rather than
repeat derived crosswalk review. This audit's new source dispositions change coverage;
unchanged index assignments are generated and preservation-checked, not newly credited
scientific findings. Source counts and zero unowned obligations cannot establish final
adequacy. Revision review is a local process check, not an automatic owner escalation.

Preserve both program counters, ordinal reservation discipline, Stage C competitors,
mutation-versus-necessity distinction, and a bounded North-Star transfer argument.
The concern seam's existence is qualified without selecting its modulation law or
making TaskConcern the general Affect representation. Broader law questions remain.

Source REV258:11,148 assigned /225 unassigned;192,548 narrative /212,202 backing;
1,292 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Formula provenance,
legacy log, post-cutoff joins and independent adequacy remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-attention-routing-discipline-rev1','campaign3-history-attention-routing-discipline-development-rev1','campaign3-history-source-roles-rev258'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: historical attention routing and active discipline reconciled.
Start CAMPAIGN3_HISTORY_ATTENTION_ROUTING_DISCIPLINE_CHECKPOINT.md.
Four sources;137 original narrative occurrences. Old pause/work order superseded;
ledger correction, source adequacy and revision discipline remain explicit.
Source REV258:11148 assigned /225 unassigned;192548 narrative /212202 backing;
1292 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
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
