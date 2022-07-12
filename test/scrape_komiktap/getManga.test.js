const scraper = require('../../App/Scraper/Manhwaid.js');

(async () => {
  
  const data = await scraper.getManga('https://manhwaid.fun/manga/blissville/');
  console.log(data);
  
})();