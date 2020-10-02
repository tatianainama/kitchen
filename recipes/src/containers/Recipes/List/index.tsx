import React, { Component } from "react";
import { Link, RouteComponentProps } from 'react-router-dom';
import { throttle } from 'throttle-debounce';
import { connect } from "react-redux";

import {
  fetchIfNeeded as fetch,
  receiveRecipes as receive,
  selectRecipe as select,
  deleteRecipeActionCreator as deleteRecipe,
  changeLayout,
} from "containers/Recipes/List/actions";
import {
  addRecipeToCart,
  removeFromCart
} from 'containers/ShoppingCart/actions';
import plannerActions from 'containers/Planner/actions';

import Button from "components/Button";
import Card from 'components/Card';
import RecipeCard from 'components/RecipeCard';
import Navbar from 'components/Navbar';
import Input from 'components/Input';
import Spinner from 'components/Spinner';
import List from 'components/List';

import { DBRecipe } from 'types/recipes';
import { UiState, Display } from "types/ui";
import { Layout } from './types';
import { AppState } from "store/configureStore";

import '@rmwc/grid/styles';
import './styles.scss';

const API: string = process.env.REACT_APP_IMG || '';

interface RecipeListProps extends RouteComponentProps {
  data: DBRecipe[],
  isFetching: boolean,
  selectedRecipe?: DBRecipe,
  ui: UiState,
  layout: Layout,
  fetchRecipes: (query: string) => void,
  receiveRecipes: (recipes: DBRecipe[]) => void,
  selectRecipe: (recipe?: DBRecipe) => void,
  removeFromCart: (recipe: DBRecipe) => void,
  addRecipeToCart: (recipe: DBRecipe) => void,
  addRecipeToPlanner: (recipe: DBRecipe) => void,
  deleteRecipe: (id: string) => void,
  changeLayout: (layout: Layout) => void
};

type RecipeListState = {
  phoneDisplay: boolean,
  search: string,
}

class RecipeList extends Component<RecipeListProps, RecipeListState> {
  layoutButtons: {
    icon: string,
    layout: Layout
  }[];
  constructor(props: RecipeListProps) {
    super(props);
    this.state = {
      phoneDisplay: this.props.ui.display === Display.Mobile,
      search: '',
    }
    this.layoutButtons = [{
      icon: 'view_module',
      layout: Layout.Module
    }, {
      icon: 'view_list',
      layout: Layout.List
    }, {
      icon: 'view_sidebar',
      layout: Layout.VerticalSplit
    }];
  }

  componentDidMount() {
    const { fetchRecipes } = this.props;
    fetchRecipes('');
  }

  autocompleteSearch = throttle(500, (query: string) => {
    this.props.fetchRecipes(query)
  })


  changeQuery = (query: string) => {
    this.setState({
      search: query
    }, () => {
      this.autocompleteSearch(this.state.search)
    })
  }

  componentDidUpdate(prevProps: any) {
    const { data, receiveRecipes, isFetching } = this.props;
    if (isFetching === false && data.length !== prevProps.data.length) {
      receiveRecipes(data);
    }
  }

  cleanRecipeSelection() {
    this.props.selectRecipe();
  }

  handleRecipeSelection = (recipe: DBRecipe) => {
    if (this.state.phoneDisplay) {
      this.props.history.push('/recipes/view/' + recipe._id)
      this.cleanRecipeSelection();
    } else {
      this.props.selectRecipe(recipe) 
    }
  }

  handleEditRecipe = (id = '') => (event: React.MouseEvent) => {
    event.stopPropagation();
    this.props.history.push('/recipes/edit/' + id)
    this.cleanRecipeSelection();
  }

  handleAddToShopping = (recipe: DBRecipe) => (event: React.MouseEvent) => {
    event.stopPropagation();
    this.props.addRecipeToCart(recipe)
  }

  handleAddToPlanner = (recipe: DBRecipe) => (event: React.MouseEvent) => {
    event.stopPropagation();
    this.props.addRecipeToPlanner(recipe)
  }

  handleDeleteRecipe = (id: string) => (event: React.MouseEvent) => {
    event.stopPropagation();
    this.props.deleteRecipe(id);
  }

  openRecipe = (id: string) => {
    this.props.history.push(`/recipes/view/${id}`)
  }

  handler = (event: React.MouseEvent) => {
    console.log('click', event);
  }

  actions = (recipe: DBRecipe) => [{
    label: 'edit',
    handler: this.handleEditRecipe(recipe._id),
  }, {
    label: 'shopping',
    handler: this.handleAddToShopping(recipe)
  }, {
    label: 'planner',
    handler: this.handleAddToPlanner(recipe)
  }];

  icons = (id = '') => [{
    icon: 'open_in_new',
    handler: () => this.props.history.push('/recipes/view/' + id)
  }, {
    icon: 'delete_outline',
    handler: this.handleDeleteRecipe(id)
  }]

  render() {
    const {data, selectedRecipe, isFetching, changeLayout } = this.props;
    return(
      <div className='cbk-recipes-list'>
        <Navbar
          title="Recipes"
        >
          <Input
            value={this.state.search}
            label='search'
            onChange={(e) => this.changeQuery(e.currentTarget.value)}
            button={{
              icon: 'clear',
              onClick: () => this.changeQuery('')
            }}
            className='cbk-recipes-list__search'
          />
          <Link to='/recipes/create'>
            <Button unelevated>
              Create Recipe
            </Button>
          </Link>
          <div style={{display: 'flex'}}>
            {
              this.layoutButtons.map(({icon, layout}) => {
                return (
                  <Button icon={icon} key={icon} onClick={() => {changeLayout(layout)} } active={layout === this.props.layout}></Button>
                );
              })
            }
          </div>
        </Navbar>
        {
          isFetching && (<Spinner/>)
        }
        <div className="cbk-recipes-list__results">
          {
            this.props.layout === Layout.VerticalSplit ? (
              <VerticalSplitMode
                data={data}
                handleRecipeSelection={this.handleRecipeSelection}
                actions={this.actions}
                icons={this.icons}
                selectedRecipe={selectedRecipe}
              />
            ) : 
            this.props.layout === Layout.List ? (
              <List
                twoLine
                bordered
                className="cbk-recipes-list__list"
                avatarList
                onAction={({ detail }) => { this.openRecipe(data[detail.index]._id)}}
                items={data.map((recipe) => ({
                  text: recipe.name,
                  img: recipe.image ? `${API}/${recipe.image}` : undefined,
                  meta: (<div>
                    <Button icon='add_shopping_cart' onClick={this.handleAddToShopping(recipe)}/>
                    <Button icon='edit' onClick={this.handleEditRecipe(recipe._id)}/>
                    <Button icon='delete' onClick={this.handleDeleteRecipe(recipe._id)}/>
                  </div>)
                }))}
              />
            ) : null
          }
        </div>
      </div>
    )
  }
}

// VerticalSplit,
// Module,
// List
type VerticalSplitModeProps = {
  data: DBRecipe[],
  handleRecipeSelection: (recipe: DBRecipe) => void,
  actions: (recipe: DBRecipe) => {
    label: string;
    handler: (event: React.MouseEvent<Element, MouseEvent>) => void;
  }[],
  icons: (id?: string) => {
    icon: string;
    handler: (event: React.MouseEvent<Element, MouseEvent>) => void;
  }[],
  selectedRecipe?: DBRecipe,
}

const VerticalSplitMode: React.FunctionComponent<VerticalSplitModeProps> = ({ data, handleRecipeSelection, actions, icons, selectedRecipe }) => (
  <div className="cbk-recipes-list__vertical-split">
    <div className="cbk-recipes-list__vertical-split__list">
      {
        data.map((recipe, i) => {
          return (
            <Card
              key={i}
              title={recipe.name}
              onClick={() => {handleRecipeSelection(recipe)}}
              summary={recipe.summary}
              actions={actions(recipe)}
              icons={icons(recipe._id)}
              img={recipe.image}
              highlight={selectedRecipe ? recipe._id === selectedRecipe._id : undefined}
            />
          )
        })
      }
    </div>
    <div className="cbk-recipes-list__vertical-split__preview">
      { selectedRecipe !== undefined && 
        <RecipeCard 
          recipe={selectedRecipe}
        />
      }
    </div>
  </div>
)

const mapStateToProps = (state: AppState) => {
  return {
    ...state.recipes,
    ui: state.ui,
    shoppingCart: state.shoppingCart
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchRecipes: (query: string) => {
      dispatch(fetch(query))
    },
    receiveRecipes: (recipes: DBRecipe[]) => {
      dispatch(receive(recipes))
    },
    selectRecipe: (recipe?: DBRecipe) => {
      dispatch(select(recipe))
    },
    addRecipeToCart: (recipe: DBRecipe) => {
      dispatch(addRecipeToCart(recipe))
    },
    removeFromCart: (recipe: DBRecipe) => {
      dispatch(removeFromCart(recipe))
    },
    addRecipeToPlanner: (recipe: DBRecipe) => {
      dispatch(plannerActions.addToBacklog(recipe))
    },
    deleteRecipe: (id: string) => {
      dispatch(deleteRecipe(id))
    },
    changeLayout: (layout: Layout) => {
      dispatch(changeLayout(layout))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList);