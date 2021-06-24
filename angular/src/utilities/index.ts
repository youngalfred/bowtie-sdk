type UpdateFunction = (value: string) => void;
export const onChange = (e: Event, changeHandler: UpdateFunction) => {
    const { value = "" } = e.target as HTMLInputElement | HTMLSelectElement;
    changeHandler(value);
};

export const onCheck = (e: Event, changeHandler: UpdateFunction) => {
    const { checked = false } = e.target as HTMLInputElement;
    changeHandler(checked ? "1" : "");
};