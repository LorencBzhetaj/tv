import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { boot } from './dom-helper.mjs';
import { readPreferences, savePreferences, viewportMetrics } from '../src/preferences.ts';
import { resources, translate } from '../src/locales.ts';
import { root } from '../scripts/lib.mjs';
function memory(value=null) { return {value,getItem(){return this.value;},setItem(k,v){this.value=v;}}; }

test('M2 defaults to Full View, English, Home and hidden navigation',async()=>{
  const app=await boot(memory());assert.equal(app.host.children[0].dataset.view,'full');assert.equal(app.document.documentElement.lang,'en');assert.equal(app.get('frame-title').textContent,'Home');assert.equal(app.get('frame-sidebar').hidden,true);
});
test('M2 Standard View toggle persists across boot and retains Home',async()=>{
  const storage=memory();const app=await boot(storage);const view=app.get('frame-view');view.value='standard';view.fire('change');assert.equal(app.get('frame-sidebar').hidden,false);assert.equal((await boot(storage)).host.children[0].dataset.view,'standard');assert.equal(app.get('frame-title').textContent,'Home');
});
test('M2 Menu is modal, backgrounds inert, Escape restores invoker and scroll',async()=>{
  const app=await boot(memory());app.get('frame-content').scrollTop=124;app.get('frame-menu').fire('click');assert.equal(app.get('frame-sidebar').getAttribute('aria-modal'),'true');assert.equal(app.get('frame-content').inert,true);assert.equal(app.document.activeElement.id,'frame-nav-home');app.get('frame-nav-home').fire('keydown',{key:'Escape'});assert.equal(app.get('frame-sidebar').hidden,true);assert.equal(app.get('frame-content').inert,false);assert.equal(app.document.activeElement.id,'frame-menu');assert.equal(app.get('frame-content').scrollTop,124);
});
test('M2 EN/SQ resources have equal keys and switching persists without focus/scroll reset',async()=>{
  assert.deepEqual(Object.keys(resources.en),Object.keys(resources.sq));const storage=memory();const app=await boot(storage);const control=app.get('frame-language');control.focus();app.get('frame-content').scrollTop=98;control.value='sq';control.fire('change');assert.equal(app.get('frame-title').textContent,'Kryefaqja');assert.equal(app.document.documentElement.lang,'sq');assert.equal(app.document.activeElement.id,'frame-language');assert.equal(app.get('frame-content').scrollTop,98);assert.equal((await boot(storage)).get('frame-title').textContent,'Kryefaqja');control.value='en';control.fire('change');assert.equal(app.get('frame-title').textContent,'Home');
});
test('M2 missing translation uses English fallback then visible resource key',()=>{
  const backup=resources.sq.home;try{resources.sq.home='';assert.equal(translate('sq','home'),'Home');}finally{resources.sq.home=backup;}
  assert.equal(translate('sq','unknown.key'),'[unknown.key]');assert.equal(translate('en','__proto__'),'[__proto__]');
});
test('M2 corrupt/blocked preferences safely default; failed save is visible',async()=>{
  assert.deepEqual(readPreferences(memory('{bad')), {locale:'en',viewMode:'full'});assert.deepEqual(readPreferences(memory('{"locale":"xx","viewMode":"giant"}')),{locale:'en',viewMode:'full'});
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};assert.equal(savePreferences(blocked,{locale:'en',viewMode:'full'}),false);const app=await boot(blocked);app.get('frame-language').value='sq';app.get('frame-language').fire('change');assert.equal(app.host.children[0].querySelectorAll('p').find(n=>n.className==='storage-warning').hidden,false);
});
test('M2 viewport metrics scale with actual viewport and safe margins round outward',async()=>{
  assert.deepEqual(viewportMetrics(1600,900),{scale:1,safe:48});assert.deepEqual(viewportMetrics(1920,1080),{scale:1.2,safe:58});assert.equal(viewportMetrics(1280,720).safe,39);assert.equal(viewportMetrics(390,844).safe,16);const app=await boot();app.window.innerWidth=1920;app.window.innerHeight=1080;app.window.listeners.resize[0]();assert.equal(app.host.children[0].style.values['--safe'],'58px');
});
test('M2 temporary F shortcut excludes selects, open dialogs and repeated keys',async()=>{
  const app=await boot(memory());const frame=app.host.children[0];app.get('frame-menu').fire('keydown',{key:'f'});assert.equal(frame.dataset.view,'standard');app.get('frame-view').fire('keydown',{key:'f'});assert.equal(frame.dataset.view,'standard');app.get('frame-menu').fire('keydown',{key:'f',repeat:true});assert.equal(frame.dataset.view,'standard');app.get('frame-menu').fire('keydown',{key:'f'});app.get('frame-menu').fire('click');app.get('frame-nav-home').fire('keydown',{key:'f'});assert.equal(frame.dataset.view,'full');
});
test('M2 overlay Tab stays inside and directional input is deterministic DOM order',async()=>{
  const app=await boot(memory());app.get('frame-menu').fire('click');app.get('frame-nav-home').fire('keydown',{key:'ArrowDown'});assert.equal(app.document.activeElement.id,'frame-nav-settings');app.get('frame-nav-settings').fire('keydown',{key:'Tab'});assert.equal(app.document.activeElement.className,'close-menu');
});
test('M2 runtime uses no HTML injection, external dependencies or media/network API',async()=>{
  for(const file of ['frame.ts','main.ts','locales.ts','preferences.ts','pc-navigation.ts'])assert.doesNotMatch(await fs.readFile(path.join(root,'src',file),'utf8'),/innerHTML|insertAdjacentHTML|\bfetch\(|XMLHttpRequest|https?:|webapis|avplay|<video|<audio/i);
  const css=await fs.readFile(path.join(root,'src/boot.css'),'utf8');for(const color of ['#07101e','#1672ed','#48a9ff'])assert.ok(css.includes(color));assert.match(css,/prefers-reduced-motion/);assert.doesNotMatch(css,/width:1600px|height:900px|@import|url\(/);
});
