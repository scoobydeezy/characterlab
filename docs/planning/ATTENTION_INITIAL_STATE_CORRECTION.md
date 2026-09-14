# ATTN specimen initial-state correction

2026-09-11. Accepted correct-forward implementation finding under autonomous review.
The first actual public run rejected the old specimen S0 before transition ingress:
`state/0.2-candidate` requires a canonical set of StateLeaf records. The image builder
and independent review had both assumed an empty list. Their declaration and model
identity checks did not establish state restore admissibility.

The [corrected cohort](campaign3-attention-model-rev2/FREEZE.json) uses the actual
`new AuthoritativeState([]).canonicalValue()` and passes actual restoreAuthoritativeState.
All32 ModelIdentities, model images, seven original-input images, seed and semantics
are unchanged. All224 specimen RunIdentities change because S0 bytes change. They
are not aliases for the old commitments. No accepted allocation or contract is edited.

The old cohort and failed public-test receipt remain historical. Its32 models remain
valid model commitments; its224 list-S0 specimen runs are invalid for public state
admission and are superseded. The corrected cohort is current. Public qualification
remains pending; this correction alone passes no AT2 vector.
