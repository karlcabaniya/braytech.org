import React from 'react';
import L from 'leaflet';

export const ghostScan = L.icon({
  iconUrl: `data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='white' d='M754 538h270v34l-434 452h-124l-466-452v-34h302l226 228zM302 486h-302v-38l466-448h124l434 448v38h-270l-226-228zM645.993 511.923q0 49.027-34.9 83.927t-83.096 34.9-83.096-34.9-34.9-83.927 34.9-83.096 83.096-34.070 83.096 34.070 34.9 83.096z'%3E%3C/path%3E%3C/svg%3E%0A`,
  iconSize: [24, 24],
  className: 'ghost-scan'
});

export const textMarker = (className, name) => {
  return L.divIcon({
    className: 'text-marker ' + className,
    html: `<div class='wrapper'><div class='value'>${name}</div></div>`
  });
}