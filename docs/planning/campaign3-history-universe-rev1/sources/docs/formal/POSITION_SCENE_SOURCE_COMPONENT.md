# Bounded multi-item position scene source

`position-scene-source-component/0.1-candidate`, 2026-09-13.
LOCAL DISPOSITION — no owner ruling required.

This controlled source uses ten strictly increasing positive instants and at most
three distinct scene objects per frame. Each item has exact0..7 position/glyph,
visibility, permission and Preserve/Unresolved role mode. The five authored roles
are the existing attention source's Actor, Target, Participant, Instrument and
Beneficiary. Actual SEM-B compilation validates each binding before allocation.
Compiled attention-scene-object kind/membership is an explicit upstream premise;
structural SemanticReferent validation does not establish that qualification.

Materialization uses existing WorldEventTruth210 and EventBinding211 with the
shared supplied allocator. World/binding identities cannot collide. Actual safe
projection uses the materialized binding's role only when permitted. Hidden or
denied items produce no detection candidate; Unresolved carries no exact role.
Safe ordering compares canonical observed glyph/position/role tuples, never true
referent identity or authored item order. Identical safe tuples remain distinct
indistinguishable candidates; no source identity becomes a perception file key.

Truth and safe results are separate return projections for the trusted source
coordinator. The safe projection has no marker, binding/world ID, role mode,
visibility reason, resolver or access to physical state. This is not itself a
registered observer occurrence: later observation/detection allocation, tracking,
shared experience freeze and actual source admission remain distinct stages.

Returned safe values and stored input are detached. The source holds no mutable
runtime state; repeated materialization needs actual fresh allocator/admission from
the enclosing runtime. It does not claim once-only public ingress or rollback of
allocator reservations. Existing one-point source constructors remain controls.
