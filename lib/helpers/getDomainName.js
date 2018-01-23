function getDomainName(host){
  var domainRegex = /\w+\.\w+$/;
  return domainRegex.test(host) ? host.match(domainRegex)[0] : null;
}

module.exports = getDomainName;
