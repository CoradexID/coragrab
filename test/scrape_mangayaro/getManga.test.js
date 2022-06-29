require('dotenv').config();

const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');

(async () => {
  
  const data = await scraper.getManga('https://mangayaro.com/manga/blend-s/');
  console.log(data);
  
})();