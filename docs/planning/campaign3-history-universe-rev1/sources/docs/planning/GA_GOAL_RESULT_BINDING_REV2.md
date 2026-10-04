# Goal/result canonical binding correction — revision 2

2026-09-13. LOCAL DISPOSITION — no owner ruling required.

The existing FiniteLevelInterval/462 has rational Lower and Upper, but its actual
decoder requires Lower < Upper. Goal distance, desired ranges and singleton evidence
use closed intervals and legitimately permit equality. Record462 therefore cannot
be reused merely because its fields look similar. Its historical bytes and positive
width admission remain unchanged.

Add a symbolic GoalClosedInterval with rational Lower and Upper, permitting equality.
For the first metric profile both endpoints are in [0,100], Lower <= Upper. The goal
spec further checks containment in its declared metric signal domain; distance
results are derived by the existing exact distance law, not arbitrary interval input.
This is a record representation, not a new scalar identity or measurement precision
law. No permanent record number is assigned. Raw embodied observation still uses462;
the adapter converts its actual admitted endpoints to the goal component's values.

The inspected ordered-input compiler assigns each original eventId and eventSequence
to its zero-based list index (`src/campaign2/orderedInputs.ts`, compile schedule).
The delivery's OriginalAddress therefore uses that existing canonical unsigned
original index. It is not a typed semantic occurrence and introduces no namespace.
Admission checks index < original count, exact expected ScheduledEvent serialization,
matching due instant and exact current RunIdentity/compiler authority. Unsigned type
alone is not authentication. Runtime-emitted events cannot impersonate originals just
because their eventIds are well formed.

The revision2 machine inventory replaces the unresolved ExactInterval reference with
GoalClosedInterval and specifies OriginalAddress as unsigned. No other behavioral
shape changes. Source/result binding, exact registrations and public execution remain
OPEN; the revision1 structural receipt remains accurate for that earlier inventory.
