process.on('SIGINT', async () => {
  console.log('UDAHAN');
  storage.end();
});

require('dotenv').config();
const storage = require('./App/Storage.js');
const Database = require('./App/Database/' + process.env.MAIN_THEME + '.js');
const db = new Database(storage);
const scraper = require('./App/Scraper/' + process.env.MAIN_TARGET + '.js');

const url = 'https://kiryuu.id/the-newbie-is-too-strong-chapter-3/';
const chapter = '3';

(async () => {
  storage.connect();
  db.connection.connect();
  
  const data = await scraper.getChapter(url);
  data.chapter = chapter;
  
  const result = await db.insertChapter(6, data);
  console.log(result);
  
  console.log('udahan');
  storage.end();
  db.connection.end();
})();