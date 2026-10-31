import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeKey,createRemoteInput,installRemoteInput } from '../src/input/remote-input.ts';
import { configureOptionalKeys,requestApplicationExit } from '../src/input/tizen-keys.ts';
const event=(key,extra={})=>({key,prevented:false,preventDefault(){this.prevented=true;},...extra});
test('M3 input maps all mandatory directions/OK/Return and named optional actions',()=>{
  for(const [key,code,action]of [['ArrowLeft',37,'left'],['ArrowUp',38,'up'],['ArrowRight',39,'right'],['ArrowDown',40,'down'],['Enter',13,'ok'],['Back',10009,'back']]){assert.equal(normalizeKey(event(key)),action);assert.equal(normalizeKey(event('Unidentified',{keyCode:code})),action);}
  for(const [key,action]of [['Escape','back'],['ContextMenu','menu'],['MediaPlay','play'],['MediaPause','pause'],['MediaPlayPause','playPause'],['ColorF0Red','red'],['ColorF1Green','green'],['ColorF2Yellow','yellow'],['ColorF3Blue','blue']])assert.equal(normalizeKey(event(key)),action);
  assert.equal(normalizeKey(event('Unidentified',{keyCode:909}),new Map([[909,'playPause']])),'playPause');
});
test('M3 input does not claim OS/unknown, modified or composing keys',()=>{
  for(const key of ['Home','Power','VolumeUp','VolumeDown','AudioVolumeMute','Unknown'])assert.equal(normalizeKey(event(key)),null);
  assert.equal(normalizeKey(event('Enter',{ctrlKey:true})),null);assert.equal(normalizeKey(event('Enter',{isComposing:true})),null);
});
test('M3 one-shot input suppresses duplicates/repeat until keyup; modified keyup clears hold',()=>{
  const calls=[];const input=createRemoteInput(a=>{calls.push(a);return true;});const e=event('Enter');input.keydown(e);input.keydown(e);input.keydown(event('Enter'));input.keydown(event('Enter',{repeat:true}));assert.deepEqual(calls,['ok']);assert.equal(e.prevented,true);input.keyup(event('Enter',{ctrlKey:true}));input.keydown(event('Enter'));assert.equal(calls.length,2);
  for(const key of ['Back','Menu']){input.keydown(event(key));input.keydown(event(key,{repeat:true}));input.keyup(event(key));}assert.deepEqual(calls.slice(-2),['back','menu']);
});
test('M3 directional repeats are bounded with injected monotonic clock, blur resets state',()=>{
  let time=0,count=0;const input=createRemoteInput(()=>{count++;return true;},{now:()=>time});input.keydown(event('ArrowDown'));time=30;input.keydown(event('ArrowDown',{repeat:true}));assert.equal(count,1);time=101;input.keydown(event('ArrowDown',{repeat:true}));assert.equal(count,2);input.reset();input.keydown(event('Enter'));input.reset();input.keydown(event('Enter'));assert.equal(count,4);
});
test('M3 synchronous reentrant input cannot double activate; unhandled events retain default',()=>{
  let count=0,input;input=createRemoteInput(()=>{count++;input.keydown(event('Enter'));return true;});input.keydown(event('Enter'));assert.equal(count,1);
  const unhandled=createRemoteInput(()=>false);const media=event('MediaPlay');unhandled.keydown(media);assert.equal(media.prevented,false);
});
test('M3 unowned editing/media repeat events retain native default behavior',()=>{const input=createRemoteInput(()=>assert.fail('unowned dispatch'),{owns:()=>false});for(const key of ['Backspace','Enter','MediaPlay'])for(const repeat of [false,true]){const e=event(key,{repeat});input.keydown(e);input.keydown(e);assert.equal(e.prevented,false);}});
test('M3 listener ownership cleans up over50 install/dispose cycles',()=>{
  class Target{listeners=new Map();addEventListener(k,f){const s=this.listeners.get(k)??new Set();s.add(f);this.listeners.set(k,s);}removeEventListener(k,f){this.listeners.get(k)?.delete(f);}count(){return [...this.listeners.values()].reduce((n,s)=>n+s.size,0);}}
  const previousWindow=globalThis.window,previousDocument=globalThis.document;globalThis.window=new Target();globalThis.document=new Target();
  try{const target=new Target();for(let i=0;i<50;i++){const dispose=installRemoteInput(target,()=>true);assert.throws(()=>installRemoteInput(target,()=>true),/already installed/);assert.equal(target.count(),2);dispose();assert.equal(target.count(),0);assert.equal(window.count(),0);assert.equal(document.count(),0);}}finally{globalThis.window=previousWindow;globalThis.document=previousDocument;}
});
test('M3 optional adapter makes zero calls by default and degrades on missing/throwing APIs',()=>{
  let calls=0;const api={getSupportedKeys(){calls++;throw Error();},registerKey(){calls++;},unregisterKey(){calls++;}};
  assert.equal(configureOptionalKeys(api).status,'disabled');assert.equal(configureOptionalKeys(api,['MediaPlay']).status,'disabled');assert.equal(calls,0);assert.equal(configureOptionalKeys(undefined,['MediaPlay'],true).status,'unavailable');assert.equal(configureOptionalKeys(api,['MediaPlay'],true).status,'failed');
});
test('M3 optional registration allowlists supported keys, rejects mandatory/collisions and cleans partial success',()=>{
  const registered=[],removed=[];const api={getSupportedKeys:()=>[{name:'MediaPlay',code:415},{name:'MediaPause',code:19},{name:'Menu',code:13},{name:'ColorF0Red',code:415},{name:'Home',code:36}],registerKey(n){if(n==='MediaPause')throw Error('denied');registered.push(n);},unregisterKey(n){removed.push(n);}};
  const result=configureOptionalKeys(api,['MediaPlay','MediaPause','Menu','ColorF0Red','Home','ArrowUp'],true);assert.equal(result.status,'partial');assert.deepEqual(registered,['MediaPlay']);assert.deepEqual([...result.codes],[[415,'play']]);result.dispose();result.dispose();assert.deepEqual(removed,['MediaPlay']);assert.equal(result.codes.size,0);
});
test('M3 platform exit hook is explicit and safely reports failure',()=>{
  let exits=0;assert.equal(requestApplicationExit({getCurrentApplication:()=>({exit(){exits++;}})}),true);assert.equal(exits,1);assert.equal(requestApplicationExit({getCurrentApplication(){throw Error('denied');}}),false);
});
test('M3 1000 input actions produce exactly one activation per released press',()=>{
  let time=0,activations=0;const input=createRemoteInput(()=>{activations++;return true;},{now:()=>time});for(let i=0;i<1000;i++){const key=['Enter','Back','Menu','ArrowDown'][i%4];const e=event(key);input.keydown(e);input.keydown(e);input.keydown(event(key,{repeat:true}));input.keyup(event(key));time+=500;}assert.equal(activations,1000);
});
