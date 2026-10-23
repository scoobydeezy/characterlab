import type {DispositionPagedPair} from './dispositionPagedPair';

/** Portable diagnostics from a published pair; source references are not embedded saves. */
export function dispositionPagedComparisonSummary(view:ReturnType<DispositionPagedPair['summary']>){
 if(view.failure)throw Error('Cannot summarize a failed pair as current');
 const c=view.comparison;
 for(const b of ['a','b'] as const){
  const s=view[b],h=view.history[b].source,q=view.choices[b];
  if(c[b].saveHash!==s.saveHash||c[b].prefix!==s.prefix||h.saveHash!==s.saveHash||h.prefix!==s.prefix||q.saveHash!==s.saveHash||q.prefix!==s.prefix||q.program!==s.program)throw Error('Mixed comparison summary revisions');
 }
 if(view.choices.comparison!==c.contrast.id)throw Error('Mixed comparison summary contrasts');
 const artifact=structuredClone({
  version:'disposition-paged-comparison-summary/0.1',seamVersion:view.a.seamVersion,
  audience:'researcher',comparison:c,choices:view.choices,storedHistory:view.history,
  stateDivergence:{status:'unavailable',reason:'Current state equality is recorded. No historical state hashes are reconstructed from scalar history.'},
  limitations:[
   'Researcher diagnostics only; not character/player knowledge, a checkpoint or a standalone save authenticator.',
   'Field values are referenced by branch saveHash and exact state selector, not embedded. Restore the matching paired checkpoint to retrieve those pages.',
   'Stored scalar history hashes identify the containing current saves, not historical saves. Refold absence remains distinct from zero.',
   'Choice differences are recorded decisions, not successful execution, psychological significance or independent causal necessity.',
   'Reason factors, architecture participation and execution outcomes require their separate revision-bound diagnostic reports; they are not inferred here.',
  ],
 });
 const first=artifact.choices.firstDifference;
 const text=[
  'CharacterLab — DISPOSITION paged comparison summary',
  `Declared comparison: ${c.contrast.id}`,
  `A: ${c.a.program} at ${c.a.prefix} | B: ${c.b.program} at ${c.b.prefix}`,
  `Controlled change: ${c.contrast.changed} (${c.contrast.kind})`,
  `Aligned: ${c.aligned}; current state equality: ${c.stateEqual}; mechanism projection equality: ${c.mechanismProjectionEqual}`,
  `First recorded choice/emission difference: ${first?`instant ${first.instant} (${first.outcome})`:'none within jointly recorded instants'}`,
  `First exact state divergence: unavailable. ${artifact.stateDivergence.reason}`,
  ...artifact.limitations,'','Exact report:',JSON.stringify(artifact,null,2),
 ].join('\n');
 if(text.length>8_000_000)throw Error('Comparison summary exceeds explicit 8-million-character limit; no truncated report produced');
 return {artifact,text};
}
