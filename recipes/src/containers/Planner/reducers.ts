import { ActionTypes } from './actions';
import { PlannerState } from 'types/planner';
import { getWeekNumber, mkWeekDay } from 'services/time';


const initialState: PlannerState = {
  isFetching: false,
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

const PlannerReducer = (
  state = initialState,
  action: ActionTypes
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
      return {
        ...state,
        planner: {
          ...state.planner,
          [action.day]: {
            ...state.planner[action.day],
            [action.meal]: undefined
          }
        }
      }
    default:
      return state
  }
}

export default PlannerReducer;

