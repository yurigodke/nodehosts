const fs = require('fs');
const path = require('path');

class FileManager {
  constructor() {

  }

  readJson(file) {
    let fileData = {};

    try {
      fileData = fs.readFileSync(path.resolve(file), 'utf8');
      fileData = JSON.parse(fileData);
    } catch (err) {
      fileData.error = true;
      console.error(err)
    }

    return fileData;
  }

  writeJson(file, data) {
    let fileRead = this.readJson(file);
    let result = {};

    if (!fileRead.error) {
      let fileWrite = { ...fileRead, ...data };

      try {
        fs.writeFileSync(file, JSON.stringify(fileWrite));
        result.status = "file writed"
      } catch (err) {
        console.error(err)
        result.error = true;
      }
    } else {
      result.error = true;
    }

    return result;
  }
}

module.exports = new FileManager;
