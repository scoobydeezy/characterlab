from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev209/check.json');assert c['assignedSources']==10842
cp=P/'CAMPAIGN3_HISTORY_ADAPT_PARENT_PAIR_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical parent-pair and corpus promotion reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Six parent-pair,fixture-alignment and corpus-promotion sources reconciled:109 original
narrative occurrences and169 complete JSON string leaves. A new read-only checker
verifies stored canonical evidence;it never invokes the historical report writer.

Two same-S0 count0/1 histories have identical21-event topology and allocator bytes.
Normalizing only authored count reproduces the complete original input sequence.
Count0 retains absent body baselines;count1 has exactly four body leaves at1. The
stored D diff matches the later probe read. Formation adds one episode without
changing earlier leaves;the nested observation/carriage/M1/episode chain carries
measurement5 versus51/10,and352 returns that episode. Exposure and probe are separate
scheduler roots. State write/read dependence joins them;recall is a carriage child,
not a formation child. No invented parent edge or character truth access is implied.

The original52 check labels include repeated allocator assertions. Full traces,
random addresses and saves are not stored in this report. Hidden-interval equality,
no random draws and original-S0 replay remain original accepted harness evidence;
they are not freshly proven by this stored-data check. Reading today's helper does
not establish its original full executable identity. These limits remain explicit.

The accepted fixture amendment corrects the historical one-rule restriction forward
for four independent single-path rules. Expected changed paths are independently
specified;control3's leaf-family complement is non-discriminating,so exact-path/key,
WRT and collision controls retain isolation. Concrete model freeze did not override
fixture authority. Pending acceptance/version-choice prose is superseded by explicit
forward approvals;it is not a current architectural blocker.

All three ten-member historical manifests reproduce exact bytes and digests:1.10draft,
1.11draft and accepted1.11. Removing the member-version suffix changes174field2 and
the digest;aggregate corpus version is an external label. Draft and accepted commits
are not aliases. Both historical artifact hashes in the promotion receipt match.
Historical accepted corpus0.27 is not today's0.29;no current promotion occurred.

SourceREV209:10,842 assigned/531 unassigned;186,288 narrative/211,691 backing;
1,193 indexed archives. All prior source-gap inventories remain open. Formula
provenance,legacy log,remaining support,post-cutoff joins and independent adequacy
remain open. No runtime,test,build,model,law,allocation,verdict,corpus or obligation
status changed. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;
132 bounded;55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;
RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-adapt-parent-pair-rev1','campaign3-history-source-roles-rev209'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:six parent-pair/fixture/promotion sources reconciled.
Start CAMPAIGN3_HISTORY_ADAPT_PARENT_PAIR_CHECKPOINT.md.
109 narrative;169 strings;two stored timelines and three exact manifests checked.
State dependence differs from scheduler parentage;full historical replay not rerun.
SourceREV209:10842 assigned/531 unassigned;186288 narrative/211691 backing;
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
