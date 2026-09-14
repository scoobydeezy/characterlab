import fs from 'node:fs';import assert from 'node:assert/strict';
const output='docs/planning/ATTENTION_MEMORY_SYMBOLIC_INVENTORY_REV1.json';assert(!fs.existsSync(output));
const ref=name=>({kind:'ref',name}),list=(name,min,max)=>({kind:'list',element:ref(name),min,max}),optional=name=>({kind:'optional',value:ref(name)}),choice=(...values)=>({kind:'enum',values});
const records=[];function record(name,fields){records.push({name,fields:Object.entries(fields).map(([name,type])=>({name,type:typeof type==='string'?ref(type):type}))});}
record('GridPosition',{X:'Cell',Y:'Cell'});
record('ExtendedScene',{Scene:'AttentionSceneDefinition',Positions:list('GridPosition',3,3),Glyphs:list('Glyph',3,3)});
record('ObservedFeatureDetection',{Detection:'CurrentDetectionId',Role:'EventRoleEvidence',Glyph:optional('Glyph'),Position:optional('GridPosition')});
record('ExtendedObservation',{Observation:'ObservationId',Observer:'ObserverId',At:'Instant',Detections:list('ObservedFeatureDetection',0,3)});
record('TrackingWindowItem',{File:'PerceptualReferentId',Glyph:optional('Glyph')});
record('TrackingWindow',{Observer:'ObserverId',At:'Instant',Observation:'ObservationId',Items:list('TrackingWindowItem',0,3)});
record('SelectedSpatialWitness',{Unit:'AttentionUnitKey',Position:optional('GridPosition'),Class:choice('SpatialFocal','SpatialPeripheral','SpatialUnknown'),PeripheralCount:'SmallCount'});
record('ExtendedSelected',{Selected:'SelectedEvidenceView',SpatialWitnesses:list('SelectedSpatialWitness',0,3)});
record('ActualConcernCarry',{Concern:'ConcernOccurrenceId',Subject:'CharacterId',SourceAt:'Instant',Response:'TaskConcernResponse'});
record('NoConcernAvailable',{Subject:'CharacterId',SourceAt:'Instant',Reason:choice('NoSelectedTask')});
record('FeedbackDelivery',{TargetOriginal:'SchedulerEventId',TargetAt:'Instant',Value:{kind:'union',alternatives:[ref('ActualConcernCarry'),ref('NoConcernAvailable')]}});
record('EncodingJoinInput',{Observer:'ObserverId',Selected:'ExtendedSelected',Feedback:'FeedbackDelivery'});
record('EncodingFactors',{Base:'UnitRational',Role:'UnitRational',Attention:'UnitRational',Raw:'NonnegativeRational'});
record('EncodingEvaluationRow',{Unit:'AttentionUnitKey',Status:choice('Positive','KnownZero','UnavailableAllocation'),Factors:optional('EncodingFactors'),Strength:optional('UnitRational')});
record('EncodingEvaluation',{Input:'EncodingJoinInput',Rows:list('EncodingEvaluationRow',0,3),Calibration:'GovernedContentDefinitionId'});
record('RetainedEncodingUnit',{Unit:'AttentionUnitKey',Bindings:list('PerceivedBindingEvidence',1,6),Claims:list('CausalRoleEvidence',1,1),Factors:'EncodingFactors',Strength:'PositiveUnitRational',SpatialWitness:optional('SelectedSpatialWitness')});
record('RetainedEncoding',{Selection:'SelectionOccurrenceId',Observer:'ObserverId',At:'Instant',Calibration:'GovernedContentDefinitionId',Units:list('RetainedEncodingUnit',1,3)});
record('EpisodeEntry',{Encoding:'RetainedEncoding'});
record('EpisodeLedger',{Entries:list('EpisodeEntry',1,4)});
record('AssociationMassRow',{Masses:list('LatticeMass',1,12)});
record('AssociationGraph',{Nodes:list('PerceptualReferentId',1,12),Rows:list('AssociationMassRow',1,12),LastUpdatedAt:'Instant'});
record('PresentationEntry',{Selection:'SelectionOccurrenceId',Times:list('Instant',1,5)});
record('PresentationLedger',{Entries:list('PresentationEntry',1,4)});
record('CueEvidence',{Observer:'ObserverId',Observation:'ObservationId',At:'Instant',Status:choice('AvailableFile','UnavailableCue'),Detection:optional('CurrentDetectionId'),File:optional('PerceptualReferentId')});
record('RecallScore',{Selection:'SelectionOccurrenceId',Base:'NonnegativeRational',Pull:'NonnegativeRational',Score:'NonnegativeRational'});
record('AttentionRecollection',{Occurrence:'ProposedRecollectionOccurrenceId',Subject:'CharacterId',At:'Instant',Encoding:'RetainedEncoding',Score:'RecallScore'});
const packet={status:'DRAFT DOMAIN INVENTORY; NOT ALLOCATION INPUT',version:'attention-memory-inventory/0.1-draft',records,
 external:['AttentionSceneDefinition','CurrentDetectionId','EventRoleEvidence','ObservationId','ObserverId','PerceptualReferentId','AttentionUnitKey','SelectedEvidenceView','ConcernOccurrenceId','CharacterId','TaskConcernResponse','SchedulerEventId','GovernedContentDefinitionId','PerceivedBindingEvidence','CausalRoleEvidence','SelectionOccurrenceId'],
 primitives:['Cell','Glyph','Instant','SmallCount','UnitRational','NonnegativeRational','PositiveUnitRational','LatticeMass'],proposedIdentities:['ProposedRecollectionOccurrenceId'],
 storage:[{value:'TrackingWindow',key:'ObserverId',family:'perception',owner:'perception'},{value:'EpisodeLedger',key:'CharacterId',family:'episodic-memory',owner:'attention-episode-formation'},{value:'AssociationGraph',key:'CharacterId',family:'associations',owner:'attention-association-update'},{value:'PresentationLedger',key:'CharacterId',family:'episodic-memory',owner:'attention-presentation-update'}],
 retention:{predicate:'final strength > 0',unknown:'excluded',knownZero:'excluded',empty:'no episode, association or presentation write',copiedEvidence:'exact positive-unit binding/claim closure only',key:'qualified CharacterId + retained SelectionOccurrenceId'},
 characterStorageForbiddenReachability:['ExtendedScene','ExtendedObservation','ExtendedSelected','EncodingJoinInput','EncodingEvaluation','FeedbackDelivery','ActualConcernCarry','NoConcernAvailable'],
 pending:['ordered-input grammar and exact source profiles','registration and admitted-input/PRJ declarations','source/transport/output occurrence closure','state root, accessor and identity roles','exact model recipe and stage work bounds','public runtime and persistence vectors','corpus promotion']};
fs.writeFileSync(output,JSON.stringify(packet,null,2)+'\n');console.log({records:records.length,fields:records.reduce((n,r)=>n+r.fields.length,0),status:packet.status});
