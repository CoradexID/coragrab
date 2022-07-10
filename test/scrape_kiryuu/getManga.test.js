const scraper = require('../../App/Scraper/Kiryuu.js');

(async () => {
  
  const data = await scraper.getManga('https://kiryuu.id/manga/the-raven-black-hero/');
  console.log(data);
  
})();