const util = require('util')
var self = module.exports = {
    escapeHTML: (function() {
            var MAP = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&#34;',
                "'": '&#39;'
            };
            var repl = function(c) {
                return MAP[c];
            };
            return function(s) {
                return s.replace(/[&<>'"]/g, repl);
            };
        })(),
    object2String: function(exportData) {
        return util.inspect(exportData, {
            depth: null
        })
    },
    htmlPrettyObjOutput: function(v) {
       return "<pre>" + self.escapeHTML( self.object2String(v) ) + "</pre>"
    },
}