process.on('SIGINT', async () => {
  storage.closeFTP();
  db.closeDatabase();
});

require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const storage = require(process.env.HOME_DIR + 'App/Storage.js');
const Database = require(process.env.HOME_DIR + 'App/Database/' + process.env.MAIN_THEME + '.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');

const db = new Database(storage);

(async () => {
  await storage.connectFTP();
  await db.connectDatabase();
  
  try {
    while (true) {
      const feeds = await scraper.getFeed();
      for (const feed of feeds) {
        console.log(feed);
        // MANGA CHECKER
        const manga = await db.mangaCheck(feed);
        console.log(manga);
        if (manga.status == 1) {
          const mangaData = await scraper.getManga(feed.url);
          mangaData.title = feed.title;
          const insertedManga = await db.insertManga(mangaData);
          console.log(insertedManga.post_title);
          for (const chapter of mangaData.chapters) {
            const chapterData = await scraper.getChapter(chapter.url);
            chapterData.chapter = chapter.chapter;
            const insertedChapter = await db.insertChapter(insertedManga.ID, chapterData);
            console.log(insertedChapter.post_title);
          }
        }

        if (manga.status == 0) {
          const mangaData = await scraper.getManga(feed.url);
          const chapters = await db.chapterCheck(manga.data.ID, mangaData);
          for (const chapter of chapters) {
            const chapterData = await scraper.getChapter(chapter.url);
            chapterData.chapter = chapter.chapter;
            const insertedChapter = await db.insertChapter(manga.data.ID, chapterData);
            console.log(insertedChapter.post_title);
          }
        }
      }

      console.log('REST 5 MINUTES...');
      await new Promise(resolve => setTimeout(resolve, (60000 * 5)));

    }
  } catch (e) {
    console.log(e.message);
  }
  
  storage.closeFTP();
  db.closeDatabase();
})();