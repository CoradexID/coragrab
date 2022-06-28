const ftp = require('basic-ftp');
require('dotenv').config();

const functions = require('./Functions.js');

class Storage {

  constructor() {
    this.wp = new ftp.Client();
    this.storage = new ftp.Client();
  }

  async connectFTP() {
    await this.wp.access({
      host: process.env.WP_FTP_HOST,
      port: process.env.WP_FTP_PORT,
      user: process.env.WP_FTP_USER,
      password: process.env.WP_FTP_PASS,
    });
    await this.storage.access({
      host: process.env.STORAGE_FTP_HOST,
      port: process.env.STORAGE_FTP_PORT,
      user: process.env.STORAGE_FTP_USER,
      password: process.env.STORAGE_FTP_PASS,
    });
    this.wp.ftp.verbose = true;
    return Promise.resolve(true);
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