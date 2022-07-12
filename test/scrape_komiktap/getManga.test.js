const scraper = require('../../App/Scraper/Komiktap.js');

(async () => {
  
  const data = await scraper.getManga('https://194.233.66.232/manga/sextudy-group/');
  console.log(data);
  
})();