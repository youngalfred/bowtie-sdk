export const propertyType: Record<string, string> = {
  Condo: 'assets/icons/condo.png',
  condo: 'assets/icons/condo.png',
  CoOp: 'assets/icons/condo.png',
  coop: 'assets/icons/condo.png',
  home: 'assets/icons/home.png',
  House: 'assets/icons/home.png',
  house: 'assets/icons/home.png',
  MobileHome: 'assets/icons/mobile-home.png',
  'mobile-home': 'assets/icons/mobile-home.png',
  TownHome: 'assets/icons/townhome.png',
  townhome: 'assets/icons/townhome.png',
}

export const valuables: Record<string, string> = {
  none: 'assets/icons/nothing.png',
  art: 'assets/icons/art.png',
  camera: 'assets/icons/camera.png',
  coins: 'assets/icons/coins.png',
  computer: 'assets/icons/computer.png',
  firearms: 'assets/icons/firearms.png',
  fur: 'assets/icons/fur.png',
  golf: 'assets/icons/golf.png',
  jewelry: 'assets/icons/jewelry.png',
  music: 'assets/icons/music.png',
  nothing: 'assets/icons/nothing.png',
  postage: 'assets/icons/postage.png',
  silverware: 'assets/icons/silverware.png',
}

export const icons: Record<string, string> = {
  info: 'assets/icons/ico_info.svg',
  ...propertyType,
  ...valuables,
}
