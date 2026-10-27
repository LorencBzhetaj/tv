(function () {
  'use strict';
  const F = window.PREVIEW;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function stored(key, fallback) { try { return JSON.parse(localStorage.getItem('lori-preview-' + key)) ?? fallback; } catch { return fallback; } }
  let locale = stored('locale', 'en'); if (!F.locales[locale]) locale = 'en';
  let profile = 'Lori';
  let favoriteSets = stored('favorites', {Lori:['north','ch1','coast'],Kids:[],Guest:[]});
  let watchSets = stored('watchlist', {Lori:['signal','crossing'],Kids:[],Guest:[]});
  if (!favoriteSets || typeof favoriteSets !== 'object' || Array.isArray(favoriteSets)) favoriteSets = {};
  if (!watchSets || typeof watchSets !== 'object' || Array.isArray(watchSets)) watchSets = {};
  let route = {name:'home', filter:'all', query:'', scope:'all', state:'normal', channel:'ch1', season:1};
  const history = [];
  let modal = null, toastTimer, playing = false, position = 0;
  let searchEditing = false;
  let viewMode = stored('view-mode','full') === 'standard' ? 'standard' : 'full';
  let navOpen = false, navReturn = null, immersive = false, controlsVisible = true;
  let controlsTimer, backLockUntil = 0;
  const label = (en,sq) => locale === 'sq' ? sq : en;
  const progress = {};
  const navNames = ['home','live','guide','sports','movies','series','search','favorites','watchlist','profiles','settings'];
  const t = key => F.locales[locale][key] ?? F.locales.en[key] ?? key;
  const item = id => F.items.find(x => x.id === id) || F.channels.find(x => x.id === id);
  function membership(kind) {
    const store = kind === 'favorite' ? favoriteSets : watchSets;
    if (!Array.isArray(store[profile])) store[profile] = [];
    return store[profile];
  }
  function persist() {
    try { localStorage.setItem('lori-preview-locale', JSON.stringify(locale)); localStorage.setItem('lori-preview-favorites', JSON.stringify(favoriteSets)); localStorage.setItem('lori-preview-watchlist', JSON.stringify(watchSets)); } catch { toast(locale === 'sq' ? 'Ruajtja lokale nuk është e disponueshme.' : 'Local saving unavailable; changes last for this session.'); }
  }
  function button(label, action, arg='', extra='', id='') {
    return `<button type="button" data-action="${action}" data-arg="${esc(arg)}" ${id ? `id="${esc(id)}"` : ''} ${extra}>${label}</button>`;
  }
  function activeGroup() {
    if (route.name === 'details' || route.name === 'player') return item(route.id)?.type === 'series' ? 'series' : item(route.id)?.id.startsWith('ch') ? 'live' : 'movies';
    return route.name;
  }
  function shell() {
    document.documentElement.lang = locale;
    $('sidebar').innerHTML = `<div class="brand"><img src="/assets/branding/lori-tv-icon-512.png" alt=""><span>LORI<span>TV</span><small>WATCH YOUR WAY</small></span></div><nav class="nav">${navNames.map(name => button(`<span class="icon" aria-hidden="true">${F.icons[name]}</span>${t(name)}`, 'nav', name, `class="${activeGroup() === name ? 'active' : ''}" ${activeGroup() === name ? 'aria-current="page"' : ''}`, 'nav-'+name)).join('')}</nav><div class="sidebar-bottom"><strong>Samsung Tizen · Design concept</strong><br>Phase 01.5 · Browser preview</div>`;
    $('header').innerHTML = `<div class="header-start">${button('☰ '+label('Menu','Menu'),'menu','','aria-controls="sidebar" aria-expanded="'+navOpen+'"','header-menu')}<span class="header-label">${t('demo')} <span class="status">·</span> ${t('previewOnly')}</span></div><div class="header-actions">${button('⌕ '+t('search'),'nav','search','','header-search')}${button(locale.toUpperCase(),'language','','','header-language')}${button(`<span class="avatar-mini">${profile[0]}</span>${profile}`,'nav','profiles','','header-profile')}<span class="clock">20:45</span></div>`;
    $('disclaimer').textContent = t('preview');
    $('help').innerHTML = `<span class="help-caption">H · ${t('close')}</span><h3>${t('help')}</h3><p>${t('helpCopy')}</p><p>${t('helpSearch')}</p><p>${t('helpStates')}</p>`;
  }
  function focus(id, fallback=true) {
    let target = id && document.getElementById(id);
    if (!target && fallback) target = $('content').querySelector('button:not(:disabled),input') || $('sidebar').querySelector('button');
    if (target) { target.focus({preventScroll:true}); target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'}); }
  }
  function snapshot() {
    return {route:{...route}, focus:document.activeElement?.id, scroll:$('content').scrollTop,
      rails:Array.from(document.querySelectorAll('.rail')).map(x => [x.id,x.scrollLeft])};
  }
  function presentation() {
    const canvas=$('canvas'), isPlayer=route.name==='player';
    canvas.classList.toggle('full-view',viewMode==='full');
    canvas.classList.toggle('nav-open',navOpen);
    canvas.classList.toggle('player-view',isPlayer);
    canvas.classList.toggle('immersive',isPlayer&&immersive);
    $('sidebar').hidden=isPlayer || (viewMode==='full'&&!navOpen);
    $('nav-shade').hidden=!navOpen;
    $('header').inert=!!modal||navOpen;
    $('content').inert=!!modal||navOpen;
    $('sidebar').inert=!!modal;
    $('header-menu')?.setAttribute('aria-expanded',String(navOpen));
    if($('setting-view'))$('setting-view').textContent=label('View Mode: ','Pamja: ')+(viewMode==='full'?label('Full View','Pamje e plotë'):label('Standard View','Pamje standarde'))+' ›';
  }
  function menu(open) {
    if(open){navReturn=snapshot();navOpen=true;presentation();focus('nav-'+activeGroup());}
    else {navOpen=false;presentation();if(navReturn){focus(navReturn.focus);$('content').scrollTop=navReturn.scroll;for(const [id,left] of navReturn.rails)if($(id))$(id).scrollLeft=left;}navReturn=null;}
  }
  function toggleView() {
    const saved=snapshot();viewMode=viewMode==='full'?'standard':'full';
    try{localStorage.setItem('lori-preview-view-mode',JSON.stringify(viewMode));}catch{/* Session-only preference. */}
    presentation();focus($(saved.focus)?.closest('[hidden]')?'header-menu':saved.focus);
    $('content').scrollTop=saved.scroll;for(const [id,left] of saved.rails)if($(id))$(id).scrollLeft=left;
  }
  function go(name, extras={}) {
    if (modal) closeModal();
    if (route.name === 'player') stopSimulation();
    history.push(snapshot());
    route = {name, filter:'all', query:'', scope:'all', state:'normal', channel:'ch1', season:1,...extras};
    render(); $('content').scrollTop = 0; focus(initialFocus());
  }
  function initialFocus() {
    return ({home:'hero-explore',live:'catalog-search',guide:'epg-ch1-1',sports:'sport-upcoming',movies:'catalog-search',series:'catalog-search',search:'catalog-search',favorites:'card-'+membership('favorite')[0],watchlist:'card-'+membership('watch')[0],profiles:'profile-'+profile,settings:'setting-language',details:'details-play',player:'player-toggle'})[route.name];
  }
  function back() {
    if(Date.now()<backLockUntil)return;
    backLockUntil=Date.now()+450;
    if (modal) { closeModal(); return; }
    if (navOpen) { menu(false); return; }
    if (!$('help').hidden) { $('help').hidden = true; return; }
    if (searchEditing) { searchEditing = false; $('catalog-search')?.setAttribute('readonly',''); focus('catalog-search'); return; }
    if (route.name === 'player'&&immersive&&controlsVisible) { hideControls(); return; }
    if (route.name === 'player') stopSimulation();
    const last = history.pop();
    if (!last) { openModal('exit'); return; }
    route = last.route; render(); $('content').scrollTop = last.scroll;
    for (const [id,scroll] of last.rails) if ($(id)) $(id).scrollLeft = scroll;
    focus(last.focus);
    $('content').scrollTop=last.scroll;
    for (const [id,scroll] of last.rails) if ($(id)) $(id).scrollLeft=scroll;
  }
  function card(x, context='') {
    const saved = membership('favorite').includes(x.id);
    return button(`<span class="art-star" aria-hidden="true">✦</span>${saved ? '<span class="star-tag" aria-hidden="true">★</span>' : ''}<span class="poster-copy"><strong>${esc(x.title)}</strong><span class="genre">${esc(x.genre)} · ${t('previewOnly')}</span></span>${context.includes('continue') ? '<span class="progress"></span>' : ''}`, 'details', x.id, `class="card ${x.color}" aria-label="${esc(x.title)} — ${t('details')}"`, 'card-'+(context?context+'-':'')+x.id);
  }
  function rail(title, items, id, target, context='') {
    if (!items.length) return '';
    return `<section><div class="section-head"><h2>${title}</h2>${target ? button(t('viewAll')+' ›','nav',target) : ''}</div><div class="rail" id="rail-${id}">${items.map(x=>card(x,id+(context?'-'+context:''))).join('')}</div></section>`;
  }
  function intro(title, sub='') { return `<div class="intro"><h1>${title}</h1><span class="badge">${t('previewOnly')}</span></div>${sub ? `<p class="muted">${sub}</p>` : ''}`; }
  function searchBox(placeholder) {
    return `<label class="search-box"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="${esc(route.query)}" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}" readonly autocomplete="off"><small>Enter · ${t('search')}</small></label>`;
  }
  function chips(values, selected, action, prefix='filter') { return `<div class="filter-row">${values.map(([value,label])=>button(label,action,value,`class="${selected === value ? 'selected' : ''}" aria-pressed="${selected === value}"`,prefix+'-'+value)).join('')}</div>`; }
  function home() {
    return `<section class="hero"><div class="hero-art" aria-hidden="true"><div class="diamond"></div></div><span class="eyebrow">${t('featured')}</span><h1>${t('hero1')}<br>${t('hero2')}</h1><p>${t('heroCopy')}</p><div class="actions">${button('▶ '+t('explore'),'nav','movies','class="primary"','hero-explore')}${button('ⓘ '+t('more'),'details','north','class="secondary"','hero-more')}</div></section>`+
      rail(t('continue'),[F.items[0],F.items[6],F.items[1],F.items[3]],'continue','movies','continue')+
      rail(t('recommended'),F.items.slice(0,6),'recommended','movies')+
      rail(t('favorites'),membership('favorite').map(item).filter(Boolean),'favorites','favorites');
  }
  function statePanel(kind, emptyCollection=false) {
    if (kind === 'loading') return `<div class="section-head"><h2>${t('loading')}</h2>${button(t('cancel'),'state-reset','','class="small"','state-cancel')}</div><div class="skeleton-grid" aria-label="${t('loading')}">${'<div class="skeleton"></div>'.repeat(6)}</div><p class="mock-caption">${t('previewOnly')} · ${t('loadState')}</p>`;
    const error = kind === 'error';
    return `<div class="state-panel"><span class="state-icon" aria-hidden="true">${error ? '⚠' : '♡'}</span><h2>${t(error ? 'error' : emptyCollection ? 'empty' : 'noResults')}</h2><p>${t(error ? 'errorCopy' : emptyCollection ? 'emptyCopy' : 'noResultsCopy')}</p>${button(t(error ? 'retry' : emptyCollection ? 'browse' : 'clear'),error ? 'state-reset' : emptyCollection ? 'browse' : 'clear','','class="primary"','empty-action')}</div>`;
  }
  function collection() {
    const mode = route.name;
    let list = mode === 'favorites' ? membership('favorite').map(item).filter(Boolean) : mode === 'watchlist' ? membership('watch').map(item).filter(Boolean) : F.items.filter(x=> x.type === (mode === 'series' ? 'series' : 'movie'));
    if (route.filter !== 'all') list = list.filter(x => x.genre === route.filter);
    if (route.query) list = list.filter(x=>x.title.toLowerCase().includes(route.query.toLowerCase()));
    let html = intro(t(mode));
    if (mode === 'movies' || mode === 'series') html += searchBox(t(mode === 'movies' ? 'searchMovies' : 'searchSeries'));
    html += chips([['all',t('all')],['Adventure','Adventure'],['Drama','Drama'],['Sci-Fi','Sci-Fi'],['Documentary','Documentary']],route.filter,'filter');
    if (route.state === 'offline') html += `<div class="offline-banner">${t('offline')}</div>`;
    if (route.state === 'loading' || route.state === 'error' || route.state === 'empty') return html + statePanel(route.state, true);
    return html + `<div id="results-area">${list.length ? `<div class="grid">${list.map(x=>card(x)).join('')}</div>` : statePanel('empty',mode === 'favorites' || mode === 'watchlist')}</div>`;
  }
  function live() {
    const selected = item(route.channel) || F.channels[0];
    const channels = F.channels.filter(x=>(route.filter === 'all' || x.genre === route.filter) && x.title.toLowerCase().includes(route.query.toLowerCase()));
    return intro(t('live'),t('noSchedule'))+searchBox(t('searchChannels'))+
      chips([['all',t('all')],['Documentary','Documentary'],['Culture','Culture'],['Sports',t('sports')],['News','News']],route.filter,'filter')+
      `<div class="live-layout"><div class="channel-list" id="live-list">${channels.length ? channels.map((x,i)=>button(`<span class="number">${String(i+1).padStart(2,'0')}</span><span class="channel-icon">▣</span><span>${esc(x.title)}</span><span class="programme">${esc(x.show)}</span>`,'channel',x.id,`class="channel ${selected.id === x.id ? 'selected' : ''}"`,'channel-'+x.id)).join('') : statePanel('empty')}</div><section class="live-preview"><div class="landscape-art ${selected.color}"><span class="symbol">${route.preview ? '▶' : '◉'}</span><span class="badge">${t('previewOnly')}</span></div><h2>${esc(selected.title)}</h2><p>${esc(selected.show)} · ${route.preview ? t('previewSelected') : t('noSource')}</p><div class="actions">${button('▶ '+t('watch'),'player',selected.id,'class="primary"','live-watch')}${button((membership('favorite').includes(selected.id)?'★ ':'☆ ')+t('favorite'),'favorite',selected.id,'','live-favorite')}</div></section></div>`;
  }
  function guide() {
    return intro(t('guide'),t('noSchedule'))+`<div class="filter-row">${button('‹','notice',t('previewOnly'),'class="small"')}${button(t('today'),'notice',t('noSchedule'),'class="small selected"')}${button('›','notice',t('previewOnly'),'class="small"')}</div><div class="epg"><div class="time-cell">${t('live')}</div><div class="time-cell">18:00</div><div class="time-cell">18:30 · ${t('now')}</div><div class="time-cell">19:00</div>${F.channels.map(x=>`<div class="channel-cell">${x.title}</div>${['News',x.show,'Evening Stories'].map((show,i)=>button(`${show}<br><small>${i === 1 ? '18:30 – 19:00' : i === 0 ? '18:00 – 18:30' : '19:00 – 19:30'}</small>`,'programme',x.id,`class="${i===1?'current':''}"`,'epg-'+x.id+'-'+i)).join('')}`).join('')}</div>`;
  }
  function sports() {
    return intro(t('sports'))+chips([['upcoming',t('upcoming')],['live',t('live')],['results',t('results')]],route.filter==='all'?'upcoming':route.filter,'filter','sport')+`<div class="section-head"><h2>${t('events')}</h2><small>${t('previewOnly')}</small></div><div class="event-list">${Array.from({length:6},(_,i)=>`<div class="event-row"><span class="muted">${18+i}:30</span><span class="match">Team ${String.fromCharCode(65+i)} <span class="muted">vs</span> Team ${String.fromCharCode(70+i)}</span><small>${t('unavailable')}</small>${button(t('eventInfo'),'event',String(i),'class="small"','event-'+i)}</div>`).join('')}</div>`;
  }
  function searchResults() {
    const query = route.query.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    let list = [...F.items,...F.channels];
    if (route.scope !== 'all') list = list.filter(x=>route.scope==='channels' ? x.id.startsWith('ch') : route.scope==='movies' ? x.type==='movie' : route.scope==='series' ? x.type==='series' : x.genre==='Sports');
    list = list.filter(x=>x.title.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query));
    return `<div class="search-result-label"><h2>${route.query ? t('searchResults') : t('recommended')}</h2><small class="muted">${list.length} · ${t('demo')}</small></div>${list.length ? `<div class="grid">${list.map(x=>card(x)).join('')}</div>` : statePanel('empty')}`;
  }
  function search() { return intro(t('search'))+searchBox(t('searchPlaceholder'))+chips([['all',t('all')],['channels',t('live')],['movies',t('movies')],['series',t('series')],['sports',t('sports')]],route.scope,'scope','scope')+`<div id="results-area">${searchResults()}</div>`; }
  function details() {
    const x = item(route.id) || F.items[0];
    if (x.id.startsWith('ch')) return intro(x.title)+`<div class="hero"><h2>${x.show}</h2><p>${t('noSource')}</p><div class="actions">${button('▶ '+t('play'),'player',x.id,'class="primary"','details-play')}${button(t(membership('favorite').includes(x.id)?'removeFavorite':'addFavorite'),'favorite',x.id,'','details-favorite')}</div></div>`;
    return `<div class="details-hero"><div class="details-poster ${x.color}"><strong>${x.title}</strong></div><div class="details-copy"><span class="eyebrow">${t(x.type === 'series' ? 'series' : 'movies')} · ${t('demo')}</span><h1>${x.title}</h1><p>${x.year} · ${x.genre} · ${x.duration} · ${t('previewOnly')}</p><p>${x.blurb}</p><div class="actions">${button('▶ '+t('play'),'player',x.id,'class="primary"','details-play')}${button(t(membership('favorite').includes(x.id)?'removeFavorite':'addFavorite'),'favorite',x.id,'','details-favorite')}${button(t(membership('watch').includes(x.id)?'removeWatch':'addWatch'),'watch',x.id,'','details-watch')}</div><p class="mock-caption">${t('noSource')}</p></div></div>`+
      (x.type === 'series' ? `<div class="section-head"><h2>${t('episodes')}</h2>${button(t('season')+' '+route.season+' ▾','season','','class="small"','season-selector')}</div><div class="episode-list">${[1,2,3,4].map(n=>`<div class="episode-row"><span class="ep-index">EP ${String(n).padStart(2,'0')}</span><strong>${t('episode')} ${n} — Sample title</strong><small>42 min</small>${button('▶ '+t('play'),'episode',String(n),'class="small"','episode-'+n)}</div>`).join('')}</div>` : rail(t('similar'),F.items.filter(y=>y.id!==x.id).slice(0,6),'similar','movies'));
  }
  function player() {
    const x = item(route.id) || F.items[0];
    const live=x.id.startsWith('ch');
    return `<div class="player-stage"><div class="simulated-picture"><div class="orb"></div><span class="badge">${t('simulated')}</span><div class="diamond" aria-hidden="true"></div><h1>${x.title}${route.episode ? ' · '+t('episode')+' '+route.episode : ''}</h1><p>${live?esc(x.show):t('previewOnly')}</p></div></div><div class="player-bottom" id="player-controls" ${immersive&&!controlsVisible?'hidden':''}><h2>${esc(x.title)}</h2><p id="player-state"></p>${live?`<p>${esc(x.show)} · ${label('Live fixture','Shembull Live')}</p>`:`<div class="timeline"><span id="elapsed">${timeLabel(position)}</span><div class="timeline-track"><i id="progress-fill"></i></div><span>12:00</span></div>`}<div class="actions">${live?'':button('−10 s','seek','-10','','player-seek-back')}${button(t(playing?'pause':'play'),'toggle-play','','class="primary"','player-toggle')}${live?'':button('+10 s','seek','10','','player-seek-forward')+button(t('tracks'),'tracks','','','player-tracks')}${button(immersive?label('Exit Fullscreen','Dil nga fullscreen'):label('Fullscreen','Fullscreen'),'video-mode','','','player-fullscreen')}${button(t('stop'),'stop','','','player-stop')}</div></div>`;
  }
  function profiles() { return `<h1 class="profile-title">${t('who')}</h1><div class="profiles">${['Lori','Kids','Guest'].map(name=>button(`<span class="profile-avatar">${name[0]}</span><span>${name}</span><small>${name===profile?'✓ '+t('selected'):t('previewOnly')}</small>`,'profile',name,'class="profile-card"','profile-'+name)).join('')}${button(`<span class="profile-avatar">+</span><span>${t('addProfile')}</span><small>${t('previewOnly')}</small>`,'add-profile','','class="profile-card"','profile-add')}</div>`; }
  function settings() {
    return intro(t('settings'))+`<div class="settings-columns"><section class="settings-panel"><h2>${t('general')}</h2>${button(`<span>${t('language')}</span><strong>${t(locale==='en'?'english':'albanian')} ›</strong>`,'language','','class="setting"','setting-language')}${button('View Mode','view-mode','','class="setting"','setting-view')}<div class="setting readonly">${t('startup')}<strong>${t('home')}</strong></div><div class="setting readonly">${t('theme')}<strong>${t('dark')}</strong></div></section><section class="settings-panel"><h2>${t('playback')}</h2>${button(`<span>${t('quality')}</span><strong>${t('auto')} ›</strong>`,'tracks','','class="setting"','setting-quality')}<p>${t('noTracks')}</p></section><section class="settings-panel"><h2>${t('connections')}</h2>${button(t('pair')+' ›','pair','','class="setting"','setting-pair')}<p>${t('connectionNote')}</p></section></div><section class="settings-panel settings-state"><h3>${t('diagnostics')}</h3><p>${t('previewOnly')} · ${t('movies')}</p><div class="state-controls">${[['normal','normal'],['loading','loadState'],['empty','emptyState'],['error','errorState'],['offline','offlineState']].map(([value,key])=>button(t(key),'demo-state',value,'','state-'+value)).join('')}</div></section>`;
  }
  function render() {
    searchEditing = false;
    shell();
    const renderers = {home,live,guide,sports,search,details,player,profiles,settings,movies:collection,series:collection,favorites:collection,watchlist:collection};
    $('content').innerHTML = (renderers[route.name] || home)();
    presentation();
    window.history.replaceState(null,'','#'+route.name);
    updatePlayer();
  }
  function redraw(anchor) { const scroll=$('content').scrollTop; render(); $('content').scrollTop=scroll; focus(anchor); }
  function toggleMembership(kind,id) {
    const list = membership(kind), index=list.indexOf(id), removing=index>=0;
    if (removing) list.splice(index,1); else list.push(id);
    const anchor=document.activeElement.id, oldIndex=Array.from($('content').querySelectorAll('.card')).indexOf(document.activeElement);
    persist();
    redraw(anchor);
    if (!document.getElementById(anchor) && (route.name==='favorites' || route.name==='watchlist')) {
      const cards=Array.from($('content').querySelectorAll('.card')); focus(cards[Math.min(Math.max(oldIndex,0),cards.length-1)]?.id);
    }
    toast(t(kind==='favorite' ? removing?'favoriteRemoved':'favoriteAdded' : removing?'watchRemoved':'watchAdded'));
  }
  function toast(text) { clearTimeout(toastTimer); $('toast').textContent=text; $('toast').hidden=false; toastTimer=setTimeout(()=>$('toast').hidden=true,2500); }
  function openModal(kind,extra={}) {
    clearTimeout(controlsTimer);
    const returnFocus=document.activeElement.id;
    modal={kind,returnFocus,...extra};
    let title='',copy='',body='',actions=button(t('cancel'),'modal-close','','','modal-cancel');
    if(kind==='language'){title=t('chooseLanguage');body=`<div class="option-list">${button(t('english'),'locale','en','','locale-en')}${button(t('albanian'),'locale','sq','','locale-sq')}</div>`;}
    if(kind==='exit'){title=t('exitTitle');copy=t('exitCopy');actions+=button(t('confirm'),'reset-home','','class="primary"','modal-confirm');}
    if(kind==='tracks'){title=t('tracks');copy=t('noTracks');body=`<div class="divider"></div><p>${t('quality')}: ${t('auto')}<br>${t('volume')}: —</p>`;}
    if(kind==='season'){title=t('season');body=`<div class="option-list">${[1,2].map(n=>button(t('season')+' '+n,'choose-season',String(n),'','season-'+n)).join('')}</div>`;}
    if(kind==='pair'){title=t('pair');copy=t('connectionNote');}
    if(kind==='add-profile'){title=t('addProfile');copy=locale==='sq'?'Redaktimi i profileve është vetëm shembull. Përdor profilet Lori, Kids ose Guest.':'Profile editing is a placeholder. Use the Lori, Kids or Guest fixture profiles; no parental security is implemented.';}
    if(kind==='programme'){const x=item(extra.id);title=t('programme');copy=x.title+' · '+x.show;actions+=button('▶ '+t('watch'),'modal-player',x.id,'class="primary"','modal-watch');}
    if(kind==='event'){title=t('eventInfo');copy=t('unavailable')+'. '+t('previewOnly');}
    $('modal-layer').innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">${esc(title)}</h2>${copy?`<p>${esc(copy)}</p>`:''}${body}<div class="actions">${actions}</div></section>`;
    $('modal-layer').hidden=false;
    $('sidebar').inert=true; $('header').inert=true; $('content').inert=true;
    focus('modal-cancel',false);
  }
  function closeModal() {
    const anchor=modal?.returnFocus;modal=null;$('modal-layer').hidden=true;$('modal-layer').innerHTML='';
    presentation();
    focus(anchor);
    armControls();
  }
  function startSimulation(id,episode) { playing=true;immersive=true;controlsVisible=false;position=id.startsWith('ch')?0:progress[id]||0;$('help').hidden=true;$('toast').hidden=true;clearTimeout(toastTimer);go('player',{id,episode});$('content').focus({preventScroll:true}); }
  function stopSimulation() { clearTimeout(controlsTimer);playing=false;if(route.name==='player' && !route.id.startsWith('ch'))progress[route.id]=position;immersive=false;controlsVisible=true; }
  function armControls() {
    clearTimeout(controlsTimer);
    if(route.name==='player'&&immersive&&controlsVisible&&playing&&!modal)controlsTimer=setTimeout(hideControls,4000);
  }
  function hideControls() { clearTimeout(controlsTimer);controlsVisible=false;if($('player-controls'))$('player-controls').hidden=true;$('content').focus({preventScroll:true}); }
  function showControls() { controlsVisible=true;$('player-controls').hidden=false;if(!modal)focus('player-toggle');armControls(); }
  function videoMode() { immersive=!immersive;controlsVisible=!immersive||!playing;render();if(immersive&&!controlsVisible)$('content').focus({preventScroll:true});else focus(immersive?'player-toggle':'player-fullscreen');armControls(); }
  function timeLabel(seconds) { return Math.floor(seconds/60).toString().padStart(2,'0')+':'+Math.floor(seconds%60).toString().padStart(2,'0'); }
  function updatePlayer() { if(route.name!=='player')return; if($('elapsed'))$('elapsed').textContent=timeLabel(position);if($('progress-fill'))$('progress-fill').style.width=(position/720*100)+'%';if($('player-state'))$('player-state').textContent=(playing?label('Playing','Duke luajtur'):label('Paused','Në pauzë'))+' · '+t('previewOnly'); }
  function activate(action,arg) {
    switch(action){
      case 'nav': if(navOpen)menu(false);go(arg);break;
      case 'menu': menu(!navOpen);break;
      case 'view-mode':toggleView();break;
      case 'video-mode':videoMode();break;
      case 'details': go('details',{id:arg});break;
      case 'channel': route.channel=arg;route.preview=true;redraw('channel-'+arg);break;
      case 'player': startSimulation(arg);break;
      case 'episode': startSimulation(route.id,Number(arg));break;
      case 'favorite':toggleMembership('favorite',arg);break;
      case 'watch':toggleMembership('watch',arg);break;
      case 'filter':route.filter=arg;redraw((route.name==='sports'?'sport-':'filter-')+arg);break;
      case 'scope':route.scope=arg;redraw('scope-'+arg);break;
      case 'clear':route.query='';redraw('catalog-search');break;
      case 'browse':go('movies');break;
      case 'language':openModal('language');break;
      case 'locale':{const anchor=modal.returnFocus;closeModal();locale=arg;persist();redraw(anchor);break;}
      case 'profile':profile=arg;redraw('profile-'+arg);toast(t('profileSwitched')+' · '+arg);break;
      case 'add-profile':openModal('add-profile');break;
      case 'tracks':openModal('tracks');break;
      case 'pair':openModal('pair');break;
      case 'season':openModal('season');break;
      case 'choose-season':closeModal();route.season=Number(arg);redraw('season-selector');break;
      case 'programme':openModal('programme',{id:arg});break;
      case 'event':openModal('event');break;
      case 'modal-close':closeModal();break;
      case 'modal-player':closeModal();startSimulation(arg);break;
      case 'reset-home':closeModal();history.length=0;route={name:'home',filter:'all',query:'',state:'normal'};render();focus(initialFocus());break;
      case 'demo-state':go('movies',{state:arg});break;
      case 'state-reset':route.state='normal';redraw('catalog-search');break;
      case 'toggle-play':playing=!playing;$('player-toggle').textContent=t(playing?'pause':'play');updatePlayer();armControls();break;
      case 'seek':position=Math.max(0,Math.min(720,position+Number(arg)));updatePlayer();break;
      case 'stop':controlsVisible=false;backLockUntil=0;back();break;
      case 'notice':toast(arg);break;
    }
  }
  document.addEventListener('click',event=>{const control=event.target.closest('[data-action]');if(control)activate(control.dataset.action,control.dataset.arg);});
  document.addEventListener('input',event=>{
    if(event.target.id!=='catalog-search')return;route.query=event.target.value;
    if(route.name==='search')$('results-area').innerHTML=searchResults();
    else if(route.name==='movies'||route.name==='series'){
      let list=F.items.filter(x=>x.type===(route.name==='movies'?'movie':'series') && (route.filter==='all'||x.genre===route.filter) && x.title.toLowerCase().includes(route.query.toLowerCase()));
      $('results-area').innerHTML=list.length?`<div class="grid">${list.map(x=>card(x)).join('')}</div>`:statePanel('empty');
    }else if(route.name==='live'){
      const input=$('catalog-search'),start=input.selectionStart;const query=route.query;const html=live();const temp=document.createElement('div');temp.innerHTML=html;$('live-list').innerHTML=temp.querySelector('#live-list').innerHTML;route.query=query;if(start!==null)input.setSelectionRange?.(start,start);
    }
  });
  function focusables(root) { return Array.from(root.querySelectorAll('button:not(:disabled),input')).filter(x=>!x.closest('[hidden],[inert]') && x.getBoundingClientRect().width>0); }
  function move(key) {
    const root=modal?$('modal-layer'):navOpen?$('sidebar'):route.name==='player'&&immersive?$('player-controls'):$('canvas');
    const current=document.activeElement;
    if(!current||!root.contains(current)){focus(initialFocus());return;}
    const nav=current.closest('.nav');
    if(nav && (key==='ArrowUp'||key==='ArrowDown')){const list=focusables(nav),index=list.indexOf(current);list[Math.max(0,Math.min(list.length-1,index+(key==='ArrowDown'?1:-1)))].focus();return;}
    if(nav && key==='ArrowLeft')return;
    if(nav && key==='ArrowRight'){if(navOpen)menu(false);else focus(initialFocus());return;}
    const a=current.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;
    let best=null,score=Infinity;
    for(const candidate of focusables(root)){
      if(candidate===current || candidate.closest('#help'))continue;
      if(!modal && !nav && candidate.closest('.nav') && key!=='ArrowLeft')continue;
      const b=candidate.getBoundingClientRect(),dx=b.left+b.width/2-ax,dy=b.top+b.height/2-ay;
      const vertical=key==='ArrowUp'||key==='ArrowDown';const forward=vertical?(key==='ArrowDown'?dy:-dy):(key==='ArrowRight'?dx:-dx);
      if(forward<=2)continue;
      const cross=vertical?Math.abs(dx):Math.abs(dy);
      const overlap=vertical ? Math.max(a.left,b.left)<Math.min(a.right,b.right) : Math.max(a.top,b.top)<Math.min(a.bottom,b.bottom);
      const value=forward+cross*3+(overlap?0:500*Number(getComputedStyle(document.documentElement).getPropertyValue('--scale')));
      if(value<score){best=candidate;score=value;}
    }
    if(best){best.focus({preventScroll:true});best.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}
  }
  document.addEventListener('keydown',event=>{
    const editing=event.target.id==='catalog-search' && searchEditing;
    const textInput=event.target.matches('input,textarea,[contenteditable="true"]');
    if(event.key.toLowerCase()==='f'&&!textInput&&!modal&&!navOpen){event.preventDefault();if(!event.repeat)toggleView();return;}
    if(route.name==='player'&&immersive&&!modal){
      if(event.key==='Enter'&&!controlsVisible){event.preventDefault();if(!event.repeat)showControls();return;}
      if(!controlsVisible&&(event.key.startsWith('Arrow')||event.key==='Tab')){event.preventDefault();return;}
      if(event.key.toLowerCase()==='h'){event.preventDefault();return;}
      armControls();
    }
    if(event.key.toLowerCase()==='h'&&!editing){event.preventDefault();$('help').hidden=!$('help').hidden;return;}
    if(event.key==='Escape'||event.key==='Backspace'&&!editing){event.preventDefault();if(!event.repeat)back();return;}
    if(editing){if(event.key==='Enter'){event.preventDefault();searchEditing=false;event.target.readOnly=true;event.target.blur();focus('catalog-search');}return;}
    if(event.key==='Enter'&&event.target.id==='catalog-search'){event.preventDefault();searchEditing=true;event.target.readOnly=false;event.target.focus();return;}
    if(event.key==='Enter'&&event.repeat){event.preventDefault();return;}
    if(event.key.startsWith('Arrow')){event.preventDefault();move(event.key);}
    if(event.key==='Tab'&&(modal||navOpen||route.name==='player'&&immersive)){event.preventDefault();const root=modal?$('modal-layer'):navOpen?$('sidebar'):$('player-controls');const list=focusables(root),i=list.indexOf(document.activeElement);if(list.length)list[(i+(event.shiftKey?-1:1)+list.length)%list.length].focus();}
  });
  document.addEventListener('pointerdown',()=>{if(route.name==='player')armControls();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;clearTimeout(controlsTimer);if(route.name==='player'&&immersive)showControls();if($('player-toggle'))$('player-toggle').textContent=t('play');updatePlayer();}});
  function resize(){document.documentElement.style.setProperty('--scale',Math.min(window.innerWidth/1600,window.innerHeight/900));}
  window.addEventListener('resize',resize);resize();render();focus(initialFocus());
  setInterval(()=>{if(route.name==='player'&&playing&&!document.hidden){position=Math.min(720,position+0.5);if(position===720){playing=false;$('player-toggle').textContent=t('play');if(immersive)showControls();}updatePlayer();}},500);
}());
