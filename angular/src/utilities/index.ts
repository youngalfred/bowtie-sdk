type UpdateFunction = (value: string) => void;

export const onChangeJson = (
    e: Event,
    existingValue: Record<string, string>,
    changeHandler: UpdateFunction
) => {
    const { value = "", options } = e.target as HTMLSelectElement;
    const label = Array.from(options).find((o: HTMLOptionElement) => o.selected)?.label;
    if (!label) {
        throw new Error("Developer error. Unable to find label of selected option.");
    }
    changeHandler(JSON.stringify({ ...existingValue, [label]: value }));
};

export const onChange = (e: Event, changeHandler: UpdateFunction) => {
    const { value = "" } = e.target as HTMLInputElement | HTMLSelectElement;
    changeHandler(value);
};

export const onCheck = (e: Event, changeHandler: UpdateFunction) => {
    const { checked = false } = e.target as HTMLInputElement;
    changeHandler(checked ? "1" : "");
};
