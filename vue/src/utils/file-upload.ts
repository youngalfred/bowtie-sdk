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

export type InvalidFile = { name: string; reasons: InvalidFileReason[] };
export type UploadResult = Pick<InvalidFile, "name"> & {
  success: boolean;
};

export const filesReducer = (acc: { selected: File[]; invalid: InvalidFile[]; }, file: File) => {
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

export type FileUploader = {
    invalidFiles: InvalidFile[],
    failedFiles: UploadResult[],
    selectedFiles: File[],
    isUploadDisabled: boolean,
    parsedValue: Record<string,string>,

    onChange: (e: Event) => void,
    removeSelectedFileAt: (index: number) => () => void
    uploadFiles: () => Promise<void>
    makeNewFileInput: () => void
}