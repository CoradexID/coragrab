const ftp = require("basic-ftp")
require('dotenv').config();

(async () => {
  const client = new ftp.Client()
  try {
    await client.access({
      host: process.env.WP_FTP_HOST,
      port: process.env.WP_FTP_PORT,
      user: process.env.WP_FTP_USER,
      password: process.env.WP_FTP_PASS
    })
    await client.ensureDir("test_dir/yolo/oke");
    await client.pwd();
    await client.cd('/');
    await client.pwd();
  }
  catch(err) {
    console.log(err)
  }
  client.close()
})();