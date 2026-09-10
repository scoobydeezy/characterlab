# EMB packaging input-reference correction

2026-09-10. **ACCEPTED CORRECTION; NO ALLOCATION OR SEMANTIC CHANGE.**

Constructing the complete declaration image exposed a transcription error in packaging
revision1's ordered-input paragraph and inventory receipt. The accepted symbolic source
is LevelSamplingOpportunity; its frozen allocation is **459/1**, not458/1.
Record458/1 is LevelChannelDefinition. Replenishment input remains478/1.

The exact admitted input payload schemas are therefore459/1 and478/1. Every reference
to “sampling458”, “exact458/1 or478/1” or an equivalent numeric input-row spelling in
the packaging proposal/receipt is superseded by459/1 and478/1 respectively. The five-slot
outer encoding, event types, phases, field shapes, nine inputs and source authentication
are unchanged. A channel definition cannot be submitted as a sampling opportunity.

The shape acceptance always names LevelSamplingOpportunity as the source. This corrects
its packaging cross-reference to the already frozen table, not that source contract.
Historical proposal, acceptance and receipt bytes remain preserved. The allocation
table is untouched. New declaration construction resolves record numbers by their
allocated schema names. No frozen model exists yet and no replay bytes are reinterpreted.

Add EPACK-I, **FROZEN, NOT PASSED**: actual459 opportunity enters only the matching
sampling source, while otherwise valid458 channel definition rejects as an original
input. Type-correct metadata cannot replace the admitted source payload.
