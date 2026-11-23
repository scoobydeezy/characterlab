# Paired reward sensing — assembled0.149
M229; assembled-reward-experience/0.6-candidate over0.5.
Same physical axis, C1 lanes, receipt association, history821 and expectation823.
Numeric expectation0.3 MeanHistory/ties-even and Residual remain unchanged.

Slot57 .6 retains the eight fields and domains of .5 with the .6 tag.
Source [.6,permitted,[currentBias,consequenceBias],learn,[practice],[reports]]
retains .5 rules except the bias field is exactly two signed integers -1000..1000.
Each observation applies its lane's declared bias to the same existing sensor:
floor(clamp(max(0,physicalLevel-baseline)+bias)/resolution)*resolution.
Both lanes share permission/resolution; a denied reading remains absent.
No direct override of inferred reward, learned efficacy, action choice or history.
A sensor perturbation can produce a false gain after a physically failed attempt;
the learner receives the admitted observation, never a physical-success shortcut.

Current phases11..20 and Consequence121..124 retain separate same-observer
observation/experience support. Existing delta=max(0,after-before) is known only
if both readings are permitted. An own attempt binds that delta to its action.
The authoritative physical reward still changes only on an Applied body effect.
Existing execution-opportunity source can obstruct delivery independently of
known strategy availability; this changes neither motive nor pre-outcome meaning.
Biases/physical level stay in source/quantization trace, not learned evidence.
No new random draw, owner, phase, event type, report mode or model dispatch.

Versions0.5 and earlier preserve their scalar bias in both lanes and exact bytes.
Old model versions reject .6 declarations; .6 rejects scalar/malformed/out-of-range
biases. Two-action report behavior, reports-versus-attempt guards, denial and
learning withholding remain0.5 semantics. No confidence/reliability update added.
False-feedback controls qualify this bounded observation channel only; no general
hallucination, causal attribution, independent sources or final family acceptance.
