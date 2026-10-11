from pathlib import Path
import json
P=Path('docs/planning');O=P/'campaign3-history-exit-inventory-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
assert load(O/'check.json')['summary']['resolvedPairs']==657
cp=P/'CAMPAIGN3_HISTORY_EXIT_INVENTORY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical exit-audit inventory byte reconciliation — 2026-10-08

**LOCAL DISPOSITION.** HQ-011 remains open; no owner ruling. Counters **1519 / 0**.

Enumerated23,816 historical inventory occurrences across111 audit snapshots:
820 distinct path/hash pairs over468 paths and819 distinct SHA256 values. Different
path aliases with the same hash remain separate occurrences. The inventory is a
historical inspection claim, not scientific acceptance of all referenced sources.

Resolved657 path/hash pairs:475 exact available files (current, frozen or already
preserved),181 exact-hash prefix/newline reconstructions from current sources, and
one exact reachable Git blob. The latter is CAMPAIGN3_ENTRY_READINESS.md at commit
d96d3e7c88fdbb0a1ea36ba02116d2fc4d80ad76, SHA256
2825b31bd2ce505570b3f0c20cdfe54182b2636e95d7fe350c7d0c79971e4b72.
All182 newly preserved files match their original inventory target hash exactly.
Reconstructed prefixes are explicitly labeled; matching a historical content commitment
does not prove its creation time or original inspection. No guessed prose edits.

163 identities remain unresolved:54 SEAM_LEDGER,53 VERDICT_LEDGER,34 shared exit-audit,
14 REFERENCE_MECHANISM_LEDGER and8 CAMPAIGN3_ENTRY_READINESS versions. The declared
search checked current/frozen/known archived bytes, exact prefix/newline candidates,
and reachable Git history for those exact paths. No remote, unreachable-object,
rename-history or global filesystem claim. Unrecovered does not mean nonexistent;
current files are not substituted for absent historical identities.

Every occurrence retains original snapshot pointer, declared path/hash and resolution
method, with basis identity and reconstruction recipe where relevant. Snapshot hashes
verify unchanged. New files are below50MB (largest artifact2,492,906 bytes). Source
roles remain unchanged: the182 preserved variants are evidence-recovery artifacts,
not automatically accepted new scientific findings or whole reviewed sources.

Next inspect the remaining historical-root deltas/recovery avenues and account for
material differences, then complete audit JSON roles and the21 supporting-source
reviews. Byte matches alone do not establish source adequacy or waive final history.
SourceREV172 stays10,108 assigned/1,265 unassigned;22,704 narrative/184,919 backing;
920 indexed outside-census artifacts (the182 new recoveries await explicit role
integration). No new runtime simulation/test/build, law, verdict, corpus freshness
or obligation closure. Research bookkeeping checks are separate.

Formula historical identity, missing legacy log, Values90/15 and prior exclusions
remain open. HQ012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21;1519/0. RO019 ACTIVE;RO021 mandatory and UNSATISFIED;
RO022 CLOSED. All processes terminal; no user decision required.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[x.as_posix() for x in sorted(O.glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:historical exit inventory byte search recorded.
Start CAMPAIGN3_HISTORY_EXIT_INVENTORY_CHECKPOINT.md.
820 path/hash pairs/23816 occurrences:657 resolved,163 unresolved across5 root paths.
475 existing bytes/181 exact prefix reconstructions/1 Git blob;182 preserved files.
No historical timestamp or source adequacy inferred;next root deltas/support review.
SourceREV172 unchanged:10108 assigned/1265 unassigned;22704 narrative/184919 backing;
920 indexed artifacts plus182 new recoveries pending role integration.
Formula historical identity,legacy log,Values90/15 and exclusions OPEN.
Independent adequacy/HQ012 unstarted. Campaign3 NOT EXIT-READY.
1519/0;108 verdicts;55/58 wrappers;132 bounded;corpus0.29.0/21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED. All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
