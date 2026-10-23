type Client = {snapshot(): {complete: boolean}; advance(): Promise<boolean>};

/** Pause completes a whole opportunity (both sides for a comparison).
 * Disposal instead prevents any further worker call or publication.
 * Callers own the operation lock and reset their stop flag before entry.
 */
export async function advanceSubstitutionBoundaries(options: {
 clients: readonly Client[];
 limit: number;
 stopped(): boolean;
 alive(): boolean;
 committed?(): void;
 yieldBoundary?(): Promise<void>;
}): Promise<void> {
 const {clients,limit,stopped,alive,committed,yieldBoundary}=options;
 for(let i=0;i<limit;i++){
  if(!alive()||stopped()||clients.every(c=>c.snapshot().complete))return;
  let advanced=false;
  for(const client of clients){
   if(!alive())return;
   if(!client.snapshot().complete)advanced=(await client.advance())||advanced;
   if(!alive())return;
  }
  if(!advanced)return;
  committed?.();
  await yieldBoundary?.();
 }
}
