export const propertyType: Record<string, string> = {
    Condo: "src/assets/icons/condo.png",
    condo: "src/assets/icons/condo.png",
    CoOp: "src/assets/icons/condo.png",
    coop: "src/assets/icons/condo.png",
    home: "src/assets/icons/home.png",
    House: "src/assets/icons/home.png",
    house: "src/assets/icons/home.png",
    MobileHome: "src/assets/icons/mobile-home.png",
    "mobile-home": "src/assets/icons/mobile-home.png",
    TownHome: "src/assets/icons/townhome.png",
    townhome: "src/assets/icons/townhome.png",
};

export const valuables: Record<string, string> = {
    none: "src/assets/icons/nothing.png",
    art: "src/assets/icons/art.png",
    camera: "src/assets/icons/camera.png",
    coins: "src/assets/icons/coins.png",
    computer: "src/assets/icons/computer.png",
    firearms: "src/assets/icons/firearms.png",
    fur: "src/assets/icons/fur.png",
    golf: "src/assets/icons/golf.png",
    jewelry: "src/assets/icons/jewelry.png",
    music: "src/assets/icons/music.png",
    nothing: "src/assets/icons/nothing.png",
    postage: "src/assets/icons/postage.png",
    silverware: "src/assets/icons/silverware.png",
};

export const icons: Record<string, string> = {
    info: "src/assets/icons/ico_info.svg",
    ...propertyType,
    ...valuables,
};
