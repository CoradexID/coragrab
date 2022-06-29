require('dotenv').config();

const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');

(async () => {
  
  const data = await scraper.getChapter('https://mangayaro.com/blend-s-chapter-01/', false);
  console.log(data);
  
})();