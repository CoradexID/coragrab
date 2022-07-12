const scraper = require('../../App/Scraper/Komiktap.js');

(async () => {
  
  const data = await scraper.getManga('https://mangayaro.com/manga/the-raven-black-hero/');
  console.log(data);
  
})();