const scraper = require('../../App/Scraper/' + process.env.MAIN_TARGET + '.js');

(async () => {
  
  const data = await scraper.getManga('https://mangayaro.com/manga/blend-s/');
  console.log(data);
  
})();