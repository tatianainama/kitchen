import React from 'react';
import Navbar from 'components/Navbar';
import Input from 'components/Input';
import Button from 'components/Button';
import RecipeForm from 'components/RecipeForm';
import Spinner from 'components/Spinner';
import { toast } from "react-toastify";

import './styles.scss';

import Recipe, { _recipe } from 'types/recipes';
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
              },
              tags: recipe.tags || [],
              course: recipe.course || [],
            }
          })
        }).catch(e => {
          toast.error("There was an error scraping the recipe: " + e);
          this.setState({
            scrapingRecipe: false
          })
        })
      })
    }
  }

  saveRecipe = (recipe: Recipe) => {
    saveRecipe(recipe)
      .then(response => {
        if (response.status === 200) {
          toast.success("Recipe created correctly!");
          this.goToViewList();
        } else {
          toast.error("There was an error saving the recipe: " + response.statusText);
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