import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, sdk, wgt, run, sha } from '../scripts/lib.mjs';

test('Java XMLDSig rejects unsafe URIs, inventory violations and tampered digests', async () => {
  const before = sha(await fs.readFile(wgt));
  const classes = path.join(root,'Build','verify-tools');
  await fs.mkdir(classes,{recursive:true});
  run(path.join(sdk,'jdk','bin','javac.exe'),['-d',classes,path.join(root,'scripts','VerifyWgt.java'),path.join(root,'tests','VerifyWgtSecurity.java')]);
  const reference=process.env.LORI_SIGNING_REFERENCE ?? path.resolve(root,'../../LORITVDiagnostic/Debug/LORITVDiagnostic.wgt');
  run(path.join(sdk,'jdk','bin','java.exe'),['-cp',classes,'VerifyWgtSecurity',wgt,reference]);
  if(sha(await fs.readFile(wgt))!==before)throw new Error('Original WGT changed');
});
