import { mountFrame } from './frame';
import type { PreferenceStorage } from './preferences';
const bootStatus = document.getElementById('boot-status');
if (!bootStatus) {
  throw new Error('Required boot status element is missing.');
}
const host = document.getElementById('app');
if (!host) throw new Error('Required application host is missing.');
let storage: PreferenceStorage | undefined;
try { storage = window.localStorage; } catch { /* Session-only preferences remain usable. */ }
mountFrame(host,storage);
bootStatus.dataset.state = 'ready';
