# Prior task-concern feedback component

`prior-concern-feedback-component/0.1-candidate`, 2026-09-13. LOCAL DISPOSITION.
Implements the bounded mathematics and narrow projection already proposed in
ATTENTION_DELAYED_CONCERN_DESIGN_REV1 and ATTENTION_FEEDBACK_JOIN_BINDING_REV2.

The trusted adapter supplies an actual TaskConcern388 output and its actual producing
instant. Decode the existing canonical grammar, require zero or one selected task,
and exact equality of the task keys in workspace379, appraisal383 and concern387.
The character holder comes from that actual workspace and must match the task key.
Zero tasks yields NoSelectedTask, with no manufactured concern-response occurrence.
One task yields only the existing concern occurrence, subject, source instant and
detached response386. It never carries workspace, appraisal, forecast or a resolver.

The receiver independently requires the qualified subject to match and SourceAt to
be strictly earlier than the receiving instant. Those structural comparisons do not
authenticate a scheduler event, run or completed delivery. Public parent/output and
one-use join authentication remain mandatory upstream.

KnownIntensity q must lie in[0,1]. Enabled feedback yields residual pool P*(1-q)
and associative weight1+q; focal weight and role eligibility/K remain unchanged.
Disabled feedback retains P and weight1. Unavailable and NoSelectedTask use the
explicit baseline numerical branch, while retaining their distinct source status.
Known zero is never relabelled Unavailable. No result writes a prior encoding,
graph, presentation history, goal or physiological state. The pure calculation is
not a general stress/affect model or a substitute for public feedback qualification.
