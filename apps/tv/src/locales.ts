const en = {
  appTitle: 'LORI TV', home: 'Home', live: 'Live TV', guide: 'TV Guide', sports: 'Sports',
  movies: 'Movies', series: 'Series', search: 'Search', favorites: 'Favorites',
  watchlist: 'Watchlist', profiles: 'Profiles', settings: 'Settings', menu: 'Menu', closeMenu: 'Close menu',
  navigation: 'Main navigation', later: 'Available in a later milestone', headline: 'Discover more. Watch your way.',
  empty: 'Your library will appear here.', emptyCopy: 'Channels, movies and series will be added in a later milestone. Nothing plays automatically.',
  settingsTitle: 'Display & language', settingsCopy: 'Make LORI TV feel at home.',
  viewMode: 'View mode', viewCopy: 'Choose an open canvas or keep navigation in view.',
  full: 'Full View', standard: 'Standard View', language: 'Language', languageCopy: 'Change the interface language.', english: 'English', albanian: 'Shqip',
  openSettings: 'Display settings', frameOnly: 'Interface frame · No catalog or playback',
  pcHelp: 'PC preview: Tab / arrows · Enter · Esc closes Menu · F changes view',
  storageError: 'Preferences could not be saved. Changes apply for this session.', ready: 'Local production boot ready.',
  cancel: 'Cancel', exitTitle: 'Close LORI TV?', exitCopy: 'Choose Cancel to keep using LORI TV.', exitApp: 'Exit application', exitUnavailable: 'Application exit is unavailable. Cancel to continue.',
} as const;
export type Locale = 'en' | 'sq';
export type MessageKey = keyof typeof en;
const sq: Record<MessageKey, string> = {
  appTitle: 'LORI TV', home: 'Kryefaqja', live: 'TV drejtpërdrejt', guide: 'Guida TV', sports: 'Sporte', movies: 'Filma', series: 'Seriale', search: 'Kërko', favorites: 'Të preferuarat',
  watchlist: 'Lista për shikim', profiles: 'Profilet', settings: 'Cilësimet', menu: 'Menuja', closeMenu: 'Mbyll menunë',
  navigation: 'Navigimi kryesor', later: 'Ofrohet në një etapë të mëvonshme', headline: 'Zbulo më shumë. Shiko si të duash.',
  empty: 'Biblioteka jote do të shfaqet këtu.', emptyCopy: 'Kanalet, filmat dhe serialet do të shtohen në një etapë të mëvonshme. Asgjë nuk luhet automatikisht.',
  settingsTitle: 'Pamja dhe gjuha', settingsCopy: 'Përshtate LORI TV sipas dëshirës.',
  viewMode: 'Mënyra e pamjes', viewCopy: 'Zgjidh hapësirë të plotë ose mbaje navigimin të dukshëm.',
  full: 'Pamje e plotë', standard: 'Pamje standarde', language: 'Gjuha', languageCopy: 'Ndrysho gjuhën e ndërfaqes.', english: 'English', albanian: 'Shqip',
  openSettings: 'Cilësimet e pamjes', frameOnly: 'Korniza e ndërfaqes · Pa katalog apo riprodhim',
  pcHelp: 'Provë në PC: Tab / shigjetat · Enter · Esc mbyll menunë · F ndryshon pamjen',
  storageError: 'Cilësimet nuk u ruajtën. Ndryshimet vlejnë vetëm për këtë sesion.', ready: 'Aplikacioni lokal është gati.',
  cancel: 'Anulo', exitTitle: 'Ta mbyll LORI TV?', exitCopy: 'Anulo për të vazhduar përdorimin e ndërfaqes.', exitApp: 'Mbyll aplikacionin', exitUnavailable: 'Mbyllja e aplikacionit nuk është e disponueshme. Anulo për të vazhduar.',
};
export const resources: Record<Locale, Readonly<Record<MessageKey, string>>> = { en, sq };
export function translate(locale: Locale, key: string): string {
  if (!Object.hasOwn(en, key)) return `[${key}]`;
  const known = key as MessageKey;
  return resources[locale][known] || en[known];
}
