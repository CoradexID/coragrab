require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const storage = require(process.env.HOME_DIR + 'App/Storage.js');
const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');

(async () => {
  await storage.connectFTP();

  const db = new Database(storage);
  await db.connectDatabase();

  const url = 'https://kiryuu.id/manga/super-smartphone/';

  const data = await scraper.getManga(url);
  data.title = 'Holy Drown Queen';
  console.log(data);
  const result = await db.insertManga(data);
  console.log(result);

  const chapterData = await scraper.getChapter(data.chapters[0].url);
  chapterData.chapter = '1';
  chapterData.title = data.title + ' Chapter ' + chapterData.chapter;
  console.log(chapterData);
  const chapterResult = await db.insertChapter(result.ID, chapterData);
  console.log(chapterResult);

  storage.closeFTP();
  db.closeDatabase();
})();