# Task composite-key role correction

**task-commitment/0.2-candidate — internal corrected shape acceptance.**
2026-09-09. Agent adversarial construction review; no runtime qualification.

## Actual upstream authority

CAMPAIGN2_PERMANENT_ALLOCATION.md explicitly requires RecordField role positions
for fields inside record keys and prohibits substituting StateMapKey for them.
The actual stateModel.validatePath implementation confirms the distinction:

* Identity-atom map key: consult StateMapKey(root type, root field).
* Record map key: validate its exact key grammar, then recurse through its RecordField roles.

StateMapKey's FieldId names a field of the state root. It is not a field index inside
the key record. No upstream PRJ/VAL/WRT change is needed or permitted.

## Error in the task proposal

TaskCommitmentKey/371 is a record key. The task0.1 review/allocation mistakenly added
two StateMapKey declarations as though their field numbers addressed371's components.
They do not. The declared373/2 position is not even a field of373/schema1;373/1
cannot impose a scalar CharacterId role on the internal fields of a record key.

The separate numeric audit checked table parity but failed to check that semantic
role-position meaning. Its broad role-ownership PASS is withdrawn for those two
declarations. Preserve its bytes as historical evidence of the mistake. No model
was frozen or activated, and no TC runtime vector was claimed.

## Correct current role closure

Keep exactly these existing allocated RecordField constraints:

    RecordField(371,1) →1002 + validator/character-qualification
    RecordField(371,2) →1002 + validator/task-qualification

The exact key grammar for373/1 remains CanonicalRecord(371/1). Existing state-key
validation then applies both RecordField roles after the key shape is admitted.
There are **zero new StateMapKey constraints** for this root. Existing IDN268/1
StateMapKey/ObserverId and other inherited declarations remain unchanged.

The corrected task-profile compiler rejects either erroneous373 StateMapKey
declaration, rather than accepting an unused or special-case role. Do not add a
new interpretation of264, a second key-role family or a runtime adapter that indexes
inside record keys by pretending StateMapKey means RecordField.

## Correct-forward disposition

The seven record allocations370..376/schema1,34fields,14member payloads, three status
variants and ten scalar RecordField role positions remain permanently unchanged.
No schema field is added, removed, renumbered or reserved. The mistaken metadata's
reference to373/2 never allocated a new field2 in373.

task-commitment-allocation/0.2-candidate is the effective role closure, with an empty
mapKeyRoles collection. Preserve the original0.1 allocation/draft/review/audit files.
The corrected semantic version is task-commitment/0.2-candidate; all other lifecycle
mathematics, scheduling, content/spec, sources, writes and boundaries remain as in
TASK_COMMITMENTS.md and its normative registration closure, subject to this correction.

The pending model's task spec and executing-seam declarations must name0.2. Its
original proposed Rules0.1 tuple was not frozen, so the first model can select this
correction before its own first freeze. No earlier model or permanent registry is
rewritten. Task-content-kind and task-domain-validator semantics are unchanged.

## Required direct controls

Construction must reject StateMapKey373/1 and373/2 additions. Actual state construction
must accept371(C,task), reject371(task,task) and371(C,C), and reject a typed identity
atom in place of371. These need real WRT/state compiler execution, not just a count
of new role entries. Missing either RecordField role must fail exact model admission.

TC-A..L remain NOT PASSED. Numeric correction consistency is not runtime authority
qualification. This correction is agent-owned and does not require a user decision.
