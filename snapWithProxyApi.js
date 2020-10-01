const proxyApi = require('./proxyApi')
const { run } = require('react-snap')
const util = require('util')
const cpr = require('cpr')
const rimraf = require('rimraf')

const cprAsync = util.promisify(cpr)
const rimrafAsync = util.promisify(rimraf)

const pptSandbox = !process.argv.some((arg) => arg === '--no-sandbox')
const snapDesktop = process.argv.some((arg) => arg === '--desktop')

const destination = snapDesktop ? './build-crawled-desktop' : './build-crawled'

console.log('.:.SNAP OPTIONS.:.')
console.log()
console.log(JSON.stringify({
  destination,
  pptSandbox,
  snapDesktop,
}, null, 2))
console.log()

async function buildWithApi() {
  await rimrafAsync(destination)
  await cprAsync('./build', destination)
  const server = proxyApi()

  let viewport
  if (snapDesktop) {
    viewport = {
      width: 1440,
      height: 850,
    }
  } else {
    viewport = {
      width: 480,
      height: 850,
    }
  }

  await run({
    viewport,
    publicPath: '/',
    fixWebpackChunksIssue: 'CRA2',
    source: destination,
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
