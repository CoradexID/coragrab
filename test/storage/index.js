const ftp = require("basic-ftp")
require('dotenv').config();

const storage = require(process.env.HOME_DIR + 'App/Storage.js');

(async () => {
  await storage.connectFTP();
  
  try {
    const paths = [
      '/sdcard/image1.png',
      '/sdcard/image2.png',
      '/sdcard/image3.png',
    ];
    await storage.uploadsToStorage(paths, 'oke/woy/');
  } catch (e) {}
  
  storage.closeFTP();
})();