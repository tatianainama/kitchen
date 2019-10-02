import { Reducer, Action } from "redux"

export enum Display {
  Desktop,
  Mobile
}

type UiState = {
  display: Display,
}

const initialState: UiState = {
  display: window.innerWidth < 840 ? Display.Mobile : Display.Desktop
}

const CHANGE_DISPLAY = 'CHANGE_DISPLAY';

interface ChangeDisplayAction extends Action<'CHANGE_DISPLAY'> {
  display: Display
}
const changeDisplay = (display: Display): ChangeDisplayAction => ({
  type: CHANGE_DISPLAY,
  display,
});

export type UiActionsType = ChangeDisplayAction;

const UiReducer: Reducer<UiState, UiActionsType> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case CHANGE_DISPLAY:
      return {
        ...state,
        display: action.display
      }
    default:
      return state
  }
}

export const UiActions = {
  changeDisplay,
}

export default UiReducer;