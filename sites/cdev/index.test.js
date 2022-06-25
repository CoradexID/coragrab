require('dotenv').config();
const functions = require(process.env.HOME_DIR + 'App/Functions.js');
const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');


async function run() {
  console.log('connect');
  
  try {
    const feeds = await scraper.getFeed();
    for (const feed of feeds) {
      console.log(feed);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('ok');
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log('close');
  }

  
  return Promise.resolve(true);
}

(async () => {
  while (true) {
    await run();
    console.log('REST 10 MINUTES');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
})();