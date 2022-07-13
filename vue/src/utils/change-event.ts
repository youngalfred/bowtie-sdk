import type { Field } from '@/types';

export const onChange = (e: Event, changeHandler: Field['onChange']) => {
    const { value = '' } = e.target as HTMLInputElement | HTMLSelectElement;
    changeHandler(value);
};

export const onCheck = (e: Event, changeHandler: Field['onChange']) => {
    const { checked = false } = e.target as HTMLInputElement;
    changeHandler(checked ? '1' : '');
};