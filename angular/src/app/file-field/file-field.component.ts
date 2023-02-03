import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from "@angular/core";
import { InputNode, FileInput } from "src/types";
import { emptyField } from "../shared/fields";

export const defaultFileUploader = (_files: File[]) => Promise.resolve([]);
export const MAX_FILE_SIZE_BYTES = 10_485_759; // 10 MB - 1 Byte
export const validFileTypesRecord = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    png: "image/png",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    tiff: "image/tiff",
};

export const validFileTypes = Object.values(validFileTypesRecord);

export enum InvalidFileReason {
    Unsupported,
    ExceededMaxBytesLimit,
}

export const filesReducer = (acc: { selected: File[]; invalid: InvalidFile[] }, file: File) => {
    const invalidReasons: InvalidFileReason[] = [];
    if (file.size > MAX_FILE_SIZE_BYTES) {
        invalidReasons.push(InvalidFileReason.ExceededMaxBytesLimit);
    }
    if (!validFileTypes.includes(file.type)) {
        invalidReasons.push(InvalidFileReason.Unsupported);
    }

    if (invalidReasons.length) {
        acc.invalid.push({ name: file.name, reasons: invalidReasons });
    } else {
        acc.selected.push(file);
    }
    return acc;
};

export type InvalidFile = { name: string; reasons: InvalidFileReason[] };
type UploadResult = Pick<InvalidFile, "name"> & {
    success: boolean;
};

@Component({
    selector: "file-field",
    templateUrl: "./file-field.component.html",
    styleUrls: ["./file-field.component.css"],
})
export class FileFieldComponent implements OnChanges {
    constructor() {}
    @Input("field") field: InputNode = emptyField;

    invalidFiles: InvalidFile[] = [];
    failedFiles: UploadResult[] = [];
    uploadedFiles: string[] = [];
    selectedFiles: File[] = [];
    isUploadDisabled: boolean = false;
    parsedValue: Record<string, string> = {};

    removeFileAt = (index: number) => () => {
        this.selectedFiles = [...this.selectedFiles.slice(0, index), ...this.selectedFiles.slice(index + 1)];
    };

    onChange = (e: Event) => {
        const { files = [] } = e.target as HTMLInputElement;
        const { selected, invalid } = Array.from(files || []).reduce(filesReducer, {
            selected: [],
            invalid: [],
        });

        this.isUploadDisabled = false;
        this.invalidFiles = invalid;
        this.selectedFiles = selected;
        if (this.invalidFiles.length) {
            window.alert(
                `We support only the following file formats: \n${Object.keys(validFileTypesRecord).join(
                    ", "
                )}.\n\nThe following files are not one of the above file formats: ${this.invalidFiles
                    .map((f) => `\n- ${f.name}`)
                    .join(" ")}`
            );
        }
    };

    uploadFiles = async () => {
        this.isUploadDisabled = true;
        const results = await (this.field as FileInput).uploadFiles(this.selectedFiles);

        this.selectedFiles = [];
        // Indicate to user which files failed the upload
        this.failedFiles = this.selectedFiles.reduce((acc, { name }) => {
            if (!results.some(({ fileName }) => fileName === name)) {
                return [
                    ...acc,
                    {
                        name,
                        success: false,
                    },
                ];
            }
            return acc;
        }, [] as UploadResult[]);

        const makeDuplicateFileName = (fileName: string, duplicateCount: number) =>
            `${fileName}${duplicateCount > 0 ? ` (copy ${duplicateCount})` : ""}`;
        const updatedValue = results.reduce((acc, { objectId, fileName }) => {
            let duplicateCounter = 0;
            while (acc[makeDuplicateFileName(fileName, duplicateCounter)]) {
                duplicateCounter += 1;
            }

            acc[makeDuplicateFileName(fileName, duplicateCounter)] = objectId;
            return acc;
        }, this.parsedValue);

        this.field.onChange(JSON.stringify(updatedValue));
    };

    makeNewFileInput = () => {
        let inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.onchange = this.onChange;
        inputElement.multiple = true;
        inputElement.accept = validFileTypes.join(", ");
        inputElement.click();
    };

    ngOnChanges(_: SimpleChanges) {
        this.parsedValue = JSON.parse(this.field.value || "{}");
        this.uploadedFiles = Object.keys(this.parsedValue);
    }
}
