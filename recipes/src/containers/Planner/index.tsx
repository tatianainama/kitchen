import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import Navbar from 'components/Navbar';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import { PlannerState, Weekday, Meal, PlannerMode, RecipePlan, WeekPlan, Meals, WeekShift } from 'types/planner';
import Card from 'components/Card';
import PlannerActions, { fetchPlannerActionCreator, savePlannerActionCreator, changePlannerRangeActionCreator } from './actions';
import moment, { Moment } from 'moment';
import { DragDropContext, Droppable, Draggable, DropResult, OnDragEndResponder } from 'react-beautiful-dnd';
import './styles.scss';
import Button from 'components/Button';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import RecipeSearch from 'components/RecipeSearch';
import { DBRecipe } from 'types/recipes';
import { Display, UiState} from 'types/ui';
import { getWeekPeriod } from 'services/time';
import Sticker from 'components/Sticker';

type Actions = typeof PlannerActions

interface PlannerContainerProps extends RouteComponentProps, PlannerState, Actions, UiState {
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
    backlog: { ...this.props.backlog } 
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

  assignRecipe = (result: DropResult) => {
    const recipe = this.findRecipe(result.draggableId);
    if (result.destination && recipe) {
      const [idx, day, meal] = result.destination.droppableId.split('-');
      this.props.assignToDay(recipe, day as Weekday, parseInt(meal) as Meal);
      this.props.removeFromBacklog(recipe);
      this.props.editPlanner();
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
                  <Button outlined raised onClick={() => this.changeMode(PlannerMode.Edit)}>Edit</Button>
                  ) : (
                    <div>
                      <Button outlined raised onClick={() => {
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
                  <Button onClick={() => this.changeWeek(WeekShift.Prev)}>Prev</Button>
                  <Button onClick={() => this.changeWeek()}>Current</Button>
                  <Button onClick={() => this.changeWeek(WeekShift.Next)}>Next</Button>
                </div>

              </div>
              <DisplayPlanner
                week={this.state.week.map(([day]) => day)}
                planner={this.props.planner}
                mode={this.props.mode}
                assignToDay={this.props.assignToDay}
                removeMeal={this.removeMeal}
              />
              {/* <DisplayPlannerDrag
                mode={this.props.mode}
                week={this.state.week}
                weekNumber={this.props.week}
                onDragEnd={this.assignRecipe}
                backlog={this.props.backlog}
                planner={this.props.planner}
                removeMeal={this.removeMeal}
                addToBacklog={this.props.addToBacklog}
                assignToDay={this.props.assignToDay}
                changeWeek={this.changeWeek}
              /> */}
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
}> = ({ week, planner, mode, removeMeal, assignToDay }) => (
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
                        <h5 title={recipe && recipe.name}>{ recipe && recipe.name }</h5>
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

const DisplayPlannerDrag: React.SFC<{
  week: [Weekday, string][],
  onDragEnd: OnDragEndResponder,
  weekNumber: number,
  backlog: RecipePlan[],
  planner: WeekPlan,
  removeMeal: typeof PlannerActions.removeMeal,
  assignToDay: typeof PlannerActions.assignToDay,
  addToBacklog: (recipe: DBRecipe) => {},
  changeWeek: (shift?: WeekShift) => void,
  mode?: PlannerMode,
}> = ({ mode, onDragEnd, backlog, weekNumber, week, planner, removeMeal, addToBacklog, assignToDay, changeWeek}) => (
  <section className='cbk-planner__body'>
    <DragDropContext onDragEnd={onDragEnd}>
      {
        mode === PlannerMode.Edit ? (
          <div className='cbk-planner-dnd__body__backlog'>
            <RecipeSearch onSelect={(selected)=>{ addToBacklog(selected) }}/>
            <Droppable droppableId='recipeList'>
              {(provided) => (
                <div ref={provided.innerRef}>
                  {backlog.map((item, index) => (
                      <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}>
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card
                                key={item._id}
                                title={item.name}
                                onClick={() => {}}
                              />
                            </div>
                          )}
                      </Draggable>
                  ))}
                  {provided.placeholder}
              </div>
              )}
            </Droppable>
          </div>
        ) : null
      }
      <div className='cbk-planner-dnd__body__calendar'>
        <div>
          Week {weekNumber}
          </div>
          <Button onClick={() => changeWeek(WeekShift.Prev)}>Prev</Button>
          <Button onClick={() => changeWeek()}>Current</Button>
          <Button onClick={() => changeWeek(WeekShift.Next)}>Next</Button>
        <div className='container'>
          <div className='day-schedule day-schedule--meals'>
            <div className='day-schedule--date'></div>
            {
              Meals.map((meal, key) => (
                <div className='day-schedule--meal' key={key}>
                  <h5>{Meal[meal]}</h5>
                </div>
              ))
            }
          </div>
          {
            week.map(([weekday, day], dayNumber) => (
              <div key={dayNumber} className='day-schedule'>
                <div className='day-schedule--date'>
                  <h5>{planner[weekday].date.format('ddd DD.MM') || weekday}</h5>
                </div>
                {
                  Meals.map((meal, key) => {
                    const recipe = planner[weekday][meal];
                    return (
                      <div className='day-schedule--meal' key={key}>
                        {
                          mode === PlannerMode.Edit && !recipe ? 
                            (<RecipeSearch onSelect={(selected)=>{ assignToDay(selected, weekday, meal) }}/>) :
                            null
                        }
                        <Droppable droppableId={`${dayNumber}-${weekday}-${meal}`}>
                          {
                            provided => (
                              <div className='day-schedule-content' ref={provided.innerRef}>
                                { provided.placeholder }
                                {
                                  recipe ? (
                                    <div className='meal-card'>
                                      <div className="meal-card--actions">
                                        {
                                          recipe && mode === PlannerMode.Edit ? (
                                            <Button icon='clear' onClick={() => removeMeal(weekday, meal)} small></Button>      
                                          ) : null
                                        }
                                      </div>
                                      <h5>{ recipe.name }</h5>
                                    </div>
                                  ) : null
                                }
                              </div>
                            )
                          }
                        </Droppable>
                      </div>
                    )
                  })
                }
              </div>
            ))
          }
        </div>
      </div>
    </DragDropContext>
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
  ...bindActionCreators(PlannerActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlannerContainer);
