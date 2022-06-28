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
    const feeds = await scraper.getFeed();

    for (var i = 0; i < feeds.length; i++) {
      if (i == feeds.length - 1) {
        const feed = feeds[i];
        console.log(feed);
        // MANGA CHECKER
        const manga = await db.mangaCheck(feed);
        console.log(manga);

        if (manga.status == 1) {
          console.log('Getting Manga Data');
          const mangaData = await scraper.getManga(feed.url);
          mangaData.title = feed.title;
          console.log('Posting Manga');
          const insertedManga = await db.insertManga(mangaData);
          console.log(insertedManga.post_title);
          for (const chapter of mangaData.chapters) {
            console.log('Getting Chapter Data');
            const chapterData = await scraper.getChapter(chapter.url);
            chapterData.chapter = chapter.chapter;
            console.log('Posting Chapter');
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
    }
  } catch (e) {
    console.log(e.message);
  }

  storage.closeFTP();
  await db.closeDatabase();


  return Promise.resolve(true);
}

(async () => {
  while (true) {
    await run();
    console.log('REST 10 MINUTES');
    await new Promise(resolve => setTimeout(resolve, (60000 * 10)));
  }
})();