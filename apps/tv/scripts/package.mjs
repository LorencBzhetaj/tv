import { stage, tz, run, verifyStage } from './lib.mjs';
await verifyStage();
run(process.execPath, ['scripts/verify.mjs','stage']);
run(tz, ['pack-chain',`--proj-dir=${stage}`]);
console.log('Signed package build completed. Run npm run verify:package before any separately approved device operation.');
