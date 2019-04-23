import React, { Component } from 'react';
import { RecipeCard, Recipe } from '../components/RecipeCard';
import Card from '../components/Card';
import axios from 'axios';

type RecipeState = {
  error: null | Error,
  isLoaded: boolean,
  recipes: Recipe[],
}

class Recipes extends Component<{}, RecipeState> {
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
      <div>
        {/* {
          this.state.recipes.map((_recipe) => (
            <RecipeCard recipe={_recipe} key={_recipe._id}/>
          ))
        } */}
      </div>
    )
  }
}

export default Recipes;