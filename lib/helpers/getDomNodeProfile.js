import { getDomNodePath } from './getDomNodePath';

export function getDomNodeProfile(el) {
  return {
    action: el.action,
    class: el.className,
    href: getElementProps(el, 'href'),
    id: getElementProps(el, 'id'),
    event_key: getElementProps(el, 'data-event-key'),
    method: el.method,
    name: el.name,
    node_name: el.nodeName,
    selector: getDomNodePath(el),
    text: getElementProps(el, 'text'),
    title: getElementProps(el, 'title'),
    type: el.type,
    x_position: el.offsetLeft || el.clientLeft || null,
    y_position: el.offsetTop || el.clientTop || null
  };
}

const getElementProps = (el, prop) => {
  if (el[prop]) {
    return el[prop];
  }
  if (el.hasAttribute && el.hasAttribute(prop)) {
    return el.getAttribute(prop);
  }
  if (el.parentNode) {
    return getElementProps(el.parentNode, prop);
  }
  return null;
};
