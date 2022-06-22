require('dotenv').config();
process.env.TZ = 'Etc/Universal';
const mysql = require('mysql');
const util = require('util');
const fs = require('fs-extra');
const functions = require('../Functions.js');

class Database {

  constructor(storage) {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    this.query = util.promisify(this.connection.query).bind(this.connection);
    this.storage = storage;
  }
  
  connectDatabase() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        err ? reject(err) : resolve(true);
      });
    });
  }

  closeDatabase() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        err ? reject(err) : resolve(true);
      });
    });
  }
  
  async insertManga(data, setFeaturedImage = true) {
    // DECLARING VARIABLES
    const query = this.query;
    const nowtime = functions.getTimestamps();
    
    const postData = {
        post_author: process.env.WP_AUTHOR_ID,
        post_date: nowtime,
        post_date_gmt: nowtime,
        post_content: data.sinopsys,
        post_title: data.title,
        post_excerpt: '',
        post_status: 'publish',
        comment_status: 'open',
        ping_status: 'closed',
        post_password: '',
        post_name: functions.toSlug(data.title),
        to_ping: '',
        pinged: '',
        post_modified: nowtime,
        post_modified_gmt: nowtime,
        post_content_filtered: '',
        post_parent: 0,
        guid: '',
        menu_order: 0,
        post_type: 'series',
        post_mime_type: '',
        comment_count: 0
      };
    const post = await query('INSERT INTO wp_posts SET ?', postData);
    
    const createSerie = new Promise(async (resolve, reject) => {
      try {
        console.log('create serie');
        const guid = process.env.HOME_URL + '?post_type=series&#038;p=' + post.insertId;
        await query('UPDATE wp_posts SET guid = ? WHERE id = ?', [guid, post.insertId]);
        const term_data = { name: data.title, slug: functions.toSlug(data.title) };
        const term = await query('INSERT INTO wp_terms SET ?', term_data);
        const taxonomy_data = {
          term_id: term.insertId,
          taxonomy: 'seri',
          description: '',
          count: 0
        }
        const taxonomy = await query('INSERT INTO wp_term_taxonomy SET ?', taxonomy_data);
        const relationships_data = {
          object_id: post.insertId,
          term_taxonomy_id: taxonomy.insertId
        }
        await query('INSERT INTO wp_term_relationships SET ?', relationships_data);
        console.log('create serie complete');
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
    
    const createMeta = new Promise(async (resolve, reject) => {
      try {
        // ONLY ZMANGA
        console.log('create meta');
        let cover = data.cover;
        
        if (setFeaturedImage) {
          console.log('upload');
          const image = await this.uploadImage(data.coverPath, post.insertId);
          console.log('set');
          await this.setFeaturedImage(post.insertId, image.ID);
          console.log('set done');
          // ONLY ZMANGA
          cover = image.guid;
        }
        
        const metas_data = [
          [post.insertId, 'oxy_coverurl', cover],
          [post.insertId, 'oxy_title', data.title],
          [post.insertId, 'oxy_alternative', data.alternative],
          [post.insertId, 'oxy_type', data.type],
          [post.insertId, 'oxy_status', data.status],
          [post.insertId, 'oxy_author', data.author],
          [post.insertId, 'oxy_artist', data.artist],
          [post.insertId, 'oxy_published', data.published],
          [post.insertId, 'oxy_score', data.score],
          [post.insertId, 'oxy_project', 'No'],
          [post.insertId, 'oxy_adult', 'No'],
        ]
        
        await query('INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES ?', [metas_data]);
        console.log('create meta complete');
        resolve(true);
      } catch (e) {
        reject(e);
      }
    }); 
    
    const createCategory = new Promise(async (resolve, reject) => {
      try {
        console.log('create category');
        if (!data.genres[0]) {
          resolve(true);
          return;
        }
        
        const terms = data.genres.map(genre => genre);
        
        const categoryExist = await query('SELECT * FROM wp_terms WHERE name IN (?)', [terms]);
        const categoryCheck = categoryExist.map(value => value.name);
        const categoryNotExist = terms.filter(value => !categoryCheck.includes(value));
        
        for (const category of categoryExist) {
          const taxonomy = await query('SELECT * FROM wp_term_taxonomy WHERE term_id = ?', [category.term_id]);
          const relationships_data = {
            object_id: post.insertId,
            term_taxonomy_id: taxonomy[0].term_taxonomy_id
          }
          const relationships = await query('INSERT INTO wp_term_relationships SET ?', [relationships_data]);
          await query('UPDATE wp_term_taxonomy SET count = ? WHERE term_id = ?', [(taxonomy[0].count + 1), taxonomy[0].term_id]);
        }
        
        for (const category of categoryNotExist) {
          const term_data = { name: category, slug: functions.toSlug(category) };
          const term = await query('INSERT INTO wp_terms SET ?', term_data);
          const taxonomy_data = {
            term_id: term.insertId,
            taxonomy: 'genre',
            description: '',
            count: 1
          }
          const taxonomy = await query('INSERT INTO wp_term_taxonomy SET ?', taxonomy_data);
          const relationships_data = {
            object_id: post.insertId,
            term_taxonomy_id: taxonomy.insertId
          }
          await query('INSERT INTO wp_term_relationships SET ?', relationships_data);
        }
        
        console.log('create category complete');
        resolve(true);
      } catch (e) {
        reject(e);
      }
    }); 

    await Promise.all([createSerie,createMeta, createCategory]);
    
    const result = await query('SELECT * FROM wp_posts WHERE ID = ?', [post.insertId]);
    return Promise.resolve(result[0]);
  }

  async insertChapter(mangaId, data, uploadContent = true) {
    // DECLARING VARIABLES
    const query = this.query;
    const nowtime = functions.getTimestamps();
    let content = data.content;
    
    const serie = await query('SELECT * FROM wp_posts WHERE id = ?', [mangaId]);
    
    if (uploadContent) {
      const slug = serie[0].post_name;
      const ch_slug = functions.toSlug(data.chapter);
      const alphabet = slug[0];
      const destination = alphabet + '/' + slug + '/' + ch_slug + '/'; 
      
      let contents = data.contentPath.map((path) => {
        const filename = path.split('/').pop();
        const filepath = destination + filename;
        const src = process.env.STORAGE_URL + filepath;
        return '<img src="' + src + '"/>';
      });
      contents = contents.join('');
      content = contents;
      
      await this.storage.uploadsToStorage(data.contentPath, destination);
    }

    // INSERT TO wp_posts
    const post_data = {
      post_author: process.env.WP_AUTHOR_ID,
      post_date: nowtime,
      post_date_gmt: nowtime,
      post_content: content,
      post_title: data.title,
      post_excerpt: '',
      post_status: 'publish',
      comment_status: 'open',
      ping_status: 'open',
      post_password: '',
      post_name: functions.toSlug(data.title),
      to_ping: '',
      pinged: '',
      post_modified: nowtime,
      post_modified_gmt: nowtime,
      post_content_filtered: '',
      post_parent: 0,
      guid: '',
      menu_order: 0,
      post_type: 'post',
      post_mime_type: '',
      comment_count: 0
    }
    const post = await query('INSERT INTO wp_posts SET ?', post_data);
    
    const createGuid = new Promise(async (resolve, reject) => {
      const guid = process.env.HOME_URL + '?p=' + post.insertId;
      await query('UPDATE wp_posts SET guid = ? WHERE id = ?', [guid, post.insertId]);
      resolve(true);
    });
    
    const createMeta = new Promise(async (resolve, reject) => {
      const metas_data = [
        [post.insertId, 'oxy_ch', data.chapter],
        [post.insertId, 'oxy_series', mangaId],
      ]
      
      await query('INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES ?', [metas_data]);
      resolve(true);
    }); 
    
    const createChapter = new Promise(async (resolve, reject) => {
      const serie_term = await query('SELECT * FROM wp_terms WHERE slug = ?', [serie[0].post_name]);
      const serie_taxonomy = await query('SELECT * FROM wp_term_taxonomy WHERE term_id = ?', [serie_term[0].term_id]);
      const relationships_data = {
        object_id: post.insertId,
        term_taxonomy_id: serie_taxonomy[0].term_taxonomy_id
      }
      await query('INSERT INTO wp_term_relationships SET ?', [relationships_data]);
      await Promise.all([
        query('UPDATE wp_term_taxonomy SET count = ? WHERE term_taxonomy_id = ?', [(serie_taxonomy[0].count + 1), serie_taxonomy[0].term_taxonomy_id]),
        query('UPDATE wp_posts SET post_modified = ?, post_modified_gmt = ? WHERE id = ?', [nowtime, nowtime, serie[0].ID])
      ]);
      resolve(true);
    });
    
    await Promise.all([createGuid, createMeta, createChapter]);
    const result = await query('SELECT * FROM wp_posts WHERE ID = ?', [post.insertId]);
    return Promise.resolve(result[0]);
  }

  async PJCheck(data) {
    const slug = data.url.split('/')[4];

    let post = await this.query('SELECT * FROM wp_posts p JOIN wp_postmeta m ON p.ID = m.post_id WHERE post_title = ? AND meta_key = ?', [data.title, 'oxy_project']);

    if (!post[0]) {
      post = await this.query('SELECT * FROM wp_posts p JOIN wp_postmeta m ON p.ID = m.post_id WHERE post_name = ? AND meta_key = ?', [slug, 'oxy_project']);
      if (!post[0]) return false;
      return post[0].meta_value == 'Yes' ? true: false;
    }

    return Promise.resolve(post[0].meta_value == 'Yes' ? true: false);
  }

  async mangaCheck(data) {
    const slug = data.url.split('/')[4];

    let post = await this.query('SELECT * FROM wp_posts WHERE post_title = ?', [data.title]);

    // IF DUPLICATE
    if (post[1]) return {
      status: 2,
      message: 'Duplicate'
    };

    // IF PROJECT
    const project = await this.PJCheck(data);
    if (project) return {
      status: 3,
      message: 'Project'
    };

    if (!post[0]) {
      post = await this.query('SELECT * FROM wp_posts WHERE post_name = ?', [slug]);
      if (!post[0]) return {
        status: 1,
        message: 'Not Exist'
      };
    }

    return {
      status: 0,
      message: 'Exist',
      data: post[0]
    };
  }

  async chapterCheck(id, data) {

    let posts = await this.query('SELECT post_id FROM wp_postmeta WHERE meta_key = ? AND meta_value = ?', ['oxy_series', id]);

    const result_array = posts.map((item) => item.post_id);
    if (!result_array[0]) return data.chapters;
    
    posts = await this.query('SELECT meta_value FROM wp_postmeta WHERE post_id IN (?) AND meta_key = ?', [result_array, 'oxy_ch']);

    const chapters = posts.map((item) => item.meta_value);

    const results = [];
    for (const chapter of data.chapters) {
      if (!chapters.includes(chapter.chapter)) {
        results.push(chapter);
      }
    }

    return results;
  }
  
  async uploadImage(imagePath, postParent = 0) {
    const time = functions.getTime();
    const nowtime = functions.getTimestamps();
    const filename = 'i' + time.day + time.hour + time.minute + time.seconds;
    const path = time.year + '/' + time.month + '/' + filename + '.jpg';
    const filepath = path;
    console.log(imagePath, filepath);
    await this.storage.uploadToWP(imagePath, filepath);
    console.log('Upload done');
    
    const post_data = {
      post_author: process.env.WP_AUTHOR_ID,
      post_date: nowtime,
      post_date_gmt: nowtime,
      post_content: '',
      post_title: filename,
      post_excerpt: '',
      post_status: 'inherit',
      comment_status: 'open',
      ping_status: 'closed',
      post_password: '',
      post_name: filename,
      to_ping: '',
      pinged: '',
      post_modified: nowtime,
      post_modified_gmt: nowtime,
      post_content_filtered: '',
      post_parent: postParent,
      guid: process.env.HOME_URL + 'wp-content/uploads/' + path,
      menu_order: 0,
      post_type: 'attachment',
      post_mime_type: 'image/jpeg',
      comment_count: 0
    }
    const post = await this.query('INSERT INTO wp_posts SET ?', [post_data]);
    const meta_data = {post_id: post.insertId, meta_key: '_wp_attached_file', meta_value: path}
    await this.query('INSERT INTO wp_postmeta SET ?', [meta_data])
    
    const result = await this.query('SELECT * FROM wp_posts WHERE id = ?', [post.insertId]); 
    return Promise.resolve(result[0]);
  }
  
  async setFeaturedImage(post_id, image_id) {
    const meta_data = {post_id, meta_key: '_thumbnail_id', meta_value: image_id}
    await this.query('INSERT INTO wp_postmeta SET ?', [meta_data])
    return Promise.resolve(true);
  }

}

module.exports = Database;

