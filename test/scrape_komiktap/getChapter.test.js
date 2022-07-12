const scraper = require('../../App/Scraper/Komiktap.js');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

(async () => {
  
  try {
  
  const data = await scraper.getChapter('https://194.233.66.232/sextudy-group-chapter-28/');
  console.log(data);
  
  } catch (e) {
    console.log(e.message);
  }
})();