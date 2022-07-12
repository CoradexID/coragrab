const axios = require('axios');

(async () => {
  const res = await axios.get(url);
  console.log(res.data);
})();