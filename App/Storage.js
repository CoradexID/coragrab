const ftp = require('basic-ftp');
require('dotenv').config();

const functions = require('./Functions.js');

class Storage {

  constructor(options) {
    this.client = new ftp.Client();
    this.options = options;
    
    this.host = this.options.host;
    this.user = this.options.user;
    this.password = this.options.password;
    this.port = this.options.port;
  }

  async connectFTP() {
    await this.storage.access({
      host: process.env.STORAGE_FTP_HOST,
      port: process.env.STORAGE_FTP_PORT,
      user: process.env.STORAGE_FTP_USER,
      password: process.env.STORAGE_FTP_PASS,
    });
    
    this.wp.ftp.verbose = true;
    return Promise.resolve(true);
    
    // await this.wp.access({
    //   host: process.env.WP_FTP_HOST,
    //   port: process.env.WP_FTP_PORT,
    //   user: process.env.WP_FTP_USER,
    //   password: process.env.WP_FTP_PASS,
    // });
  }
  
  closeFTP() {
    this.wp.close();
    this.storage.close();
  }

  async uploadToWP(imagePath, path) {
    let folders = path.split('/');
    folders.pop();
    folders = folders.join('/');

    await this.wp.ensureDir(folders);
    await this.wp.cd('/');

    await this.wp.uploadFrom(imagePath, path);

    return Promise.resolve(true);
  }

  async uploadToStorage(paths, destination) {
    await this.storage.ensureDir(destination);
    await this.storage.cd('/');

    for (const path of paths) {
      try {
        const filename = path.split('/').pop();
        const filepath = destination + filename;
        
        await this.storage.uploadFrom(path, filepath);
      } catch (e) {
        console.log(e.message);
      }
    }
    
    return Promise.resolve(true);
  }

}

module.exports = new Storage();