const path = require('path')
const multer = require('multer')
const axios = require('axios')
const express = require('express')
const FormData = require('form-data')

const MAX_FILE_SIZE_BYTES = 10_485_759 // 10 MB - 1 Byte
const ALLOWED_FILE_TYPES = [
  '.pdf',
  '.doc',
  '.docx',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.svgz',
  '.tiff',
  '.tif',
  '.bmp',
]

const uploadConfig = multer({
  fileFilter: function (_req, file, callback) {
    const extension = path.extname(file?.originalname || '')
    if (!ALLOWED_FILE_TYPES.includes(extension)) {
      return callback(new Error(`Only ${ALLOWED_FILE_TYPES.join(', ')} files are allowed`))
    }
    callback(null, true)
  },
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
})

const getFileData = req => {
  const { files = [] } = req

  // Report error when no "files" object is present
  // in request or "files" list is empty
  if (!files?.length) {
    throw new Error('You must include a file to upload.')
  }
  return files[0]
}

const makeFileUploadFn = (BOWTIE_API_URL, api_key) => async (files, headers) => {
  const url = `${BOWTIE_API_URL}/v1/file`

  try {
    const { data } = await axios.post(url, files, {
      headers: {
        ...headers,
        'x-api-key': api_key,
      },
    })

    return data
  } catch (error) {
    throw error
  }
}

const getFileRoutes = (BOWTIE_API_URL = '', api_key = '') => {
  const router = express.Router()

  const uploadFile = makeFileUploadFn(BOWTIE_API_URL, api_key)

  router.post('/', uploadConfig.any(), async (req, res) => {
    let fileName, buffer
    try {
      const { buffer: fileBuffer, originalname } = getFileData(req)
      fileName = originalname
      buffer = fileBuffer
    } catch (err) {
      return res.status(400).send({
        message: 'You must include a file to upload.',
      })
    }

    const formData = new FormData()
    formData.append('content', buffer)
    formData.append('fileName', fileName)

    try {
      const result = await uploadFile(formData, formData.getHeaders())
      return res.status(200).json(result)
    } catch (error) {
      console.error(error)
      console.log('--File upload error above.')
      return res.status(500).json({ message: 'Unknown server error.' })
    }
  })

  return router
}

module.exports = {
  getFileRoutes,
}
