export const propertyType: Record<string, string> = {
    Condo: 'icons/condo.png',
    condo: 'icons/condo.png',
    CoOp: 'icons/condo.png',
    coop: 'icons/condo.png',
    home: 'icons/home.png',
    House: 'icons/home.png',
    house: 'icons/home.png',
    MobileHome: 'icons/mobile-home.png',
    'mobile-home': 'icons/mobile-home.png',
    TownHome: 'icons/townhome.png',
    townhome: 'icons/townhome.png',
};

export const valuables: Record<string, string> = {
    none: 'icons/nothing.png',
    art: 'icons/art.png',
    camera: 'icons/camera.png',
    coins: 'icons/coins.png',
    computer: 'icons/computer.png',
    firearms: 'icons/firearms.png',
    fur: 'icons/fur.png',
    golf: 'icons/golf.png',
    jewelry: 'icons/jewelry.png',
    music: 'icons/music.png',
    nothing: 'icons/nothing.png',
    postage: 'icons/postage.png',
    silverware: 'icons/silverware.png',
};

export const icons: Record<string, string> = {
    info: 'icons/ico_info.svg',
    ...propertyType,
    ...valuables,
};
