// Temporary M2 PC-only DOM-order adapter. Replace in M3; no geometry or TV key registration.
export function installPCNavigation(root: HTMLElement, overlay: () => HTMLElement | null, close: () => void, toggleView: () => void): void {
  root.addEventListener('keydown', event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const editing = target.matches('input,select,textarea,[contenteditable="true"]');
    const dialog = overlay();
    if ((event.key === 'Escape' || (event.key === 'Backspace' && !editing)) && dialog) { event.preventDefault(); if (!event.repeat) close(); return; }
    if (event.key.toLowerCase() === 'f' && !editing && !dialog && !event.repeat) { event.preventDefault(); toggleView(); return; }
    if (editing || !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(event.key)) return;
    if (event.key === 'Tab' && !dialog) return;
    const items = Array.from((dialog ?? root).querySelectorAll<HTMLElement>('button:not(:disabled),select')).filter(item => !item.closest('[hidden],[inert]'));
    const index = items.indexOf(target);
    const delta = event.key === 'ArrowUp' || event.key === 'ArrowLeft' || (event.key === 'Tab' && event.shiftKey) ? -1 : 1;
    const next = event.key === 'Tab' ? (index + delta + items.length) % items.length : Math.max(0, Math.min(items.length - 1, index + delta));
    const item = items[next];
    if (item) { event.preventDefault(); item.focus({ preventScroll: true }); item.scrollIntoView({ block: 'nearest' }); }
  });
}
