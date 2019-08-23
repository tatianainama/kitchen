import { DBRecipe } from 'types/recipes';
import { Moment } from 'moment'
import { Meal } from 'types/planner';

export const ADD_TO_BACKLOG = 'ADD_TO_BACKLOG';
export const REMOVE_FROM_BACKLOG = 'REMOVE_FROM_BACKLOG';
export const ASSIGN_TO_DAY = 'ASSIGN_TO_DAY';

const actions = {
  addToBacklog: (recipe: DBRecipe) => ({
    type: ADD_TO_BACKLOG,
    recipe,
  }),
  removeFromBacklog: (recipe: DBRecipe) => ({
    type: REMOVE_FROM_BACKLOG,
    recipe
  }),
  assignToDay: (recipe: DBRecipe, day: Moment, meal: Meal) => ({
    type: ASSIGN_TO_DAY,
    recipe,
    day,
    meal,
  })
}

export type AddToBacklog = {
  type: typeof ADD_TO_BACKLOG,
  recipe: DBRecipe,
};

export type RemoveFromBacklog = {
  type: typeof REMOVE_FROM_BACKLOG,
  recipe: DBRecipe
}

export type AssignToDay = {
  type: typeof ASSIGN_TO_DAY,
  recipe: DBRecipe,
  day: Moment,
  meal: Meal
}

export type ActionTypes = AddToBacklog | RemoveFromBacklog | AssignToDay;

export default {
  ...actions
}