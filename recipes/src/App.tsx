import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { Component, Props } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';

function Index() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

class Recipes extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      recipes: [],
    }
  }

  componentDidMount(){
    axios.get('https://recipes.davidventura.com.ar/recipes/ingredients/?ingredients=beef,bacon').then(response => {
      console.log('response', response.data);
      this.setState({
        isLoaded: true,
        recipes: response.data,
      })
    }).catch(error => {
      this.setState({
        isLoaded: true,
        error: error,
        recipes: [],
      })
    })
  }

  render() {
    return (
      <h2>Recipes yayyy!!</h2>
    )
  }
}

class App extends Component {
  navbarItems: { title: string, path: string, active: boolean }[]

  constructor(props: any) {
    super(props);
    this.navbarItems = [
      { title: 'home', path: '/', active: false },
      { title: 'recipes', path: '/recipes', active: false },
      { title: 'planner', path: '/planner', active: false },
      { title: 'shoplist', path: '/shoplist', active: false },
    ];
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar items={this.navbarItems}></Navbar>

          <Route path="/" exact component={Index} />
          <Route path="/recipes/" component={Recipes} />
          <Route path="/users/" component={Users} />
        </div>
      </Router>
    )
  }
}

export default App;
