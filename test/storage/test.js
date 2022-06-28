var ftp = require("basic-ftp");

(async() => {
  const wp = new ftp.Client(0);
  
  wp.access({
    host: "185.193.66.3",
    user: "corawp",
    password: "corawp",
    port: "21"
  });
  
  await wp.cd('/');
  
  wp.close();
})();