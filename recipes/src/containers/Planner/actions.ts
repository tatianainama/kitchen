import { DBRecipe } from 'types/recipes';
import { Meal, RecipePlan, Weekday, DBPlanner, PlannerMode, WeekPlan, DBDayPlan } from 'types/planner';
import { Dispatch, ActionCreator, Action } from 'redux';
import { getPlanner, savePlanner } from './services'
import { ThunkAction } from 'redux-thunk';
import { Moment } from 'moment';

export const ADD_TO_BACKLOG = 'ADD_TO_BACKLOG';
export const REMOVE_FROM_BACKLOG = 'REMOVE_FROM_BACKLOG';
export const ASSIGN_TO_DAY = 'ASSIGN_TO_DAY';
export const REMOVE_MEAL = 'REMOVE_MEAL';

export const REQUEST_PLANNER = 'REQUEST_PLANNER';
export const RECEIVE_PLANNER = 'RECEIVE_PLANNER';

export const CHANGE_PLANNER_MODE = 'CHANGE_PLANNER_MODE';
export const EDIT_PLANNER = 'EDIT_PLANNER';
export const CHANGE_PLANNER_RANGE = 'CHANGE_PLANNER_RANGE';

export const PENDING_SAVE_PLANNER = 'PENDING_SAVE_PLANNER';
export const CONFIRM_SAVE_PLANNER = 'CONFIRM_SAVE_PLANNER';
export const REJECT_SAVE_PLANNER = 'REJECT_SAVE_PLANNER';

export const CANCEL_SAVE_PLANNER = 'CANCEL_SAVE_PLANNER';

export interface AddToBacklogAction extends Action<'ADD_TO_BACKLOG'> {
  recipe: RecipePlan
}

const addToBacklog = (recipe: DBRecipe): AddToBacklogAction => ({
  recipe: {
    _id: recipe._id,
    name: recipe.name,
    ingredients: recipe.ingredients
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
  from: Moment,
  to: Moment
}
const requestPlanner = (from: Moment, to: Moment): RequestPlannerAction => ({
  type: REQUEST_PLANNER,
  from,
  to
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
    {from: Moment, to: Moment},
    ReceivePlannerAction
  >
> = (from: Moment, to: Moment) => {
  return async (dispatch: Dispatch) => {
    dispatch(requestPlanner(from, to));
    const planner = await getPlanner(from, to);
    return dispatch(receivePlanner(planner))
  }
}

export interface ChangePlannerModeAction extends Action<'CHANGE_PLANNER_MODE'> {
  mode: PlannerMode
}
export const changePlannerMode = (mode: PlannerMode): ChangePlannerModeAction => ({
  type: CHANGE_PLANNER_MODE,
  mode,
});

export interface EditPlannerAction extends Action<'EDIT_PLANNER'> {
}
export const editPlanner = (): EditPlannerAction => ({
  type: EDIT_PLANNER
});

export interface ChangePlannerRangeAction extends Action<'CHANGE_PLANNER_RANGE'> {
  from: Moment,
  to: Moment,
  week: number
}
export const changePlannerRange = (from: Moment, to: Moment, week: number): ChangePlannerRangeAction => ({
  type: CHANGE_PLANNER_RANGE,
  from,
  to,
  week
});
export const changePlannerRangeActionCreator: ActionCreator<
  ThunkAction<
    Promise<ReceivePlannerAction>,
    DBPlanner,
    {from: Moment, to: Moment},
    ReceivePlannerAction
  >
> = (from, to, week) => {
  return async (dispatch: Dispatch) => {
    dispatch(changePlannerRange(from, to, week));
    dispatch(requestPlanner(from, to));
    const planner = await getPlanner(from, to);
    return dispatch(receivePlanner(planner))
  }
}

export interface PendingSavePlannerAction extends Action<'PENDING_SAVE_PLANNER'> {
  planner: WeekPlan,
  from: Moment,
  to: Moment
}
export const pendingSavePlanner = (planner: WeekPlan, from: Moment, to: Moment): PendingSavePlannerAction => ({
  type: PENDING_SAVE_PLANNER,
  planner,
  from,
  to,
})

export interface ConfirmSavePlannerAction extends Action<'CONFIRM_SAVE_PLANNER'> {
  result: DBDayPlan[]
}
export const confirmSavePlanner = (result: DBDayPlan[]): ConfirmSavePlannerAction => ({
  type: CONFIRM_SAVE_PLANNER,
  result
})

export interface RejectSavePlannerAction extends Action<'REJECT_SAVE_PLANNER'> {
  error: Error
}
export const rejectSavePlanner = (error: Error): RejectSavePlannerAction => ({
  type: REJECT_SAVE_PLANNER,
  error,
})

export const savePlannerActionCreator: ActionCreator<
  ThunkAction<
    Promise<ConfirmSavePlannerAction|RejectSavePlannerAction>,
    DBDayPlan[],
    WeekPlan,
    ConfirmSavePlannerAction|RejectSavePlannerAction
  >
> = (weekplan: WeekPlan, from: Moment, to: Moment) => {
  return async (dispatch: Dispatch) => {
    dispatch(pendingSavePlanner(weekplan, from, to))
    try {
      const result = await savePlanner(weekplan, from, to);
      return dispatch(confirmSavePlanner(result))
    } catch(error) {
      return dispatch(rejectSavePlanner(error))
    }
  }
}

export interface CancelSavePlannerAction extends Action<'CANCEL_SAVE_PLANNER'> {
  oldPlanner: WeekPlan,
  oldBacklog: RecipePlan[]
}

export const cancelSavePlanner = (oldPlanner: WeekPlan, oldBacklog: RecipePlan[]): CancelSavePlannerAction => ({
  type: CANCEL_SAVE_PLANNER,
  oldPlanner,
  oldBacklog
})

export type PlannerActions =
  AddToBacklogAction |
  RemoveFromBacklogAction |
  AssignToDayAction |
  RemoveMealAction |
  RequestPlannerAction |
  ReceivePlannerAction |
  ChangePlannerModeAction |
  EditPlannerAction |
  PendingSavePlannerAction |
  ConfirmSavePlannerAction |
  RejectSavePlannerAction |
  CancelSavePlannerAction |
  ChangePlannerRangeAction;


export default {
  addToBacklog,
  removeFromBacklog,
  assignToDay,
  removeMeal,
  changePlannerMode,
  editPlanner,
  cancelSavePlanner,
  changePlannerRange
}