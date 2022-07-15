const axios = require('axios');
const { JSDOM } = require('jsdom');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

(async () => {
  const res = await axios.get('https://194.233.87.209/housewife-day-break-ch-1/');
  const dom = new JSDOM(res.data).window.document;
  const images = dom.querySelectorAll('img');
  
  for (const image of images) {
    console.log(image.src);
  }
  
})();