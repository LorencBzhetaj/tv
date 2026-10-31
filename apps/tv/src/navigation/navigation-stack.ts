import type { FocusSnapshot } from '../focus/focus-manager';
export interface NavigationEntry { screen:string; focus:FocusSnapshot|null; state:Readonly<Record<string,string|number|boolean|null>> }
export interface BackLayers { dismissModal:()=>boolean; dismissMenu:()=>boolean; restore:(entry:NavigationEntry)=>void; requestExit:()=>void }
export class NavigationStack {
  private entries:NavigationEntry[];private lastBack=-Infinity;private busy=false;
  private limit:number;private guardMs:number;
  private canLeave:(entry:NavigationEntry)=>boolean;
  constructor(root:NavigationEntry,limit=32,guardMs=450,canLeave:(entry:NavigationEntry)=>boolean = entry=>entry.screen!=='player'){if(limit<1)throw new Error('Invalid history limit');this.limit=limit;this.guardMs=guardMs;this.canLeave=canLeave;this.entries=[structuredClone(root)];}
  get length():number{return this.entries.length;}
  get current():NavigationEntry{return structuredClone(this.entries[this.entries.length-1]!);}
  push(entry:NavigationEntry,origin?:NavigationEntry):boolean {if(this.busy||this.entries.length>=this.limit||!this.canLeave(this.current))return false;if(origin)this.entries[this.entries.length-1]=structuredClone(origin);this.entries.push(structuredClone(entry));return true;}
  replace(entry:NavigationEntry):void {if(!this.busy&&this.canLeave(this.current))this.entries[this.entries.length-1]=structuredClone(entry);}
  private popEntry():NavigationEntry|null {if(this.entries.length<=1||!this.canLeave(this.current))return null;this.entries.pop();return this.current;}
  pop():NavigationEntry|null {return this.busy?null:this.popEntry();}
  back(layers:BackLayers,now:number):'ignored'|'modal'|'menu'|'route'|'exit'|'blocked' {
    if(this.busy||now-this.lastBack<this.guardMs)return 'ignored';this.busy=true;this.lastBack=now;
    try {if(layers.dismissModal())return 'modal';if(layers.dismissMenu())return 'menu';if(!this.canLeave(this.current))return 'blocked';const previous=this.current;const entry=this.popEntry();if(entry){try{layers.restore(entry);}catch(error){this.entries.push(previous);throw error;}return 'route';}layers.requestExit();return 'exit';}
    finally{this.busy=false;}
  }
}
