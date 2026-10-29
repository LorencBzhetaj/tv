import fs from 'node:fs/promises';
import path from 'node:path';
import { root, stage, sdk, wgt, run, sha, verifyStage } from './lib.mjs';

const mode = process.argv[2];
if (!['stage','package'].includes(mode)) throw new Error('Expected stage or package.');
if (mode === 'stage') await verifyStage();
const args = ['-NoProfile','-NonInteractive','-File',path.join(root,'scripts','verify-xml-package.ps1'),'-StagePath',stage,'-SourcePath',root,'-SdkRoot',sdk];
if (mode === 'package') args.push('-WgtPath',wgt);
run('powershell.exe',args);
if (mode === 'package') {
  const reference = process.env.LORI_SIGNING_REFERENCE ?? path.resolve(root,'..','..','LORITVDiagnostic','Debug','LORITVDiagnostic.wgt');
  const referenceHash = process.env.LORI_SIGNING_REFERENCE_SHA256 ?? '526030eeb6c890682af3f84538ab7f321f57ca47b01e68e5c4bca79c9e00ea11';
  if (sha(await fs.readFile(reference)) !== referenceHash) throw new Error('Signing reference hash mismatch.');
  const classes = path.join(root,'Build','verify-tools');await fs.mkdir(classes,{recursive:true});
  run(path.join(sdk,'jdk','bin','javac.exe'),['-d',classes,path.join(root,'scripts','VerifyWgt.java')]);
  run(path.join(sdk,'jdk','bin','java.exe'),['-cp',classes,'VerifyWgt',wgt,reference]);
  const hash = sha(await fs.readFile(wgt));
  await fs.writeFile(path.join(root,'Build','verification.json'),JSON.stringify({sha256:hash,referenceSha256:referenceHash,result:'PASS'},null,2)+'\n');
  console.log(`WGT SHA-256 ${hash}`);
}
