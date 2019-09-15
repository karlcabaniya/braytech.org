import L from 'leaflet';

export const icon = (tooltip = {}, classNames = [], destinyIcon, text) => {
  const html = tooltip.hash ? `<div class='wrapper'><div class='icon ${destinyIcon} tooltip' data-hash='${tooltip.hash}' data-table='${tooltip.table}'></div>${text ? `<div class='text'>${text}</div>` : ''}</div>` : `<div class='wrapper'><div class='icon ${destinyIcon}'></div>${text ? `<div class='text'>${text}</div>` : ''}</div>`;
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
