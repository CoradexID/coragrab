const ftp = require("basic-ftp")
require('dotenv').config();

const storage = require(process.env.HOME_DIR + 'App/Storage.js');

(async () => {
  await storage.connectFTP();
  
  try {
    await storage.uploadToWP('/sdcard/image1.png', 'oke/woy/image1.png');
  } catch (e) {}
  
  storage.closeFTP();
})();