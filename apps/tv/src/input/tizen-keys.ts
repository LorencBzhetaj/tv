import type { RemoteAction } from './remote-input';
// Minimal local shape: no installed TVInputDevice declarations or new typing dependency required.
export interface TVInputDevice { getSupportedKeys():Array<{name:string;code:number}>; registerKey(name:string):void; unregisterKey(name:string):void }
export interface ApplicationLifecycle {getCurrentApplication():{exit():void}}
export function requestApplicationExit(api?:ApplicationLifecycle):boolean {
  try { const lifecycle=api??(window as Window & {tizen?:{application?:ApplicationLifecycle}}).tizen?.application;
    if(!lifecycle)return false;lifecycle.getCurrentApplication().exit();return true;
  } catch {return false;}
}
const optional: Readonly<Record<string,RemoteAction>> = {Menu:'menu',MediaPlay:'play',MediaPause:'pause',MediaPlayPause:'playPause',ColorF0Red:'red',ColorF1Green:'green',ColorF2Yellow:'yellow',ColorF3Blue:'blue'};
export function tizenInputDevice(): TVInputDevice | undefined {
  try {const api=(window as Window & {tizen?:{tvinputdevice?:TVInputDevice}}).tizen?.tvinputdevice;
    return api && typeof api.getSupportedKeys==='function' && typeof api.registerKey==='function' && typeof api.unregisterKey==='function' ? api : undefined;
  }catch{return undefined;}
}
export function configureOptionalKeys(api: TVInputDevice | undefined, requested: readonly string[] = [], privilegeApproved = false) {
  const codes = new Map<number,RemoteAction>();const registered:string[]=[];const failures:string[]=[];
  let status: 'disabled'|'unavailable'|'registered'|'partial'|'failed' = 'disabled';
  // No capability query or registration at all without a demonstrated request AND privilege approval.
  if(requested.length && privilegeApproved) {
    if(!api) status='unavailable';
    else try {
      const supported=api.getSupportedKeys().slice(0,256);
      for(const name of [...new Set(requested)].slice(0,8)) {
        const action=Object.hasOwn(optional,name)?optional[name]:undefined;
        const matches=supported.filter(key=>key.name===name);
        const key=matches.length===1?matches[0]:undefined;
        if(!action || !key || !Number.isSafeInteger(key.code) || key.code<=0 || [13,37,38,39,40,10009].includes(key.code) || codes.has(key.code)) continue;
        try { api.registerKey(name);registered.push(name);codes.set(key.code,action); } catch { failures.push(name); }
      }
      status=failures.length?'partial':registered.length?'registered':'unavailable';
    } catch { status='failed'; }
  }
  return {codes,status,registered:[...registered],failures:[...failures],dispose(){for(const name of registered.splice(0))try{api?.unregisterKey(name);}catch{/* Bounded best-effort disposal; no retry. */}codes.clear();}};
}
