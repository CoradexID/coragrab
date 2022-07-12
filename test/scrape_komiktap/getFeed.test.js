require('dotenv').config();

const scraper = require('../../App/Scraper/Manhwaid.js');

(async () => {
  
  const data = await scraper.getFeed();
  console.log(data);
  
})();