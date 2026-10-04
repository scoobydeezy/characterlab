# Panel and body opportunity composition

`panel-body-opportunity-component/0.1-candidate`, 2026-09-13.
LOCAL DISPOSITION — no owner ruling required. Actual bounded sources and SEM
composition; public producer/subject admission remains OPEN.

This branch samples one requested trial panel and1..9 requested body channels at
the same observer/instant. It invokes the actual panel and local-reserve sources,
allocates each observation once through the trusted shared allocator, and derives
presence from those returned observations. A present panel allocates one event
detection; body evidence alone allocates none. Reserve exactly one SEM ExperienceId
iff the panel or any body view is present. There is never a body-only reservation
followed by a second panel reservation. All-unavailable input reserves none.

The actual panel event-file operation is prepared transactionally. Freeze the
experience at14/124 in the selected accepted lane, with exactly the present panel
and body observations as support and the actually perceived panel context if any.
Only then publish the panel candidate. An invalid reservation/freeze cannot publish
the new context. The enclosing runtime still owns allocator/output/whole-instant
rollback; this local transaction does not qualify public save/restart.

The body branch returns this same optional experience to its independent selector
and cue gates. Panel-only presence may therefore provide a real experience while
the body selector is empty and body cue absent. Present body plus zero selection
capacity can still supply a current cue. The context companion exists only for an
actually present panel and names the same experience and event-file identity.

This is explicitly the panel/body subset, not a visual producer. It cannot freeze
a combined visual opportunity before that opportunity's actual tracks/bindings are
available. Visual binding, selected spatial witnesses and public canonical panel
records remain OPEN. Unrequested channels cannot be passed as fabricated absent
observations. Both channels are genuinely requested in this bounded branch.
