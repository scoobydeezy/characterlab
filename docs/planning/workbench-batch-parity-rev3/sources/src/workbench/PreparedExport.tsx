import {useEffect,useState} from 'react';
/** Bounded display only. The downloadable UTF-8 artifact retains every character. */
export function PreparedExport({text,label,filename}:{text:string;label:string;filename:string}){
 const [file,setFile]=useState<{text:string;url:string;bytes:number}>();
 useEffect(()=>{const blob=new Blob([text],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob);setFile({text,url,bytes:blob.size});return()=>URL.revokeObjectURL(url);},[text]);
 const limit=64000,truncated=text.length>limit;
 return <section className="card"><h2>Prepared export</h2><p>{truncated?`Showing the first ${limit.toLocaleString()} of ${text.length.toLocaleString()} characters. The preview is incomplete; download the full JSON file for replay or analysis.`:'Complete JSON preview.'}</p>{file?.text===text&&<p><a href={file.url} download={filename}>Download complete JSON ({file.bytes.toLocaleString()} bytes)</a></p>}<label>{label}<textarea readOnly wrap="off" rows={6} value={text.slice(0,limit)}/></label></section>;
}
