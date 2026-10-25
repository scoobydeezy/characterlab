/**
 * Single character entry, initially task-cognitive-path/0.1-candidate and
 * task-cognitive-model-profile/0.1-candidate with their unchanged persistence.
 *
 * This becomes the assembled model definition/composition entry. Add capability
 * within shared runtime/state, never by dispatching to alternate research pipelines.
 * M1 preserves frozen recipe admission; M2a owns its versioned replacement.
 */
export {
  prepareCognitiveModel as prepareCharacterModel,
  cognitiveModelIdentity as characterModelIdentity,
  createCognitiveRun as createCharacterRun,
  restoreCognitiveRun as restoreCharacterRun,
  type CognitiveModel as CharacterModel,
} from '../campaign2/cognitiveFactory';
export type {Campaign2ModelSource as CharacterModelSource} from '../campaign2/factory';
