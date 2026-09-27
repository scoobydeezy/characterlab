/** task-commitment/0.2-candidate private initial deadline allocation.
 * Original input authority remains owned by orderedInputs; these are model clocks.
 */
import {list,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {compiledInputSchedule,type OrderedInputCompilation} from './orderedInputs';
import type {compileTaskModel} from './taskModel';
export const TASK_DEADLINE_EVENT=typedIdentifier(1001,text('event/task-deadline'));
export function taskInitialSchedule(model:Pick<Awaited<ReturnType<typeof compileTaskModel>>,'tasks'>,inputs:OrderedInputCompilation,initialState:Uint8Array){
 const original=compiledInputSchedule(inputs,initialState);
 const deadlines:ScheduledEvent[]=model.tasks.map((task,i)=>({eventId:original.allocators.nextEventId+BigInt(i),eventSequence:original.allocators.nextEventSequence+BigInt(i),dueAt:simInstant(task.deadline),phase:140n,eventTypeId:structuredClone(TASK_DEADLINE_EVENT),payload:structuredClone(task.key),dependencies:list([]),causalParentEventIds:[]}));
 return {events:[...original.events,...deadlines],deadlines,allocators:{...original.allocators,nextEventId:original.allocators.nextEventId+BigInt(deadlines.length),nextEventSequence:original.allocators.nextEventSequence+BigInt(deadlines.length)}};
}
