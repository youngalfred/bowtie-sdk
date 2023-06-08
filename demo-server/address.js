const express = require('express')
const { pipeResponse } = require('./utils/http-helpers')

const getAddressRoutes = (apiUrl = '', api_key = '') => {
  const router = express.Router()
  const headers = {
    'x-api-key': api_key,
  }

  router.get('/property', async (req, res) => {
    const { streetNumber = '', streetName = '', city = '', state = '', zipCode = '' } = req.query
    const params = {
      streetNumber,
      streetName,
      city,
      state,
      zipCode,
    }

    await pipeResponse({ res, url: `${apiUrl}/v1/property`, params, headers })
  })

  return router
}

module.exports = {
  getAddressRoutes,
}
