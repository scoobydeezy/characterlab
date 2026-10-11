"""Classify the research charter's complete normative scope, without awarding gates."""
from pathlib import Path
import re,json,hashlib
P=Path('docs/planning');B=P/'campaign3-history-universe-rev1';O=P/'campaign3-history-research-charter-rev1'
SOURCE='CharacterLab — Ideal Character Research Program Brief.md'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,v):
 if p.exists():assert load(p)==v,p
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
specs={
 0:('CHARTER ROLE','Governing research method beneath required architecture; draft label does not demote its assigned authority.','Not an implementation-status report or scientific qualification.'),
 1:('MISSION','Overcomplete topology is a superset hypothesis to traverse, test and reduce across the Vivarium-relevant frontier.','Not universal psychology; no convenience-driven omission or complexity-as-success.'),
 2:('SCOPED AUTHORITY','North Star capabilities, Architecture topology, formal exact semantics, research method, plan sequence and experiment specifics have distinct authority.','Method cannot override exact accepted arithmetic; formal semantics cannot waive required phenomena. Resolve genuine conflicts explicitly.'),
 3:('RESET','Old findings/controls/substrate survive with tested scope; old implementation does not automatically govern new architecture.','Unimplemented required distinctions are still topology, not optional future features; no silent historical deletion.'),
 4:('DISTILLATION PURPOSE','Research causal sufficiency precedes production representation/cost selection.','Expensive research may be useful; no automatic direct code export or production acceptance.'),
 5:('VALIDITY CRITERIA','Architecture invariants, retained phenomena and causal counterfactuals judge the reference, which is itself a hypothesis.','Same chosen output is not equivalent intent/history/agency; behavior requirements do not alone require a stored root.'),
 6:('HARD CONSTRAINTS','Complete model/run/experiment identities; deterministic transformations, observer-safe evidence, immutable historical meaning and sole persistent mutation authorities.','Semantic examples illustrate desired derivations, not executed fear/identity/control claims. LLM/wall clock/ambient order cannot decide simulation truth. Shared fact can have distinct effects but not duplicate pressure by restatement.'),
 7:('PROOF BURDEN','Mathematical validity, semantic meaning, psychological sufficiency and architectural necessity differ; formal/test/behavior/counterfactual/comparator/trace package is required.','Useful behavior alone is not necessity. Plausible formula is not evidence; four validity classes must not collapse.'),
 8:('NUMERIC SUBSTRATE','Exact rational oracle and versioned ties-even lattice are tools; quantization placement and feedback boundaries are explicit. Addressed random keys retain purpose/coupling.','One-step lattice error is not accumulated dynamic error. Counter hash shorthand does not specify distribution sampling; exact formal contract supplies encoding/mapping/bias. No global stream or model identity in natural address.'),
 9:('REFERENCE FIRST','Make contracted seams and intact legitimate path, then serious alternatives and same declared corpus; witness for difference, coverage for equivalence.','DERIVED/MERGED/COMPRESSED/RETRACTED need explicit domain and causal comparison. UNRESOLVED is legitimate. A successful comparator is not a failed research experiment.'),
 10:('SEAM TEMPLATE','Before implementation fix domain/units/reads/writes/permissions/failure/transformation/randomness/quantization/order/timing/invariants/trace/controls/equivalence.','Bounded contract drafting may be locally resolved under escalation policy; code or intuition cannot silently fill missing authoritative semantics.'),
 11:('REFERENCE POLICY','Thin explicit replaceable mechanisms and retained named competitors; legacy decision/dice/identity pipeline has an initial port/control obligation.','Mandatory initial control is not universal necessity, permanent module boundary or calibration. No generic weighted-random replacement without purpose-built comparison.'),
 12:('PHENOMENON REQUIREMENTS','All15 families and their132 listed clauses are normative requirements for the frontier; later owner development requirements supplement scope.','Clause enumeration is not a pass. Bounded witnesses, native/component scope and remaining coupled/history gates must be separately proven. Labels such as confidently wrong do not calibrate a confidence diagnostic.'),
 13:('EXPERIMENT CLASSES','Baseline/counterfactual/ablation/derivation/merger/compression/substitution/competing/adversarial designs pose different questions.','Named Mina/Glen/Priya scenarios and mechanism diagrams are illustrative proposals, not completed findings or authoritative world state.'),
 14:('COUNTERFACTUAL DISCIPLINE','Single deliberate causal intervention with controlled model/state/seed/order/context and exact intermediates is preferred.','Matching seed alone is not matched address/uniform coupling; source-history interventions legitimately differ only through their declared intervention.'),
 15:('TRACE','Every important derivation reproducible from named authoritative sources; skipped/nonapplicable stages explicit.','Ideal trace diagram is conceptual, not exact phase registration or proof every event runs every box.'),
 16:('DOUBLE COUNTING','Provenance must distinguish genuine independent downstream effects from repeated descriptions of pressure.','Stress/fear/reason example is an audit hypothesis; cannot blanket-remove one channel without examining its defined effect.'),
 17:('VERDICTS','Verdicts attach to tested distinctions with corpus/domain/coupling/equivalence/coverage/exclusion/reopen records.','Lack of a good competitor does not earn RETAINED; no observed difference alone does not earn equivalence. No confidence theater.'),
 18:('CAMPAIGNS','Research uncertainty or tightly coupled seams define campaigns; listed domains are examples.','Not a fixed additive phase order; plan owns sequence.'),
 19:('ENTRY','Formal readiness, required discrimination, controls, dependencies, outputs and admissible verdicts precede campaign entry.','Successful implementation alone is not a research outcome; isolate unresolved decisions only with explicit non-effect argument.'),
 20:('COMPLETION','Report behavior/failures, numerical/semantic findings, architectural/counterfactual results, cost, new corpus and reopen requirements.','Required review categories are questions, not completed results. Cost measurements inform distillation without disproving necessity.'),
 21:('BUILD RULES','Implement ideal topology through exact contracts, thin references and strong discriminating experiments; stop increasing fidelity when comparison is adequate.','Plan sequence cannot override methodology; maintain controls/corpus and update verdicts instead of silently canonizing implementation.'),
 22:('EXPORT','Export semantic ownership/equations/boundaries/timing/provenance/approximation/failures after causal reduction; compare distribution and later learning as well as action.','Production reduction is separate; no automatic copy of research class or raw outcome equivalence.'),
 23:('SCALING','Eventually characterize state/trace growth, work, events, sparsity, invalidation and analytical/compression opportunities.','Causal necessity may coexist with production-unsuitable representation. Small finite research runs do not establish Vivarium scale.'),
 24:('OUTPUT EXAMPLES','Psychological, computational, architectural and production conclusions are required report dimensions.','The attachment, multi-hop and sparse-index quoted findings are explicitly examples, not earned equivalence or retirement verdicts.'),
 25:('SUBSTRATE PRESERVATION','Keep deterministic utilities, fixtures, coupling and controls until a concrete conflict or explicit research disposition.','Preservation is not immunity from future falsification; infrastructure is not psychological ontology.'),
 26:('RETRACTED PREMISES','Seven axes, immutable personality, stored Need, Need-derived Values, global graph, scalar affect, generic inhibition/withdrawal/option list and private-state visibility are not governing assumptions.','Retracting a premise does not refute every candidate using it; controlled research may recover a bounded result.'),
 27:('MISSION STOP','Classify all required distinctions across retained phenomena, preserve explicit semantics/boundaries, reduce sufficiently and characterize distillation.','Foundational mission endpoint is not the earlier Campaign3 traversal checkpoint; unresolved limits remain explicit, not fabricated closure.'),
 28:('REOPEN','New phenomena/counterfactuals/leaks/provenance/history/production requirements can reopen verdicts.','Earlier experiments remain evidence; their findings neither disappear nor become universal law.'),
 29:('RESEARCH PRINCIPLES','Labels require mechanisms, transformations invariants, claims experiments, reductions counterfactuals and semantics provenance.','These are normative standards, not evidence that the current implementation already satisfies them.'),
 30:('POSTURE','Preserve distinctions long enough to test, reduce after evidence, retain epistemic/history/intent/competence/communication boundaries.','Expensive math/complexity is not necessity; explicit uncertainty preferred over false precision.'),
 31:('SOURCE ANCHORS','North Star/Architecture govern; historical briefs/code/log and external Vivarium formula inventory inform hypotheses/controls.','Current external file is not authenticated historical pinned bytes. Every imported formula needs classification and formal re-specification; HQ009 provenance remains unresolved.'),
 32:('SEQUENCE DELEGATION','Separate campaign plan sequences substrate, topology, controls, cross-domain scenarios and retained comparison corpus.','Does not revive the historical additive phase ladder or waive formal readiness.')}
raw=(B/'sources'/SOURCE).read_bytes();assert Path(SOURCE).read_bytes()==raw
lines=raw.decode('utf-8-sig').splitlines(keepends=True);sections=[(1,0)]
for i,l in enumerate(lines,1):
 m=re.match(r'^# (\d+)\.',l)
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
  rows.append(dict(occurrenceId=u['id'],location=u['location'],text=u['text'],section=section,subject=subject,role='NORMATIVE_RESEARCH_METHOD_OR_EXPLICIT_ILLUSTRATION',disposition=d,limits=limits))
assert len(rows)==756
assert {n for r in rows for n in range(r['location']['startLine'],r['location']['endLine']+1)}=={i+1 for i,l in enumerate(lines) if l.strip()}
evidence=[]
for n in ['CAMPAIGN3_FINAL_HISTORY_GATE.md','CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md','CAMPAIGN3_HISTORY_HQ009_CHECKPOINT.md','DEVELOPMENT_OWNER_REQUIREMENTS_2026_10_01.md']:
 p=P/n;evidence.append(dict(path=p.as_posix(),sha256=sha(p)))
v=dict(status='RESEARCH CHARTER REQUIREMENTS/ILLUSTRATIONS REVIEWED; WIDER HQ011 OPEN',source=dict(path=SOURCE,sha256=sha(B/'sources'/SOURCE)),rows=rows,evidence=evidence,obligations=['RO-C3-019','RO-C3-020','RO-C3-021'],limits=['Normative authority accepted by repository hierarchy, not by filename, draft label or matching text.','Review classifies the charter requirements and explicit examples; it does not claim those gates are already met.','No behavioral experiment, implementation change, new verdict or corpus waiver.'])
O.mkdir(exist_ok=True);save(O/'review.json',v)
c=dict(status=v['status'],originalOccurrences=len(rows),sections=len(specs),indexedWholeOccurrenceLinks=2276+len(rows),reviewSha256=sha(O/'review.json'),checkerSha256=sha(__file__))
save(O/'check.json',c);print(json.dumps(c))
