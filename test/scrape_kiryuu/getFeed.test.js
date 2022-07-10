
const scraper = require('../../App/Scraper/Kiryuu.js');

(async () => {
  
  const data = await scraper.getFeed();
  console.log(data);
  
})();