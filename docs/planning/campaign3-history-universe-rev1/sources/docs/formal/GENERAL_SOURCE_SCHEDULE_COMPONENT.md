# Bounded General Attention source schedule

`general-source-schedule-component/0.1-candidate`, 2026-09-13.
LOCAL DISPOSITION — no owner ruling required.

This trusted compiled-data check instantiates the source/use declarations before
runtime admission. It validates at most32 strictly increasing observation originals
in (initialClock, horizon], each with Current or Consequence lane, an exact sampling
request and an independently authored use plan. Both clock bounds are exact SimInstant
values. This first profile admits one observation original per instant; separately
admitted physical and lifecycle originals may share an instant where their contracts
permit. It does not sort malformed input or infer a lane from timing.

At least one surface is requested. Body requests contain1..9 distinct known channels.
Body selection/cue require a body request; visual selection/cue require a visual
request. Selection and cue flags are independent. Sensing without either is lawful.
A goal assessment requires a known assessment definition, consequence lane and body
request. The first profile excludes assessment at a lifecycle instant. Missing safe
context or an unavailable sample remains an actual runtime unavailable result; this
check cannot invent either evidence or a qualification.

The run is bounded independently by10 visual sweeps,16 panel sweeps and32 completed
selection slots. A combined body/visual selection counts twice. Count before source
visibility, permission, positive encoding or capacity; an empty completed selection
still uses its slot. Cue-only sensing counts its sensing surfaces and no selection.
An input limit is not substituted for the formation-source envelope. A future prefix
extension must validate the whole declared run, not reset these counts per chunk.

All operands are exact data objects, dense arrays and canonical nonempty symbols.
Returned entries are detached and frozen. No sampling, occurrence allocation, state
write, PRJ, authentication or successful-formation claim occurs here. Symbolic names
refer to already compiled definitions; they are not new public identity payloads.
Public canonical decoding, actual producer/output association, exact source-frame
coverage, cue detection cardinality, work bounds, owner/hook registration, queue and
complete-prefix validation remain separate obligations.

This is a conservative finite profile, not a psychological limit. Preserve a future
separately bounded concurrent-observation profile as a comparator/extension; admitting
it requires explicit shared tracking/segmentation ordering and complete batch proof.
No established capability or generic source contract is narrowed by this component.
