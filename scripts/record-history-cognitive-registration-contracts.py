from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev181/check.json');assert c['assignedSources']==10330
cp=P/'CAMPAIGN3_HISTORY_COGNITIVE_REGISTRATION_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical cognitive registration contracts — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS. Counters **1519 /0**.

Twelve registration/output/ownership/role/refinement/version documents reconciled,
with242 original narrative occurrences preserving exact text, locations and hashes.
All31 components referenced by TASK_COGNITIVE_SHAPE_MANIFEST now have explicit reviewed
source roles and match the manifest's exact hashes. This closes that prose bundle's
source-role accounting, not the pending machine-readable inventories or HQ011 adequacy.

Preserve scalar namespace roles versus collection and contextual predicates versus
live source authentication. A complete declared producer graph and private generated
parent binding are both required; a well-shaped copied record is not an admitted
source. The successor compiler derives private routing metadata from commitments
without widening predecessor factories or inventing controller transition kinds.

Workspace, selected plan and raw identity each own their reads. Appraisal/concern
receive restricted immutable operands, execution alone receives permission, and
identity applies through its separate prepared140 owner. Rejected identity still
executes with no target/prior/patch; no I-only public instant follows from the pure
component. Learning, automatic adaptation and prospective lifecycle remain separate
routes. Occurrence identities belong solely to the actual semantic outputs; inline
records, draws and the private200 truth view receive no shadow identities.

Exact disjoint absence/result unions, selected action preservation, qualification
priority and NotRepresented cost/fear remain explicit. Conditionality belongs to
child production, preserving exactly-one output per executed producer. The resolution
instant was added and copied standing-history diagnostic removed before allocation.
The initial fixed-member inventory's missing physical plan leaf was later corrected
separately; this review does not pretend the earlier inventory already contained it.
Three wrong draft namespace labels were corrected before any production allocation.

Protocol observation owns its separate receiving version: completed0/1 are points,
completed2 is a lower bound. Source knowledge cannot sharpen that observation. Exact
fields1..9 are preserved while the truth reference is removed, without publishing
another observation. Suppression creates no observation, reservation, EVID or padding,
while actual zero-count/positive-count ADAPT proceeds independently. Earlier pending
padding language is superseded by the later explicit bridge/work contract.

The refinement document's long proposed-fault list remains intact. Existing grouped
public/component/exclusion qualification and newer appraisal checks are scoped
acceptance evidence, not a claim of one independently executed mutant for every
proposed branch. Public single-source task scope cannot manufacture general weighted
coverage or Avoid witnesses; those remain component controls. No old receipt, model,
production source or mathematical law changed. Prior focused source/test hashes were
reverified unchanged; no runtime suite or build rerun for this bookkeeping pass.

SourceREV181:10,330 assigned/1,043 unassigned;130,806 narrative/211,150 backing;
1,190 indexed archives.80 exit-inventory identities plus one older scheduler identity
remain unresolved. Next shape/symbolic/grammar/role audit artifacts and their rejected
predecessors, followed by remaining planning sources and independent adequacy.
Formula provenance, legacy log, Values90/15 remain open. HQ012 unstarted;
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;55/58 wrappers;
corpus0.29.0/21. RO019 ACTIVE;RO021 mandatory UNSATISFIED;RO022 CLOSED.
No verdict/corpus promotion, obligation closure or owner ruling.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-cognitive-registration-contracts-rev1','campaign3-history-source-roles-rev181'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:twelve cognitive registration/output contracts reconciled.
Start CAMPAIGN3_HISTORY_COGNITIVE_REGISTRATION_CONTRACTS_CHECKPOINT.md.
242 original narrative occurrences;all31 shape-manifest components now reviewed
with exact hashes. Mechanical inventories and whole-universe adequacy remain OPEN.
Source/authenticity,typed roles,conditional children,ownership and censored observer
cut preserved. No fresh runtime execution or production/new-verdict change.
SourceREV181:10330 assigned/1043 unassigned;130806 narrative/211150 backing;
1190 archives.80 exit-inventory gaps plus one scheduler identity OPEN.
Next shape/symbolic/grammar/role audits and predecessor corrections.
Formula provenance,legacy log,Values90/15 and independent adequacy OPEN.
HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;
132 bounded;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
