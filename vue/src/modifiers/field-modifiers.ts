import type { InputNode } from '@/types';
import { makeDefaultConverter, toCardGroup, type BaseConverter, type InterrimConverter } from './shared-modifiers';
import { getSideEffectFor } from './side-effects';

const defaultConverter = makeDefaultConverter<InputNode>()
type FieldConverter = InterrimConverter<BaseConverter<InputNode, InputNode>>

const toFieldWithSideEffects: FieldConverter = (converter = defaultConverter) => (node, store) => converter({
    ...node,
    renderer: 'async-field',
    sideEffect: getSideEffectFor(node, store),
}, store)

const idModifierMap: Record<string, BaseConverter<InputNode, InputNode>> = {
    'auto.autos.n.vinNumber': toFieldWithSideEffects(),
    'auto.autos.n.year': toFieldWithSideEffects(),
    'auto.autos.n.make': toFieldWithSideEffects(),
    'auto.autos.n.model': toFieldWithSideEffects(),
    'home.propertyType.House': toCardGroup(),
    'home.propertyType.TownHome': toCardGroup(),
    'home.propertyType.MobileHome': toCardGroup(),
    'home.propertyType.Condo': toCardGroup(),
    ...[
        'hasBurglarAlarmSystem',
        'hasSprinklerSystem',
        'hasFireExtinguisher',
        'hasFireAlarmSystem',
        'hasSmokeDetector',
        'hasCoDetector'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.protectionSystems.${next}`]: toCardGroup()
    }), {}),
    ...[
        'deadbolts',
        'doorman',
        'smokerFree',
        'stormShutters',
        'hailResistantRoof',
    ].reduce((acc, next) => ({
        ...acc,
        [`home.discounts.${next}`]: toCardGroup()
    }), {}),
    'home.risks.none': toCardGroup(),
    'home.deck.hasDeck': toCardGroup(),
    'home.screenedEnclosure.hasScreenEnclosure': toCardGroup(),
    ...[
        'ranch',
        'splitLevel',
        'colonial',
        'capeCod',
        'duplex',
        'contemporary',
        'mediterranean',
        'queenAnne',
        'southwestAdobe',
        'victorian',
        'farmhouse',
        'cottage',
        'craftsman',
        'tudor',
        'townHouseEnd',
        'townHouseCenter',
        'rowHouseEnd',
        'rowHouseCenter',
    ].reduce((acc, next) => ({
        ...acc,
        [`home.propertyStyle.${next}`]: toCardGroup()
    }), {}),
    ...[
        'flood', 'waterBackup', 'personalProperty', 'mold', 'jewelry', 'identityTheft', 'animalLiability'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.additionalCoverageRequests.${next}`]: toCardGroup()
    }), {}),
    ...[
        'none', 'heatPump', 'furnace', 'boiler', 'wood', 'geothermal', 'electricBaseboard'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.heating.primarySource.${next}`]: toCardGroup()
    }), {}),
    ...[
        'threeTabAsphaltShingles', 'architecturalAsphaltShingles', 'tarOrGravel', 'metal', 'concreteTile', 'clayTile', 'slate', 'foam', 'spanishTile', 'reinforcedConcrete', 'woodShingles', 'rubber', 'membrane'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.roof.roofMaterial.${next}`]: toCardGroup()
    }), {}),
    ...[
        'frame', 'n10to33BrickVeneer', 'n34to66BrickVeneer', 'n67to11BrickVeneer', 'brickStoneMasonry', 'frameAluminumSiding', 'frameVinylSiding', 'concreteBlock', 'stuccoWoodframe', 'stuccoBlock', 'steelFrame', 'logHome', 'prefabManufactured', 'prefabModular'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.constructionType.${next}`]: toCardGroup()
    }), {}),
    ...[
        'gable', 'hip', 'gambrel', 'mansard', 'shed', 'flat', 'complex'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.roof.roofShape.${next}`]: toCardGroup()
    }), {}),
    ...[
        'none', 'trampoline', 'swimmingPool.hasSwimmingPool', 'sumpPump'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.risks.${next}`]: toCardGroup()
    }), {}),
    ...[
        'premium', 'standard', 'basic'
    ].reduce((acc, next) => ({
        ...acc,
        [`home.plan.requestedPlanType.${next}`]: toCardGroup()
    }), {}),
    ...[
        'oil', 'electric', 'naturalGas', 'propane'
    ].reduce((acc, next) => ({
        ...acc,
        [`'home.heating.fuelType.${next}`]: toCardGroup()
    }), {}),
}

const idRgx = /\.(\d+)\./
export const modifyField = (node: InputNode, store: any) => {
    const standardId = node.id.replace(idRgx, '.n.')
    const converter = idModifierMap[standardId]
    return converter?.(node, store) || node
}

export default modifyField