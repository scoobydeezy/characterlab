# Two-position perceived trial grouping

`retained-position-trial-grouping/0.1-candidate` — locally accepted component shape,
2026-09-13. Retains the old one-motion grouping as its separately named control.

Consumes up to16 unique, same-observer, valid safe SEM experiences with admitted
Before/Motion/After role projections. For one supplied perceived event-file context,
requires exactly one Before, two Motion observations and one After. The two Motion
observations are ordered by their explicit observation instants, not occurrence IDs
or input order. Before <= start < end < After is required. Duplicate times reject;
excess role members are AmbiguousRole, missing members IncompleteContext and absent
context MissingContext. No subset search repairs an ambiguous group.

Returns only the existing four experience identities and context, never new motion
or trial identity, sample values, target address or causal conclusion. The consumer
resolves each identity to its exact admitted retained view. Neutral displayed Motion
labels can span two position observations; this is not general inferred segmentation.
Public role/source provenance and carrier allocation remain unqualified.
