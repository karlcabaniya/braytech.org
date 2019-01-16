import assign from 'lodash/assign';
import Globals from './globals';

import store from './reduxStore';

async function apiRequest() {

  const vendors = [
    {
      slug: 'spider',
      hash: '863940356',
    },
    {
      slug: 'banshee',
      hash: '1265988377',
    },
    {
      slug: 'tess',
      hash: '3361454721',
    },
    {
      slug: 'xur',
      hash: '2190858386'
    }
  ];

  let fetches = vendors.map(async vendor => {
    const request = await fetch(`https://api.braytech.org/cache/json/vendors/${vendor.hash}.json`, { cache: 'reload' });
    const response = await request.json();
    let object = {};
    object[vendor.slug] = response;
    return object;
  });

  try {
    const promises = await Promise.all(fetches);
    return assign(...promises);
  } catch (error) {
    console.log(error);
  }
}

export async function getVendors() {
  
  
  let data = await apiRequest();

  store.dispatch({ type: 'SET_VENDORS', payload: data });
  
}

export default getVendors;