require('dotenv').config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const scraper = require('../../App/Scraper/Komiktap.js');

(async () => {
  
  const data = await scraper.getFeed();
  console.log(data);
  
})();