from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev241/check.json');assert c['assignedSources']==11031
cp=P/'CAMPAIGN3_HISTORY_PROBE_TRACE_ALLOCATION_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Probe and trace allocation authority reconciliation — 2026-10-08

**LOCAL DISPOSITION — no owner ruling.** HQ011 IN PROGRESS; counters **1519 / 0**.

Twelve sources preserve388 original narrative occurrences and all1008 JSON string leaves.
Fresh checks verify118 referenced hashes against current or indexed historical bytes,
including the pre-amendment registry and original probe-shape authority. The existing
regulatory probe allocation table retains its prior reviewed role; it is checked as
backing here without being counted again as a newly reviewed source.

The two trace seam members use existing1036; the diagnostic accessor uses existing1028.
Neither grants a capability, creates a new namespace or modifies a registry manifest by
itself. The probe adds five records331..335 with19 fields,11 roles,12 text members and
one1123 truth occurrence. All field/role/member Markdown rows match the machine table;
three governed259 union entries exactly match the required/forbidden carrier layouts.
The original layout-only omission and conditional freeze after governed-entry correction
remain explicit. Numeric/member consistency is not runtime qualification.

The missing required ActualReadRecord accessor was an expressibility/name gap. The owner
explicitly rejected preserving old probe ModelIdentity when fixing authoritative trace
bytes. The successor makes the exact displacement accessor part of its fixed trace
profile: one actual read when available, none when unavailable, independent of observer
permission. No dummy read, additional path, observer truth access or old-profile alias.
Historical proposed/blocked wording is superseded only by its named later acceptance.

Bounded diagnostic qualification is observation-only: actual adaptation history may first
change permitted203 while matched X/E/L stay equal. F retains generic temporal REG plus
public exclusion; G retains public positive, generic signed-domain and public exclusion.
Those component domains were not exercised under a broader public model. Preserve the
extra-learning-output defect that initially committed because trace code checked only
the first output; exact cardinality/type and archive closure corrected it. The historical
549-test full regression preceded later focused/mutation evidence; counts are not silently
combined into a new full-suite claim. Source audits are finite qualification checks,
not independent mechanisms, runtime validators or proof against arbitrary hostile code.

Source REV241:11,031 assigned /342 unassigned;190,904 narrative /211,997 backing;
1,239 indexed backing resources. No new archive/source gap, runtime/test/build rerun,
model, law, allocation, verdict, corpus or obligation status change. Prior source gaps,
formula provenance, legacy log, post-cutoff joins and independent adequacy remain open.
HQ012 unstarted; Campaign3 NOT EXIT-READY.1519/0;108 verdicts;132 bounded clauses;
55/58 wrappers;corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-008','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-probe-trace-allocation-rev1','campaign3-history-source-roles-rev241'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: probe/trace allocation and scoped qualification reconciled.
Start CAMPAIGN3_HISTORY_PROBE_TRACE_ALLOCATION_CHECKPOINT.md.
Twelve sources;388 narrative occurrences;1008strings;118exact bindings checked.
Accessor successor requirement,F/G split scopes and original output-closure flaw preserved.
Source REV241:11031 assigned /342 unassigned;190904 narrative /211997 backing;
1239 backing resources. Values post-cutoff reviews retain separate denominators.
Prior source-gap inventories remain open;no global deduplication or absence claim.
Next remaining material support,post-cutoff joins and independent adequacy.
Formula provenance and legacy log remain OPEN;HQ012 unstarted.
Campaign3 NOT EXIT-READY.1519/0;108 verdicts;55/58 wrappers;132 bounded;
corpus0.29.0/21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
