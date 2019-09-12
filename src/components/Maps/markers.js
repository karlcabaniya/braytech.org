import React from 'react';
import L from 'leaflet';

export const icon = (classNames = [], destinyIcon, name) => {
  return L.divIcon({
    className: ['icon-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='icon ${destinyIcon}'></div>${name ? `<div class='name'>${name}</div>` : ''}</div>`
  });
}

export const text = (classNames = [], name) => {
  return L.divIcon({
    className: ['text-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='name'>${name}</div></div>`
  });
}