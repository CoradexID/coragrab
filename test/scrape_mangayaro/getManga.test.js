const scraper = require('../../App/Scraper/' + 'Mangayaro.js');

(async () => {
  
  const data = await scraper.getManga('https://mangayaro.com/manga/blend-s/');
  console.log(data);
  
})();