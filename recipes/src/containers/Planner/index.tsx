import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import Navbar from 'components/Navbar';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import { PlannerState, Weekday, Meal, DayPlan, PlannerMode, RecipePlan, WeekPlan } from 'types/planner';
import Card from 'components/Card';
import PlannerActions, { fetchPlannerActionCreator, PlannerActions as PlannerActionsTypes, savePlannerActionCreator } from './actions';
import moment from 'moment';
import { DragDropContext, Droppable, Draggable, DropResult, OnDragEndResponder } from 'react-beautiful-dnd';
import './styles.scss';
import { getWeekDay } from 'services/time';
import Button from 'components/Button';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';

type Actions = typeof PlannerActions

interface PlannerContainerProps extends RouteComponentProps, PlannerState, Actions {
  fetch: typeof fetchPlannerActionCreator,
  save: typeof savePlannerActionCreator
}

interface PlannerContainerState {
  week: [Weekday, string][]
}

class PlannerContainer extends Component<PlannerContainerProps, PlannerContainerState> {

  constructor(props: PlannerContainerProps) {
    super(props);
    console.log(props)
    this.state = {
      week: Object.keys(props.planner).map((weekday) => ([ weekday as Weekday, moment(props.planner[weekday as Weekday].date).format()]))
    }
  }

  componentDidMount() {
    this.props.fetch(this.props.week);
  }

  componentDidUpdate() {
    const { isFetching } = this.props;
  }

  assignRecipe = (result: DropResult) => {
    const recipe = this.findRecipe(result.draggableId);
    if (result.destination && recipe) {
      const [idx, day, meal] = result.destination.droppableId.split('-');
      this.props.assignToDay(recipe, day as Weekday, meal as Meal);
      this.props.removeFromBacklog(recipe);
    }
  }

  findRecipe = (recipeId: string) => this.props.backlog.find(recipe => recipe._id === recipeId);

  changeMode = (mode: PlannerMode) => this.props.changePlannerMode(mode);

  render () {
    return (
      <div className='cbk-planner'>
        <Navbar
          title='Planner'
        >
          {
            this.props.mode === 'view' ? (
              <Button outlined raised onClick={() => this.changeMode('edit')}>Edit</Button>
              ) : (
              <Button outlined raised onClick={() => {
                this.props.save(this.props.planner)
                this.changeMode('view')
              }}>Save</Button>
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
          removeMeal={this.props.removeMeal}
        />
      </div>
    );
  }
}

const DisplayMeal = (dayPlan: DayPlan, meal: Meal, onRemove: typeof PlannerActions.removeMeal) => {
  const dish = dayPlan ? dayPlan[meal] : dayPlan;
  if (dish !== undefined) {
    return (
      <div className='meal-card'>
        <div className='meal-card--actions'>
          <Button icon='clear' onClick={() => onRemove(getWeekDay(dayPlan.date), meal)} small></Button>
        </div>
        <h5>{dish.name}</h5>
      </div>
    )
  } else {
    return null;
  }
};

const DisplayMealWithActions: React.SFC<{
  recipe?: RecipePlan,
  children?: React.ReactElement
}> = ({ recipe, children }) => recipe ? (
  <div className='meal-card'>
    <div className="meal-card--actions">
      { children }
    </div>
    <h5>{ recipe.name }</h5>
  </div>
) : null; 

const DisplayPlanner: React.SFC<{
  week: [Weekday, string][],
  onDragEnd: OnDragEndResponder,
  weekNumber: number,
  backlog: RecipePlan[],
  planner: WeekPlan,
  removeMeal: typeof PlannerActions.removeMeal,
  mode?: PlannerMode,
}> = ({ mode, onDragEnd, backlog, weekNumber, week, planner, removeMeal}) => (
  <section className='cbk-planner__body'>
    <DragDropContext onDragEnd={onDragEnd}>
      {
        mode === 'edit' ? (
          <div className='cbk-planner__body__backlog'>
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
            <div className='day-schedule--lunch'> <h5>lunch</h5></div>
            <div className='day-schedule--dinner'> <h5>dinner</h5> </div>                                      
          </div>
          {
            week.map(([weekday, day], dayNumber) => (
              <div key={dayNumber} className='day-schedule'>
                <div className='day-schedule--date'>
                  <h5>{weekday} {moment(day).format('DD')}</h5>
                </div>
                <div className='day-schedule--lunch'>
                <Droppable droppableId={`${dayNumber}-${weekday}-lunch`}>
                  {provided => (
                    <div className='day-schedule-content' ref={provided.innerRef}>
                      {provided.placeholder}
                      <DisplayMealWithActions recipe={planner[weekday]['lunch']}>
                        {
                          planner[weekday]['lunch'] && mode === 'edit' ? (
                            <Button icon='clear' onClick={() => removeMeal(weekday, 'lunch')} small></Button>
                          ) : undefined
                        }
                      </DisplayMealWithActions>
                    </div>
                  )}
                </Droppable> 
                </div>
                <div className='day-schedule--dinner'>
                  <Droppable droppableId={`${dayNumber}-${weekday}-dinner`}>
                    {provided => (
                      <div className='day-schedule-content' ref={provided.innerRef}>
                        {provided.placeholder}
                        <DisplayMealWithActions recipe={planner[weekday]['dinner']}>
                          {
                            planner[weekday]['dinner'] && mode === 'edit' ? (
                              <Button icon='clear' onClick={() => removeMeal(weekday, 'dinner')} small></Button>
                            ) : undefined
                          }
                        </DisplayMealWithActions>
                      </div>
                    )}
                  </Droppable> 
                </div>
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
  fetch: (week: number) => dispatch(fetchPlannerActionCreator(week)),
  save: (plan: WeekPlan) => dispatch(savePlannerActionCreator(plan)),
  ...bindActionCreators(PlannerActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlannerContainer);
