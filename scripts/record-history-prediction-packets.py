from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev289/check.json');assert c['assignedSources']==11304
cp=P/'CAMPAIGN3_HISTORY_PREDICTION_PACKETS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Prediction declaration packets — 2026-10-08

**LOCAL DISPOSITION — declaration, freeze and execution remain distinct.**
HQ-011 remains in progress; no owner ruling. Counters **1519 / 0**.

Nineteen sources cover three copies of the prediction model packet and its separate
freeze. All nine model/control files are byte-identical across the three directories.
REV2 changes only the review checks and materializer fingerprint: it retains all70
initial checks and adds rejection of368/1, the new profile by the old memory factory,
and prediction declarations relabelled with old profile identifiers. The freeze's
ten file hashes match. Its permission is implementation; PRED-A..P were not passed.

A read-only checker decoded/re-encoded twelve canonical/readable pairs, restored
three copies of the baseline identity and recomputed nine manifest commitments.
The64 boolean control selections and their distinct stored model/registry digests
are checked, including the all-enabled baseline match. Other63 control model images
are not stored here and were not reconstructed. No historical materializer, model
writer, scheduler or runtime was rerun. Current codec equality is not evidence of
historical timing.166 preservation entries are not166 behavioral tests.

Rules0.1 and component semantics0.2 have separate version owners. Corrected367/2
and368/2 preserve the retired occurrence-rule field boundary. Structural ownership
and old-profile exclusion do not constitute a new runtime compiler or relax every
profile's dispatcher. Single application/no cross-key public reads cannot provide
a discriminating live-versus-frozen numeric collision; generic collision controls
and actual public frozen binding remain separately scoped. Later prediction
qualification supplies its own evidence, not a retroactive declaration PASS.

All720 referenced binding occurrences resolve exactly through current files or
indexed sources. No new source gap in this batch.229 original narrative and68
backing occurrences retain their identities; all45,582 string leaves are accounted
for, including short strings. Fourteen existing backing files newly indexed.

Source REV289:11,304 assigned /69 unassigned;196,120 narrative /212,321 backing;
2,483 backing resources. No model, law, allocation, verdict, corpus or obligation
status changed. Earlier source gaps and dependent claims, post-cutoff joins and
independent scientific adequacy remain open. HQ-012 unstarted; Campaign3 NOT
EXIT-READY.108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-prediction-packets-rev1','campaign3-history-source-roles-rev289'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: nineteen prediction declaration packet sources reconciled.
Start CAMPAIGN3_HISTORY_PREDICTION_PACKETS_CHECKPOINT.md.
Twelve canonical/readable pairs/nine commitments;64 stored control identities.
70 initial declaration checks plus3;720 exact bindings/no new source gap.
Source REV289:11304 assigned /69 unassigned;196120 narrative /212321 backing;
2483 backing resources. No new runtime replay or qualification.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include earlier gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
