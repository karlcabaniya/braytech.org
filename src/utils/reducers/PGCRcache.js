const defaultState = {
  cache: []
};

export default function PGCRcacheReducer(state = defaultState, action) {
  switch (action.type) {
    case 'PGCR_LOADED':
      return {
        ...state,
        cache: [...state.cache, action.payload]
      };
    default:
      return state;
  }
}
