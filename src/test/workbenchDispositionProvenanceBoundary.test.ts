import {it,expect} from 'vitest';
import {list} from '../substrate/canonicalEncoding';
import {dispositionCanonicalProvenance} from '../workbench/dispositionCanonicalProvenance';
it('keeps an absent reasons output absent and rejects unqualified source contexts',()=>{
 const event={id:'18',instant:'1',stage:'reasons',phase:'52'},empty=list([]);
 expect(dispositionCanonicalProvenance(event,empty,empty,'Plastic','disposition-public/0.1-candidate')).toEqual({version:'disposition-provenance/0.1',seamVersion:'disposition-public/0.1-candidate',law:'Plastic',eventId:'18',instant:'1',emitted:false});
 expect(()=>dispositionCanonicalProvenance({...event,phase:'53'},empty,empty,'Plastic','disposition-public/0.1-candidate')).toThrow('reasons-stage');
 expect(()=>dispositionCanonicalProvenance(event,empty,empty,'Plastic','unknown')).toThrow('profile');
 expect(()=>dispositionCanonicalProvenance(event,empty,empty,'Unknown','disposition-public/0.1-candidate')).toThrow('profile');
});
