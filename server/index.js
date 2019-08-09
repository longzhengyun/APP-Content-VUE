const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const api = require('./api')

const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.set('port', port)

app.use(bodyParser.json({ limit: '10000kb' })) // 请求体数据大小限制为10M
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
