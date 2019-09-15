import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

function generateIcon(destinyIcon) {
  let icon;

  if (destinyIcon === 'destiny-adventure2') {
    icon = (
      <div className='icon'>
        <span className='destiny-adventure2'>
          <span className='path1' />
          <span className='path2' />
          <span className='path3' />
          <span className='path4' />
          <span className='path5' />
          <span className='path6' />
        </span>
      </div>
    );
  } else {
    icon = <div className={`icon ${destinyIcon}`} />;
  }

  return icon;
}

export const icon = (tooltip = {}, classNames = [], destinyIcon, opacity = 0.6, text) => {
  const icon = generateIcon(destinyIcon);
  const html = (
    <div className='wrapper'>
      {tooltip.hash ? (
        <>
          <div className='tooltip' data-hash={tooltip.hash} data-table={tooltip.table}>
            {icon}
          </div>
          {text ? <div className='text'>${text}</div> : null}
        </>
      ) : (
        <>
          {icon}
          {text ? <div className='text'>${text}</div> : null}
        </>
      )}
    </div>
  );

  return L.divIcon({
    className: ['icon-marker'].concat(classNames).join(' '),
    opacity,
    html: ReactDOMServer.renderToString(html)
  });
};

export const text = (classNames = [], name) => {
  return L.divIcon({
    className: ['text-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='name'>${name}</div></div>`
  });
};
