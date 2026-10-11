from pathlib import Path
import json
P=Path('docs/planning')
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
c=load(P/'campaign3-history-source-roles-rev280/check.json');assert c['assignedSources']==11258
cp=P/'CAMPAIGN3_HISTORY_SALIENCE_ARITHMETIC_CHECKPOINT.md';assert not cp.exists()
cp.write_text('''# Salience arithmetic and claim limits — 2026-10-08

**LOCAL DISPOSITION — finite arithmetic verified; no owner ruling.**
HQ-011 remains in progress. Counters **1519 / 0**. Original receipts unchanged.

An independent Fraction calculation verifies all 116 allocation, role-response,
quantized-edge and row-mass rows and six pairwise distinctions in
SALIENCE_LAW_COMPARISON_REV1. Both historical source fingerprints match exact bytes.
Round-to-even and canonical largest-remainder overflow preserve the original results.

Focal allocation invariance is not learned-edge invariance. At resolving scales,
all four laws change the focal association edge with footprint. Independent edges
at scale 100 are all zero because of quantization, not a demonstrated equivalence.
The shared law changes between zero and positive incidental membership; under a
conserved residual pool its focal allocation then stays constant across positive
footprints. The unconserved control dilutes it as positive footprint grows.

Two claim limits are made explicit under RO-C3-004. The massConserved flag is a
nonsaturation test plus spread <=2% of peak, not exact conservation. Independent
mass ranges from 3680 to 3720 with spread/peak 1/93; the other derived laws also
have nonzero quantized spread. The receipt's evidence-proportional wording supports
bounded sensitivity, not a general linear law: bounded response x/(1+x) is nonlinear,
only one focal profile and a three-role intervention were tested, and no general
scaling sweep was performed. This qualification preserves every numeric result.

Flat tagging saturates the full row budget here and overflows from footprint 2.
It remains a retired negative comparison; independent/shared/hybrid remain distinct
candidates. Empty prior, eta=1, no decay, and footprints 1/2/4/8 do not qualify
arbitrary graphs, psychological correctness, source admission or native runtime.
The receipt contains two fingerprints, not all four candidate paths in the writer.
No historical writer was rerun or original receipt regenerated.

One source preserves 22 original narrative occurrences and all 246 string leaves.
Source REV280: 11,258 assigned / 115 unassigned; 194,247 narrative / 212,205 backing;
1,467 backing resources. Earlier source gaps, post-cutoff joins and independent
adequacy remain open. HQ-012 unstarted; Campaign3 NOT EXIT-READY.
No model, law, allocation, verdict, corpus or obligation status changed.
108 verdicts; 132 bounded clauses; 55 / 58 wrappers; corpus 0.29.0 / 21.
RO019 ACTIVE; RO021 UNSATISFIED; RO022 CLOSED.
''',encoding='utf-8',newline='\n')
rpath=P/'RESEARCH_OBLIGATIONS.json';r=load(rpath);obs=['RO-C3-004','RO-C3-019','RO-C3-020','RO-C3-021'];existing={x['path'] for x in r['reportReviews']}
paths=[p.as_posix() for d in ['campaign3-history-salience-arithmetic-rev1','campaign3-history-source-roles-rev280'] for p in sorted((P/d).glob('*.json'))]+[cp.as_posix()]
for p in paths:
 assert p not in existing
 r['reportReviews'].append(dict(path=p,obligations=obs))
 for o in r['obligations']:
  if o['id'] in obs:o['evidence'].append(p)
o=next(o for o in r['obligations'] if o['id']=='RO-C3-004')
o['established']+=' HQ-011 salience arithmetic review (2026-10-08) independently verifies all116 stored arithmetic rows and six pairwise distinctions. The massConserved flag means nonsaturation plus spread <=2% of peak, not exact equality (independent spread1/93). Evidence-proportional wording is limited to bounded sensitivity under the declared profile/role intervention, not a general linear scaling law. Original receipts and comparators unchanged.'
o['blocks'].append('Claiming exact total-mass conservation or general linear evidence proportionality from SALIENCE_LAW_COMPARISON_REV1')
o['reopenTrigger']+=' A proposed reduction relies on exact conservation or general proportionality inferred from that finite salience receipt.'
o['closureRequirement']+=' Distinguish exact conservation from declared tolerances and verify any broader evidence-scaling claim over its claimed domain.'
rpath.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
cur=P/'CURRENT.md';old=cur.read_bytes();log=P/'CAMPAIGN3_LOG.md';size=log.stat().st_size
with log.open('ab') as f:f.write(b'\n\n'+old)
assert log.read_bytes()[size:]==b'\n\n'+old
route='''HQ-011 IN PROGRESS: salience comparison arithmetic and claim limits verified.
Start CAMPAIGN3_HISTORY_SALIENCE_ARITHMETIC_CHECKPOINT.md.
116 exact arithmetic rows/six pairwise comparisons; both source bindings exact.
Conservation is a two-percent tolerance; general linear proportionality unproved.
Source REV280: 11258 assigned /115 unassigned;194247 narrative /212205 backing;
1467 backing resources. RO004 limits preserved; no law selected or retired.
Next: remaining material support, source recovery, post-cutoff joins and independent adequacy.
Prior source gaps, formula provenance and legacy log remain OPEN; HQ-012 unstarted.
Campaign3 NOT EXIT-READY. Counters1519 /0;108 verdicts;55 /58 wrappers;
132 bounded clauses;corpus0.29.0 /21. RO019 ACTIVE;RO021 UNSATISFIED;RO022 CLOSED.
All jobs terminal;no owner ruling.
'''
cur.write_text(old.decode('utf-8-sig').split('HQ-011 IN PROGRESS:')[0]+route,encoding='utf-8',newline='\n')
a=Path('AGENTS.md');s=a.read_text(encoding='utf-8-sig');needle='**Current routing (2026-10-08):**';pos=s.index(needle)
a.write_text(s[:pos]+needle+'\n'+route+'\n'+s[pos:].replace('**Current routing','**Prior routing',1),encoding='utf-8',newline='\n')
print(json.dumps(dict(reports=len(r['reportReviews']),added=len(paths),exactChronology=True)))
