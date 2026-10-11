"""Classify the research charter's complete normative scope, without awarding gates."""
from pathlib import Path
import re,json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-north-star-rev1'
SOURCE='CharacterLab — Ideal Character Architecture North Star.md'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={0: ('AUTHORITY',
     'Primary capability/invariant source, with candidate mechanisms and research obligations distinguished.',
     'Architectural ground truth does not mean every proposed mechanism is scientifically proven.'),
 1: ('SCOPE',
     'North Star governs desired properties; lower documents own scoped implementation/evidence.',
     'Change desired architecture only explicitly; rejected candidates are allowed.'),
 2: ('PERSONHOOD',
     'Required body, evidence, cognition, goal, action, social and developmental capacities preserve autonomy.',
     'Not a personality-slider model or permission for player authorship of will.'),
 3: ('PROOF',
     'Headless deterministic explicit semantics and complete causal trace; intact reference is a superset hypothesis judged by phenomena.',
     'Difference needs witness, equivalence declared coverage; addressed randomness is permitted, authoritative LLM interpretation is not.'),
 4: ('SEMANTICS',
     'Rebellious, fear and low controllability examples illustrate derived historical meaning.',
     'These diagrams are desired examples, not experiments or automatic action commands.'),
 5: ('BOUNDARIES',
     'Truth/evidence/appraisal/affect/motive/goal/plan/competence/private expression/intent/outcome/history remain separately intervenable.',
     'Opaque equality can leak truth. Missing is not negative; observer files are not truth identities; same fact can have distinct effects but '
     'cannot be duplicate generic pressure.'),
 6: ('TOPOLOGY AUTHORITY',
     'CHARACTER_ARCHITECTURE owns canonical boxes/edges/owners/order beneath these invariants.',
     'Small North Star diagrams illustrate boundaries, not independent canonical topology or phase registrations.'),
 7: ('CONSTITUTION',
     'Persistent constitution, development and acquired state are distinct; owner requires independent younger learning and event-time personality '
     'gains.',
     'Candidate axes not irreducible ontology or clinical physiology. Older characters can change; later age cannot reweight original history.'),
 8: ('PLASTICITY',
     'Biography and development may change effective disposition without rewriting starting constitution.',
     'Examples of assertiveness/coping/avoidance are capacities, not proof of an update law.'),
 9: ('REGULATION',
     'Regulatory explanations must earn reduction of descriptive sliders.',
     'Biological analog names are allowed under user direction without1:1 claims; dopamine-like reward does not establish clinical fidelity or '
     'necessary meter.'),
 10: ('MOTIVATION',
      'Need pressure can be derived; body, psychological motive and durable goal need distinct roles.',
      'No mandatory stored meter or universal current-Reason representation of future intention.'),
 11: ('MEMORY',
      'Truth, encoding, imprint, recollection, retention, access and recognition differ; semantic consolidation must retain important '
      'individuality/provenance.',
      'Sparse sketch not destructive hash; selected reinforcement and mood bias are testable candidates, not current truth rewrites or proven '
      'lifelong compression.'),
 12: ('FAMILIARITY',
      'Familiarity and valence differ; partial recognition can change novelty and why experience rewards.',
      'Recognition-to-reward/old novelty return are candidate paths; no primitive Novelty Need, reset timer or automatic liking.'),
 13: ('REPETITION',
      'Satiation, habituation, tolerance and sensitization name different causal possibilities.',
      'Generic repetition penalty may fail distinctions; listed behaviors are research targets, not all qualified by any one adaptation result.'),
 14: ('CONSOLIDATION',
      'Repeated history can become structure across separately owned memory/belief/skill/habit/relationship/identity/adaptation transitions.',
      'No shared universal update or mutation owner; retain individuality and provenance wherever future queries still require them.'),
 15: ('PERSON MODEL',
      'Observer-relative enduring disposition and current affect/goal/intent/knowledge belief remain fallible, sparse and directional.',
      'No omniscient minds or unbounded recursive belief; final relationship lenses not fixed ontology or one Friendship scalar.'),
 16: ('IDENTITY',
      'Semantic traits summarize qualified contextual expressions and bounded acquired history.',
      'Bravery is not low fear; rebellion is not high Agency. Trait labels cannot become authored bonuses or outcome-only evidence.'),
 17: ('CHOICE/ACTION',
      'Preserve earned reason/dice/modifier pipeline as initial control; bounded workspace, control, goals, skill, attempt, evaluation and '
      'communication are separable.',
      'No generic Willpower or general planner required. Confidence unresolved; skill differs from habit and belief. Sincerity/deceptive intent in '
      'candidate communication output is private/trace-side unless separately evidenced:5.8/17.7 explicitly forbid recipients reading it as fact.'),
 18: ('DECISION CONFIDENCE',
      'Choice decisiveness, significance and inhibitory difficulty differ.',
      'Candidate mode table does not fix thresholds or calibrate epistemic confidence.'),
 19: ('EXPRESSION',
      'Frozen choice context/meaning and intent survive prevented execution.',
      'Expression is not successful outcome; later identity/calibration cannot reinterpret historical authorship.'),
 20: ('ROLL MIGRATION',
      'Biography may move future decision boundaries; execution improvement is a separate research target.',
      'Capstone narrative not proof that every seed stops rolling, or a universal monotonic identity trajectory.'),
 21: ('COMMITMENT',
      'Concrete durable obligation/goal lifecycle and attribution preserve intended/attempted/actual/perceived/learned distinctions.',
      'Failure does not force abandonment; private causes cannot bypass observer evidence; ordinary background consolidation not unbounded episodic '
      'retention.'),
 22: ('PERTURBATION',
      'Status effects should act through causal body/control/perception/execution substrate with character-specific responses.',
      'Examples are proof targets, not an authorized arbitrary modifier bag or qualification of every listed axis.'),
 23: ('ADDICTION',
      'Whole-system acquired reward/relief/cue/control/goal/identity progression and recovery contrasts are intended behavioral tests.',
      'No authored AddictionTendency or withdrawal Need as assumed explanation. Functional biology qualification is bounded, not clinical or every '
      'listed recovery mechanism.'),
 24: ('SCALING',
      'Eventually support population scale through analytical triggers, sparse social state, indexed bounded retrieval, compression and bounded '
      'prospection.',
      'Approximately10000 is production-direction target, not measured current capacity. Derived state should rebuild only when cost/semantics '
      'allow; no loss of future causal queries.'),
 25: ('EXPLAINABILITY',
      'Research trace must explain perception, learning, choice, control, competence and attribution.',
      'Omniscient trace is not necessarily player-facing or a character evidence channel.'),
 26: ('NO ORACLE',
      'Authoring supplies permitted semantic facts; deterministic character transformations derive meaning.',
      'Norm violations/skill requirements are not preauthored embarrassment/courage conclusions; no human/LLM bridge for runtime semantics.'),
 27: ('AUTHORING',
      'Semantic entities/affordances/propositions may be authored; dialogue may realize already determined semantics.',
      'SincerityIntent in realization input does not authorize listener knowledge. Preserve private plan, executed display and interpreted message '
      'separately.'),
 28: ('METHOD',
      'Each seam needs explicit competing/counterfactual/equivalence/trace and reduction tests.',
      'Successful reduced candidate is preferred only within required coverage, not from matching a few outputs.'),
 29: ('PRIMITIVES',
      'Attempt reduction of generic psychological sliders and new boxes under the same method.',
      'No absence-of-witness necessity and no premature ontology collapse; candidates survive only with earned scope.'),
 30: ('TORTURE CASES',
      'Causally contrasting archetypes and action/control/competence examples preserve desired discrimination.',
      'Examples are not implemented traits or evidence receipts.132 Brief clauses alone do not prove every North Star contrast; exact '
      'relevance/coverage remains an exit question.'),
 31: ('EXPORT',
      'Vivarium receives earned semantic contracts and counterfactuals, not mandatory TypeScript classes/subsystems.',
      'Distillation follows research; current representation success does not establish production feasibility.'),
 32: ('SUCCESS',
      'Forty desired integrated capabilities and counterfactual robustness define eventual architectural success.',
      'Not a claim all40 now pass; Campaign3 traversal and later reduction/scale obligations remain distinct gates.'),
 33: ('MANDATE',
      'Embodied partial knowledge/history/autonomy through explicit deterministic semantics is the governing target.',
      'No claim of present complete implementation, general psychology, universal laws or waived research obligations.')}
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes()==raw
lines=raw.decode('utf-8-sig').splitlines(keepends=True);sections=[(1,0)]
for i,l in enumerate(lines,1):
 m=re.match(r'^#{1,2} (\d+)\. ',l)
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
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],section=section,subject=subject,role='REQUIRED_ARCHITECTURE_OR_EXPLICIT_CANDIDATE_ILLUSTRATION',disposition=d,limits=limits))
assert len(rows)==735
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={i+1 for i,l in enumerate(lines) if l.strip()}
evidence=[]
for n in ['CAMPAIGN3_FINAL_HISTORY_GATE.md','CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md','CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md','DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md']:
 p=P/n;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='NORTH STAR INVARIANTS/CANDIDATES/ILLUSTRATIONS REVIEWED; WIDER HQ011 OPEN',source=dict(path=SOURCE,sha256=sha(B/'sources'/SOURCE)),rows=rows,evidence=evidence,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Normative authority accepted by repository hierarchy, not by filename, draft label or matching text.','Review classifies North Star invariants, candidates, requirements and explicit examples; it does not claim those gates are already met.','No behavioral experiment, implementation change, new verdict or corpus waiver.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],originalOccurrences=len(rows),sections=len(specs),indexedWholeOccurrenceLinks=3032+len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
