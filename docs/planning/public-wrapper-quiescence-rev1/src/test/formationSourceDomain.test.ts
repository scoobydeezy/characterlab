import {describe,it,expect} from 'vitest';
import {extendFormationSourceDomain as admit} from '../campaign3/formationSourceDomain';
import {reconcileFormationGovernance as form,type FormationSource} from '../campaign3/formationGovernance';
const s=(id:string,character='character/a'):FormationSource=>({source:id,character,kind:'Interoceptive'});
describe('bounded qualified source-domain enrollment',()=>{
 it('SD-A: never-successful sources consume the distinct domain bound',()=>{const domain=admit([],[s('a'),s('b')],2);expect(form(domain,[],[],[],1n)).toEqual([]);expect(()=>admit(domain,[s('c')],2)).toThrow('FORMATION_SOURCE_LIFETIME_EXCEEDED');});
 it('SD-B: revisiting an admitted source costs no new slot but successful replay still rejects',()=>{const source=s('a'),domain=admit([],[source],1),rows=form(domain,[],[{...source,acquisition:1n,formedAt:1n}],[],1n);expect(admit(domain,[source],1)).toEqual(domain);expect(()=>form(domain,rows,[{...source,acquisition:2n,formedAt:2n}],[],2n)).toThrow();});
 it('SD-C: cognitive loss and continuation do not free source capacity',()=>{const source=s('a'),domain=admit([],[source],1);const rows=form(domain,[],[{...source,acquisition:1n,formedAt:1n}],[],1n);expect(rows[0].completeLoss).toBe(true);expect(()=>admit(structuredClone(domain),[s('b')],1)).toThrow('FORMATION_SOURCE_LIFETIME_EXCEEDED');});
 it('SD-D: source qualification includes subject and kind must remain stable',()=>{const domain=admit([],[s('a')],2);expect(admit(domain,[s('a','character/b')],2)).toHaveLength(2);expect(()=>admit(domain,[{...s('a'),kind:'EventContinuant'}],2)).toThrow('FORMATION_SOURCE_KIND_CONFLICT');});
 it('SD-E: whole incoming domain is admitted atomically, canonical ordering is permutation invariant',()=>{const prior=admit([],[s('z')],2),before=structuredClone(prior);expect(()=>admit(prior,[s('a'),s('b')],2)).toThrow();expect(prior).toEqual(before);expect(admit([],[s('a'),s('z')],2)).toEqual(admit([],[s('z'),s('a')],2));});
 it('SD-F: zero domain permits no new address; invalid bounds and duplicate batch declarations reject',()=>{expect(admit([],[],0)).toEqual([]);expect(()=>admit([],[s('a')],0)).toThrow();for(const limit of [-1,1.5,65])expect(()=>admit([],[],limit)).toThrow('FORMATION_SOURCE_LIMIT');expect(()=>admit([],[s('a'),s('a')],2)).toThrow();});
});
