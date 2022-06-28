var ftp = require("basic-ftp");

(async() => {
  const wp = new ftp.Client();
  
  console.log(wp.closed);
})();