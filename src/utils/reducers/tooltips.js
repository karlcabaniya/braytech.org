import * as ls from '../localStorage';

let lsState = ls.get('setting.tooltips') ? ls.get('setting.tooltips') : { detailedMode: false };
let defState = {
  settings: lsState,
  bindTime: new Date().getTime()
};

export default function themeReducer(state = defState, action) {
  switch (action.type) {
    case 'SET_TOOLTIPS_DESIGN':
      ls.set('setting.tooltips', action.payload);
      return {
        ...state,
        settings: action.payload
      };
    case 'REBIND_TOOLTIPS':
      return {
        ...state,
        bindTime: action.payload
      };
    default:
      return state;
  }
}
