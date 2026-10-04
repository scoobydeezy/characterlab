# Event presentation history settlement

`event-presentation-settlement/0.1-candidate`,2026-09-13.
LOCAL DISPOSITION — no owner ruling required. Implements the event-only history
boundary already specified in GA_RECOLLECTION_CARRIER_REV3.

The pure component consumes trusted prior and new acquisition metadata, the validated
ordinary-memory owner's actual surviving identities, prior presentation history and
separately authenticated actual presentation descriptors. It reads no memory payload,
graph, body truth, ranking or selection result. These arguments are owner descriptors,
not observer evidence or an alternate public admission API.

Each prior event acquisition has exactly one nonempty history beginning at its original
formation time. All prior times precede the target instant. New event formation seeds
one time; body formation never seeds. A later presentation must identify an existing
event acquisition and one actual recollection occurrence. Distinct presentations may
share an instant; duplicate occurrence use in a batch rejects. Source-event binding,
cross-instant replay exclusion and exact schema/version admission remain upstream.

The32-acquisition and32-instants-per-entry profile bounds reject overflow, including
when the affected acquisition will lose all children in this batch. There is no silent
truncation. Fresh acquisition cannot be recalled from B0 at this same instant.

After validating the complete batch, discard history for actual complete memory loss;
partial loss preserves the acquisition's history unchanged. This does not erase any
learned graph node. Return detached entries in canonical acquisition order. No state
is committed or identity allocated by the component.

Recall alone supplies no presentation operation. Current presentation never changes
same-instant ranking, use protection or significance. Naming a production consumer,
its exact dispatch and public owner registration remains an independent gate.
