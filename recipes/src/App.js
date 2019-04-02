import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

function Index() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

class Recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      recipes: [],
    }
  }

  componentDidMount(){
    axios.get('http://recipes.davidventura.com.ar/recipes/ingredients/?ingredients=beef,bacon').then(response => {
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
  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/recipes/">Recipes</Link>
              </li>
              <li>
                <Link to="/users/">Users</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/recipes/" component={Recipes} />
          <Route path="/users/" component={Users} />
        </div>
      </Router>
    )
  }
}

export default App;
