import store from './reduxStore';
import * as bungie from './bungie';

export async function getPGCR(id) {
  let response = await bungie.PGCR(id);

  store.dispatch({ type: 'PGCR_LOADED', payload: response });
}

export default getPGCR;
