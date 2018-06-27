const FileManager = require('./FileManager');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

class hostManager {
  constructor() {
    this.setHostData()
  }

  setHostData() {
    let env = this.getEnviroment();

    let localData = FileManager.readJson('./files/env.local.js');
    let envData = FileManager.readJson(`./files/env.${env}.js`);

    let hostData = [];

    if (!localData.error) {
      let row = this.getRowString(localData);

      hostData = hostData.concat(row);
    }

    if (!envData.error) {
      let row = this.getRowString(envData);
      hostData = hostData.concat(row);
    }

    this.writeHost(hostData);
  }

  getEnviroment() {
    let config = FileManager.readJson('./files/config.js');

    return config.env;
  }

  getRowString(data) {
    let rowData = [];
    if (process.platform === 'win32') {
      data.forEach(item => {
        let rowString = `${item.ip}\t${item.host}`;

        rowData.push(rowString);
      })
    };
    return rowData;
  }

  writeHost(data) {
    let dataWrite = '';
    let hostPath = '';
    let cmdCode = '';

    if (process.platform === "win32") {
      dataWrite = data.join("\n");
      hostPath = path.resolve(process.env.SystemRoot, 'system32/drivers/etc/hosts');
      cmdCode = 'ipconfig /flushdns';
    }

    fs.writeFileSync(hostPath, dataWrite);

    if (cmdCode) {
      exec(cmdCode, function(error, stdout, stderr) {
        
      });
    }
  }
}

module.exports = new hostManager;
