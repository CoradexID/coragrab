require('dotenv').config();

const scraper = require(process.env.HOME_DIR + 'App/Scraper/' + process.env.MAIN_TARGET + '.js');

(async () => {
  
  const data = await scraper.getFeed();
  console.log(data);
  
})();