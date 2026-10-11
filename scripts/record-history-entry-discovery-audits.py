from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev298/check.json');assert c['assignedSources']==11334
cp=P/'CAMPAIGN3_HISTORY_ENTRY_DISCOVERY_AUDITS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Campaign3 entry and discovery audits — 2026-10-08

**LOCAL DISPOSITION — historical packet consistency, not broad readiness.**
HQ-011 in progress; no owner ruling. Counters **1519 / 0**.

Two packet audits report8 then11 proposed intake entries, twelve required fields
per entry and15 then17 local links. Both retain446 preservation checks and identical
ablation evidence references. They explicitly state production tests were not rerun
and no new whole phenomenon PASS follows. Proposals are not newly committed corpus
members. Four public matched ablation pairs remain separate from generated-source
component contrasts; narrow identity-feedback influence is not whole biography.

Discovery adds the body frontier without lowering missing families' importance.
Coverage gaps remain UNKNOWN rather than zero. Current readiness/acceptance prose
and later domain qualifications supply separately scoped developments, not proof
that the earlier packet already qualified attention, physiology or Campaign3 exit.
The independent final history gate remains mandatory despite subsequent coverage.

Nine references resolve exactly. Eight historical document hashes remain unresolved:
two CURRENT snapshots, two entry-readiness versions, one pre-entry review disposition,
two intake versions and one body-frontier version. Current named paths, indexed backing
and census hashes were searched; no global absence is claimed. Reconcile these with
prior gap searches and possible exact chronology/Git recovery before final adequacy.
Never use current overwritten prose as byte-identical historical evidence.

Six original narrative occurrences and all40 string leaves retain scope. Two existing
backing resources newly indexed. No historical audit writer or runtime was rerun.
REV298:11,334 assigned /39 unassigned;197,808 narrative /212,373 backing;
2,597 backing resources. No model, law, allocation, verdict, corpus or obligation
status changes. Remaining source support, dependent claims, post-cutoff joins and
independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-001','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-entry-discovery-audits-rev1','campaign3-history-source-roles-rev298'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: two entry/discovery packet audits reconciled.
Start CAMPAIGN3_HISTORY_ENTRY_DISCOVERY_AUDITS_CHECKPOINT.md.
8->11 proposed entries;446 preservation checks, explicitly no new full-suite/phenomenon PASS.
Nine exact bindings/eight historical document gaps, including two CURRENT snapshots.
Source REV298:11334 assigned /39 unassigned;197808 narrative /212373 backing;
2597 backing resources. No historical writer or runtime rerun.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier/new gaps and artifact limits in final reconciliation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
