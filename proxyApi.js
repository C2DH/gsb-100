const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')
const pkg = require('./package.json')

function proxyApi() {
  const app = express()

  app.use(cors())
  app.use('/', createProxyMiddleware({ target: pkg.proxy, changeOrigin: true  }))

  const server = app.listen(3033)
  return server
}

if (typeof require !== 'undefined' && require.main === module) {
  proxyApi()
} else {
  module.exports = proxyApi
}