const { default : axios } = require('axios');

const url = 'https://mangayaro.com/martial-artist-lee-gwak-chapter-79-bahasa-indonesia/';

(async() => {
  const data = await axios.get(url);
  console.log(data);
})();
