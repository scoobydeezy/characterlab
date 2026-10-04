# General attention carrier codec component

Implements `general-attention-carrier/0.1-candidate` and
`general-attention-carrier-allocation/0.1-candidate` beneath cenc/1.

The codec admits the exact allocated record/version and field grammar, closed
finite tags and record unions, collection bounds, canonical identity payloads,
and primitive grammar. The inherited registry is the checked union of attention
and embodied-receiving registries. Shared declarations must agree exactly.
Attention-owned records use the unchanged attention decoder; the embodied and
older cognitive branch uses the unchanged receiving decoder, which delegates to
its embodied/cognitive owners. The attention registry alone does not contain EMB.
Construction round-trips through the authoritative schema registry so a caller's
forged nested schema cannot bypass required fields. Sets/maps retain cenc/1
ordering and duplicate rejection. Decoding creates no occurrence identity.

VersionText and LatticeMass require external grammar context; omission fails
closed. Supplied context does not authenticate a model. The future public compiler
must derive exact versions and scale from its admitted definitions, not input data.

This structural component does not grant public ingress, subject projection,
identity domain membership, occurrence authenticity, cross-field consistency,
state authority or execution. Existing domain-validator obligations remain required.
It is possible to decode a structurally valid carrier that public admission rejects.
No factory, trace binding, corpus member or General Attention verdict is activated.

The separately accepted write-scope successor adds705/1 and706/1. The new wrapper's
write field is a closed distinct-record union of322/1 and705/1. Frozen704/1 continues
to admit only322/1 and is not an alias of706/1. The fixed write-scope checker separately
enforces stage mode, authority, family or allowed root/field/selector shape. Exact
model path sets and PRJ/IDN holder binding remain upstream; a map-key wildcard in a
declaration does not waive actual-target qualification.
