const axios = require('axios')

const findFirstMissingQueryParam = params =>
  Object.entries(params).find(([_qpName, qpValue]) => !qpValue)?.[0]

const getErrorData = error => {
  const { response: { status = 500, data = { message: 'Unknown server error.' } } = {} } =
    error || {}

  return {
    status,
    data,
  }
}

const pipeResponse = async ({ res, url, params = {}, headers = {} }) => {
  const missingQueryParam = findFirstMissingQueryParam(params)
  if (missingQueryParam) {
    res.status(400).json({
      message: `You must provide a ${missingQueryParam} query parameter in your request.`,
    })
    return
  }

  try {
    const { data } = await axios.get(url, {
      params,
      headers,
    })
    res.status(200).json(data)
  } catch (error) {
    const { status, data } = getErrorData()
    res.status(status).json(data)
  }
}

module.exports = {
  pipeResponse,
  getErrorData,
}
