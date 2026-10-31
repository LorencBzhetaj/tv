export type Direction = 'up' | 'down' | 'left' | 'right';
export type RemoteAction = Direction | 'ok' | 'back' | 'menu' | 'play' | 'pause' | 'playPause' | 'red' | 'green' | 'yellow' | 'blue' | 'toggleView' | 'tabNext' | 'tabPrevious';
export interface KeyInput { key?: string; keyCode?: number; repeat?: boolean; shiftKey?: boolean; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean; isComposing?: boolean; target?: EventTarget | null; preventDefault(): void }
const names: Readonly<Record<string,RemoteAction>> = {
  ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', Enter:'ok',
  Escape:'back', Back:'back', GoBack:'back', Backspace:'back', Menu:'menu', ContextMenu:'menu',
  MediaPlay:'play', MediaPause:'pause', MediaPlayPause:'playPause',
  ColorF0Red:'red', ColorF1Green:'green', ColorF2Yellow:'yellow', ColorF3Blue:'blue',
};
const mandatory: Readonly<Record<number,RemoteAction>> = {37:'left',38:'up',39:'right',40:'down',13:'ok',10009:'back'};
export function normalizeKey(event: KeyInput, optionalCodes: ReadonlyMap<number,RemoteAction> = new Map()): RemoteAction | null {
  if(event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return null;
  if(event.key === 'Tab') return event.shiftKey ? 'tabPrevious' : 'tabNext';
  if(event.key === 'f' || event.key === 'F') return 'toggleView';
  return (event.key ? names[event.key] : undefined) ?? mandatory[event.keyCode ?? -1] ?? optionalCodes.get(event.keyCode ?? -1) ?? null;
}
export function createRemoteInput(dispatch: (action: RemoteAction,event: KeyInput)=>boolean, options: {now?:()=>number; optionalCodes?:ReadonlyMap<number,RemoteAction>; repeatMs?:number; owns?:(action:RemoteAction,event:KeyInput)=>boolean} = {}) {
  const now = options.now ?? (()=>performance.now());
  const held = new Set<RemoteAction>(); const lastDirection = new Map<RemoteAction,number>();
  const seen = new WeakSet<object>();
  let busy = false;
  function keydown(event: KeyInput): void {
    const action = normalizeKey(event,options.optionalCodes); if(!action) return;
    if(options.owns&&!options.owns(action,event))return;
    if(seen.has(event)){event.preventDefault();return;}
    const direction = ['up','down','left','right'].includes(action);
    // Suppress repeated one-shot actions until keyup; Tab retains browser repeat semantics.
    const once = !direction && action !== 'tabNext' && action !== 'tabPrevious' && action !== 'toggleView';
    if(busy || (once && (event.repeat || held.has(action))) || (action === 'toggleView' && event.repeat)) { event.preventDefault(); return; }
    const time = now();
    if(direction && event.repeat && time-(lastDirection.get(action) ?? -Infinity)<(options.repeatMs ?? 100)) { event.preventDefault(); return; }
    busy = true;
    try { if(dispatch(action,event)) { seen.add(event);event.preventDefault(); if(once) held.add(action); if(direction) lastDirection.set(action,time); } }
    finally { busy = false; }
  }
  function keyup(event: KeyInput): void { const action=normalizeKey({key:event.key??'',keyCode:event.keyCode??0,preventDefault(){}},options.optionalCodes);if(action){held.delete(action);lastDirection.delete(action);} }
  function reset(): void { held.clear();lastDirection.clear(); }
  return {keydown,keyup,reset};
}
const owners = new WeakSet<EventTarget>();
export function installRemoteInput(target: HTMLElement,dispatch:(action:RemoteAction,event:KeyInput)=>boolean,optionalCodes:ReadonlyMap<number,RemoteAction> = new Map(),owns:(action:RemoteAction,event:KeyInput)=>boolean = ()=>true): ()=>void {
  if(owners.has(target)) throw new Error('Input owner already installed');
  owners.add(target); const input=createRemoteInput(dispatch,{optionalCodes,owns});
  target.addEventListener('keydown',input.keydown);target.addEventListener('keyup',input.keyup);
  window.addEventListener('blur',input.reset);document.addEventListener('visibilitychange',input.reset);
  return ()=>{target.removeEventListener('keydown',input.keydown);target.removeEventListener('keyup',input.keyup);window.removeEventListener('blur',input.reset);document.removeEventListener('visibilitychange',input.reset);input.reset();owners.delete(target);};
}
