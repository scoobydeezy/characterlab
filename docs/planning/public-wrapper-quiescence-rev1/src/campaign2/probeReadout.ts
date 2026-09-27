/** regulatory-diagnostic-probe/0.1-candidate: detached diagnostic arithmetic only. */
import {StateContractError} from '../substrate/state';
type ProbeOperands=Readonly<{reference:bigint;displacement:bigint}>;
export function probeOperands(reference:bigint,displacement:bigint):ProbeOperands {
 const data=Object.freeze(Object.assign(Object.create(null) as ProbeOperands,{reference,displacement}));
 return new Proxy(data,{get(target,property){
  if(!Object.hasOwn(target,property))throw new StateContractError('ILLEGAL_READ','probe arithmetic has no requested state capability');
  return Reflect.get(target,property);
 }});
}
export function executeProbeReadout(input:ProbeOperands):bigint {
 return input.reference+input.displacement;
}
