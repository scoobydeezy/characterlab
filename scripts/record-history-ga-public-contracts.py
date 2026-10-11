from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev188/check.json');assert c['assignedSources']==10387
cp=P/'CAMPAIGN3_HISTORY_GA_PUBLIC_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# General Attention public contract reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Twelve GA body-production, recall, codec, primitive, trace, persistence and acceptance
contracts reconciled:69 original narrative occurrences. Six acceptance manifests and
40 referenced source bindings match exact bytes. Historical16/8/7 numeric and14 output
fault receipts retain their original scope; no old writer or fault suite was rerun.
Output reviewREV2 actually binds declarationsREV3, so those revision numbers are distinct.

Symbolic carrier/member shape, permanent numeric/member allocation, codec, exact model
compilation and public evidence/ownership/rollback remain separate gates.163 layouts,
523fields,165role positions and218members do not themselves authenticate a source.
The write-scope correction appends705/706 with a closed322/705union; frozen704 remains
322-only. No old model gains perception,goal,physical or protocol permission by alias.

Body serialization preserves actual selection/acquisition identities and one-use
capabilities; no groups means no acquisition. Recall projection validates the whole
ledger before partitioning and erases use/significance metadata without reconstructing
lost children. Generic Rational is not narrowed by maintenance field bounds; lattice
scale and version context come from admitted definitions, not the checked value.

Trace source-occurrence indexes are diagnostic, not character evidence. Terminal owner
groups prepare from oneB0; earliest owner event carries combined reads/patch/diffs,
other contributions retain ancestry with empty patches. Formation-governance protocol
changes remain separate InvariantResults, never cognitive patches or recollection.

Save132 restoration reconstructs exact RunIdentity from S0/original calendar/seed,
reexecutes the original complete prefix and compares the entire save. It returns that
live reconstructed runtime, recreating pending authentication through actual producers.
State/clock/count equality alone is insufficient. Empty random-ID/continuing-input
fields belong to this deterministic closed profile, not arbitrary future consumers.

SourceREV188:10,387 assigned/986 unassigned;131,577 narrative/211,258 backing;
1,192 indexed archives. Values post-cutoff reviews remain separate denominators.
Two Values/seven cognitive/80 exit-inventory/one scheduler source identities,formula
provenance,legacy log,remaining material support and independent adequacy remain open.
HQ012 unstarted;Campaign3 NOT EXIT-READY. No runtime/build/model/law/allocation/verdict/
corpus/obligation change.1519/0;108 verdicts;132 bounded;55/58 wrappers;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-ga-public-contracts-rev1','campaign3-history-source-roles-rev188'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:twelve GA public/acceptance contracts reconciled.
Start CAMPAIGN3_HISTORY_GA_PUBLIC_CONTRACTS_CHECKPOINT.md.
69 original narrative occurrences;six manifests/40 source bindings exact.
Shape/numeric/member/compiler/public gates remain distinct;704 is not706 alias.
Preserve recall erasure,commonB0 trace ownership and complete-save prefix reconstruction.
SourceREV188:10387 assigned/986 unassigned;131577 narrative/211258 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
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
