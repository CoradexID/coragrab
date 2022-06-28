const ftp = require('basic-ftp');
require('dotenv').config();

const functions = require('./Functions.js');

class Storage {

  constructor(config) {
    this.client = new ftp.Client();
    this.config = config;
  }

  async connectFTP() {
    await this.client.access({
      host: this.config.host,
      user: this.config.user,
      password: this.config.password,
      port: this.config.port,
    });
    
    return Promise.resolve(true);
    
    // await this.client.access({
    //   host: process.env.WP_FTP_HOST,
    //   port: process.env.WP_FTP_PORT,
    //   user: process.env.WP_FTP_USER,
    //   password: process.env.WP_FTP_PASS,
    // });
  }
  
  async checkConnection() {
    if (this.client.closed) {
      await this.connectFTP();
      return Promise.Resolve('Closed & Successfully Reconnected');
    }
    return Promise.resolve('Not Closed');
  }
  
  closeFTP() {
    this.client.close();
  }

  async uploadSingle(imagePath, path) {
    let folders = path.split('/');
    folders.pop();
    folders = folders.join('/');

    await this.client.ensureDir(folders);
    await this.client.cd('/');

    await this.client.uploadFrom(imagePath, path);

    return Promise.resolve(true);
  }

  async uploadMultiple(paths, destination) {
    await this.client.ensureDir(destination);
    await this.client.cd('/');

    for (const path of paths) {
      try {
        const filename = path.split('/').pop();
        const filepath = destination + filename;
        
        await this.client.uploadFrom(path, filepath);
      } catch (e) {
        console.log(e.message);
      }
    }
    
    return Promise.resolve(true);
  }

}

module.exports = new Storage();