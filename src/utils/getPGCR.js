import store from './reduxStore';
import * as bungie from './bungie';

export async function getPGCR(membershipId, id) {
  let response = await bungie.PGCR(id);
  response.instanceId = id;
  
  store.dispatch({ type: 'PGCR_LOADED', payload: { membershipId, response } });
}

export default getPGCR;
