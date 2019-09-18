import { DBRecipe } from 'types/recipes';
import { Meal, RecipePlan, Weekday, DBPlanner } from 'types/planner';
import { Dispatch, ActionCreator, Action } from 'redux';
import { getPlanner } from './services'
import { ThunkAction } from 'redux-thunk';

export const ADD_TO_BACKLOG = 'ADD_TO_BACKLOG';
export const REMOVE_FROM_BACKLOG = 'REMOVE_FROM_BACKLOG';
export const ASSIGN_TO_DAY = 'ASSIGN_TO_DAY';
export const REMOVE_MEAL = 'REMOVE_MEAL';

export const REQUEST_PLANNER = 'REQUEST_PLANNER';
export const RECEIVE_PLANNER = 'RECEIVE_PLANNER';

export interface AddToBacklogAction extends Action<'ADD_TO_BACKLOG'> {
  recipe: {
    _id: string,
    name: string
  }
}
const addToBacklog = (recipe: DBRecipe): AddToBacklogAction => ({
  recipe: {
    _id: recipe._id,
    name: recipe.name
  },
  type: ADD_TO_BACKLOG,
});

export interface RemoveFromBacklogAction extends Action<'REMOVE_FROM_BACKLOG'> {
  recipe: RecipePlan
}
const removeFromBacklog = (recipe: RecipePlan): RemoveFromBacklogAction => ({
  type: REMOVE_FROM_BACKLOG,
  recipe,
});

export interface AssignToDayAction extends Action<'ASSIGN_TO_DAY'> {
  recipe: RecipePlan,
  day: Weekday,
  meal: Meal
}
const assignToDay = (recipe: RecipePlan, day: Weekday, meal: Meal): AssignToDayAction => ({
  type: ASSIGN_TO_DAY,
  recipe,
  day,
  meal,
});

export interface RemoveMealAction extends Action<'REMOVE_MEAL'> {
  day: Weekday,
  meal: Meal
}
const removeMeal = (day: Weekday, meal: Meal): RemoveMealAction => ({
  type: REMOVE_MEAL,
  day,
  meal
});

export interface RequestPlannerAction extends Action<'REQUEST_PLANNER'> {
  week: number
}
const requestPlanner = (week: number): RequestPlannerAction => ({
  type: REQUEST_PLANNER,
  week
})

export interface ReceivePlannerAction extends Action<'RECEIVE_PLANNER'>{
  payload: DBPlanner,
}
const receivePlanner = (json: DBPlanner): ReceivePlannerAction => ({
  type: RECEIVE_PLANNER,
  payload: json
})

export const fetchPlannerActionCreator: ActionCreator<
  ThunkAction<
    Promise<ReceivePlannerAction>,
    DBPlanner,
    number,
    ReceivePlannerAction
  >
> = (week: number) => {
  return async (dispatch: Dispatch) => {
    dispatch(requestPlanner(week));
    const planner = await getPlanner(week);
    return dispatch(receivePlanner(planner))
  }
}
export const fetchPlanner = (week: number) => async (dispatch: Dispatch) => {
  dispatch(requestPlanner(week));
  try {
    const data = await getPlanner(week);
    return dispatch(receivePlanner(data));
  }
  catch (error) {
    return console.log('Error while receiving planner data:', error);
  }
}

export type PlannerActions =
  AddToBacklogAction |
  RemoveFromBacklogAction |
  AssignToDayAction |
  RemoveMealAction |
  RequestPlannerAction |
  ReceivePlannerAction;

export default {
  addToBacklog,
  removeFromBacklog,
  assignToDay,
  removeMeal,
}