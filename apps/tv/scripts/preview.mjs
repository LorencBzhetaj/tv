import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stage, runtimeFiles } from './lib.mjs';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
  const name=req.url==='/'?'index.html':req.url?.slice(1);
  if(!['GET','HEAD'].includes(req.method??'')||!runtimeFiles.includes(name)){res.writeHead(404);res.end();return;}
  try{const bytes=await fs.readFile(path.join(stage,name));res.writeHead(200,{'Content-Type':types[path.extname(name)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);}
  catch{res.writeHead(404);res.end();}
});
server.listen(4174,'127.0.0.1',()=>console.log('LORI TV production frame: http://127.0.0.1:4174 — Ctrl+C to stop. No TV/media connection.'));
