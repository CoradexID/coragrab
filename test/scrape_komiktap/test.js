const axios = require('axios');
const { JSDOM } = require('jsdom');

(async () => {
  const res = await axios.get('https://manhwaid.fun/manga/e-romance/chapter-12/');
  const dom = new JSDOM(res.data).window.document;
  const images = dom.querySelector('.reading-content').innerHTML;
  
  console.log(images);
})();