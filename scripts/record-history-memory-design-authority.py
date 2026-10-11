from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev195/check.json');assert c['assignedSources']==10477
cp=P/'CAMPAIGN3_HISTORY_MEMORY_DESIGN_AUTHORITY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Memory design and identity/history authority reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Eighteen declaration, review, carrier and acquisition identity/history sources
reconciled with235 exact original narrative occurrences. This records historical
scope and accepted supersession; no runtime, test, mutant, build or old writer ran.

The phase140 barrier could not execute the original form->associate->presentation
child chain. The corrected design has retention emit three terminal siblings sharing
one authenticated parent and common B0. Disjoint own-leaf candidates are composed
and checked before atomic publication. Their causal traces intentionally differ from
the old proposal. Four scheduler fixtures demonstrate that graph and rollback scope,
not public PRJ, canonical owner patches or authenticated memory input.

The positive-content correction prevents a full selected envelope from smuggling
zero-strength or unavailable units into later recall. Evaluation stays trace-side;
retained children keep only their exact positive evidence closure. Retired-flat's
known-input behavior does not turn an unavailable operand into evidence. Later
survivor semantics separately reject the old shared-presence coupling: absent graph
or presentation history does not erase a surviving episode, and a graph-only key
does not create an episodic target. Historical4/12/5 bounds are not lifetime laws.

Acquisition identity B marks successful durable creation, distinct from selection
provenance even in a one-acquisition-per-source profile. Failed whole instants commit
neither acquisition nor candidate state. The source-addressed A comparator remains
coherent, and accepted measurement memory is unchanged. The common event/body header
unifies addressing without equating payloads or inventing redundant formation/group
identities. Body groups retain every admitted view; overflow cannot silently discard
contradiction. Immutable initial evidence does not imply a permanently readable
archive after current content loss.

Exact replay membership cannot be reconstructed from opaque maxima: formed-source
sets{2} and{1,2} share maximum2 but differ on source1. Accepted bounded history A
therefore requires successes<=distinct admitted source domain<=N. Successful payload-
free metadata survives final-child loss; absent success says nothing about failed
attempts. Save, continuation and pruning do not replenish the domain budget. N+1
rejects at an admission/lifetime boundary without cognitive loss. Finalization or
compaction needs an explicit successor and declared historical query guarantees.

The old draft's field/role/output/static corruption checks remain design evidence.
No fresh semantic occurrence follows merely from transporting an identity, and no
public authority follows from namespace membership or matching fields. Conditional
experience reservations, exact source/cue joins and per-writer projections remain
separate obligations. Per-kind complete-child loss and retained alternatives remain
bound to their later accepted rulings; no accessibility-to-importance reduction occurs.

SourceREV195:10,477 assigned/896 unassigned;132,367 narrative/211,269 backing;
1,192 indexed archives. No new provenance gap. Two composition,two Values,seven
cognitive,80 exit-inventory and one scheduler identity groups remain open, alongside
formula provenance,legacy log,remaining material support and independent adequacy.
HQ012 unstarted;Campaign3 NOT EXIT-READY. No model/law/allocation/verdict/corpus or
obligation status changed.1519/0;108 verdicts;132 bounded;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-005','RO-C3-006','RO-C3-007','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-memory-design-authority-rev1','campaign3-history-source-roles-rev195'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:18 memory design/identity/history sources reconciled.
Start CAMPAIGN3_HISTORY_MEMORY_DESIGN_AUTHORITY_CHECKPOINT.md.
235 narrative occurrences;terminal sibling/positive-only/independent-presence corrections.
Selection/acquisition/current content/replay history distinct;no high-water membership shortcut.
SourceREV195:10477 assigned/896 unassigned;132367 narrative/211269 backing;
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
