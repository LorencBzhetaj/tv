import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, sdk, run, sha } from '../scripts/lib.mjs';

test('Java XMLDSig rejects unsafe URIs, inventory violations and tampered digests', async () => {
  // M2 does not sign a new WGT: retain the M1 cryptographic regression fixture.
  const testWgt = process.env.LORI_TEST_WGT ?? path.join(root,'Build','m1-reference','package.wgt');
  const before = sha(await fs.readFile(testWgt));
  const classes = path.join(root,'Build','verify-tools');
  await fs.mkdir(classes,{recursive:true});
  run(path.join(sdk,'jdk','bin','javac.exe'),['-d',classes,path.join(root,'scripts','VerifyWgt.java'),path.join(root,'tests','VerifyWgtSecurity.java')]);
  const reference=process.env.LORI_SIGNING_REFERENCE ?? path.resolve(root,'../../LORITVDiagnostic/Debug/LORITVDiagnostic.wgt');
  run(path.join(sdk,'jdk','bin','java.exe'),['-cp',classes,'VerifyWgtSecurity',testWgt,reference]);
  if(sha(await fs.readFile(testWgt))!==before)throw new Error('Original WGT changed');
});
