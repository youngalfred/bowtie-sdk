const express = require('express')
const axios = require('axios')

const getPortfolioRoutes = (BOWTIE_API_URL = '', api_key = '') => {
  const router = express.Router()
  const commonHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': api_key,
  }
  /* 
    This is the primary request/response proxy cycle. After the customer
    submits the form, your proxy server instance will forward the content to the 
    Bowtie API, using your private BOWTIE_API_KEY (along with the bowtie-api-version).
    */
  router.post('/submit', (req, res) => {
    const { application } = req.body
    // if (env !== 'PROD') {
    console.log('Request:\n\n', JSON.stringify(application, null, 2))
    // }

    axios
      .post(`${BOWTIE_API_URL}/v1/portfolio`, application, {
        headers: {
          ...commonHeaders,
          'bowtie-api-version': req.headers['bowtie-api-version'], // automatically sent by the sdk
        },
      })
      .then(result => {
        // This information is forwarded to the client. The
        // resulting portfolioId can be used to retrieve the
        // portfolio.
        res.status(202).json({
          message: 'Portfolio was successfully submitted',
          portfolioId: result.data.objectId,
        })
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          console.log('Errors:\n\n', JSON.stringify(error.response.data, null, 2))
          res.status(400).json({
            message: 'Invalid data',
            errors: error.response.data.errors.map(function (e) {
              return { field: e.source, message: e.detail }
            }),
            kind: 'validation-failure',
          })
        } else {
          console.error('Internal server error submitting portfolio:\n', error.toString())
          res.status(500).json({ message: 'Server error. Please contact an administrator.' })
        }
      })
  })

  router.get('/status', (req, res) => {
    const portfolioId = req.query.id
    if (portfolioId === undefined) {
      res.status(400).json({ message: 'Portfolio id was not provided' })
    } else {
      axios
        .get(`${BOWTIE_API_URL}/v1/portfolio_status?portfolioId=${portfolioId}`, {
          headers: commonHeaders,
        })
        .then(result => {
          const status = result.data.portfolioStatus
          res.status(200).json(status)
        })
        .catch(error => {
          console.log('Error: ', error)
          res.status(500).json({ message: 'Internal server error.' })
        })
    }
  })

  return router
}

module.exports = {
  getPortfolioRoutes,
}
