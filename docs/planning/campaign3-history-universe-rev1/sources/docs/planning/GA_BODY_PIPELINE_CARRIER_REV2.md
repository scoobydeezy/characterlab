# Body selection and cue public carrier — revision 2

2026-09-13. LOCAL DISPOSITION — no owner ruling required. Symbolic field closure;
component source/selection/cue evidence does not activate these public records.

## One source, two separately admitted paths

BodyOpportunityEvidence contains Observer, At, Samples, optional Experience and safe
Declarations. Samples are exactly the requested actual461/463 outputs, at most9.
Declarations map only those requested channels to safe signals, at most3 signals and
3 views each. They contain no physical reserve key or source-definition resolver.
The adapter validates this projection against the compiled source declaration rather
than trusting supplied equivalent-looking declarations. Unrequested channels appear
in neither collection. Each requested channel appears exactly once, even when unavailable.

Experience is the actual frozen227, present iff the containing combined opportunity
reserved one. For the body-only branch that means at least one present sample. In a
combined source, panel/visual evidence can justify the one experience even with no
present body sample. Never make a second body reservation. A present body sample with
no experience rejects. Full experience support must be authenticated against the
whole combined source before releasing this safe subprojection to a body consumer.

One exact completed source can produce both BodySelectionInput and BodyCueInput.
Selection uses the declared durable group capacity. Cue uses its separately admitted
current-signal permission. There is no dependency from selected groups to cue eligibility.
Both inputs contain the same bound safe source, with no copied physical source object.

## Selection audit and view

BodySelectionAudit owns the sole existing1143 selection occurrence, Observer, At,
optional Opportunity:ExperienceId, and bounded Rows. Each row records safe Signal,
actual present ViewCount and Selected/Capacity/Unavailable disposition. Zero-valued
present samples remain present. A full unavailable batch still completes an actual
empty selection when that selector is requested; it is not no selector occurrence.

BodySelectedView references Selection, Observer, At and that same optional Opportunity,
with0..3 selected PositiveBodySignalGroups. It has no independent occurrence or allocation.
Selected groups contain every admitted present view of that signal, including
contradictory intervals; grouping does not average them or choose the most convenient.
Optional perceived-context companions must come from the actual combined SEM/panel
association, not channel labels or source schedule. The body-only branch has none.

Formation-source enrollment authenticates the actual audit/view pair and PRJ/IDN before
testing whether positive groups exist. Positive groups can produce the proposed
AcquisitionFormationEvidence with a fresh acquisition occurrence; zero groups produce
none. No body field is inserted into old visual532/534. Raw samples cannot emit EVID270.

## Cue and recall

BodySignalCue contains Observer, At, optional Opportunity, Status, Signals and Supporting
observation IDs. Present requires a nonempty exact signal set and its actual present
sample support; Absent requires both sets empty. A sensed zero still supplies a cue.
Absent may retain the actual opportunity identity when sensing occurred but cue
permission was denied; it must not invent one when the source had no experience.
No sample interval, raw-sample resolver, physical identity or selection ID is included.

BodyRecallInput contains ObserverId and that actual cue. Its subject requirement is
resolved through PRJ/IDN after source admission. An absent cue takes the registered
no-memory-read branch, rather than invoking the component's input-validation scan as
a public read. Present cue performs the exact bounded ordinary owner read and direct
signal/acquisition-recency rule, returning the separately drafted BodyRecallResult.
Recall allocates no acquisition or formation source and adds no presentation/use credit
merely by reading. Later explicitly authenticated consumers retain their own authority.

## Remaining gate

The machine packet closes names and finite fields, including the genuine no-experience
branch. Exact registrations, source/PRJ roles, owner paths, output occurrence/multiplicity
rules, admitted source-version set and whole-instant work/rollback/restore remain OPEN.
General combined sensing and public admission are not qualified by the body-only
component. No numbers, model version or corpus member are allocated here.
