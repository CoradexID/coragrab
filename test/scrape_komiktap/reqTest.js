const fs = require('fs');
const client = require('https');

const url = 'https://manhwaid.fun/wp-content/uploads/WP-manga/data/manga_629f6b39c96a7/f981b726ec78f84b583c89ced35b10e4/05.jpg';
const filepath = '/sdcard/test/test.png'

client.get(url, (res) => {
  if (res.statusCode === 200) {
    res.pipe(fs.createWriteStream(filepath))
    .on('error', (err) => reject(new Error('error when save image')))
    .once('close', () => resolve(filepath));
  } else {
    // Consume response data to free up memory
    res.resume();
    reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
  }
})
.on('error', (err) => {
  console.log(err);
  reject(new Error('Error when scrape image'));
});