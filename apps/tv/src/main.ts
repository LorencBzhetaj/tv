// M1 boot only: no routes, input handlers, player, catalog or network access.
const bootStatus = document.getElementById('boot-status');
if (!bootStatus) {
  throw new Error('Required boot status element is missing.');
}
bootStatus.textContent = 'Local production boot ready.';
bootStatus.dataset.state = 'ready';
