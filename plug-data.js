var fs = require('co-fs');

var plugFile = './plugs.json';

module.exports = {
    plugs : {
        get: function *() {
            var data = yield fs.readFile(plugFile, 'utf-8');
            return JSON.parse(data);
        },
        save: function *(plug) {
            var plugs = yield this.get();

            plugs.push(plug);

            yield fs.writeFile(plugFile, JSON.stringify(plugs));
        }
    }
}
