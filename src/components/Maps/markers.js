import L from 'leaflet';

export const icon = (tooltip = {}, classNames = [], destinyIcon, name) => {
  const html = tooltip.hash ? `<div class='wrapper'><div class='icon ${destinyIcon} tooltip' data-hash='${tooltip.hash}' data-table='${tooltip.table}'></div>${name ? `<div class='name'>${name}</div>` : ''}</div>` : `<div class='wrapper'><div class='icon ${destinyIcon}'></div>${name ? `<div class='name'>${name}</div>` : ''}</div>`;
  return L.divIcon({
    className: ['icon-marker'].concat(classNames).join(' '),
    html
  });
};

export const text = (classNames = [], name) => {
  return L.divIcon({
    className: ['text-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='name'>${name}</div></div>`
  });
};