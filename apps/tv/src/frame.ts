import { translate, type MessageKey } from './locales';
import { readPreferences, savePreferences, viewportMetrics, type PreferenceStorage } from './preferences';
import { installRemoteInput, type RemoteAction, type KeyInput } from './input/remote-input';
import { configureOptionalKeys, tizenInputDevice, requestApplicationExit } from './input/tizen-keys';
import { FocusManager, eligible, type FocusNode } from './focus/focus-manager';
import { NavigationStack } from './navigation/navigation-stack';

export function mountFrame(host: HTMLElement, storage?: PreferenceStorage, onExit:()=>boolean = requestApplicationExit): ()=>void {
  const prefs = readPreferences(storage);
  const bindings: Array<{ node: HTMLElement; key: MessageKey }> = [];
  const named: Array<{ node: HTMLElement; attr: string; key: MessageKey }> = [];
  function element<K extends keyof HTMLElementTagNameMap>(tag: K, key?: MessageKey, cls?: string): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag); if (key) bindings.push({ node, key }); if (cls) node.className = cls; return node;
  }
  function button(key: MessageKey, cls?: string): HTMLButtonElement { const node = element('button',key,cls); node.type = 'button'; return node; }
  function brand(): HTMLElement {
    const node = element('div',undefined,'brand'); const image = element('img'); image.src = 'assets/icon.png'; image.alt = ''; image.width = 48; image.height = 48;
    node.append(image,element('span','appTitle')); return node;
  }
  const frame = element('div',undefined,'app-frame'); frame.dataset.view = prefs.viewMode;
  const header = element('header',undefined,'app-header');
  const menuButton = button('menu','menu-button'); menuButton.id = 'frame-menu'; menuButton.setAttribute('aria-controls','frame-sidebar'); header.append(menuButton,brand());
  const headerActions = element('div',undefined,'header-actions');
  for (const key of ['search','profiles'] as const) { const control = button(key,'quiet'); control.disabled = true; headerActions.append(control); }
  header.append(headerActions);
  const sidebar = element('aside',undefined,'sidebar'); sidebar.id = 'frame-sidebar'; sidebar.append(brand());
  const closeButton = button('closeMenu','close-menu'); closeButton.id='frame-close-menu'; sidebar.append(closeButton);
  const nav = element('nav',undefined,'nav'); named.push({node:nav,attr:'aria-label',key:'navigation'});
  const navButtons: HTMLButtonElement[] = [];
  for (const key of ['home','live','guide','sports','movies','series','search','favorites','watchlist','profiles','settings'] as const) {
    const control = button(key,key === 'home' ? 'nav-item selected' : 'nav-item'); control.id = `frame-nav-${key}`;
    if (key === 'home') control.setAttribute('aria-current','page');
    else if (key !== 'settings') { control.disabled = true; named.push({node:control,attr:'title',key:'later'}); }
    navButtons.push(control); nav.append(control);
  }
  sidebar.append(nav,element('p','later','sidebar-note'));
  const scrim = element('button',undefined,'menu-scrim'); scrim.type = 'button'; scrim.tabIndex = -1;
  named.push({node:scrim,attr:'aria-label',key:'cancel'});
  const main = element('main'); main.id = 'frame-content'; main.setAttribute('aria-labelledby','frame-title');
  const title = element('h1','home'); title.id = 'frame-title'; main.append(title);
  const hero = element('section',undefined,'welcome'); hero.append(element('h2','headline'),element('p','emptyCopy'));
  const settingsAction = button('openSettings','primary'); settingsAction.id='frame-settings-action'; hero.append(settingsAction); main.append(hero,element('p','empty','empty-state'));
  const settings = element('section',undefined,'preferences'); settings.id = 'frame-preferences'; settings.setAttribute('aria-labelledby','preferences-title');
  const settingsTitle = element('h2','settingsTitle'); settingsTitle.id = 'preferences-title'; settings.append(settingsTitle,element('p','settingsCopy','muted'));
  function choice(id: string, labelKey: MessageKey, copyKey: MessageKey, options: Array<[string,MessageKey]>): HTMLSelectElement {
    const row = element('div',undefined,'preference-row'); const words = element('div'); const label = element('label',labelKey); label.htmlFor = id;
    const copy = element('p',copyKey,'muted'); copy.id = `${id}-help`; words.append(label,copy);
    const select = element('select'); select.id = id; select.setAttribute('aria-describedby',copy.id);select.setAttribute('aria-haspopup','dialog');
    for (const [value,key] of options) { const option = element('option',key); option.value = value; select.append(option); }
    row.append(words,select); settings.append(row); return select;
  }
  const view = choice('frame-view','viewMode','viewCopy',[['full','full'],['standard','standard']]);
  const locale = choice('frame-language','language','languageCopy',[['en','english'],['sq','albanian']]); main.append(settings);
  const warning = element('p','storageError','storage-warning'); warning.setAttribute('role','status'); warning.hidden = true; main.append(warning);
  const footer = element('footer'); footer.append(element('span','frameOnly'),element('span','pcHelp','pc-help'));
  frame.append(sidebar,header,main,footer,scrim); host.append(frame);
  const focus=new FocusManager();const navigation=new NavigationStack({screen:'home',focus:null,state:{}});
  const optionalKeys=configureOptionalKeys(tizenInputDevice()); // No optional requirement: no query/registration/privilege.
  let menuOpen = false; let dialog: 'view'|'language'|'exit'|null = null;let exitPending=false;
  const dialogs=new Map<string,HTMLElement>();
  function node(id:string,region:string,neighbors:FocusNode['neighbors']):FocusNode {return {id,region,neighbors,element:()=>document.getElementById(id)};}
  const scrollers={main:()=>main,sidebar:()=>sidebar};
  function registerBase():void {
    const side=prefs.viewMode==='standard';
    focus.register({id:'home',initial:'frame-settings-action',fallback:'frame-menu',scrollers,nodes:[
      node('frame-menu','header',{down:()=>focus.anchor('home','content','frame-settings-action'),right:'frame-settings-action',left:side?'frame-nav-home':'frame-menu'}),
      node('frame-settings-action','content',{up:'frame-menu',down:'frame-view',left:side?'frame-nav-home':'frame-menu',right:'frame-view'}),
      node('frame-view','content',{up:'frame-settings-action',down:'frame-language',left:side?'frame-nav-settings':'frame-menu',right:'frame-language'}),
      node('frame-language','content',{up:'frame-view',left:side?'frame-nav-settings':'frame-menu',right:'frame-view'}),
      node('frame-nav-home','sidebar',{down:'frame-nav-settings',right:()=>focus.anchor('home','content','frame-settings-action')}),
      node('frame-nav-settings','sidebar',{up:'frame-nav-home',right:'frame-view'}),
    ]});
  }
  focus.register({id:'menu',initial:'frame-nav-home',fallback:'frame-close-menu',scrollers,nodes:[
    node('frame-close-menu','menu',{down:'frame-nav-home'}),node('frame-nav-home','menu',{up:'frame-close-menu',down:'frame-nav-settings'}),node('frame-nav-settings','menu',{up:'frame-nav-home'}),
  ]});
  function createDialog(id:'view'|'language'|'exit',titleKey:MessageKey,choices:Array<[string,MessageKey,()=>void]>):void {
    const panel=element('section',undefined,'focus-dialog');panel.id=`frame-dialog-${id}`;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby',`${panel.id}-title`);
    const heading=element('h2',titleKey);heading.id=`${panel.id}-title`;panel.append(heading);
    if(id==='exit')panel.append(element('p','exitCopy'));
    const ids:string[]=[];
    for(const [suffix,key,run]of choices){const control=button(key);control.id=`${panel.id}-${suffix}`;control.addEventListener('click',run);ids.push(control.id);panel.append(control);}
    const cancel=button('cancel');cancel.id=`${panel.id}-cancel`;cancel.addEventListener('click',closeDialog);ids.push(cancel.id);panel.append(cancel);
    const error=element('p','exitUnavailable','storage-warning');error.id='frame-exit-error';error.hidden=true;if(id==='exit'){error.setAttribute('role','status');panel.append(error);}
    frame.append(panel);dialogs.set(id,panel);
    focus.register({id,initial:id==='exit'?cancel.id:ids[0]!,fallback:cancel.id,scrollers,nodes:ids.map((key,i)=>node(key,'dialog',{up:ids[Math.max(0,i-1)]!,down:ids[Math.min(ids.length-1,i+1)]!,left:ids[Math.max(0,i-1)]!,right:ids[Math.min(ids.length-1,i+1)]!}))});
  }
  createDialog('view','viewMode',[['full','full',()=>{closeDialog();setView('full');}],['standard','standard',()=>{closeDialog();setView('standard');}]]);
  createDialog('language','language',[['en','english',()=>{closeDialog();setLocale('en');}],['sq','albanian',()=>{closeDialog();setLocale('sq');}]]);
  createDialog('exit','exitTitle',[['confirm','exitApp',()=>{if(exitPending)return;exitPending=true;try{if(onExit())return;}catch{/* Remain in a cancelable dialog if platform exit fails. */}exitPending=false;document.getElementById('frame-exit-error')!.hidden=false;}]]);
  function render(): void {
    document.documentElement.lang = prefs.locale; document.title = translate(prefs.locale,'appTitle');
    for (const {node,key} of bindings) node.textContent = translate(prefs.locale,key);
    for (const {node,attr,key} of named) node.setAttribute(attr,translate(prefs.locale,key));
    document.getElementById('boot-status')!.textContent = translate(prefs.locale,'ready');
    frame.dataset.view = prefs.viewMode; frame.dataset.menu = String(menuOpen); view.value = prefs.viewMode; locale.value = prefs.locale;
    sidebar.hidden = prefs.viewMode === 'full' && !menuOpen; closeButton.hidden = !menuOpen; scrim.hidden = !menuOpen; menuButton.setAttribute('aria-expanded',String(menuOpen));
    header.inert = menuOpen||!!dialog; main.inert = menuOpen||!!dialog; footer.inert = menuOpen||!!dialog;sidebar.inert=!!dialog;
    scrim.hidden=!menuOpen&&!dialog;
    for(const [id,panel]of dialogs)panel.hidden=id!==dialog;
    view.setAttribute('aria-expanded',String(dialog==='view'));locale.setAttribute('aria-expanded',String(dialog==='language'));
    for(const [id,value]of [['view',prefs.viewMode],['language',prefs.locale]])for(const suffix of (id==='view'?['full','standard']:['en','sq'])){const control=document.getElementById(`frame-dialog-${id}-${suffix}`)!;control.setAttribute('aria-pressed',String(suffix===value));control.className=suffix===value?'selected':'';}
    if (menuOpen) { sidebar.setAttribute('role','dialog'); sidebar.setAttribute('aria-modal','true'); sidebar.setAttribute('aria-label',translate(prefs.locale,'navigation')); }
    else { sidebar.removeAttribute('role'); sidebar.removeAttribute('aria-modal'); sidebar.removeAttribute('aria-label'); }
  }
  function setMenu(open: boolean): void {
    if (open === menuOpen || dialog) return;
    menuOpen = open; render();
    if(open){if(!focus.push('menu')){menuOpen=false;render();focus.reconcile();}}else focus.pop();
  }
  function openDialog(id:'view'|'language'|'exit'):void {
    if(dialog)return;dialog=id;render();
    if(!focus.push(id)){dialog=null;render();return;}
    if(id==='view'||id==='language')focus.focus(`frame-dialog-${id}-${id==='view'?prefs.viewMode:prefs.locale}`);
  }
  function closeDialog():void {if(!dialog)return;dialog=null;render();focus.pop();document.getElementById('frame-exit-error')!.hidden=true;}
  function persist(): void { warning.hidden = savePreferences(storage,prefs); }
  function setView(value: string): void {
    const previous = document.activeElement; const top = main.scrollTop;
    prefs.viewMode = value === 'standard' ? 'standard' : 'full'; persist(); render();registerBase();
    if (previous instanceof HTMLElement && previous.closest('[hidden]')) focus.focus('frame-menu'); main.scrollTop = top;
  }
  function setLocale(value:string):void {const top=main.scrollTop;prefs.locale=value==='sq'?'sq':'en';persist();render();main.scrollTop=top;}
  menuButton.addEventListener('click',()=> { focus.sync(menuButton.id);if (prefs.viewMode === 'full') setMenu(!menuOpen); else focus.focus('frame-nav-home'); });
  closeButton.addEventListener('click',()=>setMenu(false)); scrim.addEventListener('click',()=>{if(dialog)closeDialog();else setMenu(false);});
  view.addEventListener('change',()=>setView(view.value));
  locale.addEventListener('change',()=>setLocale(locale.value));
  view.addEventListener('mousedown',event=>{event.preventDefault();focus.focus(view.id);openDialog('view');});
  locale.addEventListener('mousedown',event=>{event.preventDefault();focus.focus(locale.id);openDialog('language');});
  function showSettings(): void { if (menuOpen) setMenu(false);focus.focus('frame-view');settings.scrollIntoView({block:'nearest'}); }
  settingsAction.addEventListener('click',showSettings); document.getElementById('frame-nav-settings')!.addEventListener('click',showSettings);
  navButtons[0]?.addEventListener('click',()=> { if (menuOpen) setMenu(false);main.scrollTop=0;focus.focus('frame-settings-action'); });
  function dispatch(action:RemoteAction,event:KeyInput):boolean {
    const target=event.target instanceof HTMLElement?event.target:document.activeElement;
    if(!(target instanceof HTMLElement)||!eligible(target))return false;
    focus.sync(target.id);
    const editing=target.matches('input,textarea,[contenteditable="true"]');
    if(editing&&action!=='back')return false;
    if(action==='back'){
      if(editing&&event.key==='Backspace')return false;
      navigation.back({dismissModal:()=>{if(!dialog)return false;closeDialog();return true;},dismissMenu:()=>{if(!menuOpen)return false;setMenu(false);return true;},restore:entry=>{if(entry.focus)focus.restore(entry.focus);},requestExit:()=>openDialog('exit')},performance.now());return true;
    }
    if(action==='menu'){if(!dialog){if(prefs.viewMode==='full')setMenu(!menuOpen);else focus.focus('frame-nav-home');}return true;}
    if(action==='toggleView'){if(dialog||menuOpen||target.matches('select'))return false;setView(prefs.viewMode==='full'?'standard':'full');return true;}
    if(action==='tabNext'||action==='tabPrevious'){if(!menuOpen&&!dialog)return false;focus.tab(action==='tabPrevious');return true;}
    if(action==='ok'){if(target===view){openDialog('view');return true;}if(target===locale){openDialog('language');return true;}if(target.matches('button')){target.click();return true;}return false;}
    if(action==='up'||action==='down'||action==='left'||action==='right'){focus.move(action);return true;}
    return false; // No media consumer in M3; never start playback or claim an optional key works.
  }
  function syncFocus(event:FocusEvent):void {if(event.target instanceof HTMLElement)focus.sync(event.target.id);}
  frame.addEventListener('focusin',syncFocus);
  const disposeInput=installRemoteInput(frame,dispatch,optionalKeys.codes,(action,event)=>{
    if(['play','pause','playPause','red','green','yellow','blue'].includes(action))return false;
    const target=event.target;if(!(target instanceof HTMLElement)||!eligible(target))return false;
    if(target.matches('input,textarea,[contenteditable="true"]'))return action==='back'&&event.key!=='Backspace';
    return !(action==='toggleView'&&(dialog||menuOpen||target.matches('select')));
  });
  const observer=typeof MutationObserver==='undefined'?null:new MutationObserver(()=>focus.reconcile());
  observer?.observe(frame,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','disabled','inert','aria-disabled','style']});
  function resumeFocus():void {if(!document.hidden)focus.reconcile();}
  document.addEventListener('visibilitychange',resumeFocus);
  function resize(): void { const metrics = viewportMetrics(window.innerWidth,window.innerHeight); frame.style.setProperty('--ui-scale',String(metrics.scale)); frame.style.setProperty('--safe',`${metrics.safe}px`); }
  window.addEventListener('resize',resize);resize();render();registerBase();focus.activate('home');
  return ()=>{observer?.disconnect();disposeInput();optionalKeys.dispose();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',resumeFocus);frame.removeEventListener('focusin',syncFocus);focus.clear();frame.remove();};
}
