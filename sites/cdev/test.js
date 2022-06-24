require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const storage = require(process.env.HOME_DIR + 'App/Storage.js');
const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');


async function run() {
  await storage.connectFTP();
  
  const db = new Database(storage);
  await db.connectDatabase();
  
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (e) {
    console.log(e.message);
  }

  storage.closeFTP();
  db.closeDatabase();
  
  return Promise.resolve(true);
}

(async () => {
  while (true) {
    await run();
    console.log('REST 10 MINUTES');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
})();