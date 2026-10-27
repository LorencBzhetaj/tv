// Loopback-only, dependency-free static design preview. No TV connection or backend.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const repo = path.resolve(root, '../..');
const publicFiles = new Set(['index.html', 'styles.css', 'fixtures.js', 'app.js']);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
http.createServer((req,res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
  if (name === '/favicon.ico') { res.writeHead(204).end(); return; }
  let file;
  if (name === '/') file = path.join(root,'index.html');
  else if (publicFiles.has(name.slice(1))) file = path.join(root,name.slice(1));
  else if (/^\/assets\/branding\/lori-tv-icon-(512|1024)\.png$/.test(name)) file = path.join(repo,name.slice(1));
  else { res.writeHead(404).end('Not found'); return; }
  fs.readFile(file,(error,data) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(4173,'127.0.0.1',()=>console.log('LORI TV design preview: http://127.0.0.1:4173 — Ctrl+C to stop.'))
  .on('error',error=>{console.error(error.message);process.exitCode=1;});
