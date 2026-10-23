/**
 * The negative controls named by `CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md`, in contract order.
 *
 * This list lives outside any test file so that both the ledger that discharges the controls and
 * the acceptance-gate audit that cross-checks the contract can import it without either one
 * re-running the other's tests.
 */
export const NAMED_NEGATIVE_CONTROLS: readonly string[] = Object.freeze([
  'TruthIdentityCopy',
  'ReferentKeyedBinding',
  'SlotWideVisibility',
  'EventRoleEqualsCausalRole',
  'hidden-truth causal-role derivation',
  'OpaqueButLinkableTruthHandle',
  'RecognitionRewrite',
  'TruthFacetCopy',
  'FreeformTagBag',
  'ClassificationToPressure',
  'TruthCorrectedTracking',
  'GlobalTrackAllocator',
  'TrackOrdinalPsychology',
  'RoleKeyedBinding',
  'GlobalRoleCardinality',
  'BindingOrdinalPsychology',
  'RoleOrdinalPriority',
  'DuplicateOpaqueOccurrence',
  'FreeformBindingQualifier',
  'VisibleBindingRevealsTruthRole',
  'SharedTruthPerceptualFacetId',
  'WrongTypedFacetValue',
  'CategoryStringValue',
  'MissingAsFalse',
  'UnknownSentinel',
  'ExclusivePrimaryKind',
  'DuplicateFacetAssertion',
  'ClassificationOrdinalPsychology',
  'RecognitionFromClassificationIdentity',
  'LLMClassifier',
  'AuthoritativeProse',
]);
