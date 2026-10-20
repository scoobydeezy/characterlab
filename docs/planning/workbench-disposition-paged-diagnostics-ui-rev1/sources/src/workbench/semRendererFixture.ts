// Generated CV-SEM-012 diagnostic fixture only; no accepted rendering seam.
import {authoredReferentKey} from '../test/fixtures/referentOrigin';

import { EventRoleId } from '../semanticBinding/eventBindings';
import { PerceptualFacetId } from '../semanticBinding/perceptualClassification';
import type { RecognitionResolutionRecord } from '../semanticBinding/recognition';
import {
  GLEN,
  REFERENT,
  createRunAllocator,
  projectObserver,
  stringifyWithBigInts,
  truthBindings,
  recognizeObserverContinuant,
  type CatalogCandidate,
  type ObserverProjection,
} from '../test/fixtures/phenSem001';
import {
  NARRATIVE_PRESENTATION,
  PLAIN_PRESENTATION,
  RENDERER_VIEWPOINTS,
  renderAllViewpoints,
  renderView,
  type RenderRequest,
} from '../test/fixtures/phenSem001Renderer';

/**
 * Glen's own catalog. Seeded observer knowledge: he independently holds these two person
 * candidates, which is why either may legitimately appear in his own account of the event. The
 * truth referents he never holds — the library, the pipe, the action, and himself — are the ones
 * whose appearance in a character view would be a leak.
 */
const MINA_CANDIDATE: CatalogCandidate = {
  candidateSemanticReferentId: authoredReferentKey('person.mina'), recognitionTemplateId: 'template/mina',
};
const DARIUS_CANDIDATE: CatalogCandidate = {
  candidateSemanticReferentId: authoredReferentKey('person.darius'), recognitionTemplateId: 'template/darius',
};
const GLEN_CATALOG: readonly CatalogCandidate[] = Object.freeze([MINA_CANDIDATE, DARIUS_CANDIDATE]);

const CATALOG_IDENTITIES: ReadonlySet<string> = new Set(
  GLEN_CATALOG.map((candidate) => candidate.candidateSemanticReferentId));

/** Truth referents that appear nowhere in Glen's catalog. None may reach a character view. */
const NON_CATALOG_TRUTH_REFERENTS: readonly string[] = Object.freeze([
  REFERENT.library.semanticReferentId,
  REFERENT.leadPipe.semanticReferentId,
  REFERENT.skipRope.semanticReferentId,
  REFERENT.glen.semanticReferentId,
]);

interface Scenario {
  readonly first: ObserverProjection;
  readonly resolutionLog: readonly RecognitionResolutionRecord[];
  readonly contemporaneousResolution: RecognitionResolutionRecord;
  readonly correction: RecognitionResolutionRecord;
  /** The first experience serialized before the correction existed. */
  readonly experienceBeforeCorrection: string;
}

/**
 * Glen perceives the actor at t=10 and contemporaneously misrecognises them as Darius. At t=40 he
 * re-encounters the same continuant-file and appends a corrective resolution naming Mina. The
 * first experience is never touched: the correction is a new record in an append-only log.
 */
function misrecognitionScenario(allocatorStart = 5000n): Scenario {
  const allocator = createRunAllocator(allocatorStart);
  const truth = truthBindings();

  const first = projectObserver({ observerId: GLEN, truth, allocator, experienceId: 1n });
  const actorTrack = first.tracksByLabel.get('glen/actor')!;

  const contemporaneousResolution = recognizeObserverContinuant({
    projection: first,
    perceptualReferentId: actorTrack,
    catalog: GLEN_CATALOG,
    assertCandidate: DARIUS_CANDIDATE,
    nextRuntimeId: allocator.next(),
  })!;

  const experienceBeforeCorrection = stringifyWithBigInts(first.experience);

  // A later experience over the same continuant-file: the track continues rather than restarting.
  const second = projectObserver({
    observerId: GLEN,
    truth,
    allocator,
    experienceId: 2n,
    occurredAt: 40n,
    continuantFiles: first.continuantFiles,
    eventFiles: first.eventFiles,
    priorTracksByLabel: first.tracksByLabel,
  });
  if (stringifyWithBigInts(second.tracksByLabel.get('glen/actor')) !== stringifyWithBigInts(actorTrack)) throw Error('CV-SEM-012 continuant changed');

  const correction = recognizeObserverContinuant({
    projection: second,
    perceptualReferentId: actorTrack,
    catalog: GLEN_CATALOG,
    assertCandidate: MINA_CANDIDATE,
    nextRuntimeId: allocator.next(),
    priorResolutionHistory: [contemporaneousResolution],
  })!;

  return {
    first,
    contemporaneousResolution,
    correction,
    experienceBeforeCorrection,
    resolutionLog: Object.freeze([contemporaneousResolution, correction]),
  };
}

const requestFor = (scenario: Scenario): RenderRequest => ({
  projection: scenario.first, resolutionLog: scenario.resolutionLog,
});

const identityTokens = (recordLines: readonly string[]): readonly string[] => recordLines
  .flatMap((line) => line.split('|'))
  .filter((field) => field.startsWith('identity:'))
  .map((field) => field.slice('identity:'.length));


export {misrecognitionScenario,requestFor,identityTokens,CATALOG_IDENTITIES,NON_CATALOG_TRUTH_REFERENTS};
export const originalSource={path:'src/test/phenSem001Rendering.test.ts',sha256:'338a990bc0e2c9653d6cdf8f93202966b422021a8814bd6f1eb70d7c76e4d39e'} as const;
