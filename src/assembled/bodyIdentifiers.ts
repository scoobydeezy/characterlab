/** Shared canonical body identifiers; no runtime dependencies. */
import {typedIdentifier,text} from '../substrate/canonicalEncoding';
export const bodyId=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const BODY_SAMPLE=bodyId(1001,'event/assembled-body-sample'),BODY_DELIVERY=bodyId(1001,'event/assembled-body-delivery');
export const BODY_SELECTION=bodyId(1001,'event/assembled-body-selection');
export const BODY_SELECTION_REPORT='assembled-body-selection/0.1';
export const BODY_OWNER=bodyId(1025,'authority/embodied-reserve');
export const BODY_OBSERVER=bodyId(1000,'observer/bridge-subject');
export const BODY_CHANNEL=bodyId(1005,'channel/assembled-body-level');
export const BODY_DEFINITION=bodyId(1027,'definition/assembled-body-level');
