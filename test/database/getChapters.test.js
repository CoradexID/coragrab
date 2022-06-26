require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const storage = require(process.env.HOME_DIR + 'App/Storage.js');
const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');


async function run() {
  const db = new Database();
  await db.connectDatabase();
  
  const chapters = await db.getChapters('586641');
  console.log(chapters);
  
  db.closeDatabase();
  
  return Promise.resolve(true);
}

(async () => {
  await run();
})();