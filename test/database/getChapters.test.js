const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');


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