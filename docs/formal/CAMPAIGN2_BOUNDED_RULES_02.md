# Bounded Campaign-2 RulesVersion 0.2

**Status: ACCEPTED AND FROZEN (symbolic bundle).**

Exact RulesVersion: `rules/campaign2-bounded-bridge/0.2-candidate`.

Exact ordered compatibility bundle:

```text
substrate/0.2-candidate
cenc/1
content/0.2-candidate
content-kind/0.1-candidate
governed-domain-validator/0.1-candidate
governed-execution/0.1-candidate
ordering/0.2-candidate
ordering-phases/2-candidate
mutation-authority/0.1-candidate#TRC-001-002-addendum
state/0.3-candidate-addendum
projection/0.3-candidate-addendum
identity-binding/0.5-candidate
observation/0.1-candidate
authored-fact-observation/0.1-candidate
observation-unit-identity/0.1-candidate
referent-origin/0.1-candidate
content-definition-id/0.1-candidate
semantic-binding/0.1-candidate#SEM-001H
character-learning-evidence/0.5-candidate
transition-admission/0.4-candidate
transition-admission-extension/0.6-candidate
adaptation-input/0.31-candidate
adaptation-settlement/0.2-candidate
regulatory-reference/0.5-candidate
trace/0.2-candidate
campaign2-trace-binding/0.1-candidate
```

All old bundle entries remain in identical order; the final two entries are the only additions.
Ordered-input profile remains campaign2-ordered-input/0.1-candidate; persistence profile
remains campaign2-persistence/0.1-candidate. No public profile selector or fallback.
The fixed trace profile is defined by CAMPAIGN2_TRACE_BINDING.md. Qualification vectors
are not additional runtime operands.

The old rules/campaign2-bounded-bridge/0.1-candidate remains an immutable historical model.
No retroactive trace implementation under that identity and no save migration alias.
The replacement identity must be materialized and frozen separately before wrapper implementation.
