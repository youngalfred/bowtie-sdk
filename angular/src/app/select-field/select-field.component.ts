import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { onChange, onChangeJson } from "src/utilities";
import { InputNode, OptionType, Select } from "../../types";
import { emptyField } from "../shared/fields";

@Component({
    selector: "select-field",
    templateUrl: "./select-field.component.html",
    styleUrls: ["./select-field.component.css"],
})
export class SelectFieldComponent implements OnInit, OnChanges {
    public options: OptionType[] = [];
    public isMultipleSelect: boolean = false;
    public parsedMultiValue: Record<string, string> = {};
    public selectedValues: string[] = [];
    constructor() {}

    @Input("field") field: InputNode = emptyField;

    ngOnInit(): void {
        const options = (this.field as Select)?.options || [];
        this.updateOptions(options);
    }

    updateOptions(options: { name: string; label: string }[]) {
        // Insert an empty option when an option is NOT pre-selected
        this.options = this.field.value ? options : [{ name: "", label: "" }, ...options];

        this.isMultipleSelect = this.field.classes.includes("multi-select-dropdown");
        this.adaptForMultiSelect();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.updateOptions(changes.field.currentValue.options);
        this.adaptForMultiSelect();
    }

    private adaptForMultiSelect() {
        if (this.isMultipleSelect) {
            this.parsedMultiValue = JSON.parse(this.field.value) || {};
            this.selectedValues = Object.keys(this.parsedMultiValue);
        }
    }

    isSelected(o: OptionType): boolean {
        return this.isMultipleSelect ? false : o.name === this.field.value;
    }

    remove(selectedOptionLabel: string): void {
        const { [selectedOptionLabel]: removed, ...newValue } = this.parsedMultiValue;
        this.field.onChange(JSON.stringify(newValue));
    }

    onChangeInternal(e: Event) {
        if (this.isMultipleSelect) {
            onChangeJson(e, this.parsedMultiValue, this.field.onChange);
        } else {
            onChange(e, this.field.onChange);
        }
    }
}
