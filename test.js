process.on('SIGINT', async () => {
  console.log('UDAHAN');
  storage.end();
});

require('dotenv').config();
const storage = require('./App/Storage.js');
const Database = require('./App/Database/' + process.env.MAIN_THEME + '.js');
const db = new Database(storage);
const scraper = require('./App/Scraper/' + process.env.MAIN_TARGET + '.js');

const url = 'https://kiryuu.id/manga/how-to-kill-a-god/';

(async () => {
  storage.connect();
  db.connection.connect();
  
  const data = await scraper.getManga(url);
  
  const result = await db.insertManga(data);
  console.log(result);
  
  console.log('udahan');
  storage.end();
  db.connection.end();
})();