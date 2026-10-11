from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev275/check.json');assert c['assignedSources']==11247
cp=P/'CAMPAIGN3_HISTORY_OWNER_GRAMMAR_CONTROLS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Historical owner, primitive grammar and feedback carrier controls — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ-011 remains in progress. Counters **1519 / 0**.

Eight sources preserve30 original narrative occurrences and all336 JSON string
leaves. Seven control receipts record46 detected faults; the eighth source is the
full symbolic feedback carrier.41 binding occurrences represent40 distinct pairs;
33 match exact current/indexed bytes and8 remain explicitly unresolved. Historical
source gaps limit exact reproducibility; later qualification cannot replace hashes.

Attribution preserves partial consumption even when unavailable, without making
every consumed item a credit target. It allocates no result without consequence
and does not derive character subject from observer identity. Recall/body production
keeps selection and acquisition distinct, preserves safe context and excludes
retention-wrapper metadata. Primitive grammar requires exact canonical rationals,
fixed version admission and legitimate phases. These are not public admission proofs.

Empty-source controls preserve role absence, no detection and no eligible candidates
as distinct cases. Source-owner controls prevent cue bridging, observation replay,
reset significance, skipped retention and injected fresh credit. The baseline-cache
mutation concerns fixture coordination, not a publicly qualified baseline reader.
Write scope distinguishes sibling roots, authority, learning family and read-only use.

The eight-record symbolic feedback carrier has no storage and no new identity
families. No selected task is distinct from a genuine concern occurrence. Delivery
uses completed same-run parent authority and strict prior time rather than original
ingress or receiver relabelling. Status and branch remain distinct even when numeric
modulation equals baseline. Feedback is trace-side, not durable event content or
persistent Affect. Declared invariants require separately qualified runtime evidence.

Source REV275:11,247 assigned /126 unassigned;194,144 narrative /212,205 backing;
1,451 indexed backing resources. No historical writers or runtime tests rerun.
No model, law, allocation, verdict, corpus or obligation status changed. Source gaps,
post-cutoff joins and independent adequacy remain open. HQ-012 unstarted.
Campaign3 NOT EXIT-READY;108 verdicts;132 bounded clauses;55 /58 wrappers;
corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-010','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-owner-grammar-controls-rev1','campaign3-history-source-roles-rev275'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: eight owner/grammar/control/carrier sources reconciled.
Start CAMPAIGN3_HISTORY_OWNER_GRAMMAR_CONTROLS_CHECKPOINT.md.
30 original narrative occurrences;336 string leaves;46 stored fault controls.
33 exact bindings;8 unresolved binding occurrences;symbolic carrier has no storage.
Source REV275:11247 assigned /126 unassigned;194144 narrative /212205 backing;
1451 backing resources. Structural checks remain distinct from public authentication.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN;HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
