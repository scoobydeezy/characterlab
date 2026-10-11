from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev187/check.json');assert c['assignedSources']==10375
cp=P/'CAMPAIGN3_HISTORY_RETAINED_SELECTION_CONTRACTS_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Retained selection and attribution contract reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 /0**.

Nine new formal contracts reconciled:63 original narrative occurrences with exact
text/IDs/locations. The independent-association-access contract already had a reviewed
role and four exact evidence bindings; these were reverified without counting it again.
The initial unassigned-source guard rejected that duplicate scope before report output.
The rejected checker is preserved as bookkeeping development, not a scientific failure.

Canonical selection allocates one real audit even for empty/ineligible completion;
no-detection observation and positive source at zero capacity remain distinct. No
synthetic SEM experience or acquisition is created to represent an empty selection.
Frozen532/533/534 shapes and transformation versions do not imply public admission.

Contrastive attribution retains the strict four-trial interval rule:two strokes/two
stationary, matched baselines, guaranteed positive change exceeding stationary upper
bounds. Equality, missing contrast and overlap are Unavailable, not negative causation.
Identical observed contrast must retain Supported under hidden confounding; the rule
is deliberately fallible, not objective causation or calibrated confidence. All four
trials, including stationary comparators, remain its evidence basis.

Structural validation of bound operands earns no use. Actual semantic reads occur
in order, stop at unavailability, and deduplicate consumed children. Invalid unread
operands can still reject structurally. Full contrast can earn use while a stationary
focal target earns no significance. Opaque one-shot results return candidate protection;
the scheduler owns atomic result/state commitment. Public provenance/read domains
remain distinct from trusted adapter grammar.

Two-position/context grouping uses explicit observed times and exact role cardinality,
not ID order, input order or subset search. Companion contexts do not reconstruct SEM
or authorize old-source lookup. Graph formation derives elapsed time from committed
LastUpdatedAt and advances it even when the result is empty; retention-only neither
decays nor changes that clock. Graph/episode survival remain independent, and graph-only
keys cannot create memories. Same-instant multiple formations remain outside this profile.

Later bounded GA evidence retains16 consumed experiences/one endpoint and equal final
protection states; it does not select universal laws or prove every proposed component
vector independently executed. No runtime/test/build/model/allocation/verdict/corpus/
obligation change. SourceREV187:10,375 assigned/998 unassigned;131,508 narrative/
211,258 backing;1,192 archives. Values post-cutoff reviews remain separate denominators.
Two Values/seven cognitive/80 exit-inventory/one scheduler identities remain open.
Formula provenance,legacy log,remaining material support and independent adequacy remain
required. HQ012 unstarted;Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-014','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-retained-selection-contracts-rev1','campaign3-history-source-roles-rev187'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS:nine retained/selection contracts reconciled.
Start CAMPAIGN3_HISTORY_RETAINED_SELECTION_CONTRACTS_CHECKPOINT.md.
63 original narrative occurrences;prior association review/evidence rebound,not recounted.
Validation/use/credit and unavailable/negative causation remain distinct.
Preserve duplicate-scope checker rejection;no scientific or runtime failure.
SourceREV187:10375 assigned/998 unassigned;131508 narrative/211258 backing;
1192 archives. Values post-cutoff reviews retain separate denominators.
Open identities:two Values,seven cognitive,80 exit-inventory,one scheduler.
Next remaining material support,post-cutoff delta joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
