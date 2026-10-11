from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev287/check.json');assert c['assignedSources']==11281
cp=P/'CAMPAIGN3_HISTORY_BODY_MULTISOURCE_FREEZES_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Embodied and MULTISOURCE freeze scope — 2026-10-08

**LOCAL DISPOSITION — commitment evidence reconciled; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

The embodied declaration review executes24 declaration checks but does not admit
live state or source inputs. Its seven models and seven run commitments match the
subsequent freeze exactly, as do all49 image pairs. Hidden89 shares baseline model
identity but changes RunIdentity. Work7 is a negative work-limit model, not one of
the seven listed successful-run recipes. The446 preserved fingerprints are source
consistency checks, not446 fresh tests. Later embodied qualification supplies the
separate runtime, source, state and work evidence; the freeze alone does not.

The rejected MULTISOURCE first cohort contains55 named model/S0/input recipes and
43 distinct ModelIdentities. Its13 cases compare five receiver alternatives, with
DescriptionDice only in orphan-removed/duplicate/aggregate contrasts. Known-zero,
no-task and no-body change initial state rather than model identity. All55 stored
identity texts match their image files. A copied body instruction named a different
action; these images remain inadmissible. REV2 corrects the registry and separately
qualifies62 public runs/227 prefixes. No PASS transfers backward to REV1.

Three sources preserve42 original narrative and34 backing occurrences, plus all
1,384 string leaves.437 binding occurrences are exact; two remain unresolved in
current/indexed files: embodiedModel.ts hash5f20c093414933ca149e1200e8328caaae2ed4c309c03e9d833fa6b0f9e16f8b
and embodied-declaration-tools.mjs hashcac0fcc1d715083e5bc5d907d712c0524a642128ebaab817e4dd50dd93d3833d.
No source-exact rerun is claimed.431 existing artifacts newly indexed.

This audit's REV1 accidentally copied an unrelated prior search-scope sentence
about three recovered gaps. REV2 corrects that wording; all targets and results
are unchanged, and both receipts remain. This is a bookkeeping correction, not a
new historical source recovery. The prior consolidated200-pair search predates
these two reported occurrences; final gap reconciliation must incorporate them.

Source REV287:11,281 assigned /92 unassigned;194,691 narrative /212,239 backing;
2,016 backing resources. No runtime replay, original writer, model, law, verdict,
allocation, corpus or obligation status changed. Earlier gaps, post-cutoff joins
and independent adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
108 verdicts;132 bounded clauses;55 /58 wrappers;corpus0.29.0 /21.
RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-001','RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-body-multisource-freezes-rev1','campaign3-history-body-multisource-freezes-rev2','campaign3-history-source-roles-rev287'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: embodied/MULTISOURCE freeze scope reconciled.
Start CAMPAIGN3_HISTORY_BODY_MULTISOURCE_FREEZES_CHECKPOINT.md.
49 image pairs/55 recipe identities checked;43 distinct MULTISOURCE models.
437 exact bindings/two gaps; copied audit search sentence corrected in preservedREV2.
Source REV287:11281 assigned /92 unassigned;194691 narrative /212239 backing;
2016 backing resources. Declaration/freeze evidence is not public qualification.
Next: remaining material support, dependent-claim dispositions, post-cutoff joins and independent adequacy.
Include new gaps in final consolidation. HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
