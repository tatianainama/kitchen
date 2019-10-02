import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import Navbar from 'components/Navbar';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import { PlannerState, Weekday, Meal, PlannerMode, RecipePlan, WeekPlan, Meals } from 'types/planner';
import Card from 'components/Card';
import PlannerActions, { fetchPlannerActionCreator, savePlannerActionCreator } from './actions';
import moment, { Moment } from 'moment';
import { DragDropContext, Droppable, Draggable, DropResult, OnDragEndResponder } from 'react-beautiful-dnd';
import './styles.scss';
import Button from 'components/Button';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import RecipeSearch from 'components/RecipeSearch';
import { DBRecipe } from 'src/types/recipes';
type Actions = typeof PlannerActions

interface PlannerContainerProps extends RouteComponentProps, PlannerState, Actions {
  fetch: typeof fetchPlannerActionCreator,
  save: typeof savePlannerActionCreator
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

  cancel = () => this.props.cancelSavePlanner(this._prevState.planner, this._prevState.backlog)

  render () {
    return (
      <div className='cbk-planner'>
        <Navbar
          title='Planner'
        >
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
        <DisplayPlanner
          mode={this.props.mode}
          week={this.state.week}
          weekNumber={this.props.week}
          onDragEnd={this.assignRecipe}
          backlog={this.props.backlog}
          planner={this.props.planner}
          removeMeal={this.removeMeal}
          addToBacklog={this.props.addToBacklog}
          assignToDay={this.props.assignToDay}
        />
      </div>
    );
  }
}

const DisplayPlanner: React.SFC<{
  week: [Weekday, string][],
  onDragEnd: OnDragEndResponder,
  weekNumber: number,
  backlog: RecipePlan[],
  planner: WeekPlan,
  removeMeal: typeof PlannerActions.removeMeal,
  assignToDay: typeof PlannerActions.assignToDay,
  addToBacklog: (recipe: DBRecipe) => {},
  mode?: PlannerMode,
}> = ({ mode, onDragEnd, backlog, weekNumber, week, planner, removeMeal, addToBacklog, assignToDay }) => (
  <section className='cbk-planner__body'>
    <DragDropContext onDragEnd={onDragEnd}>
      {
        mode === PlannerMode.Edit ? (
          <div className='cbk-planner__body__backlog'>
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
      <div className='cbk-planner__body__calendar'>
        <div>Week {weekNumber}</div>
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
                  <h5>{weekday} {moment(day).format('DD')}</h5>
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
  return state.planner
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, any>) => ({
  fetch: (from: Moment, to: Moment) => dispatch(fetchPlannerActionCreator(from, to)),
  save: (plan: WeekPlan, from: Moment, to: Moment) => dispatch(savePlannerActionCreator(plan, from, to)),
  ...bindActionCreators(PlannerActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlannerContainer);
