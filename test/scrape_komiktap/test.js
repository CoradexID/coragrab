const axios = require('axios');

(async () => {
  const res = await axios.get('https://manhwaid.fun/manga/e-romance/chapter-12/');
  console.log(res.data);
})();