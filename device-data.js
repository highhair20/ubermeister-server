var fs = require('co-fs');

var deviceFile = './devices.json';

module.exports = {
    devices : {
        get: function *() {
            var data = yield fs.readFile(deviceFile, 'utf-8');
            return JSON.parse(data);
        },
        save: function *(device) {
            var devices = yield this.get();

            devices.push(device);

            yield fs.writeFile(deviceFile, JSON.stringify(devices));
        }
    }
}
