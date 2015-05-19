function getDomEventProfile(e){
  if (!arguments.length) return {};
  return {
    'innerText': e.target.innerText,
    'path': Keen.helpers.getDomPath(e.target).join(' > '),
    'tagName': e.target.tagName,
    'title': e.target.title
  };
}

module.exports = getDomEventProfile;
