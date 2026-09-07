// Qualification of the fixed private void padding implementation, not a new model registry.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import ts from 'typescript';
const path='src/campaign2/probeExecution.ts',source=fs.readFileSync(path,'utf8');
function audit(code){
 const tree=ts.createSourceFile(path,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS),printer=ts.createPrinter({removeComments:true});
 const normalized=node=>printer.printNode(ts.EmitHint.Unspecified,node,tree).replace(/\s+/g,'');
 const declarations=[],identifiers=[];function visit(node){if(ts.isVariableDeclaration(node))declarations.push(node);if(ts.isIdentifier(node)&&node.text==='consumeRuntimeOrdinalPadding')identifiers.push(node);ts.forEachChild(node,visit);}visit(tree);
 const find=name=>{const values=declarations.filter(d=>d.name.getText(tree)===name);assert.equal(values.length,1,name);return values[0];};
 const padding=find('consumeRuntimeOrdinalPadding'),budget=find('paddingRemaining');
 assert(ts.isArrowFunction(padding.initializer));assert.equal(padding.initializer.parameters.length,0);
 assert.equal(padding.initializer.type.kind,ts.SyntaxKind.VoidKeyword);
 assert.equal(normalized(padding.initializer.body),"{if(paddingRemaining<=0)fail('illegalpaddingslot');paddingRemaining--;allocator.allocateRuntimeId();}");
 assert.equal(normalized(budget.initializer),'index===0&&!available?1:index===1&&!permitted?2:index>=6?1:0');
 assert.equal(identifiers.length,3); // Declaration plus the two fixed source/suppression call sites.
 for(const name of identifiers.filter(n=>n!==padding.name)){
  assert(ts.isCallExpression(name.parent));assert.equal(name.parent.arguments.length,0);
  assert(ts.isExpressionStatement(name.parent.parent),'padding return must not be captured, tested or published');
 }
 return true;
}
assert(audit(source));
const changes=[
 ['capture ordinal','paddingRemaining--;allocator.allocateRuntimeId();','paddingRemaining--;const hidden=allocator.allocateRuntimeId();'],
 ['return ordinal','paddingRemaining--;allocator.allocateRuntimeId();','paddingRemaining--;return allocator.allocateRuntimeId();'],
 ['compare ordinal','paddingRemaining--;allocator.allocateRuntimeId();','paddingRemaining--;if(allocator.allocateRuntimeId()===0n)fail("inspect");'],
 ['expose ordinal','paddingRemaining--;allocator.allocateRuntimeId();','paddingRemaining--;outputs.push(unsigned(allocator.allocateRuntimeId()));'],
 ['change fixed budget','index===0&&!available?1:index===1&&!permitted?2:index>=6?1:0','index===0&&!available?2:index===1&&!permitted?2:index>=6?1:0'],
 ['calculate budget from allocator','index===0&&!available?1:index===1&&!permitted?2:index>=6?1:0','Number(allocator.allocateRuntimeId())'],
];
const mutants=changes.map(([name,from,to])=>{assert.equal(source.split(from).length-1,1);assert.throws(()=>audit(source.replace(from,to)));return {name,status:'REJECTED'};});
const report={status:'PASS',scope:'PROBE-N/O private void padding source qualification; executable branch budgets and later sentinel require separate runtime witnesses.',source:{path,sha256:crypto.createHash('sha256').update(source).digest('hex')},checks:['void, zero-argument, private capability','allocator result discarded as expression only','exact fixed slot budget','only two statement-only consumption sites'],mutants};
fs.writeFileSync('docs/planning/CAMPAIGN2_PROBE_PADDING_AUDIT.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
