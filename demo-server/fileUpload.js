const path = require("path");
const multer = require("multer");
const axios = require("axios");

const MAX_FILE_SIZE_BYTES = 10_485_759; // 10 MB - 1 Byte
const ALLOWED_FILE_TYPES = [
    ".pdf",
    ".doc",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".svgz",
    ".tiff",
    ".tif",
    ".bmp",
];

const uploadConfig = multer({
    fileFilter: function (_req, file, callback) {
        const extension = path.extname(file?.originalname || "");
        if (!ALLOWED_FILE_TYPES.includes(extension)) {
            return callback(new Error(`Only ${ALLOWED_FILE_TYPES.join(", ")} files are allowed`));
        }
        callback(null, true);
    },
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
    },
});

const getFileData = (req) => {
    const { files = [] } = req;

    // Report error when no "files" object is present
    // in request or "files" list is empty
    if (!files?.length) {
        throw new Error("You must include a file to upload.");
    }
    return (files)[0];
};

const uploadFile = (BOWTIE_API_URL) => async (files, headers, partnerId, integrationId) => {
    const url = `${BOWTIE_API_URL}/v1/file`;

    try {
        const { data } = await axios.post(url, files, {
            headers: {
                ...headers,
                "x-partner-id": partnerId,
                "x-integration-id": integrationId,
            },
        });

        return data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    uploadFile,
    getFileData,
    uploadConfig,
};