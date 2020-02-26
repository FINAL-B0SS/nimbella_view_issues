// jshint esversion: 9

/**
 * @description null
 * @param {ParamsType} params list of command parameters
 * @param {?string} commandText text message
 * @param {!object} [secrets = {}] list of secrets
 * @return {Promise<SlackBodyType>} Response body
 */

var XMLHttpRequest;

async function install(pkgs) {
  
  pkgs = pkgs.join(' ');
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    exec(`npm install ${pkgs}`, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
  
function fetchIssues(status, secrets) {
  
  var url = `https://gitlab.com/api/v4/issues?state=${status}&access_token=${secrets.AcessToken_GitLab}`;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false );
  xmlHttp.send( null );
  return JSON.parse(xmlHttp.responseText);
}
  
function formatIssueText(issues) {
  
  if (issues.error)
    return null;
  var text = '';
  issues.forEach(issue => {
    text +=
      `\`\`\`Title: ${issue.title}
Description: ${issue.description}
Status: ${issue.state}
Author: ${issue.author ?  issue.author.name : 'undefined'}
Asignee: ${issue.assignee ? issue.assignee.name : 'undefined'}
Issue URL: ${issue.web_url}\`\`\`\n`;
  });
  return text;
}

async function _command(params, commandText, secrets = {}) {
  
  const {
    status
  } = params;
  
  if (!XMLHttpRequest) {
    let packages = [ 'xmlhttprequest' ];
    await install(packages);
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  }
  
  var issues = formatIssueText(fetchIssues(status, secrets));
  
  return {
    response_type: 'in_channel', // or `ephemeral` for private response
    text: !issues ? 'No issues found' : issues
  };
}

/**
 * @typedef {object} SlackBodyType
 * @property {string} text
 * @property {'in_channel'|'ephemeral'} [response_type]
 */

const main = async ({__secrets = {}, commandText, ...params}) => ({
  body: await _command(params, commandText, __secrets).catch(error => ({
    response_type: 'ephemeral',
    text: `Error: ${error.message}`
  }))
});
module.exports = main;


