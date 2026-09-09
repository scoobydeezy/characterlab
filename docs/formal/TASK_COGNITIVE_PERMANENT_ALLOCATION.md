# Task cognitive permanent allocation

Version: task-cognitive-allocation/0.1-candidate. **PERMANENT AND FROZEN.**

Internal separate numeric review accepts the one-to-one realization of
task-cognitive-path/0.1-candidate in [the complete table](TASK_COGNITIVE_ALLOCATION_TABLE.json).

- Records377..452/schema1:76 new records,244 fields.
- TaskCommitmentState373/schema2: unchanged field1 plus permanent field2 AdoptedInstructions.
- New discriminator namespaces1040..1043 and output occurrence namespaces1128..1141.
-103 exact fixed members,52 scalar RecordField roles,16 finite enums and17 union branches.

The proposed [human field/namespace/member tables](../planning/TASK_COGNITIVE_ALLOCATION_DRAFT.md)
were independently parsed against the machine table. All prior allocation artifacts
remain byte-identical. Type373/schema1 remains frozen and is not an alias for schema2.
TaskIdentityState is415/1; DecisionResolution409/1; ExecutionOutcome433/1.

UnionVariantDefinition259 uses payload-only field sets excluding VariantTag field1.
The whole-record union requiredFields and the separately listed unionDefinitions
make that mapping explicit. Namespace1024 uses its existing canonical unsigned-pair
payload, never a text spelling or a new identity family.

No renumbering, reuse or insertion-by-shifting. Numeric adjacency has no semantic
meaning. Runtime ordinals use the existing allocator and279/278 rules only. No
comparison-role/key namespace, standalone coverage operand or truth-view occurrence
is allocated. Singleton member admission remains receiving-profile enforcement.

Model materialization/freeze, semantic implementation, adversarial runtime controls
and RNG persistence remain OPEN. No factory or behavioral gate passes by allocation.
Campaign2 remains OPEN.
