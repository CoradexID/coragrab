const ftp = require("basic-ftp")
require('dotenv').config();

const storage = require(process.env.HOME_DIR + 'App/Storage.js');

(async () => {
  console.log(process.env);
  await storage.connectFTP();
  
  try {
    await storage.uploadToWP('/sdcard/image.png', 'oke/woy/test1.png');
    await storage.uploadToWP('/sdcard/image.png', 'oke/woy/test2.png');
  } catch (e) {}
  
  storage.closeFTP();
})();