const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const functions = require('../Functions.js');
require('dotenv').config();

const MAIN_URL = 'https://mangayaro.com/';

class Scraper {

  async getManga(url, downloadCover = true) {
    fs.emptyDirSync(process.env.DOWNLOAD_LOCAL_PATH);
    const res = await axios.get(url);
    const html = res.data;
    const $ = cheerio.load(html);

    const title = $('.entry-title').text();
    const sinopsys = $('div[itemprop="description"] p').text();
    const cover = $('.thumb img').attr('src');
    let coverPath = null;
    if (downloadCover) {
      const time = functions.getTime();
      const filename = time.day + time.hour + time.minute + time.seconds + ".jpg";
      const filepath = process.env.DOWNLOAD_LOCAL_PATH + filename;
      await functions.downloadImage(cover, filepath);
      coverPath = filepath;
    }
    const alternative = $('.alternative').text().trim();
    const score = $('div[itemprop="ratingValue"]').text().trim();
    const tables = $('.tsinfo .imptdt');

    let [type,
      status,
      published,
      author,
      artist] = Array(5).fill('');
    tables.each(function(v, i) {
      const innerText = $(this).text();
      if (innerText.includes('Type')) {
        type = innerText.replace('Type', '').trim();
      }
      if (innerText.includes('Status')) {
        status = innerText.replace('Status', '').trim();
      }
      if (innerText.includes('Released')) {
        published = innerText.replace('Released', '').trim();
      }
      if (innerText.includes('Author')) {
        author = innerText.replace('Author', '').trim();
      }
      if (innerText.includes('Artist')) {
        artist = innerText.replace('Artist', '').trim();
      }
    });

    const genres = [];
    const genreTabs = $('.info-desc .mgen a');
    genreTabs.each(function(v, i) {
      genres.push($(this).text().trim());
    });

    const chapters = $('#chapterlist ul li').map((i, el) => {
      return {
        chapter: $(el).find('a .chapternum').text().replace('Chapter ', ''),
        url: $(el).find('a').attr('href'),
      }
    }).get().reverse();

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
        chapters
      });
    });

  }

  async getChapter(url, downloadContent = true, options = {}) {
    fs.emptyDirSync(process.env.DOWNLOAD_LOCAL_PATH);
    const res = await axios.get(url);
    const html = res.data;
    const $ = cheerio.load(html);

    const a = html.split('<div id="readerarea"><noscript>')[1];
    const b = a.split('</noscript></div>')[0];
    const s = cheerio.load(b);


    const title = $('.headpost h1').text().trim();

    let content = '';
    const sources = [];
    const images = s('p img');
    images.each(function(v, i) {
      let src = $(this).attr('src');
      sources.push(src);
      if (options.replaceImageDomain) {
        src = functions.replaceDomain(src, options.replaceImageDomain);
      }
      content = content + '<img src="' + src + '"/>';
    });

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
      const $ = cheerio.load(html);

      const upd = $('.listupd');

      const results = [];
      upd.each(function(v, i) {
        if (v == 2) {
          const manga = $(this).find('.utao .imgu a.series');
          manga.each(function(v, i) {
            const title = $(this).attr('title');
            const url = $(this).attr('href');
            results.push({
              title, url
            });
          });
        }
      });

      return new Promise((resolve, reject) => {
        resolve(results);
      });
    });
  }

}

module.exports = new Scraper();