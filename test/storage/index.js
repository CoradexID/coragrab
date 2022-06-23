const ftp = require("basic-ftp")
require('dotenv').config();

const storage = require(process.env.HOME_DIR + 'App/Storage.js');

(async () => {
  await storage.connectFTP();
  
  try {
    await storage.uploadToWP('/sdcard/image.png', 'oke/woy');
  } catch (e) {}
  
  storage.closeFTP();
})();