import { DBRecipe } from 'types/recipes';
import { Moment } from 'moment'
import { Meal, RecipePlan } from 'types/planner';

export const ADD_TO_BACKLOG = 'ADD_TO_BACKLOG';
export const REMOVE_FROM_BACKLOG = 'REMOVE_FROM_BACKLOG';
export const ASSIGN_TO_DAY = 'ASSIGN_TO_DAY';
export const REMOVE_MEAL = 'REMOVE_MEAL';

const actions = {
  addToBacklog: (recipe: DBRecipe) => ({
    type: ADD_TO_BACKLOG,
    recipe: {
      _id: recipe._id,
      name: recipe.name
    },
  }),
  removeFromBacklog: (recipe: RecipePlan) => ({
    type: REMOVE_FROM_BACKLOG,
    recipe,
  }),
  assignToDay: (recipe: RecipePlan, day: Moment, meal: Meal) => ({
    type: ASSIGN_TO_DAY,
    recipe,
    day,
    meal,
  }),
  removeMeal: (day: Moment, meal: Meal) => ({
    type: REMOVE_MEAL,
    day,
    meal
  })
}

export type AddToBacklog = {
  type: typeof ADD_TO_BACKLOG,
  recipe: RecipePlan,
};

export type RemoveFromBacklog = {
  type: typeof REMOVE_FROM_BACKLOG,
  recipe: RecipePlan
}

export type AssignToDay = {
  type: typeof ASSIGN_TO_DAY,
  recipe: RecipePlan,
  day: Moment,
  meal: Meal
}

export type RemoveMeal = {
  type: typeof REMOVE_MEAL,
  day: Moment,
  meal: Meal
}

export type ActionTypes = AddToBacklog | RemoveFromBacklog | AssignToDay | RemoveMeal;

export type Actions = typeof actions;
export default actions