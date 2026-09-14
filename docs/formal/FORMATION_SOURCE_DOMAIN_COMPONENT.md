# Formation source-domain component

2026-09-12. `formation-source-domain-component/0.1-candidate`.
Component shape accepted by primary-agent self-review under autonomous authorization.
Consumes the accepted finite distinct-source envelope, separately from successful history.

Input: prior committed source domain, one unique set of incoming already-qualified
source addresses, and fixed lifetime limit N. Qualification/metadata follows
formation-governance-component/0.1-candidate. Component N is integer0..64;64 is a
safety ceiling, not a public committed parameter. Validate both sets before extension.

Union by exact (character,source) address. Existing kind must agree. Existing membership
costs no new slot; distinct subjects remain distinct qualified addresses. Duplicate
declarations within the supplied incoming set reject; a future caller must construct
the distinct set from authenticated obligations without merging conflicting metadata.
If the whole union exceeds N, reject without returning a partial accepted prefix.

Return detached immutable source/character/kind entries ordered by canonical bytes of
list(text(character),text(source)). No numerical ID chronology, attempt count, success
flag, cognition or sample payload is encoded. This set records admission membership,
not failure history. Never-successful admitted sources consume the envelope too.
Only successful formations additionally enter the separate governance table.

The source domain grows monotonically within a run. Losing content or restoring state
does not free slots. The pure component cannot authenticate prior state or ensure the
caller keeps N unchanged. Public run configuration must bind N and preserve the exact
domain on restore. This is not a public runtime codec or a new write authority.

Public integration must check the envelope before ordinary formation admission and
before the positive-content branch can skip governance. Out-of-envelope requests must
be rejected as profile admission, with no acquisition or cognitive loss/event. Actual
failed instants follow existing whole-instant rollback and terminal-run behavior;
component input preservation is not itself that proof.
