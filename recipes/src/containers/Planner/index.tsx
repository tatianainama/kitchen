import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import Navbar from 'components/Navbar';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import { PlannerState } from 'types/planner';
import { Grid, Row, Cell } from "@material/react-layout-grid";

interface PlannerContainerProps extends RouteComponentProps, PlannerState {
}

class PlannerContainer extends Component<PlannerContainerProps> {
  render () {
    return (
      <div className='cbk-planner'>
        <Navbar
          title='Planner'
        >
          <div>Week {this.props.data.week}</div>
        </Navbar>
        <section className='cbk-planner__body'>
          <div className='cbk-planner__body__calendar'>
            
          </div>
          <div className='cbk-planner__body__backlog'></div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return state.planner
}

export default connect(
  mapStateToProps
)(PlannerContainer);