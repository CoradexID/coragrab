require('dotenv').config();

const scraper = require('../../App/Scraper/Mangayaro.js');

(async () => {
  
  const data = await scraper.getFeed();
  console.log(data);
  
})();