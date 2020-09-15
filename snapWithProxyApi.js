const proxyApi = require('./proxyApi')
const { run } = require('react-snap')
const util = require('util')
const cpr = require('cpr')
const rimraf = require('rimraf')

const cprAsync = util.promisify(cpr)
const rimrafAsync = util.promisify(rimraf)

const DESTINATION = './build-crawled'

const pptSandbox = !process.argv.some((arg) => arg === '--no-sandbox')

async function buildWithApi() {
  await rimrafAsync(DESTINATION)
  await cprAsync('./build', DESTINATION)
  const server = proxyApi()
  await run({
    publicPath: '/',
    fixWebpackChunksIssue: 'CRA2',
    source: DESTINATION,
    puppeteerArgs: pptSandbox
      ? undefined
      : ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  server.close()
}

buildWithApi().catch((error) => {
  console.error(error)
  process.exit(1)
})
