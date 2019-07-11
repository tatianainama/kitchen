import React from 'react';
import { assocPath, remove } from 'ramda';
import  Navbar from 'components/Navbar';
import Input from 'components/Input';
import RecipeForm from 'components/RecipeForm';
import {  } from 'react-router';

import './styles.scss';

import sample_img from "../../../sample.png";

import Recipe, { SubRecipe, Author, Details, _recipe, _subRecipe, _ingredient, Ingredient } from 'types/recipes';
import { scrapeRecipe, saveRecipe } from '../services';

interface CreateRecipeProps {

};

interface CreateRecipeState {
  scrapeUrl: string,
  form: Recipe,
};

type FormKeys = keyof Recipe | keyof SubRecipe | keyof Ingredient | keyof Author | keyof Details | number;

class CreateRecipe extends React.Component<any, CreateRecipeState> {
  constructor(props: CreateRecipeProps) {
    super(props);
    this.state = { 
      form: {
        ..._recipe,
      },
      scrapeUrl: '',
    }
  }

  scrapeRecipe = () => {
    scrapeRecipe(this.state.scrapeUrl).then(recipe => {
      this.setState({
        form: {
          ...recipe,
          details: {
            ...recipe.details,
            url: this.state.scrapeUrl,
          }
        }
      })
    })
  }

  saveRecipe = (recipe: Recipe) => {
    saveRecipe(recipe)
      .then(response => {
        if (response.status === 200) {
          this.props.history.push('/recipes')
        } else {
          alert(response.statusText)
        }
      })
  }

  render() {
    const { scrapeUrl, form } = this.state; 
    return (
      <div>
        <Navbar
          title="Create a recipe"
        >
          <Input
            label='scrape recipe'
            value={scrapeUrl}
            onChange={(e: any)=> this.setState({scrapeUrl: e.currentTarget.value})}
            button={{
              icon: 'format_shapes',
              onClick: this.scrapeRecipe
            }}
          />
        </Navbar>
        
        <div className="cbk-create-recipe">
          <RecipeForm
            initialValues={form}
            onSubmit={(recipe) => this.saveRecipe(recipe)}
          />
        </div>
      </div>
    )
  }
}

export default CreateRecipe;