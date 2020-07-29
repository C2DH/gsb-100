const proxyApi = require('./proxyApi')
const { run } = require('react-snap')
const util = require('util')
const cpr = require('cpr')
const rimraf = require('rimraf')

const cprAsync = util.promisify(cpr)
const rimrafAsync = util.promisify(rimraf)

const DESTIONATION = './build-crawled'

async function buildWithApi() {
  await rimrafAsync(DESTIONATION)
  await cprAsync('./build', DESTIONATION)
  const server = proxyApi()
  await run({
    publicPath: '/',
    fixWebpackChunksIssue: 'CRA2',
    source: DESTIONATION,
  })
  server.close()
}

buildWithApi().catch(error => {
  console.error(error)
  process.exit(1)
})