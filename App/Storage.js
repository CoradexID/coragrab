const fs = require('fs');
const Ftp = require('ftp');

const functions = require('./Functions.js');
require('dotenv').config();


class Storage {

  constructor() {
    this.wp = new Ftp();
    this.storage = new Ftp();
  }
  
  async connectFTP() {
    this.wp.connect({
      host: process.env.WP_FTP_HOST,
      port: process.env.WP_FTP_PORT,
      user: process.env.WP_FTP_USER,
      password: process.env.WP_FTP_PASS,
      keepalive: 5000
    });
    this.storage.connect({
      host: process.env.STORAGE_FTP_HOST,
      port: process.env.STORAGE_FTP_PORT,
      user: process.env.STORAGE_FTP_USER,
      password: process.env.STORAGE_FTP_PASS,
      keepalive: 5000
    });
    await this.checkConnection(this.wp);
    await this.checkConnection(this.storage);
    return Promise.resolve(true);
  }
  
  closeFTP() {
    this.storage.end();
    this.wp.end();
  }
  
  checkConnection(ftp) {
    return new Promise((resolve) => {
      ftp.on('ready', resolve(true));
    });
  }

  async uploadToWP(imagePath, path) {
    const wp = this.wp;
    console.log('Uploadtowp');
    let folders = path.split('/');
    folders.pop();
    folders = folders.join('/');
    
    wp.status((err, status) => {
      if (err) throw err;
      console.log(status);
    });
    
    console.log('A');
    await new Promise((resolve, reject) => {
      wp.mkdir(folders, true, function (err) {
        if (err) console.log(err);
    console.log('B');
        wp.put(imagePath, path, function(err) {
          if (err) console.log(err);
    console.log('C');
          resolve(true);
        })
      });
    });
    
    return Promise.resolve(true);
  }
  
  async uploadsToStorage(paths, destination) {
    const storage = this.storage;
    const promises = [];
    
    await new Promise((resolve) => {
      storage.mkdir(destination, true, () => {
        for (const path of paths) {
          const filename = path.split('/').pop();
          const filepath = destination + filename;
          const func = new Promise((resolve) => {
            storage.put(path, filepath, (e) => {
              if (e) console.log(e);
              resolve();
            });
          });
          promises.push(func);
        }
        resolve(true);
      });
    })
    
    await Promise.all(promises);
    return Promise.resolve(true);
  }

}

module.exports = new Storage();