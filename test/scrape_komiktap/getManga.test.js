const scraper = require('../../App/Scraper/Komiktap.js');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

(async () => {
  
  const data = await scraper.getManga('https://194.233.66.232/manga/sextudy-group/');
  console.log(data);
  
})();