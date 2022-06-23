const ftp = require('ftp-basic');
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
    await this.storage.connect({
      host: process.env.STORAGE_FTP_HOST,
      port: process.env.STORAGE_FTP_PORT,
      user: process.env.STORAGE_FTP_USER,
      password: process.env.STORAGE_FTP_PASS,
    });
    return Promise.resolve(true);
  }

  async uploadToWP(imagePath, path) {
    const wp = this.wp;

    let folders = path.split('/');
    folders.pop();
    folders = folders.join('/');

    await wp.ensureDir(folders);
    await wp.cd('/');

    await wp.uploadFrom(imagePath, path);

    return Promise.resolve(true);
  }

  async uploadsToStorage(paths, destination) {
    const storage = this.storage;
    const promises = [];

    for (const path of paths) {
      const filename = path.split('/').pop();
      const filepath = destination + filename;
      
      await uploadFrom(path, filepath);
    }
    
    return Promise.resolve(true);
  }

}

module.exports = new Storage();