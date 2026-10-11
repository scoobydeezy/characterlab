"""Register independent original-occurrence coverage without a scientific promotion."""
from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-global-occurrence-links-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(O/'check.json');assert c['omitted']==0 and c['originalOccurrences']==413894
cp=P/'CAMPAIGN3_HISTORY_GLOBAL_OCCURRENCE_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Independent global occurrence join — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues toward its acceptance decision. Counters1519 /0.**

The original413,894 occurrence IDs now have one independently reconstructed exact
join to the bound content-review graph:360,238 individual review objects and53,656
members of the explicitly reviewed receiver-schema backing set. These two sets
are disjoint and their union equals the original inventory exactly. Zero omissions,
zero duplicate original IDs. All1,432 traversed review JSON identities were checked.
Seventeen bounded shards retain original IDs, report indices, exact JSON pointers
and identity fields; no text is copied into a giant artifact. Every shard is below50MB.

The first read-only diagnostic searched only individual object ID fields. Its
53,656 unmatched IDs were the existing receiver-schema list, not unreviewed sources
or newly missing findings. The final join explicitly validates that typed list,
its whole-source schema dispositions and membership in the reviewed receiver sources.
No original selector, role, source, review, counterexample or result was changed.

This closes the aggregate original-ID linkage question; it does not manufacture
scientific acceptance from ID presence. Existing source-specific content judgments,
authority chains, reduction horizons and material obligations remain necessary.
Repeated review quotations contribute links, not independent experiments. Original
source-role totals remain11,373 sources /413,894 occurrences /2,825 outside resources.

The owner-directed legacy-log disposition remains controlling: reference/RESEARCH.md
is the retained successor, and recovering the missing legacy log is not a gate.
All339 of its occurrences remain covered. Named formula/Values additions and the
formula provenance erratum are separately joined; they are not added to the original
denominator.208 other historical source identities retain their scoped claim limits,
including the corrected74 exit-inventory subset. Missing obsolete bytes alone do
not imply an unaccounted material finding or require another owner stop.

Next: finish the canonical-universe and scientific acceptance disposition using these
explicit links and existing content reviews, preserve all conditional material debt,
and hand off to HQ-012 only for its separate freshness/corpus/family/native gates.
No runtime, historical writer, build, scientific verdict, law, allocation or corpus
change. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. Campaign3 NOT EXIT-READY. Global join checker PASS.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';reg=load(rp);obs=['RO-C3-019','RO-C3-020','RO-C3-021']
existing={x['path'] for x in reg['reportReviews']}
paths=[p.as_posix() for p in sorted(O.glob('*.json'))]+[cp.as_posix()]
for path in paths:
    assert path not in existing
    reg['reportReviews'].append(dict(path=path,obligations=obs))
    for ob in reg['obligations']:
        if ob['id'] in obs:ob['evidence'].append(path)
rp.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011: independent global original-occurrence join PASS.
Start CAMPAIGN3_HISTORY_GLOBAL_OCCURRENCE_CHECKPOINT.md.
413894 exact IDs:360238 individual objects +53656 typed receiver-schema members;
disjoint complete union,0 omissions/duplicates;1432 bound JSON reviews /17 shards.
Legacy log is not a gate per owner; reference/RESEARCH.md successor339 units covered.
208 historical targets retain scoped claim limits,74 exit-inventory versions.
Next scientific/canonical acceptance decision, then HQ-012 separate acceptance gates.
REV315 unchanged:11373 roles /413894 original occurrences /2825 backing resources.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(reg['reportReviews']),added=len(paths))))
