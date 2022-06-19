const fs = require('fs');
const Ftp = require('ftp');

const functions = require('./Functions.js');
require('dotenv').config();


class Storage {

  constructor() {
    this.wp = new Ftp();
    this.storage = new Ftp();
  }
  
  connect() {
    this.wp.connect({
      host: process.env.WP_FTP_HOST,
      port: process.env.WP_FTP_PORT,
      user: process.env.WP_FTP_USER,
      password: process.env.WP_FTP_PASS,
    });
    this.storage.connect({
      host: process.env.STORAGE_FTP_HOST,
      port: process.env.STORAGE_FTP_PORT,
      user: process.env.STORAGE_FTP_USER,
      password: process.env.STORAGE_FTP_PASS,
    });
  }
  
  end() {
    this.storage.end();
    this.wp.end();
  }

  uploadToWP(imagePath, path) {
    const wp = this.wp;
    return new Promise((resolve, reject) => {
      let folders = path.split('/');
      folders.pop();
      folders = folders.join('/');

      wp.mkdir(folders, true, function (err) {
        if (err) reject(err);
        wp.put(imagePath, path, function(err) {
          if (err) reject(err);
          resolve(true);
        })
      });
    })
  }
  
  async uploadsToStorage(paths, destination) {
    const storage = this.storage;
    let contents = '';
    const promises = [];
    
    await new Promise((resolve) => {
      storage.mkdir(destination, true, () => {
        for (const path of paths) {
          const filename = path.split('/').pop();
          const filepath = destination + filename;
          const src = process.env.STORAGE_URL + filepath;
          console.log(src);
          contents = contents + '<img src="' + src + '"/>';
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
    return Promise.resolve(contents);
  }

}

module.exports = new Storage();