const defaultState = {};

export default function PGCRcacheReducer(state = defaultState, action) {
  switch (action.type) {
    case 'PGCR_LOADED':
      let newState = {...state};
      newState[action.payload.membershipId] = newState[action.payload.membershipId] || [];
      newState[action.payload.membershipId] = newState[action.payload.membershipId].concat([action.payload.response]);
      return newState;
    default:
      return state;
  }
}
