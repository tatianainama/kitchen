import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import Navbar from 'components/Navbar';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import { PlannerState, Weekday, Meal, RecipePlan, DayPlan } from 'types/planner';
import { Grid, Row, Cell } from "@material/react-layout-grid";
import Card from 'components/Card';
import PlannerActions, { Actions } from './actions';
import moment, { Moment } from 'moment';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './styles.scss';
import { mkWeekData, mkWeekDay, getWeekDay } from 'services/time';
import { DBRecipe } from 'types/recipes';
import Button from 'components/Button';


interface PlannerContainerProps extends RouteComponentProps, PlannerState, Actions {
}

const [ DAY, DATE ] = [ 0, 1 ];

type _WeekDay = [ Weekday, string ]
interface PlannerContainerState {
  week: [Weekday, string][]
}

const DisplayMeal = (dayPlan: DayPlan, meal: Meal, onRemove: typeof PlannerActions.removeMeal) => {
  const dish = dayPlan[meal];
  if (dish !== undefined) {
    return (
      <div className='meal-card'>
        <h3>{dish.name}</h3>
        <Button icon='clear' onClick={() => onRemove(getWeekDay(dayPlan.date), meal)}></Button>
      </div>
    )
  } else {
    return null;
  }
};

class PlannerContainer extends Component<PlannerContainerProps, PlannerContainerState> {

  constructor(props: PlannerContainerProps) {
    super(props);
    this.state = {
      week: Object.keys(props.planner).map((weekday) => ([ weekday as Weekday, props.planner[weekday as Weekday].date.format()]))
    }
  }

  assignRecipe = (result: DropResult) => {
    const recipe = this.findRecipe(result.draggableId);
    if (result.destination && recipe) {
      const [idx, day, meal] = result.destination.droppableId.split('-');
      const dayData = this.state.week[parseInt(idx)];
      this.props.assignToDay(recipe, moment(dayData[DATE]), meal as Meal);
      this.props.removeFromBacklog(recipe);
    }
  }

  findRecipe = (recipeId: string) => this.props.backlog.find(recipe => recipe._id === recipeId);

  render () {
    return (
      <div className='cbk-planner'>
        <Navbar
          title='Planner'
        >
          <div>Week {this.props.week}</div>
        </Navbar>
        <section className='cbk-planner__body'>
          <DragDropContext onDragEnd={this.assignRecipe}>
            <Grid>
              <Row>
                <Cell columns={2}>
                  <div className='cbk-planner__body__backlog'>
                    <Droppable droppableId='recipeList'>
                      {(provided) => (
                        <div ref={provided.innerRef}>
                          {this.props.backlog.map((item, index) => (
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
                </Cell>
                <Cell columns={10}>
                  <div className='cbk-planner__body__calendar'>
                    <div className='container'>
                      {
                        this.state.week.map(([weekday, day], dayNumber) => (
                          <div key={dayNumber} className='day-schedule'>
                            <div className='day-schedule--date'>
                              {weekday} {moment(day).format('DD')}
                            </div>
                            <div className='day-schedule--lunch'>
                            <Droppable droppableId={`${dayNumber}-${weekday}-lunch`}>
                              {provided => (
                                <div className='day-schedule-content' ref={provided.innerRef}>
                                  {provided.placeholder}
                                  { DisplayMeal(this.props.planner[weekday], 'lunch', this.props.removeMeal) }
                                </div>
                              )}
                            </Droppable> 
                            </div>
                            <div className='day-schedule--dinner'>
                              <Droppable droppableId={`${dayNumber}-${weekday}-dinner`}>
                                {provided => (
                                  <div className='day-schedule-content' ref={provided.innerRef}>
                                    {provided.placeholder}
                                    { DisplayMeal(this.props.planner[weekday], 'dinner', this.props.removeMeal) }
                                  </div>
                                )}
                              </Droppable> 
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </Cell>
              </Row>
            </Grid>
          </DragDropContext>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return state.planner
}

export default connect(
  mapStateToProps,
  PlannerActions
)(PlannerContainer);