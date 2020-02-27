import React from 'react';
import Navbar from 'components/Navbar';
import Input from 'components/Input';
import Button from 'components/Button';
import RecipeForm from 'components/RecipeForm';
import Spinner from 'components/Spinner';

import './styles.scss';

import Recipe, { SubRecipe, Author, Details, _recipe, _subRecipe, _ingredient, Ingredient } from 'types/recipes';
import { scrapeRecipe, saveRecipe } from '../services';

interface CreateRecipeProps {

};

interface CreateRecipeState {
  scrapeUrl: string,
  form: Recipe,
  scrapingRecipe: boolean,
};

class CreateRecipe extends React.Component<any, CreateRecipeState> {
  constructor(props: CreateRecipeProps) {
    super(props);
    this.state = { 
      form: {
        ..._recipe,
      },
      scrapeUrl: '',
      scrapingRecipe: false,
    }
  }

  scrapeRecipe = () => {
    if (this.state.scrapeUrl) {
      this.setState({
        scrapingRecipe: true
      }, () => {
        scrapeRecipe(this.state.scrapeUrl).then(recipe => {
          this.setState({
            scrapingRecipe: false,
            form: {
              ...recipe,
              details: {
                ...recipe.details,
                url: this.state.scrapeUrl,
              }
            }
          })
        })
      })
    }
  }

  saveRecipe = (recipe: Recipe) => {
    saveRecipe(recipe)
      .then(response => {
        if (response.status === 200) {
          this.goToViewList()
        } else {
          alert(response.statusText)
        }
      })
  }

  goToViewList = () => {
    this.props.history.push('/recipes');
  }
  

  render() {
    const { scrapeUrl, form, scrapingRecipe } = this.state; 
    return (
      <div>
        {
          scrapingRecipe && (<Spinner/>)
        }
        <Navbar
          title="Create a recipe"
        >
          <Input
            label='scrape recipe'
            value={scrapeUrl}
            onChange={(e: any)=> this.setState({scrapeUrl: e.currentTarget.value})}
          />
          <Button onClick={this.scrapeRecipe} outlined>Scrape</Button>
        </Navbar>
        
        <div className="cbk-create-recipe">
          <RecipeForm
            initialValues={form}
            onSubmit={(recipe) => this.saveRecipe(recipe)}
            onCancel={this.goToViewList}
          />
        </div>
      </div>
    )
  }
}

export default CreateRecipe;