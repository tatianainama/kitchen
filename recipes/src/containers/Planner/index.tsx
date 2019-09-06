import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import Navbar from 'components/Navbar';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import { PlannerState, Weekday, Meal } from 'types/planner';
import { Grid, Row, Cell } from "@material/react-layout-grid";
import Card from 'components/Card';
import PlannerActions, { Actions } from './actions';
import moment, { Moment } from 'moment';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './styles.scss';
import { mkWeekData, mkWeekDay } from 'services/time';
import { DBRecipe } from 'types/recipes';


interface PlannerContainerProps extends RouteComponentProps, PlannerState, Actions {
}

const [ DAY, DATE ] = [ 0, 1 ];

type _WeekDay = [ Weekday, string ]
interface PlannerContainerState {
  week: [Weekday, string][]
}

const DisplayMeal = (meal?: DBRecipe) => meal ? (
  <Card
    key={meal._id}
    onClick={()=>{}}
    title={meal.name}
    noMedia
  />
) : null;

class PlannerContainer extends Component<PlannerContainerProps, PlannerContainerState> {

  constructor(props: PlannerContainerProps) {
    super(props);
    this.state = {
      week: mkWeekData(this.props.data.week)
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
          <div>Week {this.props.data.week}</div>
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
                                  {(provided, snapshot) => (
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

                {/* {
                  this.props.backlog.map((recipe, i) => (
                    <Card
                      key={i}
                      title={recipe.name}
                      onClick={() => {}}
                      summary={recipe.summary}
                    />
                  ))
                } */}
                <Cell columns={10}>
                  <div className='cbk-planner__body__calendar'>
                    <div className='container'>
                      {
                        this.state.week.map((data, weekdayNumber) => (
                          <div key={weekdayNumber} className='day-schedule'>
                            <div className='day-schedule--name'>
                              {data[DAY]} {moment(data[DATE]).format('D')}
                            </div>
                            <div className='day-schedule--lunch'>
                              <Droppable droppableId={`${weekdayNumber}-${data[DAY]}-lunch`}>
                                {provided => (
                                  <div className='day-schedule-content' ref={provided.innerRef}>
                                    {provided.placeholder}
                                    { DisplayMeal(this.props.data[data[DAY] as Weekday].lunch) }
                                  </div>
                                )}
                              </Droppable>
                            </div>
                            <div className='day-schedule--dinner'>
                              <Droppable droppableId={`${weekdayNumber}-${data[DAY]}-dinner`}>
                                {provided => (
                                  <div className='day-schedule-content' ref={provided.innerRef}>
                                    {provided.placeholder}
                                    { DisplayMeal(this.props.data[data[DAY] as Weekday].dinner) }
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