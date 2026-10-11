from pathlib import Path
import json,hashlib
P=Path('docs/planning');O=P/'campaign3-history-ga-protocol-settlement-rev1';B=P/'campaign3-history-universe-rev1'
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def ref(p):return dict(path=Path(p).as_posix(),sha256=hashlib.sha256(Path(p).read_bytes()).hexdigest())
def walk(v,p=''):
 if isinstance(v,dict):
  for k,x in v.items():yield from walk(x,p+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,p+'/'+str(i))
 elif isinstance(v,str):yield p,v
def save(p,v):
 if p.exists():assert load(p)==v
 else:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
common='Historical bounded component/substrate/scheduler evidence,not public source/PRJ/typed owner/factory/Save132 qualification. Current execution separately hashes its inputs;historical receipts without implementation hashes do not identify an exact historical checkout. No law,allocation or owner ruling changed.'
gov='Finite supplied source universe and payload-free successful history are distinct. Fixed-universe component accepts opaque bounded NFC source/character and closed kind;component64 ceiling is not committed public N. New identity/time unique and current;prior metadata immutable,complete loss monotone,no resurrection or unknown survivors. Retain every success row even after immediate total loss;absence means no successful formation,not no attempt. Canonical integer sorting is representation,not chronology. No history GC,source resolver,failed-attempt ledger or authority to clear trusted prior state. StructuredClone is not persistence;allocator nonreuse and domain authentication remain external.'
domain='Bounded dynamic enrollment extends fixed-universe component without deriving future runtime IDs. Union exact character/source addresses atomically under fixedN0..64;stable kind,distinct subjects,duplicate-batch rejection and no partial accepted prefix. Never-successful admitted sources consume capacity;revisiting costs no slot but successful second formation still rejects. Loss/load cannot free slots. Exact prior domain,N and allocator must remain bound across real continuation;no live input-bag reset or oldest-row deletion. Profile N+1 is rejection before eligibility,not cognitive loss/event. Write-free evidence producer cannot secretly own enrollment.'
placement='Historical decision packet genuinely compared canonical governance root A with new authoritative metadata log/replay B;private unsaved maps and changing Save132 were not valid shortcuts. Resolution records A accepted by supplied planning ruling. Protocol authority owns exact canonical singleton through existing AuthoritativeState;no cognitive family,Knowledge,evidence or trace authority. Keep B as later chronology/compaction alternative. Enrolled/no-success,enrolled/success and unenrolled remain distinct;successful empty admission commits membership,failed instant commits none. N immutable;diagnostics/output caches not protocol decision authority,without waiving whole-save archive integrity. Historical DECISION REQUIRED is superseded by explicit acceptance,not a current blocker.'
shape='Qualified key is actual full selection1143 plus PRJ/IDN character,run scope implicit;kind lives only in admission. No duplicate RunId or extra source/result occurrence. Present empty nonremovable singleton has monotone admission and success subset with immutable acquisition/time and monotone CompleteLoss. No samples/children/encoding/cues/resolver. Generic state authority/read exclusion/reconstruction can express it but cannot by itself forbid authorized empty replacement. Synthetic root1/20001/20002 and primitive fixture list are not public codecs/allocations. State-value reconstruction is not SchedulerSave byte loading or full restart.'
transition='Validate prior against its own prior domain before current enrollment;incoming sources cannot repair invalid B0. Derive expected union/success/loss from governed operands,independently canonicalize candidate and compare exact primitive encoding. Reject reset,erased success,changed identity/time,invented loss/survival,skipped enrollment and extra fields. Canonical ordering carries no psychology;success/failure do not mutate inputs. Generic expected-old/nonremoval is insufficient. Supplied survivor list remains trusted at this layer;public origin,N,prior state and actual owner result need separate authentication.'
join='Complete ordinary-memory batch uses commonB0 and actual recency/fragmentation owner. Preparation detaches inputs,validates prior live memory exactly against history/kind/time and fresh memory against new formation identities/kinds/times. Source replay rejects before retention. One resolution issues private frozen transaction-local WeakMap handle;copied,cross-session,reused or closed handles reject even with matching fields. finish derives survivors from that actual owner result,then returns validated memory/protocol candidates. Governance records disposition,does not decide survival or inspect child payload. No saved handle or OwnerResultId;only trusted coordinator commits. Independent owner/source/subject/typed public association remains required.'
scheduler='Actual scheduler fixtures check source admission before eligibility,empty enrollment without new occurrence/output,immediate loss with successful history,positive retained value and lifetime overflow. Late failure restores state,clock,queue,allocator,outputs and committed trace for empty and positive branches. Failed run remains terminal;authorized replay/restore is separate. Fixture130 handler is explicitly trusted protocol admission hook,not the public write-free evidence producer. Plain fixture memory/protocol and synthetic types do not pass public registration,immutable modelN,Save132 or FJ-A..J wholesale.'
formation='Phase130 occurrence-bearing positive evidence and later140 acquisition share one identity;no parallel formation ID. Character comes from admitted PRJ,not ordinal/raw caller roster. Empty/zero/unavailable allocates no acquisition/work. All terminal obligations emitted before barrier;one commonB0 family append,independent association/presentation owners and complete cross-family checks before commit. Provisional evidence is not durable memory. Any failure discards candidates,queue,allocator,outputs/trace and leaves run terminal. One success per admitted source must survive pruning through bounded metadata,not unbounded tombstones/source archive. Old139/172/152 budget is historical and replacement output delta must be recomputed.'
notes={
'FORMATION_GOVERNANCE_COMPONENT.md':gov,
'FORMATION_GOVERNANCE_COMPONENT_CHECKPOINT.md':gov+' Eight cases pass in both revisions;REV2 moves malformed literal to variable for TypeScript runtime-negative test without broadening API. No fresh TypeScript claim.',
'FORMATION_SOURCE_DOMAIN_COMPONENT.md':domain,
'FORMATION_SOURCE_DOMAIN_BINDING_REV1.md':domain+' Fourteen combined tests are8governance+6domain;fixed predeclared universe and bounded dynamic enrollment are not interchangeable packaging.',
'FORMATION_PROTOCOL_STATE_PLACEMENT_DECISION.md':placement,
'FORMATION_PROTOCOL_STATE_PLACEMENT_RESOLUTION.md':placement,
'FORMATION_PROTOCOL_ROOT_SYMBOLIC_REV1.md':shape+' Public domain injectivity across producer kinds must be checked,not raw ordinal labels. Generic19-case receipt is14metadata+5state;REV2 selector tuple narrows TypeScript shape only. No fresh typecheck or malicious-authorized-reset protection inferred.',
'FORMATION_PROTOCOL_ADMISSION_JOIN_REV1.md':shape+' '+join+' Closed admit/reconcile operations whitelist actual completed producer,subject and terminal-owner associations. Empty source enrollment occurs before formation skip;terminal finish runs before commit without sibling provisional reads or140children. Ten frozen FJ vectors remain public obligations,not automatic passes.',
'FORMATION_PROTOCOL_TRANSITION_COMPONENT.md':transition,
'FORMATION_PROTOCOL_TRANSITION_CHECKPOINT.md':transition+' Earlier25-test receipt had six validator cases;seventh prior-domain-repair rejection raises26. Preserve original receipt rather than retroactively claiming its coverage.',
'FORMATION_SETTLEMENT_COMPONENT.md':join,
'FORMATION_OWNER_PROTOCOL_SETTLEMENT_CHECKPOINT.md':join+' '+scheduler+' Failed OJ-F expected first canonical unit alpha but got beta17 rather than42. Corrected fixture retains both and looks up alpha explicitly;no retention policy changed. Historical retrieval competition question remains routed to separate accepted decision history,not settled by acquisition/retention.',
'ATTENTION_ACQUISITION_FORMATION_PROTOCOL_REV1.md':formation+' Six scheduler cases include B0-only two-candidate reconciliation and reversed terminal emission order at matched identities. Initial AF-D incorrectly attempted in-place retry after failure;five passed and one rejected that premise. Corrected assertion requires terminal failure;no scheduler behavior changed or actual restore proved.'
}
replay=load(O/'replay.json');assert len(replay['sourcePaths'])==25 and len(replay['historical'])==12
for f in replay['inputs']+[replay['tests']]:assert ref(f['path'])==f
reports={x['path']:x for x in replay['historical']};failures=[]
for p,receipt in reports.items():
 assert ref(p)=={k:receipt[k] for k in ['path','sha256']};v=load(p)
 for t in v['testResults']:
  for a in t['assertionResults']:
   if a['status']=='failed':failures.append(dict(source=ref(p),name=a['fullName'],messages=a['failureMessages']))
 n=Path(p).name;j=f"Historical {receipt['passed']}/{receipt['total']} passed,{receipt['failed']} failed. Current44-test suite matches every old name except rejected AF-D retry premise;name equality does not identify old source bytes. "
 if 'ATTENTION_ACQUISITION' in n:j+=formation+' Initial5/6 failed AF-D because failed runs cannot retry;REV2/current6 requires terminal failure and exact committed-surface preservation.'
 elif 'OWNER_JOIN' in n:j+=join+' OJ-F initial13/14 assumed alpha was first;later14/14 retains both and looks up alpha. Canonical unit order is not a semantic key.'
 elif 'SCHEDULER' in n:j+=scheduler+' Nineteen cases combine5actual scheduler,7transition and7owner join,not19scheduler scenarios.'
 elif 'AUTHORITY' in n:j+=shape+' Nineteen cases combine14metadata and5generic state. Wrong authority,direct/derived read exclusion,four distinct canonical states,state-value reconstruction and stale/removal rejection do not prove monotone authorized updates.'
 elif 'TRANSITION' in n:j+=transition+' REV1 has25 cases;REV2 adds PT-G for26;current fresh set executes the stronger prior-validation check.'
 elif 'SOURCE_DOMAIN' in n:j+=domain+' Fourteen cases=8governance+6domain;structuredClone continuation is not canonical save.'
 else:j+=gov+' Eight cases repeated across revisions;type-only malformed-input placement change reported,not fresh typecheck.'
 notes[n]=j
assert len(failures)==2
entries={x['path']:x for x in load(B/'manifest.json')['entries']};assigned={x['path'] for x in load(P/'campaign3-history-source-roles-rev164/index.json')['roleAssignments']};roles=[];strings={}
for p in replay['sourcePaths']:
 assert p not in assigned and ref(p)['sha256']==entries[p]['sha256']
 roles.append(dict(**ref(p),role='FORMATION PROTOCOL/OWNER SETTLEMENT HISTORY; ADMISSION/SUCCESS/CONTENT DISTINCT',judgment=notes[Path(p).name]+' '+common,acceptanceChain=[ref(O/'replay.json')]))
 if p.endswith('.json'):
  for ptr,value in walk(load(p)):strings[p,ptr]=value
specs={r['path']:r['judgment'] for r in roles};rows=[]
with (B/'units.jsonl').open(encoding='utf-8') as f:
 for line in f:
  u=json.loads(line)
  if u['source'] not in specs:continue
  ptr=u['location'].get('pointer','');assert u['sourceSha256']==entries[u['source']]['sha256']
  if u['source'].endswith('.json'):assert strings[u['source'],ptr]==u['text']
  narrative=u['source'].endswith('.md') or any(k in ptr.split('/') for k in ['fullName','title','failureMessages'])
  rows.append(dict(occurrenceId=u['id'],source=u['source'],sourceSha256=u['sourceSha256'],location=u['location'],text=u['text'],role='NARRATIVE AUTHORITY/FINDING' if narrative else 'TYPED EVIDENCE BACKING',judgment=specs[u['source']]))
r=dict(status='PROTOCOL/OWNER SETTLEMENT HISTORY RECONCILED; HQ011 OPEN',sourceRoles=roles,rows=rows,stringLeaves=len(strings),bindings=[],preservedArtifacts=[],developmentFailures=failures,limits=[common,*replay['limits']])
c=dict(status='PASS; HQ011 OPEN',sources=len(roles),originalNarrativeOccurrences=sum(x['role'].startswith('NARRATIVE') for x in rows),originalBackingOccurrences=sum(x['role'].startswith('TYPED') for x in rows),stringLeaves=len(strings),resolvedBindings=0,currentInputHashes=len(replay['inputs']),unavailableBindings=0,freshTests=44,actualSchedulerTests=11,preservedFailedAssertions=2,historicalTestOccurrences=sum(x['total'] for x in replay['historical']),recoveredArtifacts=0,checker=ref(__file__))
save(O/'review.json',r);save(O/'check.json',c);print(json.dumps(c))
