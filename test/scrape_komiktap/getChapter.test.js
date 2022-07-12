const scraper = require('../../App/Scraper/Komiktap.js');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

(async () => {
  
  try {
  
  const data = await scraper.getChapter('https://mangayaro.com/my-girlfriend-is-a-villain-chapter-110-bahasa-indonesia/');
  console.log(data);
  
  } catch (e) {
    console.log(e.message);
  }
})();