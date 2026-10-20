import {useEffect,useState} from 'react';
import {explainLongObserver} from './longExplanations';
import {fromHex} from './canonical';
type Description=Awaited<ReturnType<typeof explainLongObserver>>;
export function LongObserverDescription({observerHex,observerHash}:{observerHex:string;observerHash:string}){
 const [value,setValue]=useState<Description>(),[error,setError]=useState('');
 useEffect(()=>{let current=true;setValue(undefined);setError('');void explainLongObserver(fromHex(observerHex)).then(next=>{if(next.observerHash!==observerHash)throw Error('Observer description digest mismatch');if(current)setValue(next);}).catch(e=>{if(current)setError(String(e));});return()=>{current=false;};},[observerHex,observerHash]);
 if(error)return <p role="alert">{error}</p>;
 if(!value||value.observerHash!==observerHash)return <p role="status">Preparing current observer descriptions…</p>;
 return <div data-long-language><p>Current observer-field descriptions · {value.version}</p><p>These descriptions also display the retained diagnostic-control projections. They are not first-person narration or a complete explanation of a choice.</p><ul>{value.rows.map(row=><li key={row.id}><p>{row.text}</p><details><summary>Exact evidence · {row.field} · {row.present?'present':'absent'}</summary><pre className="exact">{row.exact??'Absent'}</pre></details></li>)}</ul><p>{value.scope}</p><details><summary>Versioned observer-description record</summary><pre className="exact" data-long-language-record>{JSON.stringify(value,null,2)}</pre></details></div>;
}
