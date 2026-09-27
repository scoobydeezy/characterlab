/** Native byte admission must not enumerate one JavaScript property per byte. */
export function copyData<K extends string>(input:Record<K,Uint8Array>,names:readonly K[]):Record<K,Uint8Array>{
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)throw Error('BIOLOGY_DATA');
 const ds=Object.getOwnPropertyDescriptors(input);if(Reflect.ownKeys(ds).length!==names.length)throw Error('BIOLOGY_FIELDS');
 const result={} as Record<K,Uint8Array>;
 const getLength=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!;
 for(const n of names){const d=ds[n];if(!d||!('value'in d))throw Error('BIOLOGY_DATA_BYTES');
  const length=getLength.call(d.value);if(Object.getPrototypeOf(d.value)!==Uint8Array.prototype)throw Error('BIOLOGY_DATA_BYTES');
  // Intrinsics read only the typed-array storage. Extra host properties are ignored,
  // never enumerated, consulted as configuration, or executed (including getters).
  const copy=new Uint8Array(length);Uint8Array.prototype.set.call(copy,d.value);result[n]=copy;
 }
 return result;
}
