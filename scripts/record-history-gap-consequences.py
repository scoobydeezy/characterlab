"""Record claim-specific gap restrictions and the exact exit-subset correction."""
from pathlib import Path
import json
P=Path('docs/planning');dirs=[P/'campaign3-history-sister-object-recovery-rev1',P/'campaign3-history-gap-consequences-rev1']
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(dirs[0]/'check.json')['recoveredPairs']==0
assert load(dirs[1]/'check.json')['remainingExitPairs']==74
cp=P/'CAMPAIGN3_HISTORY_GAP_CONSEQUENCES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Missing-source claim consequences — 2026-10-11

**LOCAL DISPOSITION — HQ-011 continues; no architectural ruling. Counters1519 /0.**

All208 unresolved path/hash targets now have explicit dependent-claim restrictions
and original context links:74 exit-inventory narrative versions, five other
narrative/contract versions, two probe metadata versions,124 source/test versions
and three proof/declaration writers.299 original gap occurrences retain exact
report/pointer/entry identities. This is not a blanket exclusion or a claim that
missing contents contain no material findings.

Missing source bodies prevent source-exact reproduction/build attribution. Stored
reports remain dated evidence, while later passing code is not substituted for old
bytes. Probe canonical/readable model evidence remains independently scoped; it
does not authenticate old review metadata. Missing narrative versions additionally
prevent an unsupported claim that no findings were lost or retracted. Independent
adequacy still must assess which surviving direct evidence supports each conclusion.

CORRECTION: the preceding recovery/content checkpoints and content-check receipt
said73 of the original80 exit-inventory pairs remained. Exact path/hash intersection
shows six recoveries from that set, leaving74. Seven entry-readiness versions were
recovered overall; the seventh belongs to the earlier discovery audit. Both prior
claims remain hash-bound historical evidence with this explicit correction. The
overall21 recoveries,208 remaining, raw copies and substantive content comparisons
are unchanged. This was a subset-accounting mistake, not lost source or runtime failure.

Further read-only search examined4,070 Git trees across CharacterLab and sister
Vivarium, plus1,991 Vivarium blobs, including objects available without a reachable
filename. No additional target hash or research-log filename candidate was found.
Per-command safe-directory handling changed no Git configuration. No remote fetch,
cleanup or arbitrary-content identification was attempted; no global absence claim.

Five original no-hash references are separately disposed. Three unversioned formula
links identify an inventory only. The literal formula commit pin is unsupported;
preserved comparison bytes and accepted contracts supply their own scoped evidence,
not historical production parity. The legacy companion log remains unlocated;
superseded build routing alone does not prove its material findings survived.
reference/RESEARCH.md is not substituted. The historical source-manifest omission
also remains a separate methodological limit, not another invented hash target.

Next: independent requirement-by-requirement universe and scientific adequacy audit.
Source-role completeness is established; full historical completeness is not yet
demonstrated. HQ-012 remains unstarted. REV315 unchanged:11,373 assigned sources,
413,894 original occurrences,2,825 outside-census resources. No original runtime,
build, law, verdict, allocation or corpus change. RO019 ACTIVE;RO021 UNSATISFIED;
RO022 CLOSED.108 verdicts;132 bounded clauses;55/58 wrappers;corpus0.29.0/21.
Campaign3 NOT EXIT-READY. Search and consequence checkers PASS; bookkeeping follows.
''',encoding='utf-8',newline='\n')
rp=P/'RESEARCH_OBLIGATIONS.json';reg=load(rp);obs=['RO-C3-019','RO-C3-020','RO-C3-021']
existing={x['path'] for x in reg['reportReviews']}
paths=[p.as_posix() for d in dirs for p in sorted(d.glob('*.json'))]+[cp.as_posix()]
for path in paths:
    assert path not in existing
    reg['reportReviews'].append(dict(path=path,obligations=obs))
    for ob in reg['obligations']:
        if ob['id'] in obs:ob['evidence'].append(path)
rp.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: missing-source claim consequences recorded.
Start CAMPAIGN3_HISTORY_GAP_CONSEQUENCES_CHECKPOINT.md.
208 targets /299 original gap occurrences:74 exit narratives,5 other narratives,
2 probe metadata,124 source/test,3 writers. Prior73 exit-subset count corrected to74;
six of80 recovered, not seven. Overall21 recoveries/208 remaining unchanged.
4070 trees /1991 sister blobs:0 new matches or legacy-log filename candidates.
Five no-hash references separately limited; legacy-log material completeness unproven.
Next independent universe/scientific adequacy audit. HQ-012 unstarted.
REV315 unchanged:11373 source roles /413894 original occurrences /2825 backing resources.
Counters1519 /0;108 verdicts;55 /58 wrappers;132 bounded clauses;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. Campaign3 NOT EXIT-READY.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-11):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(reg['reportReviews']),added=len(paths))))
