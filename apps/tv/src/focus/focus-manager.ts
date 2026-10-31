import type { Direction } from '../input/remote-input';
export interface ScrollPosition { top:number; left:number }
export interface FocusSnapshot { scope:string; node:string|null; scroll:Record<string,ScrollPosition> }
export interface FocusNode { id:string; region:string; element:()=>HTMLElement|null; neighbors:Partial<Record<Direction,string|(()=>string)>> }
export interface FocusScope { id:string; initial:string; fallback:string; nodes:readonly FocusNode[]; scrollers?:Readonly<Record<string,()=>HTMLElement|null>> }
export function eligible(element:HTMLElement|null): element is HTMLElement {
  const visibility=element?.ownerDocument?.defaultView?.getComputedStyle(element).visibility;
  return !!element && element.isConnected!==false && visibility!=='hidden' && visibility!=='collapse' && !element.matches(':disabled,[aria-disabled="true"]') && !element.closest('[hidden],[inert]') && element.getClientRects().length>0;
}
export class FocusManager {
  private scopes=new Map<string,FocusScope>();private parents:FocusSnapshot[]=[];
  private scopeId='';private currentId:string|null=null;
  private anchors=new Map<string,Map<string,string>>();
  private limit:number;
  constructor(limit=8) {this.limit=limit;}
  register(scope:FocusScope):void {
    if(!this.scopes.has(scope.id)&&this.scopes.size>=32)throw new Error('Focus registry limit');
    if(!scope.nodes.length || scope.nodes.length>256 || new Set(scope.nodes.map(n=>n.id)).size!==scope.nodes.length || !scope.nodes.some(n=>n.id===scope.initial) || !scope.nodes.some(n=>n.id===scope.fallback)) throw new Error('Invalid focus scope');
    this.scopes.set(scope.id,scope);
  }
  get activeScope():string { return this.scopeId; }
  get activeNode():string|null { return this.currentId; }
  get depth():number {return this.parents.length;}
  private scope():FocusScope { const scope=this.scopes.get(this.scopeId);if(!scope)throw new Error('Focus scope missing');return scope; }
  activate(id:string,preferred?:string):boolean {if(!this.scopes.has(id))return false;this.scopeId=id;this.currentId=null;return this.focus(preferred??this.scope().initial);}
  private remember(node:FocusNode):void {const regions=this.anchors.get(this.scopeId)??new Map<string,string>();regions.set(node.region,node.id);this.anchors.set(this.scopeId,regions);}
  anchor(scope:string,region:string,fallback:string):string {const id=this.anchors.get(scope)?.get(region);const node=this.scopes.get(scope)?.nodes.find(n=>n.id===id);return node&&eligible(node.element())?node.id:fallback;}
  sync(id:string):boolean {const node=this.scope().nodes.find(n=>n.id===id);if(node&&eligible(node.element())){this.currentId=id;this.remember(node);return true;}return false;}
  focus(id:string):boolean {
    const scope=this.scope();const ids=[id,scope.fallback,...scope.nodes.map(n=>n.id)];
    for(const candidate of new Set(ids)){const node=scope.nodes.find(n=>n.id===candidate);const el=node?.element();if(node&&eligible(el??null)){this.currentId=candidate;this.remember(node);el!.focus({preventScroll:true});el!.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});return true;}}
    this.currentId=null;return false;
  }
  move(direction:Direction):boolean {
    const scope=this.scope();let node=scope.nodes.find(n=>n.id===this.currentId);const visited=new Set<string>();
    while(node){visited.add(node.id);const edge=node.neighbors[direction],next=typeof edge==='function'?edge():edge;if(!next||visited.has(next))break;const target=scope.nodes.find(n=>n.id===next);if(!target)break;if(eligible(target.element()))return this.focus(next);node=target;}
    return this.focus(this.currentId??scope.fallback);
  }
  tab(previous=false):boolean {
    const nodes=this.scope().nodes.filter(n=>eligible(n.element()));if(!nodes.length){this.currentId=null;return false;}
    const i=nodes.findIndex(n=>n.id===this.currentId),next=(i+(previous?-1:1)+nodes.length)%nodes.length;return this.focus(nodes[next]!.id);
  }
  capture():FocusSnapshot {const scroll:Record<string,ScrollPosition>={};for(const [id,get]of Object.entries(this.scope().scrollers??{})){const el=get();if(el)scroll[id]={top:el.scrollTop,left:el.scrollLeft};}return {scope:this.scopeId,node:this.currentId,scroll};}
  restore(snapshot:FocusSnapshot):boolean {
    if(!this.scopes.has(snapshot.scope))return false;this.scopeId=snapshot.scope;const result=this.focus(snapshot.node??this.scope().fallback);
    for(const [id,pos]of Object.entries(snapshot.scroll)){const el=this.scope().scrollers?.[id]?.();if(el){el.scrollTop=pos.top;el.scrollLeft=pos.left;}}
    // Exact offsets when still visible; native nearest scrolling safely clamps changed content.
    this.scope().nodes.find(n=>n.id===this.currentId)?.element()?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});return result;
  }
  push(id:string):boolean {if(this.parents.length>=this.limit||!this.scopes.has(id))return false;const parent=this.capture();this.parents.push(parent);if(this.activate(id))return true;this.parents.pop();this.restore(parent);return false;}
  pop():boolean {const parent=this.parents.pop();return parent?this.restore(parent):false;}
  reconcile():boolean {return this.focus(this.currentId??this.scope().fallback);}
  clear():void {this.scopes.clear();this.anchors.clear();this.parents=[];this.scopeId='';this.currentId=null;}
}
