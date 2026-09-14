# Attributed child boundary component

2026-09-13. `attributed-child-boundary-component/0.1-candidate`.
Primary-agent component shape acceptance implements the accepted child-local ruling.

Consume a trusted owner context (observer, character, current retained acquisitions)
and a supplied attribution-result projection with observer, character, disposition
Supported/Unavailable and child addresses. These are component inputs, not proof of
an authenticated public attribution producer. No caller projection is a public receipt.

Require exact subject/observer equality, bounded dense addresses (at most1024 entries),
nonnegative acquisition ordinals and nonempty NFC child symbols at most64 UTF-8 bytes.
Supported requires at least one address; Unavailable requires no attributed targets.
Normalize duplicate addresses to one, sort by canonical List(Unsigned(acquisition),
Text(child)) bytes and require each normalized child to exist in current memory.
Reuse fragmentation's structural/extant-address validation without applying its
discarded candidate loss. Return detached frozen addresses only. No sibling expansion,
consumed-operand inference, semantic byte matching or historical lookup occurs.

This establishes projection consistency and idempotent normalization only. The future
attribution producer must derive its causal-target role from authenticated observer-side
connection evidence and bind the actual committed result; current Supported/Unavailable
and consumed operands alone are insufficient. False-but-supported targets are not
checked against physical truth. Target qualification and concern qualification must
join before any credit, but this component performs no significance or memory write.
No result identity, provenance store or public state authority is allocated here.
