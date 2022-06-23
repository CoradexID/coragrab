process.on('SIGINT', async () => {
  storage.closeFTP();
  db.closeDatabase();
});

require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const storage = require(process.env.HOME_DIR + 'App/Storage.js');
const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');


(async () => {
  await storage.connectFTP();
  const db = new Database(storage);
  await db.connectDatabase();
  
  const url = 'https://kiryuu.id/manga/xuantian-supreme/';
  
  const data = await scraper.getManga(url);
  await db.insertManga(data);
  
  storage.closeFTP();
  db.closeDatabase();
})();