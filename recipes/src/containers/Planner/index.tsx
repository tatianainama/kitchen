import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import moment, { Moment } from 'moment';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { ShoppingCartState } from 'types/shopping-cart';
import { PlannerState, Weekday, Meal, PlannerMode, RecipePlan, WeekPlan, Meals, WeekShift } from 'types/planner';

import PlannerActions, { fetchPlannerActionCreator, savePlannerActionCreator, changePlannerRangeActionCreator } from './actions';
import ShoppingCartActions from 'containers/ShoppingCart/actions';
import ShoppingCartView from 'containers/ShoppingCart/View';

import { getWeekPeriod } from 'services/time';

import Button from 'components/Button';
import Navbar from 'components/Navbar';
import RecipeSearch from 'components/RecipeSearch';
import Sticker from 'components/Sticker';

import { AppState } from 'store/configureStore';

import './styles.scss';

type Actions = typeof PlannerActions;
type ShoppingCartActionsType = typeof ShoppingCartActions;

interface PlannerContainerProps extends RouteComponentProps, PlannerState, Actions, ShoppingCartActionsType, ShoppingCartState {
  fetch: typeof fetchPlannerActionCreator,
  save: typeof savePlannerActionCreator
  changeRange: typeof changePlannerRangeActionCreator
}

interface PlannerContainerState {
  week: [Weekday, string][],
}

class PlannerContainer extends Component<PlannerContainerProps, PlannerContainerState> {

  constructor(props: PlannerContainerProps) {
    super(props);
    this.state = {
      week: Object.keys(props.planner).map((weekday) => ([ weekday as Weekday, moment(props.planner[weekday as Weekday].date).format()])),
    }
  }

  _prevState = {
    planner: { ...this.props.planner },
    backlog: [ ...this.props.backlog ] 
  }

  componentDidMount() {
    this.props.fetch(this.props.from, this.props.to);
  }

  componentDidUpdate(prevProps: PlannerContainerProps) {
    if (prevProps.mode === PlannerMode.View && this.props.mode === PlannerMode.Edit) {
      this._prevState = { 
        planner: {...this.props.planner},
        backlog: [...this.props.backlog]
      };
    }
  }

  removeMeal = (day: Weekday, meal: Meal) => {
    this.props.editPlanner();
    return this.props.removeMeal(day, meal);
  }

  findRecipe = (recipeId: string) => this.props.backlog.find(recipe => recipe._id === recipeId);

  changeMode = (mode: PlannerMode) => this.props.changePlannerMode(mode);

  cancel = () => this.props.cancelSavePlanner(this._prevState.planner, this._prevState.backlog);

  changeWeek = (shift?: WeekShift) => {
    const newPeriod = getWeekPeriod(this.props.from, shift);
    this.props.changeRange(newPeriod.from, newPeriod.to, newPeriod.week);
  }

  goToRecipe = (recipeId: string) => {
    this.props.history.push('/recipes/view/' + recipeId)
  }

  getRecipes = (planner: WeekPlan): RecipePlan[] => {
    const nonEmpty = (recipe: RecipePlan | undefined | string): recipe is RecipePlan => recipe !== undefined && typeof recipe !== 'string' && recipe._id !== undefined;
    return Object.entries(planner).reduce((recipes, [weekday, dayplan]) => {
      return [
        ...recipes,
        ...Meals.map(meal => dayplan[meal]).filter(nonEmpty),
      ];
    }, [] as RecipePlan[]);
  }

  showRecipe = (recipe: string | RecipePlan) => {
    return typeof recipe === 'string' ? recipe : recipe.name;
  }

  render () {
    return (
      <div className='cbk-planner'>
        <Navbar title='Planner'>
          {
            this.props.mode === PlannerMode.View ? (
              <Button raised onClick={() => this.changeMode(PlannerMode.Edit)}>Edit</Button>
              ) : (
                <div>
                  <Button raised onClick={() => {
                    this.props.save(this.props.planner, this.props.from, this.props.to)
                    this.changeMode(PlannerMode.View)
                  }}>Save</Button>
                  <Button outlined raised onClick={() => {
                    this.cancel();
                    this.changeMode(PlannerMode.View)
                  }}> Cancel </Button>
                </div>
            )
          }
          </Navbar>
          <div className='cbk-planner__actions'>
            <div>
              <Sticker>
                Week {this.props.week}
              </Sticker>
            </div>
            <div>
              <Button outlined onClick={() => this.changeWeek(WeekShift.Prev)}>Prev</Button>
              <Button outlined onClick={() => this.changeWeek()}>Current</Button>
              <Button outlined onClick={() => this.changeWeek(WeekShift.Next)}>Next</Button>
            </div>

          </div>
          <WeeklyPlanner
            week={this.state.week.map(([day]) => day)}
            planner={this.props.planner}
            mode={this.props.mode}
            assignToDay={this.props.assignToDay}
            removeMeal={this.removeMeal}
            goTo={this.goToRecipe}
          />
          <div className='cbk-planner__shopping'>
            <div className='cbk-planner__shopping__actions'>
              <Sticker>Shopping Cart</Sticker>
              <Button outlined onClick={() => { this.props.addAll(this.getRecipes(this.props.planner))}}>Add to shopping</Button>
            </div>
            <ShoppingCartView
            />
          </div>
      </div>
    );
  }
}

const isCustomRecipe = (recipe: string | RecipePlan): recipe is string => {
  return typeof recipe === 'string';
}

const WeeklyPlanner: React.FunctionComponent<{
  week: Weekday[],
  planner: WeekPlan,
  mode: PlannerMode,
  removeMeal: typeof PlannerActions.removeMeal,
  assignToDay: typeof PlannerActions.assignToDay,
  goTo: (recipeId: string) => void,
}> = ({ week, planner, mode, removeMeal, assignToDay, goTo}) => {
  return (
    <section className='cbk-planner__body'>
    <div className='cbk-planner__body__planner'>
      <div className='week'>
        {
          week.map(day => {
            const recipe = planner[day][Meal.Dinner];
            return (
              <div className='day' key={day}>
                <div className='day-date'>
                  <h5>{planner[day].date.format('ddd DD.MM')}</h5>
                </div>
                {
                  mode === PlannerMode.View ? (
                  <div className='day-meal'>
                    {
                      recipe !== undefined && (isCustomRecipe(recipe) ? (
                        <h5> { recipe } </h5>
                      ) : (
                        <h5
                          onClick={() => goTo(recipe._id)}
                          title={recipe.name}>
                            { recipe.name }
                        </h5>
                      ))
                    }
                  </div>) : recipe ? (
                    <div className='day-meal day-meal--edit'>
                      <Button icon='clear' onClick={() => removeMeal(day, Meal.Dinner)} small></Button>
                      {
                        isCustomRecipe(recipe) ? (
                          <h5> {recipe} </h5>
                        ) : (
                          <h5 title={recipe && recipe.name}>{ recipe && recipe.name }</h5>
                        )
                      }
                    </div>
                  ) : (
                    <div className='day-meal'>
                      <RecipeSearch
                        onSelect={(selected) => assignToDay(selected, day, Meal.Dinner)}
                      />
                    </div>
                  )
                }
              </div>
            )
          })
        }
      </div>
    </div>
  </section>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    ...state.planner,
    ...state.ui,
    ...state.shoppingCart
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, any>) => ({
  fetch: (from: Moment, to: Moment) => dispatch(fetchPlannerActionCreator(from, to)),
  save: (plan: WeekPlan, from: Moment, to: Moment) => dispatch(savePlannerActionCreator(plan, from, to)),
  changeRange: (from: Moment, to: Moment, shift: WeekShift) => dispatch(changePlannerRangeActionCreator(from, to, shift)),
  ...bindActionCreators(PlannerActions, dispatch),
  ...bindActionCreators(ShoppingCartActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlannerContainer);
