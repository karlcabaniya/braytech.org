const defaultState = {
  responses: [],
  loading: false,
  lastUpdated: 0
};

export default function dossierMembersReducer(state = defaultState, action) {
  switch (action.type) {
    case 'DOSSIER_MEMBERS_LOADING':
      return {
        ...state,
        ...action.payload,
        loading: true
      };
    case 'DOSSIER_MEMBERS_LOADED':
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    default:
      return state;
  }
}
