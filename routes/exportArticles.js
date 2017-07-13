const getTheData = require('../app/exportArticles')
const helpersHTML = require('../helpers/HTML')
const processContentfulArticles = require('../helpers/processContentfulArticles')
var self = module.exports = (function() {
    var router = express.Router()
        // middleware to use for all requests
    router.use(function(req, res, next) {
            Logger.debug("Cluster worker [" + cluster.worker.id + "] running")
                // do logging
                // Logger.debug(filename , "::", (new Date).toUTCString() + '===>API Call made:' + req.method);
            next() // make sure we go to the next routes and don't stop here
        })
        // more routes for our API will happen here
        // on routes that end in /
        // ----------------------------------------------------

    // generate report based on contentType
    //  - /getEntries/articles
    //  - /getEntries/slideshow?export=1
    //  - /getEntries/author?export=1
    router.route('/getEntries/:contentType').get(function(req, res) {
            getTheData.getEntriess(req.params.contentType).then(function(exportData, err) {
                return exportData
            }).then(function(exportData2, err) {
                var totalPages = processContentfulArticles.getEntry_pages2Iterate(exportData2.total, exportData2.limit)
                var currentSkip = 0
                var has_res_sent = 0
                var counterLoop = 0
                if (totalPages > 1) {
                    for (var i = 1; i <= totalPages; i++) {
                        var currentSkip = exportData2.limit * i
                        getTheData.getEntriess(req.params.contentType, '', currentSkip).then(function(exportDataPaginated, err) {
                            Logger.info(`PROCESSING PAGE: ${exportDataPaginated.skip} of ${currentSkip}`)

                            if( exportDataPaginated.items.length > 0 ) {
                              exportData2.skip = currentSkip
                              exportData2.limit = exportDataPaginated.limit
                              // exportData2.items.push(exportDataPaginated.items)
                              exportData2.items = exportData2.items.concat(exportDataPaginated.items);
                              Logger.info(`we have (${exportData2.items.length}) Total Items`)
                            }
                            counterLoop++
                            if (counterLoop >= totalPages && has_res_sent === 0) {
                                if (req.query.api) {
                                    res.send(exportData2)
                                } else {
                                    if (typeof req.query.export !== 'undefined') {
                                        processContentfulArticles.getEntry_export_obj(exportData2)
                                    }
                                    res.send(helpersHTML.htmlPrettyObjOutput(exportData2))
                                }
                                has_res_sent = 1
                                return
                            }
                        }).catch((err) => setImmediate(() => {
                            Logger.error(err)
                        }))
                    }
                } else {
                    if (req.query.api) {
                        res.send(exportData2)
                    } else {
                        if (typeof req.query.export !== 'undefined') {
                            processContentfulArticles.getEntry_export_obj(exportData2)
                        }
                        res.send(helpersHTML.htmlPrettyObjOutput(exportData2))
                    }
                }
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
            }))
        }),
        router.route('/getEntries/:contentType/:slug').get(function(req, res) {
            getTheData.getEntriess(req.params.contentType, req.params.slug).then(function(exportData, err) {
                if (req.query.api) {
                    res.send(exportData)
                } else {
                    // processContentfulArticles.getEntry_export_obj(exportData)
                    res.send(helpersHTML.htmlPrettyObjOutput(exportData))
                }
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
            }))
        }),
        router.route('/getEntries/:contentType/:slug/all').get(function(req, res) {
            getTheData.getEntriess(req.params.contentType, req.params.slug).then(function(exportData, err) {
                getTheData.getEntriess('article', '', exportData.items[0].sys.id).then(function(exportData2, err) {
                    if (req.query.api) {
                        res.send(exportData2.items)
                    } else {
                        res.send(helpersHTML.htmlPrettyObjOutput(exportData2))
                    }
                }).catch((err) => setImmediate(() => {
                    Logger.error(err)
                }))
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
            }))
        }),
        router.route('/getContentTypes').get(function(req, res) {
            getTheData.getContentTypes().then(function(exportData, err) {
                Logger.error('========>' + req.query.api)
                if (req.query.api) {
                    res.send(exportData)
                } else {
                    res.send(helpersHTML.htmlPrettyObjOutput(exportData))
                }
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
            }))
        }),
        router.route('/getContentArticle/:articleID').get(function(req, res) {
            getTheData.getContentArticle(req.params.articleID).then(function(exportData, err) {
                if (req.query.api) {
                    res.send(exportData)
                } else {
                    res.send(helpersHTML.htmlPrettyObjOutput(exportData))
                }
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
            }))
        }),
        router.route('/getContentType/:contentType').get(function(req, res) {
            getTheData.getContentType(req.params.contentType).then(function(exportData, err) {
                if (req.query.api) {
                    res.send(exportData)
                } else {
                    res.send(helpersHTML.htmlPrettyObjOutput(exportData))
                }
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
            }))
        }),




        router.route("/export_articles").get(function(req, res) {
            getTheData.exportArticles("exportList").then(function(exportData, err) {
                if (req.query.api) {
                    res.send(exportData)
                } else {
                    res.send(helpersHTML.htmlPrettyObjOutput(exportData))
                }
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
            }))
        }).post(function(req, res) {
            // nothing
        }).put(function(req, res) {
            // nothing
        }).delete(function(req, res) {
            // nothing
        })
    return router
})()