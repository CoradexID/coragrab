const scraper = require('../../App/Scraper/Mangayaro.js');

(async () => {
  
  try {
  
  const data = await scraper.getChapter('https://mangayaro.com/blend-s-chapter-48-bahasa-indonesia/', false, {replaceImageDomain: process.env.MIRROR_URL});
  console.log(data);
  
  } catch (e) {
    console.log(e.message);
  }
})();