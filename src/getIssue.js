var request = require('request');

var url = 'https://api.github.com/users/SilvesterChiao/repos';

var getIssueOptions = {
  url: url,
  method: 'GET',
  json: true,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
  },
};

function getIssue() {
  return new Promise(function(resolve, reject) {
    var requestC = request.defaults({ jar: true });
    console.log('Step1: get issue via url: ' + url);

    requestC(getIssueOptions, function(error, response, body) {
      if (error) {
        console.log('error occurred: ' + error);
        reject(error);
      }
      body.forEach((item, index) => {
        console.log(`${index + 1}: ${item.name}`);
      });
    });
  });
}

function displayResult(oResult) {
  // console.log(oResult);
  var size = oResult.d.results.length;

  for (var i = 0; i < size; i++) {
    var item = oResult.d.results[i];
    console.log('city: ' + item.City);
    console.log('ContactLevelName: ' + item.ContactLevelName);
  }
}

getIssue();
