require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const storage = require(process.env.HOME_DIR + 'App/Storage.js');
const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');

(async () => {
  await storage.connectFTP();

  const db = new Database(storage);
  await db.connectDatabase();
  
  const data = await scraper.getManga(url);
  console.log(data);
  const result = await db.insertManga(data);
  console.log(result);
  
  storage.closeFTP();
  db.closeDatabase();
})();