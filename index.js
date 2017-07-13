(cluster = require('cluster'));
(Logger = require('arsenic-logger'))
require('dotenv').config({
  silent: true
})
Logger.setLevel(process.env.LOG_LEVEL || 'debug')

Logger.setTimestampFormat('dddd, MMMM Do YYYY, h:mm:ss a')
Logger.echoCPUUsage()
Logger.echoMemoryUsage()
Logger.setLocale('en')
Logger.setTransport({
  name: 'console'
  //--- to write logs to file or other
  // {name:'file', filename:'logs/log.log'},
  // {name:'papertrail', host:'logs.papertrailapp.com', port'1234'}
})

if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork()
  }

  Logger.debug(`Thread Count: ${cpuCount}`)
} else {
  (express = require('express'))
  const app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    server_port = process.env.PORT || 3001

  var routePath = './routes/'
  fs.readdirSync(routePath).forEach(function (file) {
    var route = routePath + file
    Logger.debug('LOADING ROUTE: ', routePath + file)
    app.use('/', require(route))
  })

  var server = app.listen(server_port)
  Logger.info('::Running on port ' + server_port)
  module.exports = server
}
