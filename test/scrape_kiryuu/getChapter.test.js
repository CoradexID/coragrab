const scraper = require('../../App/Scraper/Kiryuu.js');

(async () => {
  
  try {
  
  const data = await scraper.getChapter('https://kiryuu.id/the-raven-black-hero-chapter-02/', false);
  console.log(data);
  
  } catch (e) {
    console.log(e.message);
  }
})();