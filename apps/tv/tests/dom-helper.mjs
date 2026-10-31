// Small DOM double for lifecycle/state assertions; layout is checked separately in a real browser.
import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stage } from '../scripts/lib.mjs';
export async function boot(storage) {
  let doc;
  class Element {
    constructor(tag) { this.tagName=tag.toUpperCase(); this.children=[]; this.attributes={}; this.listeners={}; this.dataset={}; this.hidden=false; this.disabled=false; this.inert=false; this.scrollTop=0; this.textContent=''; this.value=''; this.style={values:{},setProperty:(k,v)=>{this.style.values[k]=v;}}; }
    append(...nodes) { for(const node of nodes){node.parent=this;this.children.push(node);} }
    setAttribute(k,v) { this.attributes[k]=String(v); }
    removeAttribute(k) { delete this.attributes[k]; }
    getAttribute(k) { return this.attributes[k] ?? null; }
    addEventListener(k,fn) { (this.listeners[k]??=[]).push(fn); }
    removeEventListener(k,fn) { this.listeners[k]=(this.listeners[k]??[]).filter(f=>f!==fn); }
    get isConnected() { return this===body || !!this.parent?.isConnected; }
    getClientRects() { return this.closest('[hidden]')?[]:[{top:0,bottom:30}]; }
    matches(selector) { return selector.split(',').some(s=>{if(s==='[hidden]')return this.hidden;if(s==='[inert]')return this.inert;if(s===':disabled')return this.disabled;if(s==='[aria-disabled="true"]')return this.attributes['aria-disabled']==='true';if(s==='[contenteditable="true"]')return false;if(s==='button:not(:disabled)')return this.tagName==='BUTTON'&&!this.disabled;return this.tagName===s.toUpperCase();}); }
    closest(selector) { return this.matches(selector)?this:this.parent?.closest(selector)??null; }
    querySelectorAll(selector) { return this.children.flatMap(n=>[...(n.matches(selector)?[n]:[]),...n.querySelectorAll(selector)]); }
    focus() { doc.activeElement=this;this.fire('focusin'); }
    click() { if(!this.disabled)this.fire('click'); }
    remove() { if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null; }
    scrollIntoView() {}
    fire(type,props={}) { const event={target:this,key:'',repeat:false,shiftKey:false,preventDefault(){this.prevented=true;},...props}; for(let n=this;n;n=n.parent)for(const fn of n.listeners[type]??[])fn(event);return event; }
  }
  const body=new Element('body'); const host=new Element('div');host.id='app';const status=new Element('p');status.id='boot-status';body.append(host,status);
  doc={body,documentElement:new Element('html'),activeElement:null,title:'',createElement:tag=>new Element(tag),getElementById:id=>[body,...body.querySelectorAll('*')].find(n=>n.id===id)};
  // '*' is only needed for ID lookup, never UI navigation.
  doc.getElementById=id=>{function find(n){if(n.id===id)return n;for(const c of n.children){const hit=find(c);if(hit)return hit;}return null;}return find(body);};
  const win={localStorage:storage,innerWidth:1600,innerHeight:900,listeners:{},addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);},removeEventListener(k,fn){this.listeners[k]=(this.listeners[k]??[]).filter(f=>f!==fn);}};
  doc.listeners={};doc.addEventListener=win.addEventListener;doc.removeEventListener=win.removeEventListener;
  let clock=0;
  const context={document:doc,window:win,HTMLElement:Element,performance:{now:()=>clock},structuredClone};
  vm.runInNewContext(await fs.readFile(path.join(stage,'app.js'),'utf8'),context);
  return {document:doc,window:win,host,status,get:id=>doc.getElementById(id),tick:ms=>{clock+=ms;}};
}
