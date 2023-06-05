const express = require('express')
const path = require('path')
const cors = require('cors')
const { getFileRoutes } = require('./fileUpload')
const { getAutoRoutes } = require('./auto')
const morgan = require('morgan')
const { getPortfolioRoutes } = require('./portfolio')
const { getAddressRoutes } = require('./address')
const { getSessionRoutes } = require('./session')

/* This configuration information should use the _testing_ integration
ID until you're ready to go live.  These IDs help to maintain the
integrity and safety of all transactions.
*/

// Change this to just api.younglalfred.com when you're ready.
const BOWTIE_API_URL = process.env.BOWTIE_API_URL
  ? process.env.BOWTIE_API_URL
  : 'https://bowtie-api-sandbox.youngalfred.com'

const PORT = process.env.BOWTIE_LOCAL_PORT ? process.env.BOWTIE_LOCAL_PORT : 3001
const api_key = process.env.BOWTIE_API_KEY
if (!api_key) {
  console.log(
    'You must pass your api key as an environment variable (BOWTIE_API_KEY) for the app to work as expected (unless you are using an integration token, in which case, you may remove this if clause).',
  )
  process.exit(-1)
}

const app = express()

// development helpers
app.use(morgan('tiny'))
app.use(cors())

app.use(function (req, res, next) {
  var filename = path.basename(req.url)
  var extension = path.extname(filename)
  if (extension === '.js') console.log('The file ' + filename + ' was requested.')
  next()
})

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

/* The static resources to be served to your customer.  If it has been
   built correctly, the demo implementation's content will be
   delivered as the "home page" of this server.  
*/

const STATIC_CONTENT = process.env.BOWTIE_STATIC_CONTENT

if (!STATIC_CONTENT) {
  console.warn(
    '\n\nYou must set the BOWTIE_STATIC_CONTENT environment variable to serve a Bowtie UI Demo. You can easily serve a demo project by going to the root folder of one of the projects (angular/, vanilla-js/, etc...) and running: `npm run server\n\n`',
  )
} else {
  app.use(express.static(STATIC_CONTENT))
}

/* 
   This is the primary request/response proxy cycle.  After the customer
   submits the form, your instance will forward the content to the 
   Bowtie API, using your private IDs.
*/

app.use(getAddressRoutes(BOWTIE_API_URL, api_key))

app.use('/file', getFileRoutes(BOWTIE_API_URL, api_key))

app.use('/portfolio', getPortfolioRoutes(BOWTIE_API_URL, api_key))

app.use('/auto', getAutoRoutes(BOWTIE_API_URL, api_key))

app.use('/session', getSessionRoutes(BOWTIE_API_URL, api_key))

// Serve the index.html (for client-side routing to take place)
// when the url is unrecognized
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, STATIC_CONTENT, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Bowtie proxy server listening at http://localhost:${PORT}`)
  if (process.env.NODE_ENV) {
    console.log('NODE_ENV: ' + process.env.NODE_ENV)
  }
})
