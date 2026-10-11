"""Record complete source roles and refreshed gaps without promoting HQ-011."""
from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
dirs=[P/'campaign3-history-chronology-consolidated-rev1',P/'campaign3-history-source-roles-rev314',P/'campaign3-history-gap-census-recovery-rev2',P/'campaign3-history-gap-workspace-recovery-rev2']
assert load(dirs[0]/'check.json')['reviewedOccurrences']==1496
assert load(dirs[1]/'check.json')['assignedSources']==11373
assert load(dirs[2]/'check.json')['unresolvedPairs']==229
assert load(dirs[3]/'check.json')['recoveredPairs']==0
cp=P/'CAMPAIGN3_HISTORY_CHRONOLOGY_CONSOLIDATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Complete frozen source roles and refreshed historical gaps — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no owner ruling. Counters1519 /0.**

Source-role REV314 assigns all11,373 frozen census sources, with zero unassigned.
All11,372 preceding assignments and2,804 outside-census backing resources are unchanged.
The final source is the frozen historical log:47 content reviews preserve all1,496
exact original occurrence IDs, texts, source hashes and locations, with no omissions
or duplicates.194 material-distinction entries retain owners, blocked claims and
reopen conditions. Repeated checkpoints are not independent experiments; dated
routing does not override current authority. The mutable later log is outside this
assignment. Original occurrence accounting is201,195 narrative/finding plus212,699
backing fields, totaling413,894. These are classified units, not413,894 experiments
or material findings. Scientific adequacy is still open.

The consolidation validates7,427 cited bindings. Its first invocation assumed every
batch had a separate findings.json and stopped with FileNotFoundError before writing
outputs. The first tail batch actually stores its three findings under materialFindings
and its dispositions on each row. The corrected checker binds those exact embedded
pointers; it does not fabricate a missing report or modify the original batch.

Gap recovery REV2 expands the earlier33-report search to63 explicit unresolved-source
reports, preserving every earlier occurrence ID.338 target occurrences identify234
distinct path/hash pairs. Five exact copies are available, including the later-bound
biological public closure checker;229 pairs remain unresolved in the declared search.
The earlier204-pair inventory remains intact. The larger unresolved count reflects
expanded coverage, not evidence newly lost. A205-file same-basename workspace search,
including raw/LF/CRLF hash variants, recovered no additional target. Current named
paths, census mirrors and the complete backing index were checked. This pass does
not repeat Git, sister-repository or arbitrary renamed-file searches and makes no
global absence claim. Missing references without a target hash remain separately
owned. Exact recovery proves bytes, not original execution or broader qualification.

RO-C3-010 preserves epistemic/learning limits; RO-C3-019 current bounded coverage;
RO-C3-020 historical distinctions; RO-C3-021 history/source adequacy. The229 targets
retain original dependent-claim dispositions and review pointers. They may constrain
historical reproducibility without invalidating separately supported later evidence;
no blanket adequacy judgment or waiver is made here.

Next: consolidate dependent-claim consequences and no-hash source gaps, explicitly
join post-cutoff formula/Values/verdict additions, then independently assess universe
and scientific adequacy. HQ-012 remains unstarted. Campaign3 NOT EXIT-READY.
No historical runtime writer or behavioral suite was rerun. No law selected,
comparator retired, allocation, verdict or corpus promotion.108 verdicts;132 bounded
clauses;55 producers/58 factories;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;
RO022 CLOSED. Validation receipts are reported after executing the required checks.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';r=load(rp)
obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021']
existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in dirs for p in sorted(d.glob('*.json'))]+[cp.as_posix()]
for path in paths:
    assert path not in existing
    r['reportReviews'].append(dict(path=path,obligations=obs))
    for o in r['obligations']:
        if o['id'] in obs:o['evidence'].append(path)
rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: frozen census source-role assignment complete.
Start CAMPAIGN3_HISTORY_CHRONOLOGY_CONSOLIDATION_CHECKPOINT.md.
REV314:11373 assigned /0 unassigned;201195 narrative /212699 backing;2804 resources.
Chronology47 reviews /1496 exact occurrences /194 distinction entries; no omissions.
Refreshed63 gap reports:338 occurrences /234 targets;5 exact copies /229 unresolved.
205-file workspace search found no further match; dependent-claim limits preserved.
Next gap consequences/no-hash gaps, post-cutoff joins and independent adequacy.
HQ-012 unstarted; source roles do not prove scientific adequacy. Campaign3 NOT EXIT-READY.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. No owner ruling; no runtime suite rerun.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),assignedSources=11373)))
