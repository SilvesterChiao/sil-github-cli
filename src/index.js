#!/usr/bin/env node
// #!/usr/bin/node
const readline = require('readline');
const request = require('request');

var colors = require('colors');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('你想对谁说声hello？ '.red, answer => {
  getRepository(answer);
  //   var e = request(
  //     {
  //       url: 'https://api.github.com/users/SilvesterChiao/repos',
  //       method: 'GET',
  //       headers: { 'Content-Type': 'text/json' },
  //     },
  //     function(error, response, body) {
  //       if (!error && response.statusCode == 200) {
  //         console.log(response);
  //         // res.render('task',{'data':JSON.parse(body) } );
  //       }
  //     },
  //   );
});

function getRepository(userName) {
  return new Promise(function(resolve, reject) {
    const url = `https://api.github.com/users/${userName}/repos`;
    request(url, function(error, response, body) {
      console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        const { data } = JSON.parse(body);
        if (data && data.length !== 0) {
          data.map(item => {
            console.log(`Name: ${item.name}`);
            // console.log(`URL: ${item.URL}`);
          });
        }
      }
    });
    rl.close();

    // request(
    //   {
    //     url: `https://api.github.com/users/${userName}/repos`,
    //     method: 'GET',
    //     json: true,
    //     headers: {
    //       'User-Agent':
    //         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
    //     },
    //   },
    //   function(error, response, body) {
    //     if (error) {
    //       console.log('error occurred: ' + error);
    //       reject(error);
    //     }
    //     console.log(body);
    //   },
    // );
  });
}
