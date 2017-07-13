const contentful = require('contentful')
const processContentfulArticles = require('../helpers/processContentfulArticles')
var ContentfulClient = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CONTENTFUL_SPACE_ID_HA50,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.CONTENTFUL_API_KEY_HA50
})
var returnLimit = process.env.API_DATA_LIMIT
    // curl -v https://cdn.contentful.com/spaces/vzozxqoah1x0/entries?access_token=${access_token}
var self = module.exports = {
    getEntriess: function(contentType, slug, skip) {
        return new Promise(function(resolve) {
            var json_params = {
                'skip': (skip > 0 ? skip : 0),
                'limit': returnLimit,
                'order': 'sys.createdAt'
            };
            json_params['content_type'] = contentType
            json_params['fields.slug'] = slug
            Logger.warn(JSON.stringify(json_params))
                // ContentfulClient.getEntries({
                //     'content_type': 'article',
                //     'fields.category.sys.id': '4RzgNxCzwcEkemYOs4qcgg',
                //     // 'fields.slug': 'fitness',
                //     skip: 0,
                //     limit: 200,
                //     order: 'sys.createdAt'
                // }).then(function(entry) {
            ContentfulClient.getEntries(json_params).then(function(entry) {
                resolve(entry)
            }).catch((err) => setImmediate(() => {
                Logger.error('exportArticles::' + err.response.status + ' ' + err.response.statusText)
                Logger.error(err.response.data)
                resolve(err.response.status + ' ' + err.response.statusText + ' - ' + err.response.data.message)
            })); // Throw async to escape the promise chain
        })
    },
    /*
     * getEntry
     *
     */
    getContentArticle: function(qContentID) {
        return new Promise(function(resolve) {
            ContentfulClient.getEntry((qContentID == 'all' ? '' : qContentID)).then(function(contentArticles) {
                if (typeof contentArticles.total === 'number') {
                    var category_exportData = processContentfulArticles.getEntry_build_conentType_obj(contentArticles, 'category')
                    category_exportData.then(function(v) {
                        // console.log(v['4RzgNxCzwcEkemYOs4qcgg']); 
                        var category_exportData2 = processContentfulArticles.getEntry_aticles_to_contenType_obj(contentArticles, v)
                        category_exportData2.then(function(u) {
                            resolve(u)
                            return
                        })
                        resolve(v)
                        return
                    })
                } else {
                    Logger.debug("====> " + contentArticles.sys.type + ': ' + contentArticles.sys.id)
                }
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
                    // Logger.error( 'getContentType::' + err.response.status + ' ' + err.response.statusText )
                    // // Logger.error(err.response.headers)
                    // resolve( err.response.status + ' ' + err.response.statusText + ' - ' + err.response.data.message )
            })); // Throw async to escape the promise chain
        })
    },
    getContentType: function(qContentType) {
        return new Promise(function(resolve) {
            ContentfulClient.getContentType((qContentType == 'all' ? '' : qContentType)).then(function(contentType) {
                if (typeof contentType.total === 'number') {
                    Object.keys(contentType).forEach(function(key, index) {
                        // Logger.debug(contentType[key])
                        if (key === 'items') {
                            Object.keys(contentType[key]).forEach(function(ikey, iindex) {
                                // Logger.debug("--->" + iindex.sys.type + ':' + iindex.sys.id)
                                Logger.debug(`(${iindex})====> ` + contentType[key][ikey].sys.type + ': ' + contentType[key][ikey].sys.id)
                            })
                        }
                    });
                } else {
                    Logger.debug("====> " + contentType.sys.type + ': ' + contentType.sys.id)
                }
                resolve(contentType)
            }).catch((err) => setImmediate(() => {
                Logger.error(err)
                    // Logger.error( 'getContentType::' + err.response.status + ' ' + err.response.statusText )
                    // // Logger.error(err.response.headers)
                    // resolve( err.response.status + ' ' + err.response.statusText + ' - ' + err.response.data.message )
            })); // Throw async to escape the promise chain
        })
    },
    exportArticle_test: function(contentID) {
        return new Promise(function(resolve) {
            ContentfulClient.getEntry(contentID ? contentID : '1oi7dyvRWEsgUgc4gu6Ymc').then(function(entry) {
                resolve(entry)
            }).catch((err) => setImmediate(() => {
                Logger.error('exportArticles::' + err.response.status + ' ' + err.response.statusText)
                Logger.error(err.response.headers)
                resolve(err.response.status + ' ' + err.response.statusText + ' - ' + err.response.data.message)
            })); // Throw async to escape the promise chain
        })
    },
    /*
     * getContentTypes
     *
     */
    getContentTypes: function(contentTypeID) {
        return new Promise(function(resolve) {
            ContentfulClient.getContentTypes(contentTypeID).then(function(entry) {
                resolve(entry)
            }).catch((err) => setImmediate(() => {
                Logger.error('exportArticles::' + err.response.status + ' ' + err.response.statusText)
                Logger.error(err.response.headers)
                resolve(err.response.status + ' ' + err.response.statusText + ' - ' + err.response.data.message)
            })); // Throw async to escape the promise chain
        })
    },
}