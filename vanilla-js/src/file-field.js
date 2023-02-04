const MAX_FILE_SIZE_BYTES = 10_485_759 // 10 MB - 1 Byte
const validFileTypesRecord = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  png: 'image/png',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
}

const validFileTypes = Object.values(validFileTypesRecord)
const InvalidFileReason = {
  Unsupported: 'Unsupported file type',
  ExceededMaxBytesLimit: `Exceeds max file size limit of ${MAX_FILE_SIZE_BYTES} bytes`,
}

const filesReducer = (acc, file) => {
  const invalidReasons = []
  if (file.size > MAX_FILE_SIZE_BYTES) {
    invalidReasons.push(InvalidFileReason.ExceededMaxBytesLimit)
  }
  if (!validFileTypes.includes(file.type)) {
    invalidReasons.push(InvalidFileReason.Unsupported)
  }

  if (invalidReasons.length) {
    acc.invalid.push({ name: file.name, reasons: invalidReasons })
  } else {
    acc.selected.push(file)
  }
  return acc
}

const submitFiles = files => {
  const results = []

  return new Promise((resolve, _reject) => {
    let fileUploadCompletions = 0
    for (let i = 0; i < files.length; i += 1) {
      const formData = new FormData()
      formData.append('file', files[i])

      fetch('/file', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(({ objectId }) => {
          if (objectId) {
            results.push({ fileName: files[i]?.name || '', objectId })
          }
        })
        .catch(_err => {
          // Do nothing. We're only tracking which files were uploaded successfully.
        })
        .finally(() => {
          fileUploadCompletions += 1
          // file uploads may finish in an unexpected order.
          // for that reason resolve based on completions,
          // NOT based on i, the for loop's index
          if (fileUploadCompletions === files.length) {
            resolve(results)
          }
        })
    }
  })
}

class FileField {
  constructor() {}

  invalidFiles = [] // InvalidFile[] =
  failedFiles = [] // UploadResult[] =
  uploadedFiles = [] // string[] =
  selectedFiles = [] // File[] =
  isUploadDisabled = false // boolean
  parsedValue = {} // Record<string,string>;

  removeSelectedFileAt = index => () => {
    this.selectedFiles = [
      ...this.selectedFiles.slice(0, index),
      ...this.selectedFiles.slice(index + 1),
    ]
  }

  onChange = e => {
    const { files = [] } = e.target
    const { selected, invalid } = Array.from(files || []).reduce(filesReducer, {
      selected: [],
      invalid: [],
    })

    this.isUploadDisabled = false
    this.invalidFiles = invalid
    this.selectedFiles = selected

    if (this.invalidFiles.length) {
      window.alert(
        `We support only the following file formats: \n${Object.keys(validFileTypesRecord).join(
          ', ',
        )}.\n\nThe following files are not one of the above file formats: ${this.invalidFiles
          .map(f => `\n- ${f.name}`)
          .join(' ')}`,
      )
    }
  }

  uploadFiles = () => {
    return new Promise((resolve, reject) => {
      if (this.isUploadDisabled) reject()

      this.isUploadDisabled = true

      submitFiles(this.selectedFiles).then(results => {
        this.selectedFiles = []
        // Indicate to user which files failed the upload
        this.failedFiles = this.selectedFiles.reduce((acc, { name }) => {
          if (!results.some(({ fileName }) => fileName === name)) {
            return [
              ...acc,
              {
                name,
                success: false,
              },
            ]
          }
          return acc
        }, [])

        const makeDuplicateFileName = (fileName, duplicateCount) =>
          `${fileName}${duplicateCount > 0 ? ` (copy ${duplicateCount})` : ''}`
        const updatedValue = results.reduce((acc, { objectId, fileName }) => {
          let duplicateCounter = 0
          while (acc[makeDuplicateFileName(fileName, duplicateCounter)]) {
            duplicateCounter += 1
          }

          acc[makeDuplicateFileName(fileName, duplicateCounter)] = objectId
          return acc
        }, this.parsedValue)

        resolve(updatedValue)
      })
    })
  }

  makeNewFileInput = () => {
    let inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.onchange = this.onChange
    inputElement.multiple = true
    inputElement.accept = validFileTypes.join(', ')
    inputElement.click()
  }
}

module.exports = FileField
