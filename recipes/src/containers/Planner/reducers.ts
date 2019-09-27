import { PlannerActions } from './actions';
import { PlannerState, DBPlanner, WeekPlan, Weekday } from 'types/planner';
import { getWeekNumber, mkWeekDay } from 'services/time';
import { Reducer } from 'redux';
import { merge, uniqBy } from 'ramda';
import moment from 'moment';

const initialState: PlannerState = {
  mode: 'view',
  isFetching: false,
  saving: false,
  edit: false,
  from: mkWeekDay(1),
  to: mkWeekDay(7),
  week: getWeekNumber(),
  planner: {
    monday:     { date: mkWeekDay(1)},
    tuesday:    { date: mkWeekDay(2)},
    wednesday:  { date: mkWeekDay(3)},
    thursday:   { date: mkWeekDay(4)},
    friday:     { date: mkWeekDay(5)},
    saturday:   { date: mkWeekDay(6)},
    sunday:     { date: mkWeekDay(7)},
  },
  backlog: [
    {
      _id: '5d638a66eed9f450ff3b32dc',
      name: 'Summer Corn Chowder'
    },
    {
      _id: '5d638aedeed9f450ff3b32dd',
      name: 'Chicken Parm'
    },
    {
      _id: '5d6906f806662f07a2825ab7',
      name: 'Creamy Chicken And Wild Rice Soup'
    }
  ]
}

const joinPlanner = (old: WeekPlan, updated: DBPlanner): WeekPlan => Object.keys(old).reduce((_oldPlanner, day) => ({
  ..._oldPlanner,
  [day]: merge(_oldPlanner[day as Weekday], updated[day as Weekday])
}), {...old});

const PlannerReducer: Reducer<PlannerState, PlannerActions> = (
  state = initialState,
  action
): PlannerState => {
  switch (action.type) {
    case 'ADD_TO_BACKLOG': 
      return {
        ...state,
        backlog: state.backlog.concat([action.recipe])
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
      const inBacklog = meal && state.backlog.find(r => r._id === meal._id) !== undefined;
      return {
        ...state,
        planner: {
          ...state.planner,
          [action.day]: {
            ...state.planner[action.day],
            [action.meal]: undefined
          }
        },
        backlog: meal && !inBacklog ? state.backlog.concat([meal]) : state.backlog
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
    default:
      return state
  }
}

export default PlannerReducer;

