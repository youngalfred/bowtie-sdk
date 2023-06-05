const express = require('express')
const axios = require('axios')
const { getErrorData } = require('./utils/http-helpers')

const getSessionRoutes = (BOWTIE_API_URL = '', api_key = '') => {
  const router = express.Router()
  const commonHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': api_key,
  }

  router.post('/', async (req, res) => {
    try {
      const { data } = await axios.post(`${BOWTIE_API_URL}/v1/session`, null, {
        headers: {
          ...commonHeaders,
        },
      })

      res.status(200).send(data)
    } catch (err) {
      const { status, data } = getErrorData(err)
      res.status(status).json(data)
    }
  })

  router.post('/:sessionId/authenticate', async (req, res) => {
    const { sessionId = '' } = req.params

    try {
      const { data } = await axios.post(
        `${BOWTIE_API_URL}/v1/session/${sessionId}/authenticate`,
        null,
        {
          headers: {
            ...commonHeaders,
          },
        },
      )

      res.status(200).send(data)
    } catch (err) {
      const { status, data } = getErrorData(err)
      res.status(status).json(data)
    }
  })

  router.get('/:sessionId', (req, res) => {
    const { sessionId = '' } = req.params

    axios
      .get(`${BOWTIE_API_URL}/v1/session/${sessionId}`, {
        headers: commonHeaders,
      })
      .then(result => {
        const status = result.data.portfolioStatus
        res.status(200).json(status)
      })
      .catch(error => {
        const { status, data } = getErrorData(error)
        res.status(status).json(data)
      })
  })

  router.get('/:sessionId/progress', async (req, res) => {
    const { sessionId = '' } = req.params

    try {
      const { data } = await axios.get(`${BOWTIE_API_URL}/v1/session/${sessionId}/progress`, {
        headers: commonHeaders,
      })
      res.status(200).json(data)
    } catch (error) {
      const { status, data } = getErrorData(error)
      res.status(status).json(data)
    }
  })

  router.patch('/:sessionId/progress', async (req, res) => {
    const { sessionId = '' } = req.params

    try {
      await axios.patch(`${BOWTIE_API_URL}/v1/session/${sessionId}/progress`, req.body, {
        headers: commonHeaders,
      })
      res.sendStatus(204)
    } catch (error) {
      const { status, data } = getErrorData(error)
      res.status(status).json(data)
    }
  })

  return router
}

module.exports = {
  getSessionRoutes,
}
