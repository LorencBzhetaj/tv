import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import { root, stage, runtimeFiles, sha, verifyStage } from './lib.mjs';

// Delete only this tool's generated staging directory, never user/source paths.
const outputRoot = path.join(root, 'Build');
await fs.mkdir(outputRoot, { recursive: true });
if (await fs.realpath(outputRoot) !== outputRoot || path.relative(root, stage) !== path.join('Build','package')) throw new Error('Unsafe build output path.');
try {
  if (await fs.realpath(stage) !== stage) throw new Error('Staging must not be a link.');
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await fs.rm(stage, { recursive: true, force: true });
await fs.mkdir(path.join(stage, 'assets'), { recursive: true });
await build({ entryPoints: [path.join(root,'src','main.ts')], outfile: path.join(stage,'app.js'), bundle: true, format: 'iife', platform: 'browser', target: 'chrome130', minify: true, sourcemap: false, legalComments: 'none' });
for (const [source,target] of [['index.html','index.html'],['config.xml','config.xml'],['src/boot.css','boot.css'],['assets/icon.png','assets/icon.png'],['tizen_web_project.yaml','tizen_web_project.yaml']]) await fs.copyFile(path.join(root,source),path.join(stage,target));
const hashes = {};
for (const name of runtimeFiles) hashes[name] = sha(await fs.readFile(path.join(stage,name)));
await fs.writeFile(path.join(outputRoot,'inventory.json'),JSON.stringify(hashes,null,2)+'\n');
await verifyStage();
console.log('PASS: deterministic M1 staging (5 runtime files + SDK YAML). No package/install/launch.');
