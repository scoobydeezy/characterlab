// A deliberately small executable assertion recorder for the retained native ledger.
// Unsupported assertions fail at compilation; no matcher silently succeeds.
export function negativeDiagnostic(value:unknown):string{
 return JSON.stringify(value,(_key,v)=>typeof v==='bigint'?{$bigint:String(v)}:v===undefined?{$undefined:true}:v instanceof Set?{$set:[...v]}:v instanceof Map?{$map:[...v]}:v,2);
}
const comparable=(v:unknown):unknown=>v instanceof Set?{set:[...v].map(comparable).map(negativeDiagnostic).sort()}:v instanceof Map?{map:[...v].map(([k,x])=>[comparable(k),comparable(x)]).sort((a,b)=>negativeDiagnostic(a[0]).localeCompare(negativeDiagnostic(b[0])))}:Array.isArray(v)?v.map(comparable):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,comparable(x)])):v;
export function createNegativeRecorder(){
 const cases:{name:string;assertions:{matcher:string;negated:boolean;actual:string;expected:string;passed:boolean}[];failures:{code:string;message:string}[]}[]=[];
 let current:typeof cases[number]|undefined;
 const recordFailure=(code:string,error:unknown)=>{if(!current)throw Error('Failure outside ledger case');current.failures.push({code,message:error instanceof Error?error.message:String(error)});};
 const expect=(actual:unknown)=>{
  const matchers=(negated:boolean)=>{
   const check=(matcher:string,expected:unknown,condition:boolean,observed=actual)=>{if(!current)throw Error('Assertion outside ledger case');const passed=negated?!condition:condition;current.assertions.push({matcher,negated,actual:negativeDiagnostic(observed),expected:negativeDiagnostic(expected),passed});if(!passed)throw Error('Ledger assertion failed: '+current.name+'/'+matcher);};
   return {
    toBe:(expected:unknown)=>check('toBe',expected,Object.is(actual,expected)),
    toEqual:(expected:unknown)=>check('toEqual',expected,negativeDiagnostic(comparable(actual))===negativeDiagnostic(comparable(expected))),
    toBeUndefined:()=>check('toBeUndefined',undefined,actual===undefined),
    toHaveLength:(expected:number)=>{if(actual===null||actual===undefined||!('length' in Object(actual)))throw Error('Length assertion on unsupported value');check('toHaveLength',expected,(actual as {length:number}).length===expected);},
    toContain:(expected:unknown)=>{if(typeof actual==='string')check('toContain',expected,actual.includes(String(expected)));else if(Array.isArray(actual))check('toContain',expected,actual.includes(expected));else throw Error('Contain assertion on unsupported value');},
    toThrow:()=>{if(typeof actual!=='function')throw Error('Throw assertion requires function');let thrown=false,result:unknown;try{result=actual();}catch(e){thrown=true;result={message:e instanceof Error?e.message:String(e)};}check('toThrow',undefined,thrown,{thrown,result});},
   };
  };return {...matchers(false),not:matchers(true)};
 };
 const describe=(_name:string,body:()=>void)=>body();
 const it=(name:string,body:()=>void)=>{if(current)throw Error('Nested ledger case');current={name,assertions:[],failures:[]};try{body();if(!current.assertions.length)throw Error('Empty ledger case');cases.push(current);}finally{current=undefined;}};
 return {expect,describe,it,recordFailure,finish:()=>cases};
}
