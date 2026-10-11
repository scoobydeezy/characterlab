from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev286/check.json');assert c['assignedSources']==11278
cp=P/'CAMPAIGN3_HISTORY_GAP_RECOVERY_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical source gap consolidation and expanded search — 2026-10-08

**LOCAL DISPOSITION — bounded search completed; claim adequacy remains open.**
HQ-011 remains in progress. Counters **1519 / 0**. No original receipt changed.

The declared input is all33 existing campaign3-history-*/unresolved*.json reports
at this checkpoint. Typed target arrays yield279 preserved entries and204 distinct
path/hash pairs. Original report hash, pointer, full entry and a stable ID survive
deduplication. Search-result candidates are excluded from requested targets; repeated
predecessor reports remain historical occurrences, not independent evidence.

Four pairs have exact bytes already available: CONTROL's initial contract and
allocation, PERSONSTATE's initial contract, and the earlier recovered task-lifecycle
script. These are verified recoveries from existing material, not four new finds.
The remaining200 pairs have no exact match in named current files, census or indexed
backing hashes, or census mirrors. An expanded repository search then checked163
files with matching basenames under docs/src/scripts/reference, excluding dependency
and Git directories. Raw, LF and CRLF SHA256 variants produce zero further matches.
No arbitrary reconstruction or replacement by current bytes was accepted.

This is not proof of global absence. Earlier scoped Git searches remain evidence;
renamed sources with different basenames, unreachable objects and sister repositories
are outside the new workspace pass. No-hash missing references, the legacy research
log and formula provenance also remain separately open. Exact dependent-claim
qualification and independent scientific adequacy must be resolved before HQ-011
closure; byte counts alone do not authorize deleting findings or passing the gate.

Source REV286 retains all prior assignments:11,278 assigned /95 unassigned;
194,649 narrative /212,205 backing;1,585 backing resources. No new material source
classification, model, law, allocation, verdict, corpus or obligation status change.
All search inputs and outcomes are committed as review artifacts; no runtime replay.
HQ-012 unstarted; Campaign3 NOT EXIT-READY.108 verdicts;132 bounded clauses;
55 /58 wrappers;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-gap-census-recovery-rev1','campaign3-history-gap-workspace-recovery-rev1','campaign3-history-source-roles-rev286'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: gap reports consolidated and workspace search expanded.
Start CAMPAIGN3_HISTORY_GAP_RECOVERY_CHECKPOINT.md.
33 reports/279 entries/204 distinct pairs;four previously recovered identities verified.
200 remain unresolved;163 matching-basename files/raw-LF-CRLF search yields no new match.
Source REV286:11278 assigned /95 unassigned;194649 narrative /212205 backing;
1585 backing resources. No gap waived or global absence claimed.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
No-hash references, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
