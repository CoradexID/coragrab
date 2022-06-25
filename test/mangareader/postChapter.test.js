require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const storage = require(process.env.HOME_DIR + 'App/Storage.js');
const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');

(async () => {
  await storage.connectFTP();

  const db = new Database(storage);
  await db.connectDatabase();
  
  const url = 'https://kiryuu.id/super-smartphone-chapter-3/';
  const mangaId = '595585';
  
  const data = await scraper.getChapter(url);
  data.chapter = '1';
  console.log(data);
  const result = await db.insertChapter(mangaId, data);
  console.log(result);
  
  storage.closeFTP();
  db.closeDatabase();
})();