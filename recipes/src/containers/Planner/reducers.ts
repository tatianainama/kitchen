import { PlannerActions } from './actions';
import { PlannerState, DBPlanner, WeekPlan, Weekday, PlannerMode, RecipePlan } from 'types/planner';
import { getWeekNumber, mkWeekDay } from 'services/time';
import { Reducer } from 'redux';
import { merge, uniqBy } from 'ramda';
import { mkPlanner } from './services';

const initialState: PlannerState = {
  mode: PlannerMode.View,
  isFetching: false,
  saving: false,
  edit: false,
  from: mkWeekDay(1),
  to: mkWeekDay(7),
  week: getWeekNumber(),
  planner: mkPlanner(),
  backlog: []
}

const isRecipe = (meal: string | RecipePlan | undefined): meal is RecipePlan => {
  return meal !== undefined && typeof meal != 'string' && meal._id !== undefined;
}

const joinPlanner = (old: WeekPlan, updated: DBPlanner): WeekPlan => Object.keys(old).reduce((_oldPlanner, day) => ({
  ..._oldPlanner,
  [day]: {
    ...merge(_oldPlanner[day as Weekday], updated[day as Weekday]),
    date: _oldPlanner[day as Weekday].date
  }
}), {...old});

const PlannerReducer: Reducer<PlannerState, PlannerActions> = (
  state = initialState,
  action
): PlannerState => {
  switch (action.type) {
    case 'ADD_TO_BACKLOG': 
      return {
        ...state,
        backlog: uniqBy(item => item._id, [
          action.recipe,
          ...state.backlog
        ])
      };
    case 'ASSIGN_TO_DAY':
      return {
        ...state,
        planner: {
          ...state.planner,
          [action.day]: {
            ...state.planner[action.day],
            [action.meal]: action.recipe
          }
        }
      };
    case 'REMOVE_FROM_BACKLOG':
      return {
        ...state,
        backlog: state.backlog.filter(recipe => recipe._id !== action.recipe._id)
      }
    case 'REMOVE_MEAL':
      const meal = state.planner[action.day][action.meal];
      let newState = {
        ...state,
        planner: {
          ...state.planner,
          [action.day]: {
            ...state.planner[action.day],
            [action.meal]: undefined
          }
        }
      };

      if (isRecipe(meal)) {
        const inBacklog = meal && typeof meal !== 'string' && state.backlog.find(r => r._id === meal._id) !== undefined;
        return {
          ...newState,
          backlog: meal && !inBacklog ? state.backlog.concat([meal]) : state.backlog
        }
      } else {
        return newState
      }
    case 'REQUEST_PLANNER':
      return {
        ...state,
        week: getWeekNumber(action.from),
        from: action.from,
        to: action.to,
        isFetching: true,
      }
    case 'RECEIVE_PLANNER':
      return {
        ...state,
        isFetching: false,
        planner: joinPlanner(state.planner, action.payload)
      }
    case 'CHANGE_PLANNER_MODE':
      return {
        ...state,
        mode: action.mode
      }
    case 'CHANGE_PLANNER_RANGE':
      return {
        ...state,
        from: action.from,
        to: action.to,
        week: action.week,
        planner: mkPlanner(action.from)
      }
    case 'EDIT_PLANNER':
      return {
        ...state,
        edit: true,
      }
    case 'PENDING_SAVE_PLANNER':
      return {
        ...state,
        saving: true
      }
    case 'CONFIRM_SAVE_PLANNER':
      return {
        ...state,
        saving: false
      }
    case 'REJECT_SAVE_PLANNER':
      return {
        ...state,
        saving: false,
        error: action.error.message
      }
    case 'CANCEL_SAVE_PLANNER':
      return {
        ...state,
        edit: false,
        mode: PlannerMode.View,
        planner: action.oldPlanner,
        backlog: action.oldBacklog
      }
    default:
      return state
  }
}

export default PlannerReducer;

