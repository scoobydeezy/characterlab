from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev295/check.json');assert c['assignedSources']==11327
cp=P/'CAMPAIGN3_HISTORY_BUILD_CONTINUATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Build metadata and facade continuation — 2026-10-08

**LOCAL DISPOSITION — bounded exclusion and historical continuation differ.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Two receipts preserve three build-assay pairs and historical two-process FCT5.
The build intervention exposes zero/eight existing RNG schema definitions without
changing actual codec support or ModelIdentity. Baseline full saves/restores are
identical868bytes. Runtime substitution inserts build-global schema IDs into field9,
yields884bytes and fails restoration. Factory substitution preserves the save but
fails restoration.28 stored canonical byte fields are compared and hashed directly.
These are two concrete detected alternatives, not exhaustive build independence.
No RNG draw or consumer exists in the specimen. Empty field9 does not qualify the
positive RNG-consuming PERSIST-I witness, which remains deferred at this checkpoint.

FCT5 reports two processes, no originalS0handoff, exact checkpoint/final-save equality
and6744 final bytes. The current writer transfers model/input/checkpoint and removes
temporary expected/actual saves after comparison. The receipt lacks the full save
and historical writer fingerprint; its digest alone cannot reproduce original
execution. Current script inspection is not recovery of its historical revision.
No fresh process run, canonical transition trace completion or release claim follows.
Later bounded factory/persistence qualification provides separately scoped evidence.

Ten original narrative occurrences and all80 string leaves retain scope. Four source
bindings resolve exactly; one existing backing resource newly indexed. No new exact
source-hash gap, but the continuation artifact/provenance limit remains explicit for
final dependent-claim reconciliation. No historical writer or runtime was rerun.

REV295:11,327 assigned /46 unassigned;197,291 narrative /212,373 backing;
2,594 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-build-continuation-rev1','campaign3-history-source-roles-rev295'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: build metadata and factory continuation receipts reconciled.
Start CAMPAIGN3_HISTORY_BUILD_CONTINUATION_CHECKPOINT.md.
Three build pairs/28 byte fields; continuation lacks original save/writer fingerprint.
Four exact source bindings/no new hash gap; artifact/provenance limit preserved.
Source REV295:11327 assigned /46 unassigned;197291 narrative /212373 backing;
2594 backing resources. No historical runtime or writer rerun.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier gaps and artifact limits in final reconciliation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
