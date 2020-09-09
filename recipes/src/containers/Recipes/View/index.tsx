import React from 'react';
import { getRecipeById } from './../services';
import { RouteComponentProps } from 'react-router';

import RecipeCard from 'components/RecipeCard';
import Recipe, { _recipe } from 'types/recipes';

import './styles.scss';

interface ViewRecipeProps extends RouteComponentProps<{id: string}>{

}

class ViewRecipe extends React.Component<ViewRecipeProps, {recipe: Recipe}> {
  constructor(props: ViewRecipeProps) {
    super(props);
    this.state = {
      recipe: { ..._recipe }
    }
  }

  componentDidMount() {
    getRecipeById(this.props.match.params.id).then(
      recipe => this.setState({ recipe })
    )
  }

  render() {
    return (
      <div className='cbk-recipe-viewer'>
        <RecipeCard recipe={this.state.recipe}/>
      </div>
    );
  }
}
// const ViewRecipe = (props: ViewRecipeProps) => {
//   const [ recipe, setRecipe ] = useState({..._recipe});
//   return (
//     <div className='cbk-recipe-viewer'>
//       <RecipeCard recipe={recipe}/>
//     </div>
//   )
// }

export default ViewRecipe;