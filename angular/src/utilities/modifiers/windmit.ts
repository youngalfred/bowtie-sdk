import { InputNode, Select, Field } from "src/types";
import { assignModifierToFieldsWithPrefix, BaseConverter } from ".";
import { makeTestId } from "./groups";

const getCheckValue = (value: string, optionName: string) => (value === optionName ? "1" : "");

const toCheckGroup: BaseConverter<InputNode, InputNode[]> = (node) => {
    const { options, label, ...rest } = node as Select;
    return options.map(({ name }) => ({
        ...rest,
        label: "",
        value: getCheckValue(node.value, name),
        testId: makeTestId(`${node.testId}-${name}`),
        id: `${node.id}-${name}`,
        kind: "check",
        onChange: () => node.onChange(name),
    }));
};

const toCheck: BaseConverter<InputNode, InputNode> = (node: InputNode): Field => ({
    ...node,
    value: getCheckValue(node.value, "yes"),
    label: "",
    onChange: () => node.onChange(node.value === "yes" ? "no" : "yes"),
    kind: "check",
});

type FieldConverter = BaseConverter<InputNode, InputNode | InputNode[]>;
export const modifierMap: Record<string, FieldConverter> = {
    ...assignModifierToFieldsWithPrefix("home.windmit.", toCheckGroup)(
        "buildingCode",
        "roofCovering",
        "roofDeckAttachment",
        "roofToWallAttachment",
        "aToeNailsTrussRafter",
        "bClips",
        "dDoubleWraps",
        "roofGeometry",
        "secondaryWaterResistance",
        "openingProtection",
        "openingProtectionA",
        "openingProtectionB",
        "openingProtectionC",
        "openingProtectionN"
    ),
    ...assignModifierToFieldsWithPrefix("home.windmit.", toCheck)(
        "minConditionBCDAttached",
        "minConditionBCDSecured"
    ),
    ...assignModifierToFieldsWithPrefix("home.windmit.roofCoveringType-", toCheck)(
        "concreteOrClayTile-NoInfo",
        "builtUp-NoInfo",
        "membrane-NoInfo",
        "asphaltOrFiberglassShingle-NoInfo",
        "metal-NoInfo",
        "other-NoInfo"
    ),
};

const modifyWindMitField = (node: InputNode) => {
    const converter = modifierMap[node.id];
    const { label, ...rest } = node;
    return converter?.(node) || { ...rest, label: "" };
};

export default modifyWindMitField;
