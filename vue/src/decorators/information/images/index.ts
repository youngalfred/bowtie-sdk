const aluminum = 'information/ttl_aluminum.png';
const commercial = 'information/ttl_commercial.png';
const comparison = 'information/ttl_comparison.png';
const electrical_fuse_box = 'information/ttl_electrical_fuse_box.png';
const galvanized = 'information/ttl_galvanized.png';
const hiproff = 'information/ttl_hiproff.png';
const knob = 'information/ttl_knob.png';
const pex = 'information/ttl_pex.png';
const polybutylene_piping = 'information/ttl_polybutylene_piping.png';
const roof_flat = 'information/ttl_roof_flat.png';
const pool = 'information/ttl_pool.png';
const unrepaired_damages = 'information/ttl_unrepaired_damages.png';

export const keyToImageMap = {
    'home.risks.aluminumWiring': aluminum,
    'home.propertyUse.farmingActivity': commercial,
    'home.manufacturedHomeType': comparison,
    'home.risks.electricalFuseBox': electrical_fuse_box,
    'home.risks.galvanizedPiping': galvanized,
    'home.roof.roofShape-hip': hiproff,
    'home.risks.knobAndTubeOrClothWiring': knob,
    'home.risks.pexPipingPrior2010': pex,
    'home.risks.polybutylenePiping': polybutylene_piping,
    'flat-roof': roof_flat,
    'home.enclosedByFenceOver4ft': pool,
    'home.risks.unrepairedDamages': unrepaired_damages,
};

export default keyToImageMap;
