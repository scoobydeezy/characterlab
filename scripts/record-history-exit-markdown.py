from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-markdown-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['lines']==1295
cp=P/'CAMPAIGN3_HISTORY_EXIT_MARKDOWN_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Shared historical exit-audit report reconciliation — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

Reviewed the complete1,295-line CAMPAIGN3_EXIT_AUDIT_2026_09_21.md, preserving all190
original paragraph occurrence IDs/texts and its frozen source hash.102 contiguous
semantic sections distinguish original scope, dated coverage, findings/owners,
reduction assumptions, North-Star transfer, work order and appended checkpoints.
SourceREV172 adds exactly this one scoped historical narrative role;111 JSON audits
remain separate pending source/inventory adequacy. No original report was rewritten.

The reduction register keeps its actual assumptions: direct zero-hop counted once;
independent retained targets and graph; orphan removal only at exact zero incoming/
outgoing weights without payload after the owner batch; graph/episode coupled loss
not equivalent; equal winners not equal laws. WORK/HABIT/REL cache derivations retain
full journals. LONG equivalence is fixed-query/horizon despite different accessible
detail. One destructive shared-slot control does not prohibit all physical sharing.
None of these labels authorizes erasing semantic ownership or choosing final laws.

All appended closures retain public/component scope, failures, duplicate run and
stochastic equality accounting. Focused native implementation and68 internal defining
programs are not the full public matrix. Component development, primary native
correspondence and full admission remain separate. Historical running sessions are
not current process handles; later finished-job text supersedes those routes.

Two wording distinctions are explicit: original line727 calls RO021 ACTIVE, while
line738 corrects it to canonical CONDITIONAL; the final gate remains mandatory and
unsatisfied throughout. The final heading's regulatory reduction QUALIFIED refers
to the comparison rejecting body-only reduction, not acceptance of that reduction.
ScalarThreat and ScalarUncontrolled successes remain. The report's early updates jump
from REV5 to REV20; it is a selective historical narrative, not an exhaustive revision
log. All111 JSON snapshots preserve their independent identities and chain.

SourceREV172:10,108 assigned/1,265 unassigned;22,704 original narrative and184,919
backing occurrences;920 outside-census artifacts. The new role preserves dated claims,
not a fresh experiment or final scientific adequacy judgment. Previous181 rationale
texts/18,648 occurrences,42,957 authority quotes and110 predecessor summaries remain
bound without reinterpretation as extra executions.

Next reconcile historical audit inventory identities and remaining21 support-source
roles, then complete audit JSON source classification and independent adequacy.
Formula historical identity, missing legacy log, Values90/15 and prior exclusions stay
open. No simulation, runtime tests/build, law, verdict, corpus freshness or obligation
closure. Research bookkeeping checks are separate. HQ012 unstarted; Campaign3 NOT
EXIT-READY.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21;1519/0.
RO019 ACTIVE;RO021 mandatory and UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[x.as_posix() for x in sorted((P/'campaign3-history-source-roles-rev172').glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:shared exit-audit Markdown source reconciled.
Start CAMPAIGN3_HISTORY_EXIT_MARKDOWN_CHECKPOINT.md.
1295 lines/190 original paragraphs/102 scoped sections;one source added inREV172.
Preserve cache/graph assumptions,RO021 status correction and regulatory comparison scope.
Next audit inventory identities,21 supporting sources and111 JSON source classification.
SourceREV172:10108 assigned/1265 unassigned;22704 narrative/184919 backing;
920 artifacts. Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
Independent adequacy/HQ012 unstarted. Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
