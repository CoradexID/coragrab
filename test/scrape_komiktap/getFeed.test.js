require('dotenv').config();

const scraper = require('../../App/Scraper/Komiktap.js');

(async () => {
  
  const data = await scraper.getFeed();
  console.log(data);
  
})();