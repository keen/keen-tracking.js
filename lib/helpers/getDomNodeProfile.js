var getDomNodePath = require('./getDomNodePath');

function getDomNodeProfile(el) {
  return {
    action: el.action,
    class: el.className,
    href: el.href || null,
    id: el.id,
    method: el.method,
    name: el.name,
    node_name: el.nodeName,
    selector: getDomNodePath(el),
    text: el.text,
    title: el.title,
    type: el.type,
    x_position: el.offsetLeft || el.clientLeft || null,
    y_position: el.offsetTop || el.clientTop || null
  };
}

module.exports = getDomNodeProfile;
