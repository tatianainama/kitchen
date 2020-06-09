import React from 'react';
import  Navbar from 'components/Navbar';
import RecipeForm from 'components/RecipeForm';

import './styles.scss';

import { _recipe, _subRecipe, _ingredient, Ingredient, DBRecipe } from 'types/recipes';
import { getRecipeById, updateRecipe } from '../services';
import { RouteComponentProps } from 'react-router';
import Spinner from 'components/Spinner';

interface EditRecipeProps extends RouteComponentProps<{id: string}> {
};

interface EditRecipeState {
  form: DBRecipe,
  loadingRecipe: boolean,
};

class EditRecipe extends React.Component<EditRecipeProps, EditRecipeState> {
  constructor(props: EditRecipeProps) {
    super(props);
    this.state = {
      form: {
        ..._recipe,
        _id: '',
      },
      loadingRecipe: true,
    }
  }

  componentDidMount = () => {
    getRecipeById(this.props.match.params.id).then(recipe => 
      this.setState({
        form: recipe,
      }, () => {
        this.setState({ loadingRecipe: false })
      }))

  }

  saveRecipe = (recipe: DBRecipe) => {
    updateRecipe(recipe)
      .then((response: any) => {
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
    const { form, loadingRecipe } = this.state;
    return (
      <div>
        { loadingRecipe && (<Spinner/>)}
        <Navbar
          title="Edit recipe"
        />
        
        <div className="cbk-create-recipe">
          <RecipeForm
            initialValues={form}
            onSubmit={(recipe: DBRecipe) => this.saveRecipe(recipe)}
            onCancel={this.goToViewList}
          />
        </div>
      </div>
    )
  }
}

export default EditRecipe;