import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { root, stage, runtimeFiles, inventory, verifyStage, safeArchivePath, sha } from '../scripts/lib.mjs';

test('complete minimal staging, source bytes and deterministic inventory', async () => {
  assert.deepEqual(await verifyStage(), [...runtimeFiles,'tizen_web_project.yaml'].sort());
});
test('boot bundle updates only the accessible status; no network or media globals', async () => {
  const status={textContent:'Starting',dataset:{}};
  const context={document:{getElementById:id=>{assert.equal(id,'boot-status');return status;}}};
  vm.runInNewContext(await fs.readFile(path.join(stage,'app.js'),'utf8'),context);
  assert.equal(status.textContent,'Local production boot ready.');assert.equal(status.dataset.state,'ready');
});
test('missing boot DOM element fails explicitly', async () => {
  assert.throws(()=>vm.runInNewContext(test.bundle,{document:{getElementById:()=>null}}),/boot status/);
});
test.bundle=await fs.readFile(path.join(stage,'app.js'),'utf8');
test('boot HTML is accessible and all references are relative and inventoried',async()=>{
  const html=await fs.readFile(path.join(root,'index.html'),'utf8');
  assert.match(html,/<html lang="en">/);assert.match(html,/<main aria-labelledby="boot-title">/);assert.match(html,/role="status" aria-live="polite"/);assert.match(html,/<noscript>/);
  const urls=Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g),m=>m[1]);assert.deepEqual(urls,['boot.css','app.js']);
  for(const url of urls){assert.ok(safeArchivePath(url));assert.ok(runtimeFiles.includes(url));}
  assert.match(html,/connect-src 'none'; media-src 'none'; object-src 'none'/);assert.doesNotMatch(html,/<(?:video|audio|iframe)\b|onload=|https?:\/\//i);
});
test('identity is the SDK-allocated production identity, distinct from diagnostic',async()=>{
  const xml=await fs.readFile(path.join(root,'config.xml'),'utf8');const diag=await fs.readFile(path.resolve(root,'../../LORITVDiagnostic/config.xml'),'utf8');
  const identity=s=>s.match(/<tizen:application id="([^"]+)" package="([^"]+)"/).slice(1);
  assert.deepEqual(identity(xml),['O12p0Tvvrb.LORITVProduction','O12p0Tvvrb']);assert.notEqual(identity(xml)[0],identity(diag)[0]);assert.notEqual(identity(xml)[1],identity(diag)[1]);
  assert.match(xml,/required_version="10.0"/);assert.doesNotMatch(xml,/<tizen:privilege|<access|prelaunch.support/);
});
test('privacy/path gate rejects traversal, encoding, hidden protocol and malformed paths',()=>{
  for(const name of ['../secret','/root','a/../b','C:/key','a\\b','a//b','%2e%2e/key','bad%zz','x\u0000',''])assert.equal(safeArchivePath(name),false,name);
  for(const name of runtimeFiles)assert.equal(safeArchivePath(name),true);
});
test('existing approved LORI icon is byte-preserved',async()=>{
  assert.equal(sha(await fs.readFile(path.join(root,'assets/icon.png'))),sha(await fs.readFile(path.resolve(root,'../../LORITVDiagnostic/icon.png'))));
});
