const scraper = require('../../App/Scraper/Kiryuu.js');

(async () => {
  
  const data = await scraper.getManga('https://kiryuu.id/manga/blend-s/');
  console.log(data);
  
})();