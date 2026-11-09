const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const {spawnSync}=require('node:child_process');
const root=process.cwd();const ts=require(path.join(root,'node_modules/typescript'));const temp=fs.mkdtempSync(path.join(os.tmpdir(),'kline-indicator-test-'));
try{
function compile(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory())compile(p);else if(p.endsWith('.ts')&&!p.endsWith('.d.ts')){const rel=path.relative(path.join(root,'src'),p).replace(/\.ts$/,'.js');const out=path.join(temp,rel);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText)}}}
compile(path.join(root,'src'));const r=spawnSync(process.execPath,['--test',path.join(__dirname,'async-calculation.test.cjs')],{stdio:'inherit',env:{...process.env,INDICATOR_BUNDLE:path.join(temp,'component/Indicator.js')}});process.exitCode=r.status===null?1:r.status;
}finally{fs.rmSync(temp,{recursive:true,force:true})}
