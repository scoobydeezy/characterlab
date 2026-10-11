"""Classify the research charter's complete normative scope, without awarding gates."""
from pathlib import Path
import re,json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-architecture-map-rev1'
SOURCE='CHARACTER_ARCHITECTURE.md'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={0: ('MAP ROLE',
     'Canonical topology/state ownership/conceptual order beneath North Star invariants.',
     'Not an implementation-status report, roadmap or empirical claim every box is necessary.'),
 1: ('RESET',
     'Overcomplete candidate topology remains current even where implementation absent; historical work is control/evidence.',
     'No module earns authority merely by existing or disappears merely because it is unimplemented.'),
 2: ('NOTATION',
     'Mermaid is canonical diagram source; required/candidate/derived/historical/reference-drafted have distinct meanings.',
     'Reference-drafted does not mean accepted or important by default; timeseries/calibration belong to experiment evidence.'),
 3: ('CANONICAL GRAPH',
     'Detailed3.2 owns exact conceptual graph;3.1/3.2.1 are semantic projections preserving typed epistemic boundaries, option construction and '
     'distinct learning/adaptation routes.',
     'Graph arrows are not runtime read capabilities or universal equations. The dashed TruthCausal no-hidden-shortcut label forbids privileged '
     'causal copying. Outcome reaches cognition only through perception/SEM; consolidation family still requires sole owner per target. No graph '
     'grants generic ancestry traversal.'),
 4: ('SEPARATIONS',
     'Evidence, belief, appraisal, affect, motives, goals, skill, communication, intent, actual/perceived outcomes and frozen meaning remain '
     'distinct.',
     'Unknown is not neutral; character-accessible is not universally admissible evidence. Causal grouping must expose genuine independent '
     'contributions rather than duplicated pressure.'),
 5: ('OWNERSHIP',
     'Authored/persistent/active/derived/frozen categories give one authoritative meaning and one mutation authority per persistent target.',
     'Event-local affect can have explicitly earned temporal persistence; categorical diagram is not permission to duplicate mutable derived truth.'),
 6: ('DEVELOPMENT',
     'Constitution, development and acquired contributors remain distinct; younger learning and event-time authorship weighting use existing owners.',
     'Development cannot manufacture eligible evidence, voluntary expression or significance; later age cannot reweight old history. Exact gains and '
     'scope remain candidate.'),
 7: ('BODY',
     'Regulatory dynamics may cause performance/control effects; pressure/belief about body uses safe interoception.',
     'Dynamic-to-contextual-cognition diagram cannot authorize direct truth-based belief/motive evidence;7.2 and detailed graph govern. Stored Need '
     'stays competitor; named hormones/axes not literal biological fidelity.'),
 8: ('MEMORY',
     'Encoding, imprints, retained patterns, access, recognition and current reconstruction preserve distinct meaning and provenance.',
     'Event-to-encoding shorthand retains canonical observation boundary. Full-history refold is not semantic compression; important individuality '
     'and future queries bound loss.'),
 9: ('SOCIAL',
     'Target expression/perception precedes observer person model; dyadic history and current target estimates are parallel inputs to relationship '
     'appraisal.',
     'No TargetTruth-to-observer shortcut, universal friendship scalar or unbounded recursive mental simulation; familiarity not liking.'),
 10: ('CONTROL',
      'Bounded maintained cognition and named later affect/control feedback preserve candidate inhibition/switching/monitoring functions.',
      'No instantaneous recursive self-update; architecture permits control mechanisms without requiring universal Willpower.'),
 11: ('PROSPECTION',
      'Represented goals/strategies/reminders survive individual decisions; ordinary planning need not create authorship contests.',
      'Bounded affordance-based planning permitted; no automatic abandonment or authored procrastination trait.'),
 12: ('DECISION',
      'Retain reference reason/dice/modifier/qualification pipeline through versioned contracts, not arbitrary weighted choice.',
      'Exact calibration remains falsifiable; significance differs from uncertainty. Choice meaning/eligibility not a bare action token or success '
      'reward.'),
 13: ('EXECUTION',
      'Habit selects, skill executes; plan/attempt/outcome preserve original choice. Communication has private intent, produced signal and recipient '
      'interpretation.',
      'Sincerity/deceptive intent may be internal/trace or realization metadata; it cannot be observer-known merely by inclusion in a semantic '
      'result.4.9 and13.4 require the explicit evidence boundary.'),
 14: ('LEARNING',
      'Pre-attempt expectation versus perceived outcome supplies discrepancy, contingency, controllability, attribution and goal progress.',
      'Authoritative cause is not inferred cause; example helplessness/defiance/superstition are target patterns, not earned blanket behavior or '
      'reward-hormone explanation.'),
 15: ('IDENTITY',
      'Qualified historical expressions support self-concept; dispositional adaptation remains a distinct contributor.',
      'Do not rewrite constitution/history or independently stack shared-history bonuses without discrimination; identity and adaptation necessity '
      'remains open.'),
 16: ('ADDICTION',
      'Reward-to-relief, craving without use, load-sensitive relapse, recovery and changing identity are joint research targets.',
      'No global addiction scalar or automatic clinical/full-phenotype claim from bounded biology.'),
 17: ('ORDERING',
      'Current10..21 and consequence120..127 lanes, pre-attempt snapshot, evaluation130, learning/adaptation140 and non-schedulable150 preserve '
      'causal cuts.',
      'Sequence is a legal conceptual scaffold, not all phases for every event; temporal precedence grants no read authority.51/52 impulse cannot '
      'reenter cognition; exact registered contracts own execution. Procedural practice evidence may be truth-side without character knowledge.'),
 18: ('SCALE',
      'Analytical triggers, sparse social state, bounded indexed memory/prospection/control and progressive consolidation are production-shape '
      'goals.',
      'No current10000-character performance evidence or equivalence inferred from finite casts.'),
 19: ('EXPLANATION',
      'Typed state through explicit transformations supplies traceable semantic labels and distinguishes cognitive learning from automatic '
      'adaptation.',
      'Authored world facts permitted; no hidden human/LLM semantic classification or emotion label as causal primitive.'),
 20: ('TYPES',
      'Illustrative conceptual state trees show ownership meanings and provenance; exact schemas belong to formal contracts.',
      'Do not implement these names/shapes as unreviewed authoritative schema or duplicate Person Models because listed in two conceptual views.'),
 21: ('REDUCTION SEAMS',
      'Fourteen high-value distinctions retain replacement points and required behavioral/counterfactual proof.',
      'No automatic necessity, merger or universal candidate law from topology; missing comparison keeps debt explicit.'),
 22: ('REFERENCE MAP',
      'Navigational drafting map points to controls/hypotheses; preservation ledger owns exhaustive dispositions.',
      'Historical phase names not roadmap or protected ontology; original evidence remains scoped to model/calibration and may need rebaselining.'),
 23: ('DISTILLATION',
      'Export earned ownership/equations/invariants/counterfactuals into independent production implementation.',
      'No automatic TypeScript-to-C# module mapping, Unity simulation authority or measured production capacity.'),
 24: ('TORTURE CORPUS',
      'Cross-domain target stories discriminate collapsed body/memory/control/social/action/identity/addiction meanings.',
      'These examples are requirements/test directions, not current qualification receipts. Exact coverage/relevance cannot be inferred from132 '
      'Brief clause count alone.'),
 25: ('OPEN QUESTIONS',
      'Twenty-seven topology questions remain research obligations on representation, laws, required coverage and scaling.',
      'Not27 current architectural owner decisions; later bounded evidence may answer narrower cases without universally closing these questions.'),
 26: ('FORBIDDEN COLLAPSES',
      'Shortcuts across epistemic/history/ownership/action boundaries fail unless explicit valid equivalence proves required distinctions survive.',
      'Equivalence cannot waive a North Star invariant; a syntactic rename or same output does not authorize privileged truth reads.'),
 27: ('WORKING IDEAL',
      'Full causally explicit topology precedes experimentally earned minimization.',
      'No claim current code implements every ideal route or current representation is minimal.'),
 28: ('ANCHORS',
      'North Star governs; old briefs/code and sister Vivarium material provide reference/control/phenomenon/constraint inputs.',
      'External mathematical inventory is candidate-only until formal adoption; source identity requires authenticated provenance, not current-file '
      'substitution.')}
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes()==raw
lines=raw.decode('utf-8-sig').splitlines(keepends=True);sections=[(1,0)]
for i,l in enumerate(lines,1):
 m=re.match(r'^## (\d+)\. ',l)
 if m:sections.append((i,int(m.group(1))))
assert {x[1] for x in sections}==set(specs)
rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source']!=SOURCE:continue
  a=u['location']['startLine'];z=u['location']['endLine'];section=max((s for s in sections if s[0]<=a))[1]
  subject,d,limits=specs[section]
  assert ''.join(lines[a-1:z])==u['text']
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],section=section,subject=subject,role='CANONICAL_TOPOLOGY_OR_EXPLICIT_CANDIDATE_ILLUSTRATION',disposition=d,limits=limits))
assert len(rows)==585
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={i+1 for i,l in enumerate(lines) if l.strip()}
evidence=[]
for n in ['CAMPAIGN3_FINAL_HISTORY_GATE.md','CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md','CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md','DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md']:
 p=P/n;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='CANONICAL TOPOLOGY/OWNERSHIP/RESEARCH QUESTIONS REVIEWED; WIDER HQ011 OPEN',source=dict(path=SOURCE,sha256=sha(B/'sources'/SOURCE)),rows=rows,evidence=evidence,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Normative authority accepted by repository hierarchy, not by filename, draft label or matching text.','Review classifies canonical topology, ownership, candidate distinctions and explicit examples; it does not claim those gates are already met.','No behavioral experiment, implementation change, new verdict or corpus waiver.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],originalOccurrences=len(rows),sections=len(specs),indexedWholeOccurrenceLinks=3767+len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
