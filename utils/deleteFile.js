const fs = require('fs');

exports.deleteFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) {
            console.error('Error deleting the file:', err);
        } else {
            console.log(`File in the path ${path} was deleted successfully.`);
        }
    });
}