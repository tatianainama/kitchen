import React from 'react';
import  Navbar from 'components/Navbar';
import Input from 'components/Input';
import RecipeForm from 'components/RecipeForm';

import './styles.scss';

import Recipe, { SubRecipe, Author, Details, _recipe, _subRecipe, _ingredient, Ingredient, DBRecipe } from 'types/recipes';
import { getRecipeById, updateRecipe } from '../services';
import { RouteComponentProps } from 'react-router';

interface EditRecipeProps extends RouteComponentProps<{id: string}> {

};

interface EditRecipeState {
  form: DBRecipe,
};

class EditRecipe extends React.Component<EditRecipeProps, EditRecipeState> {
  constructor(props: EditRecipeProps) {
    super(props);
    this.state = { 
      form: {
        ..._recipe,
        _id: '',
      }
    }
  }

  componentDidMount = () => {
    getRecipeById(this.props.match.params.id).then(recipe => this.setState({ form: recipe }))

  }

  saveRecipe = (recipe: DBRecipe) => {
    updateRecipe(recipe)
      .then((response: any) => {
        if (response.status === 200) {
          this.props.history.push('/recipes')
        } else {
          alert(response.statusText)
        }
      })
  }

  render() {
    const { form } = this.state; 
    return (
      <div>
        <Navbar
          title="Create a recipe"
        />
        
        <div className="cbk-create-recipe">
          <RecipeForm
            initialValues={form}
            onSubmit={(recipe: DBRecipe) => this.saveRecipe(recipe)}
          />
        </div>
      </div>
    )
  }
}

export default EditRecipe;