import type { InputNode } from '@/types';
import { assignModifierToFieldsByPrefixes, makeDefaultConverter, toCardGroup, type BaseConverter, type InterrimConverter } from './shared-modifiers';
import { getSideEffectFor } from './side-effects';

const defaultConverter = makeDefaultConverter<InputNode>()
type FieldConverter = InterrimConverter<BaseConverter<InputNode, InputNode>>

const toFieldWithSideEffects: FieldConverter = (converter = defaultConverter) => (node, store) => converter({
    ...node,
    renderer: 'async-field',
    sideEffect: getSideEffectFor(node, store),
}, store)

const toMultiSelect: FieldConverter = (converter = defaultConverter) => (node) => converter({
    ...node,
    renderer: 'multi-select',
})

const idModifierMap: Record<string, BaseConverter<InputNode, InputNode>> = {
    'home.pets.pet.otherDogBreed.n.mixedBreeds': toMultiSelect(),
    'auto.autos.n.vinNumber': toFieldWithSideEffects(),
    'auto.autos.n.year': toFieldWithSideEffects(),
    'auto.autos.n.make': toFieldWithSideEffects(),
    'auto.autos.n.model': toFieldWithSideEffects(),
    'home.propertyType.House': toCardGroup(),
    'home.propertyType.TownHome': toCardGroup(),
    'home.propertyType.MobileHome': toCardGroup(),
    'home.propertyType.Condo': toCardGroup(),
    ...assignModifierToFieldsByPrefixes(toCardGroup())(
        ['home.protectionSystems.', // the prefix
            [
                'hasBurglarAlarmSystem', // the fields that use the prefix
                'hasSprinklerSystem',
                'hasFireExtinguisher',
                'hasFireAlarmSystem',
                'hasSmokeDetector',
                'hasCoDetector'
            ]
        ],
        ['home.discounts.',
            [
                'deadbolts',
                'doorman',
                'smokerFree',
                'stormShutters',
                'hailResistantRoof',
            ]
        ],
        ['home.propertyStyle.',
            [
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
            ]
        ],
        [
            'home.additionalCoverageRequests.',
            [
                'flood', 'waterBackup', 'personalProperty', 'mold', 'jewelry', 'identityTheft', 'animalLiability'
            ]
        ],
        [
            'home.heating.primarySource.',
            [
                'none', 'heatPump', 'furnace', 'boiler', 'wood', 'geothermal', 'electricBaseboard'
            ]
        ],
        [
            'home.roof.roofMaterial.',
            [
                'threeTabAsphaltShingles',
                'architecturalAsphaltShingles',
                'tarOrGravel',
                'metal',
                'concreteTile',
                'clayTile',
                'slate',
                'foam',
                'spanishTile',
                'reinforcedConcrete',
                'woodShingles',
                'rubber',
                'membrane'
            ]
        ],
        [
            'home.constructionType.',
            [
                'frame',
                'n10to33BrickVeneer',
                'n34to66BrickVeneer',
                'n67to11BrickVeneer',
                'brickStoneMasonry',
                'frameAluminumSiding',
                'frameVinylSiding',
                'concreteBlock',
                'stuccoWoodframe',
                'stuccoBlock',
                'steelFrame',
                'logHome',
                'prefabManufactured',
                'prefabModular'
            ]
        ],
        [
            'home.roof.roofShape.',
            [
                'gable', 'hip', 'gambrel', 'mansard', 'shed', 'flat', 'complex'
            ]
        ],
        [
            'home.risks.',
            [
                'none', 'trampoline', 'swimmingPool.hasSwimmingPool', 'sumpPump'
            ]
        ],
        [
            'home.plan.requestedPlanType.',
            [
                'premium', 'standard', 'basic'
            ]
        ],
        [
            'home.heating.fuelType.',
            [
                'oil', 'electric', 'naturalGas', 'propane'
            ]
        ],
    ),
    'home.risks.none': toCardGroup(),
    'home.deck.hasDeck': toCardGroup(),
    'home.screenedEnclosure.hasScreenEnclosure': toCardGroup(),
}

const idRgx = /\.(\d+)\./
export const modifyField = (node: InputNode, store: any) => {
    const standardId = node.id.replace(idRgx, '.n.')
    const converter = idModifierMap[standardId]
    return converter?.(node, store) || node
}

export default modifyField