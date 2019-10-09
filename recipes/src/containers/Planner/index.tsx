import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import Navbar from 'components/Navbar';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import { PlannerState, Weekday, Meal, PlannerMode, RecipePlan, WeekPlan, Meals, WeekShift } from 'types/planner';
import PlannerActions, { fetchPlannerActionCreator, savePlannerActionCreator, changePlannerRangeActionCreator } from './actions';
import ShoppingCartActions from 'containers/ShoppingCart/actions';
import moment, { Moment } from 'moment';
import './styles.scss';
import Button from 'components/Button';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import RecipeSearch from 'components/RecipeSearch';
import { Display, UiState} from 'types/ui';
import { getWeekPeriod } from 'services/time';
import Sticker from 'components/Sticker';
import { DBRecipe } from 'src/types/recipes';

type Actions = typeof PlannerActions
type ShoppingCartActionsType = typeof ShoppingCartActions;

interface PlannerContainerProps extends RouteComponentProps, PlannerState, Actions, ShoppingCartActionsType, UiState {
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
    console.log(props)
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
    const nonEmpty = (recipe: RecipePlan | undefined): recipe is RecipePlan => recipe !== undefined;
    return Object.entries(planner).reduce((recipes, [weekday, dayplan]) => {
      return [
        ...recipes,
        ...Meals.map(meal => dayplan[meal]).filter(nonEmpty),
      ];
    }, [] as RecipePlan[]);
  }

  render () {
    return (
      <div className='cbk-planner'>
        {
          this.props.display === Display.Desktop ?
          (
            <>
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
              <DisplayPlanner
                week={this.state.week.map(([day]) => day)}
                planner={this.props.planner}
                mode={this.props.mode}
                assignToDay={this.props.assignToDay}
                removeMeal={this.removeMeal}
                goTo={this.goToRecipe}
              />
              <div className='cbk-planner__shopping'>
                <Button outlined onClick={() => { this.props.addAll(this.getRecipes(this.props.planner))}}>Add to shopping</Button>
              </div>
            </>
          ) 
          :(<MobileDisplayPlanner 
              week={this.state.week}
              weekNumber={this.props.week}
              planner={this.props.planner}
              changeWeek={this.changeWeek}
              goTo={this.goToRecipe}
            />)
        }
        
      </div>
    );
  }
}

const DisplayPlanner: React.SFC<{
  week: Weekday[],
  planner: WeekPlan,
  mode: PlannerMode,
  removeMeal: typeof PlannerActions.removeMeal,
  assignToDay: typeof PlannerActions.assignToDay,
  goTo: (recipeId: string) => void,
}> = ({ week, planner, mode, removeMeal, assignToDay, goTo }) => (
  <section className='cbk-planner__body'>
    <div className='cbk-planner__body__planner'>
      <div className='week'>
        <div className='day meal'>
          <div className='meal-placeholder'> x </div>
          {
            Meals.map(meal => (
              <div className='meal-name' key={meal}>
                <h5 className='meal-name--style'>{Meal[meal].toLowerCase()}</h5>
              </div>
            ))
          }
        </div>
        {
          week.map(day => (
            <div className='day' key={day}>
              <div className='day-date'>
                <h5>{planner[day].date.format('ddd DD.MM')}</h5>
              </div>
              {
                mode === PlannerMode.View ?
                  Meals.map(meal => {
                    const recipe = planner[day][meal];
                    return (
                      <div className='day-meal' key={meal}>
                        {
                          recipe && (
                            <h5 onClick={() => goTo(recipe._id)} title={recipe.name}>{ recipe.name }</h5>
                          )
                        }
                      </div>
                    )
                  }) :
                  Meals.map(meal => {
                    const recipe = planner[day][meal];
                    return recipe ? (
                      <div className='day-meal day-meal--edit' key={meal}>
                        <Button icon='clear' onClick={() => removeMeal(day, meal)} small></Button>
                        <h5 title={recipe && recipe.name}>{ recipe && recipe.name }</h5>
                      </div>
                    ) : (
                      <div className='day-meal' key={meal}>
                        <RecipeSearch
                          onSelect={(selected) => assignToDay(selected, day, meal)}
                        />
                      </div>
                    )
                  })
              }
            </div>
          ))
        }
      </div>
    </div>
  </section>
)

const MobileDisplayPlanner: React.SFC<{
  week: [Weekday, string][],
  weekNumber: number,
  planner: WeekPlan,
  changeWeek: (shift?: WeekShift) => void,
  goTo: (recipeId: string) => void
}> = ({ weekNumber, week, planner, changeWeek, goTo}) => (
  <section className='cbk-planner-mobile__body'>
    <div className='cbk-planner-mobile__body__actions'>
      <Button onClick={() => changeWeek(WeekShift.Prev)}>Prev</Button>
      Week {weekNumber}
      <Button onClick={() => changeWeek()}>Current</Button>
      <Button onClick={() => changeWeek(WeekShift.Next)}>Next</Button>
    </div>
    <div className='cbk-planner-mobile__body__calendar'>
      {
        week.map(([weekday], dayNumber)=>(
          <div key={dayNumber} className='day-schedule'>
            <div className='day-schedule__day'>
              <h5>{planner[weekday].date.format('ddd DD.MM') || weekday}</h5>
            </div>
            <div className='day-schedule__meals'>
              {
                Meals.map((meal, key) => {
                  const recipe = planner[weekday][meal];
                  return (
                    <div
                      key={key}
                      className={`day-schedule__meals--${meal}`}
                    >
                      {
                        recipe ? (
                          <h5 onClick={() => goTo(recipe._id)}>{ recipe.name }</h5>
                        ) : null
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        ))
      }
    </div>
  </section>
)

const mapStateToProps = (state: AppState) => {
  return {
    ...state.planner,
    ...state.ui
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
