import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const stage = path.join(root, 'Build', 'package');
export const runtimeFiles = ['app.js', 'assets/icon.png', 'boot.css', 'config.xml', 'index.html'];
export const sdk = process.env.LORI_TIZEN_SDK ?? path.join(os.homedir(), '.tizen-extension-platform', 'server', 'sdktools', 'data');
export const tz = path.join(sdk, 'tools', 'tizen-core', 'tz.exe');
export const wgt = path.join(stage, 'Debug', 'package.wgt');
export const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed (exit ${result.status}). STOP; no automatic retry.`);
}
export function safeArchivePath(name) {
  try { return !!name && name === decodeURIComponent(name) && !/[\\:%\x00-\x1f]/.test(name) && !name.startsWith('/') && !name.split('/').some(p => p === '.' || p === '..' || p === ''); } catch { return false; }
}
export async function inventory(directory) {
  const files = [];
  async function walk(folder, prefix = '') {
    for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error('Symlinks are not permitted in staging.');
      const name = prefix + entry.name;
      if (entry.isDirectory()) await walk(path.join(folder, entry.name), name + '/');
      else if (entry.isFile()) files.push(name);
      else throw new Error('Non-regular staging entry.');
    }
  }
  await walk(directory);
  return files.sort();
}
export async function verifyStage() {
  const expected = [...runtimeFiles, 'tizen_web_project.yaml'].sort();
  const actual = await inventory(stage);
  const hasSdkOutput = actual.includes('Debug/package.wgt');
  const sdkFiles = hasSdkOutput ? ['Debug/package.wgt', ...runtimeFiles.map(name => 'Debug/projects/package/' + name)] : [];
  if (JSON.stringify(actual) !== JSON.stringify([...expected, ...sdkFiles].sort())) throw new Error('Unexpected/missing staging files.');
  if (hasSdkOutput) for (const name of runtimeFiles) {
    if (!Buffer.from(await fs.readFile(path.join(stage, name))).equals(await fs.readFile(path.join(stage, 'Debug/projects/package', name)))) throw new Error(`SDK intermediate content mismatch: ${name}`);
  }
  const record = JSON.parse(await fs.readFile(path.join(root, 'Build', 'inventory.json'), 'utf8'));
  if (JSON.stringify(Object.keys(record).sort()) !== JSON.stringify(runtimeFiles)) throw new Error('Invalid build inventory.');
  for (const name of runtimeFiles) if (sha(await fs.readFile(path.join(stage, name))) !== record[name]) throw new Error(`Staging content mismatch: ${name}`);
  for (const [source, target] of [['index.html','index.html'],['config.xml','config.xml'],['src/boot.css','boot.css'],['assets/icon.png','assets/icon.png'],['tizen_web_project.yaml','tizen_web_project.yaml']]) {
    if (!Buffer.from(await fs.readFile(path.join(root, source))).equals(await fs.readFile(path.join(stage, target)))) throw new Error(`Source mismatch: ${target}`);
  }
  return expected;
}
