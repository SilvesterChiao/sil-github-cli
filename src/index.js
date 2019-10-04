#!/usr/bin/env node

const readline = require('readline');
const program = require('commander');
const request = require('request');
const colors = require('colors');
const ora = require('ora');

program
  .version('0.0.1')
  .option('--repos', 'view repos')
  .parse(process.argv);

if (program.repos) {
  const userName = process.argv[3];
  getRepos(userName);
}

function getRepos(userName) {
  const spinner = ora({
    text: 'Loading'.yellow,
  }).start();
  const optons = {
    url: `https://api.github.com/users/${userName}/repos`,
    method: 'GET',
    json: true,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
    },
  };

  return new Promise(function(resolve, reject) {
    var requestC = request.defaults({ jar: true });

    requestC(optons, function(error, response, body) {
      if (error) {
        spinner.fail('Fail'.red);
        console.log('error occurred: ' + error);
        reject(error);
        process.exit();
      }
      spinner.succeed('Succeed'.green);
      console.log(colors.magenta(`用户${userName}的 public 仓库列表；`));
      body.forEach((item, index) => {
        console.log(colors.blue(`${index + 1}: ${item.name}`));
      });
      process.exit();
    });
  });
}
