const fs = require('fs')

exports.deleteFile = (filename) => {
    fs.unlink(filename, err => {
        if (err) {
            throw err;
        }
    });
}
