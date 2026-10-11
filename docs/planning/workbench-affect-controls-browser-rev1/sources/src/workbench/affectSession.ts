import {AffectWorkbenchRun,type AffectCheckpoint as MainCheckpoint} from './affectAdapter';
import {AffectSupplementRun,type AffectSupplementCheckpoint} from './affectSupplementAdapter';
export type {AffectSnapshot} from './affectAdapter';
export type AffectCheckpoint=MainCheckpoint|AffectSupplementCheckpoint;
export function createAffectInspection(program='baseline'){
 return program.startsWith('timing/')||program.startsWith('interior/')?AffectSupplementRun.create(program):AffectWorkbenchRun.create(program);
}
export function restoreAffectInspection(c:AffectCheckpoint){
 if(c?.version==='affect-workbench/0.1')return AffectWorkbenchRun.restore(c);
 if(c?.version==='affect-supplement-workbench/0.1')return AffectSupplementRun.restore(c);
 throw Error('Unknown AFFECT inspection checkpoint version');
}
