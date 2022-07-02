const scraper = require('../../App/Scraper/Mangayaro.js');

(async () => {
  
  const data = await scraper.getManga('https://mangayaro.com/manga/the-raven-black-hero/');
  console.log(data);
  
})();