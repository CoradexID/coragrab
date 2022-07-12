const axios = require('axios');
const { JSDOM } = require('jsdom');
const fs = require('fs-extra');
const functions = require('../Functions.js');
require('dotenv').config();

const MAIN_URL = 'https://manhwaid.fun/';

class Scraper {

  async getManga(url, downloadCover = true) {
    fs.emptyDirSync(process.env.DOWNLOAD_LOCAL_PATH);
    const res = await axios.get(url);
    const html = res.data;
    
    const dom = new JSDOM(html).window.document;

    const title = dom.querySelector('.post-title h1').textContent.trim();
    const sinopsys = dom.querySelector('.summary__content p').textContent.trim();
    
    let cover = dom.querySelector('.summary_image a img').src;
    let coverPath = null;
    if (downloadCover) {
      const time = functions.getTime();
      const filename = time.day + time.hour + time.minute + time.seconds + ".jpg";
      const filepath = process.env.DOWNLOAD_LOCAL_PATH + filename;
      await functions.downloadImage(cover, filepath);
      coverPath = filepath;
    }
    
    const alternative = dom.querySelector('.alternative') ? dom.querySelector('.alternative').textContent.trim() : '';
    const score = dom.querySelector('span.score').textContent.trim();
    const tables = dom.querySelectorAll('.post-content_item');

    let [type, status, published, author, artist] = Array(5).fill('');
    for (const table of tables) {
      const innerText = table.textContent;
      if (innerText.includes('Type')) {
        type = innerText.replace('Type', '').trim();
      }
      if (innerText.includes('Status')) {
        status = innerText.replace('Status', '').trim();
      }
      if (innerText.includes('Release')) {
        published = innerText.replace('Release', '').trim();
      }
      if (innerText.includes('Author')) {
        author = innerText.replace('Author', '').trim();
      }
      if (innerText.includes('Artist')) {
        artist = innerText.replace('Artist', '').trim();
      }
    }
    

    const genres = [];
    const genreTabs = dom.querySelectorAll('.genres-content a');
    for (const genre of genreTabs) {
      genres.push(genre.textContent.trim());
    }
    const chapters = [];
    const chapterlist = dom.querySelectorAll('.wp-manga-chapter');
    for (const chapter of chapterlist) {
      console.log(chapter.innerHTML);
      chapters.push({
        chapter: chapter.querySelector('a').textContent.replace('Chapter ', '').trim(),
        url: chapter.querySelector('a').href
      });
    }

    return new Promise((resolve, reject) => {
      resolve({
        title,
        sinopsys,
        cover,
        coverPath,
        score,
        alternative,
        type,
        status,
        author,
        artist,
        published,
        genres,
        chapters: chapters.reverse()
      });
    });

  }

  async getChapter(url, downloadContent = true, options = {}) {
    fs.emptyDirSync(process.env.DOWNLOAD_LOCAL_PATH);
    const res = await axios.get(url);
    const html = res.data;
    const dom = new JSDOM(html).window.document;

    const title = dom.querySelector('.headpost h1').textContent.trim();

    let content = '';
    const sources = [];
    
    const images = dom.querySelectorAll('#readerarea img');
    for (const image of images) {
      let src = image.src;
      sources.push(src);
      if (options.replaceImageDomain) {
        src = functions.replaceDomain(src, options.replaceImageDomain);
      }
      content = content + '<img src="' + src + '"/>';
    }

    const contentPath = [];
    if (downloadContent) {
      const promises = [];
      for (let i = 0; i < sources.length; i++) {
        const src = sources[i];
        const filename = (i + 1) + '.jpg';
        const path = process.env.DOWNLOAD_LOCAL_PATH + filename;
        contentPath.push(path);
        const promise = new Promise((resolve, reject) => {
          functions.downloadImage(src, path)
          .then(resolve)
          .catch((e) => {
            console.log(e);
            resolve();
          });
        });
        promises.push(promise);
      }
      await Promise.all(promises);
    }

    return new Promise((resolve, reject) => {
      resolve({
        title,
        content,
        contentPath,
        sources
      });
    });
  }

  getFeed() {
    return axios.get(MAIN_URL).then((res) => {
      const html = res.data;
      const dom = new JSDOM(html).window.document;

      const mangas = dom.querySelectorAll('.page-listing-item .manga');
      
      const results = [];
      for (const manga of mangas) {
        results.push({
          title: manga.querySelector('a').getAttribute('title'),
          url: manga.querySelector('a').href
        })
      }

      return new Promise((resolve, reject) => {
        resolve(results);
      });
    });
  }

}

module.exports = new Scraper();