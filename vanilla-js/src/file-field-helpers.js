const MAX_FILE_SIZE_BYTES = 10_485_759; // 10 MB - 1 Byte
const validFileTypesRecord = {
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

const validFileTypes = Object.values(validFileTypesRecord);
const submitFiles = async (files) => { // File[] 
    const results = []; // { fileName: string; objectId: string }[]

    for (let i = 0; i < files.length; i += 1) {
        const formData = new FormData();
        formData.append("file", files[i]); // files[i] is a Blob
        const response = await fetch("/file", {
            method: "POST",
            body: formData,
        });

        try {
            const { objectId } = await response.json();
            if (response.ok && objectId) {
                results.push({ fileName: files[i]?.name || "", objectId });
            }
        } catch (error) {
            // Do nothing. Already tracking which files were uploaded successfully.
        }
    }

    return results;
};

class FileField {
    
    constructor(field) {
        this.field = field;
    }
    
    invalidFiles = []; // InvalidFile[] =
    failedFiles = []; // UploadResult[] =
    uploadedFiles = []; // string[] =
    selectedFiles = []; // File[] =
    isUploadDisabled = false; // boolean
    parsedValue = {}; // Record<string,string>;

    removeSelectedFileAt = (index) => () => {
        this.selectedFiles = [...this.selectedFiles.slice(0, index), ...this.selectedFiles.slice(index + 1)];
    };

    onChange = (e) => {
        const { files = [] } = e.target;
        const { selected, invalid } = Array.from(files || []).reduce(filesReducer, {
            selected: [],
            invalid: [],
        });
    
        this.isUploadDisabled = false;
        this.invalidFiles = invalid;
        this.selectedFiles = selected;
        if (this.invalidFiles.length) {
            window.alert(`We support only the following file formats: \n${Object.keys(validFileTypesRecord).join(", ")}.\n\nThe following files are not one of the above file formats: ${this.invalidFiles.map(f => `\n- ${f.name}`).join(" ")}`);
        }
    };
    
    uploadFiles = async () => {
        if (this.isUploadDisabled) return;

        this.isUploadDisabled = true;
        const results = await submitFiles(this.selectedFiles);
    
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
            }, []);
        
            const makeDuplicateFileName = (fileName, duplicateCount) =>
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

        // ngOnChanges(_: SimpleChanges) {
        //   this.parsedValue = JSON.parse(this.field.value || "{}");
        //   this.uploadedFiles = Object.keys(this.parsedValue);
        // }
};

module.exports = {
    FileField
};