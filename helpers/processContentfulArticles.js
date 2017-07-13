var json2xls = require('json2xls');
var fs = require('fs');
var dateFormat = require('dateformat');
var self = module.exports = {
    getEntry_pages2Iterate: function(exportDataTotal, exportDataLimit) {
        return Math.ceil(exportDataTotal / exportDataLimit)
    },
    getEntry_build_conentType_obj: function(contentfulJSON, groupByContentType) {
        return new Promise(function(resolve) {
            var returnDatas = [];
            if (typeof contentfulJSON.items === 'object') {
                Object.keys(contentfulJSON.items).forEach(function(key, index) {
                    // Logger.debug(contentType[key])
                    if (contentfulJSON.items[key].sys.contentType.sys.id === groupByContentType && typeof contentfulJSON.items[key].fields.slug === 'string') {
                        // Logger.warn('--------------' + contentfulJSON.items[key].sys.contentType.sys.id)
                        // Logger.warn( contentfulJSON.items[key].fields.slug)
                        returnDatas[contentfulJSON.items[key].sys.id] = contentfulJSON.items[key]
                    }
                });
                resolve(returnDatas)
            } else {
                Logger.debug("====> " + contentfulJSON.sys.type + ': ' + contentfulJSON.sys.id)
            }
        })
    },
    getEntry_aticles_to_contenType_obj: function(contentfulJSON, groupedByContentType) {
        return new Promise(function(resolve) {
            if (typeof contentfulJSON.items === 'object') {
                var groupID;
                Object.keys(contentfulJSON.items).forEach(function(key, index) {
                    // Logger.debug(contentType[key])
                    if (contentfulJSON.items[key].sys.contentType.sys.id === 'article' && typeof contentfulJSON.items[key].fields.slug === 'string' && typeof contentfulJSON.items[key].fields.category === 'object') {
                        Object.keys(contentfulJSON.items[key].fields.category).forEach(function(key2, index2) {
                            groupID = contentfulJSON.items[key].fields.category[key2].sys.id
                                // Logger.warn(groupedByContentType[groupID])
                            if (typeof groupedByContentType[groupID].items != 'object') {
                                groupedByContentType[groupID].items = []
                            }
                            // Logger.warn(`(${groupID}) ${contentfulJSON.items[key].fields.slug} ${contentfulJSON.items[key].sys.id}`)
                            groupedByContentType[groupID].items.push(contentfulJSON.items[key])
                        })
                    }
                })
                resolve(groupedByContentType)
            } else {
                Logger.debug("====> " + contentfulJSON.sys.type + ': ' + contentfulJSON.sys.id)
            }
        })
    },
    getEntry_export_obj: function(contentfulObj) {
        if (typeof contentfulObj.items === 'undefined') {
            Logger.error("---------------------")
            Logger.error("contentfulObj.items === 'undefined'")
            Logger.error("---------------------")
            return;
        }
        var exportData = []
        var ad_cat1
        var ad_cat2
        var ad_cat3
        var ad_cat4
        var uri
        Logger.info(`EXPORTING (${contentfulObj.items.length}) Total [${contentfulObj.items[0].sys.contentType.sys.id}] to Excel`)

        Object.keys(contentfulObj.items).forEach(function(key, index) {

                if (typeof contentfulObj.items[key].fields === 'undefined') {
                    return;
                }

                // articles
                if( typeof contentfulObj.items[key].fields.category !== "undefined" ) {
                  var category = contentfulObj.items[key].fields.category.reverse();
                  if (typeof category[0].fields === 'undefined') {
                      return;
                  }
                  ad_cat1 = category[0].fields.slug;
                  if (typeof category[1] === 'object' && typeof category[1].fields === 'object') {
                      ad_cat2 = category[1].fields.slug;
                  } else {
                      ad_cat2 = ad_cat1;
                  }
                } else {
                  ad_cat1 = contentfulObj.items[key].sys.contentType.sys.id
                  ad_cat2 = ' '
                }
                ad_cat3 = contentfulObj.items[key].sys.contentType.sys.id;
                ad_cat4 = contentfulObj.items[key].fields.adOverride;
                uri = `/${ad_cat1}/${ad_cat3}/${contentfulObj.items[key].fields.slug}`
                exportData.push({
                    'title': contentfulObj.items[key].fields.title,
                    'slug': contentfulObj.items[key].fields.slug,
                    'uri': uri,
                    'pageID': contentfulObj.items[key].sys.id,
                    'ad_cat1': ad_cat1,
                    'ad_cat2': (ad_cat2 ? ad_cat2 : ad_cat1),
                    'ad_cat3': ad_cat3,
                    'ad_cat4': ad_cat4,
                    'contentType': self.camelCase(ad_cat3), //should really make another API call to get content type name but kind of expensive, for what we need
                })
            })
        var xls = json2xls(exportData)
        var now = new Date()
        var day = dateFormat(now, "yyyymmdd")
        fs.writeFileSync(`export/${day}.${ad_cat3}.xlsx`, xls, 'binary');
        return exportData;
    },
    includes_structure: function(includeObj) {
        var newIncludeObjStruct = {}
        var contentType
        Object.keys(includeObj).forEach(function(key, index) {
            contentType = includeObj[key].sys.contentType.sys.id;
            if (typeof newIncludeObjStruct[contentType] !== 'object') {
                newIncludeObjStruct[contentType] = []
            }
            // Logger.warn('----->' + self.camelCase('contentType asdf-caaa') )
            newIncludeObjStruct[contentType].push(includeObj[key].fields)
        });
        return newIncludeObjStruct;
    },
    camelCase: function(input, stripChars) {
        return (input || '').toLowerCase().replace(/(\b|-|\s)\w/g, function(m) {
            if (stripChars === 'undefined') {
                return m.toUpperCase().replace(/-|\s/, '');
            } else {
                return m.toUpperCase();
            }
        });
        // return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        //     return group1.toUpperCase();
        // })
    },
}